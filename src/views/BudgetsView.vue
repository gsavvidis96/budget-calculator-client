<template>
  <div class="page-shell">
    <section class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="m-0 text-3xl font-bold text-neutral-950 sm:text-4xl dark:text-white">Budgets</h1>
        <p class="mt-2 mb-0 text-base text-neutral-500 dark:text-neutral-400">
          <template v-if="query.data.value"
            >{{ query.data.value.total_count }}
            {{ query.data.value.total_count === 1 ? 'budget' : 'budgets' }} in total</template
          >
          <template v-else>Loading budgets…</template>
        </p>
      </div>

      <Button size="large" @click="openCreateDialog">
        <Plus class="size-4" aria-hidden="true" />
        <span>New budget</span>
      </Button>
    </section>

    <section
      class="surface-card mb-6 grid gap-3 rounded-2xl p-4 sm:grid-cols-[minmax(0,1fr)_16rem] sm:p-5"
      aria-label="Budget filters"
    >
      <IconField>
        <InputIcon><Search class="size-4" aria-hidden="true" /></InputIcon>
        <InputText
          v-model="searchInput"
          fluid
          aria-label="Search budgets"
          placeholder="Search budgets…"
        />
        <InputIcon
          v-if="searchInput"
          class="pointer-events-auto! cursor-pointer"
          @click="searchInput = ''"
        >
          <Times class="size-3.5" aria-label="Clear search" />
        </InputIcon>
      </IconField>

      <Select
        v-model="sort"
        :options="sortOptions"
        option-label="label"
        option-value="value"
        fluid
        :disabled="query.isFetching.value"
        aria-label="Sort budgets"
      >
        <template #value="slotProps">
          <div class="flex items-center gap-2">
            <SortAlt class="size-3.5 text-neutral-400" aria-hidden="true" />
            <span>{{ sortOptions.find((option) => option.value === slotProps.value)?.label }}</span>
          </div>
        </template>
      </Select>
    </section>

    <BudgetListSkeleton v-if="query.isPending.value" />

    <PageState
      v-else-if="query.isError.value"
      title="We couldn’t load your budgets"
      description="Check your connection and try once more."
    >
      <template #icon><ExclamationTriangle class="size-6" aria-hidden="true" /></template>
      <template #actions>
        <Button @click="query.refetch()"
          ><Refresh class="size-4" aria-hidden="true" /><span>Try again</span></Button
        >
      </template>
    </PageState>

    <PageState
      v-else-if="query.data.value?.budgets.length === 0"
      :title="debouncedSearch ? 'No matching budgets' : 'Create your first budget'"
      :description="
        debouncedSearch
          ? `Nothing matched “${debouncedSearch}”. Try another search.`
          : 'Create a budget to begin.'
      "
    >
      <template #icon>
        <Search v-if="debouncedSearch" class="size-6" aria-hidden="true" />
        <Wallet v-else class="size-6" aria-hidden="true" />
      </template>
      <template #actions>
        <Button v-if="debouncedSearch" severity="secondary" outlined @click="searchInput = ''"
          >Clear search</Button
        >
        <Button v-else @click="openCreateDialog"
          ><Plus class="size-4" aria-hidden="true" /><span>Create budget</span></Button
        >
      </template>
    </PageState>

    <template v-else-if="query.data.value">
      <div
        class="grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3"
        :class="isRefreshing ? 'opacity-60' : 'opacity-100'"
        :aria-busy="isRefreshing"
      >
        <BudgetCard
          v-for="budget in query.data.value.budgets"
          :key="budget.id"
          :budget="budget"
          :pinning="pinMutation.isPending.value && pinMutation.variables.value?.id === budget.id"
          @edit="openEditDialog(budget)"
          @pin="pinMutation.mutate(budget)"
          @delete="confirmDelete(budget)"
        />
      </div>

      <Paginator
        v-if="query.data.value.total_count > pageSize"
        class="mt-8 rounded-2xl! bg-transparent!"
        :first="(page - 1) * pageSize"
        :rows="pageSize"
        :total-records="query.data.value.total_count"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        @page="onPage"
      />
    </template>

    <BudgetFormDialog v-model="formDialog.open" :budget="formDialog.budget" />
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangle, Plus, Refresh, Search, SortAlt, Times, Wallet } from '@primeicons/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { watchDebounced } from '@vueuse/core'
import type { PageState as PaginatorPageEvent } from 'primevue/paginator'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { computed, reactive, ref, watch } from 'vue'
import { deleteBudget, updateBudget } from '@/api/budgets'
import { budgetKeys, useBudgetsQuery } from '@/queries/budgets'
import type { BudgetListParams, BudgetSort, BudgetSummary } from '@/types'
import { getAppError } from '@/utils/errors'

const pageSize = 12
const searchInput = ref('')
const debouncedSearch = ref('')
const sort = ref<BudgetSort>('created_at:desc')
const page = ref(1)
const queryClient = useQueryClient()
const confirm = useConfirm()
const toast = useToast()

const sortOptions: Array<{ label: string; value: BudgetSort }> = [
  { label: 'Newest first', value: 'created_at:desc' },
  { label: 'Oldest first', value: 'created_at:asc' },
  { label: 'Highest balance', value: 'balance:desc' },
  { label: 'Lowest balance', value: 'balance:asc' },
]

const params = computed<BudgetListParams>(() => ({
  ...(debouncedSearch.value.trim() ? { search: debouncedSearch.value.trim() } : {}),
  sort: sort.value,
  limit: pageSize,
  offset: (page.value - 1) * pageSize,
}))

const query = useBudgetsQuery(params)
const isRefreshing = computed(() => query.isFetching.value && !query.isPending.value)

watchDebounced(
  searchInput,
  (value) => {
    debouncedSearch.value = value
  },
  { debounce: 400, maxWait: 800 },
)

watch([debouncedSearch, sort], () => {
  page.value = 1
})

const formDialog = reactive<{ open: boolean; budget: BudgetSummary | null }>({
  open: false,
  budget: null,
})

const openCreateDialog = () => {
  formDialog.budget = null
  formDialog.open = true
}

const openEditDialog = (budget: BudgetSummary) => {
  formDialog.budget = budget
  formDialog.open = true
}

const pinMutation = useMutation({
  mutationFn: (budget: BudgetSummary) =>
    updateBudget({ budgetId: budget.id, input: { is_pinned: !budget.is_pinned } }),
  onSuccess: async (updatedBudget) => {
    await queryClient.invalidateQueries({ queryKey: budgetKeys.all })
    toast.add({
      severity: updatedBudget.is_pinned ? 'success' : 'info',
      summary: updatedBudget.is_pinned ? 'Budget pinned' : 'Budget unpinned',
      detail: `“${updatedBudget.title}” ${updatedBudget.is_pinned ? 'will stay at the top.' : 'now follows your selected sort.'}`,
      life: 3500,
    })
  },
  onError: (error) => {
    toast.add({
      severity: 'error',
      summary: 'Could not update budget',
      detail: getAppError(error).message,
      life: 5000,
    })
  },
})

const deleteMutation = useMutation({
  mutationFn: deleteBudget,
  onSuccess: async (deletedBudget) => {
    await queryClient.invalidateQueries({ queryKey: budgetKeys.all })
    toast.add({
      severity: 'info',
      summary: 'Budget deleted',
      detail: `“${deletedBudget.title}” was removed.`,
      life: 3500,
    })
  },
  onError: (error) => {
    toast.add({
      severity: 'error',
      summary: 'Could not delete budget',
      detail: getAppError(error).message,
      life: 5000,
    })
  },
})

const confirmDelete = (budget: BudgetSummary) => {
  confirm.require({
    header: 'Delete budget?',
    message: `“${budget.title}” and every item inside it will be permanently deleted.`,
    acceptLabel: 'Delete budget',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
    accept: () => deleteMutation.mutate(budget.id),
  })
}

const onPage = (event: PaginatorPageEvent) => {
  page.value = event.page + 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
