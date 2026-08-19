<template>
  <div class="page-shell">
    <RouterLink
      to="/budgets"
      class="mb-6 inline-flex items-center gap-2 text-base font-bold text-neutral-500 no-underline transition-colors hover:text-teal-600 dark:text-neutral-400 dark:hover:text-teal-300"
    >
      <ArrowLeft class="size-3.5" aria-hidden="true" />
      Back to budgets
    </RouterLink>

    <div
      v-if="query.isPending.value"
      class="space-y-5"
      aria-label="Loading budget"
      aria-busy="true"
    >
      <div class="surface-card rounded-2xl p-7 sm:p-9">
        <Skeleton width="35%" height="1.25rem" />
        <Skeleton class="mt-5" width="55%" height="3.5rem" />
        <div class="mt-8 grid gap-3 sm:grid-cols-3">
          <Skeleton v-for="index in 3" :key="index" height="6rem" />
        </div>
      </div>
      <div class="grid gap-5 lg:grid-cols-2">
        <Skeleton v-for="index in 2" :key="index" height="20rem" border-radius="1.5rem" />
      </div>
    </div>

    <PageState
      v-else-if="query.isError.value"
      title="This budget isn’t available"
      description="It may have been deleted, or we couldn’t reach the server."
    >
      <template #icon><ExclamationTriangle class="size-6" aria-hidden="true" /></template>
      <template #actions>
        <Button severity="secondary" outlined as="router-link" to="/budgets"
          >View all budgets</Button
        >
        <Button @click="query.refetch()"
          ><Refresh class="size-4" aria-hidden="true" /><span>Try again</span></Button
        >
      </template>
    </PageState>

    <template v-else-if="budget">
      <section class="surface-card relative overflow-hidden rounded-2xl p-6 sm:p-9">
        <div class="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0">
            <div class="mb-3 flex flex-wrap items-center gap-2">
              <span
                v-if="budget.is_pinned"
                class="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
              >
                <Thumbtack class="size-3" aria-hidden="true" /> Pinned
              </span>
              <span class="text-sm text-neutral-500 dark:text-neutral-400"
                >Updated {{ formatDate(budget.updated_at) }}</span
              >
            </div>
            <h1
              class="m-0 truncate text-2xl font-bold text-neutral-950 sm:text-3xl dark:text-white"
            >
              {{ budget.title }}
            </h1>
            <p class="mt-5 mb-0 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
              Available balance
            </p>
            <p
              class="money mt-2 mb-0 text-3xl font-bold sm:text-4xl"
              :class="
                budget.balance < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-neutral-950 dark:text-white'
              "
            >
              {{ formatCurrency(budget.balance) }}
            </p>
          </div>

          <Button
            severity="secondary"
            outlined
            class="shrink-0 self-start"
            @click="budgetDialog = true"
          >
            <Pencil class="size-4" aria-hidden="true" /><span>Edit budget</span>
          </Button>
        </div>

        <div class="relative mt-9 grid gap-3 sm:grid-cols-3">
          <div
            class="rounded-xl border border-emerald-100 bg-emerald-50/65 p-4 dark:border-emerald-500/15 dark:bg-emerald-500/8"
          >
            <div
              class="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"
            >
              <ArrowDown class="size-3.5" aria-hidden="true" /> Income
            </div>
            <p class="money mt-3 mb-0 text-xl font-bold text-emerald-700 dark:text-emerald-300">
              {{ formatCurrency(budget.total_income) }}
            </p>
          </div>
          <div
            class="rounded-xl border border-red-100 bg-red-50/65 p-4 dark:border-red-500/15 dark:bg-red-500/8"
          >
            <div class="flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-300">
              <ArrowUp class="size-3.5" aria-hidden="true" /> Expenses
            </div>
            <p class="money mt-3 mb-0 text-xl font-bold text-red-700 dark:text-red-300">
              {{ formatCurrency(budget.total_expenses) }}
            </p>
          </div>
          <div
            class="rounded-xl border border-neutral-200 bg-neutral-50/65 p-4 dark:border-neutral-700 dark:bg-neutral-800/55"
          >
            <div
              class="flex items-center justify-between gap-3 text-sm font-bold text-neutral-500 dark:text-neutral-400"
            >
              <span class="flex items-center gap-2"
                ><Percentage class="size-3.5" aria-hidden="true" /> Income spent</span
              >
              <span>{{ formatPercentage(budget.expenses_percentage) }}</span>
            </div>
            <div class="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                class="h-full rounded-full transition-[width]"
                :class="budget.expenses_percentage > 100 ? 'bg-red-500' : 'bg-teal-500'"
                :style="{ width: `${Math.min(budget.expenses_percentage, 100)}%` }"
              />
            </div>
          </div>
        </div>
      </section>

      <div class="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <BudgetItemSection
          type="INCOME"
          :items="budget.income_items"
          @add="openItemDialog('INCOME')"
          @edit="openEditItem"
          @delete="confirmDeleteItem"
        />
        <BudgetItemSection
          type="EXPENSES"
          :items="budget.expense_items"
          @add="openItemDialog('EXPENSES')"
          @edit="openEditItem"
          @delete="confirmDeleteItem"
        />
      </div>

      <BudgetFormDialog v-model="budgetDialog" :budget="budget" />
      <BudgetItemFormDialog
        v-model="itemDialog.open"
        :budget-id="budget.id"
        :type="itemDialog.type"
        :item="itemDialog.item"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ExclamationTriangle,
  Pencil,
  Percentage,
  Refresh,
  Thumbtack,
} from '@primeicons/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, reactive, ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { deleteBudgetItem } from '@/api/budgets'
import { budgetKeys, useBudgetQuery } from '@/queries/budgets'
import type { BudgetItem, BudgetItemType } from '@/types'
import { getAppError } from '@/utils/errors'
import { formatCurrency, formatDate, formatPercentage } from '@/utils/format'

const props = defineProps<{
  id: string
}>()

const budgetId = computed(() => props.id)
const query = useBudgetQuery(budgetId)
const budget = computed(() => query.data.value)
const queryClient = useQueryClient()
const confirm = useConfirm()
const toast = useToast()

const budgetDialog = ref(false)
const itemDialog = reactive<{
  open: boolean
  type: BudgetItemType
  item: BudgetItem | null
}>({
  open: false,
  type: 'INCOME',
  item: null,
})

const openItemDialog = (type: BudgetItemType) => {
  itemDialog.type = type
  itemDialog.item = null
  itemDialog.open = true
}

const openEditItem = (item: BudgetItem) => {
  itemDialog.type = item.type
  itemDialog.item = item
  itemDialog.open = true
}

const deleteMutation = useMutation({
  mutationFn: (item: BudgetItem) => deleteBudgetItem({ budgetId: props.id, itemId: item.id }),
  onSuccess: async (deletedItem) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(props.id) }),
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() }),
    ])
    toast.add({
      severity: 'info',
      summary: deletedItem.type === 'INCOME' ? 'Income deleted' : 'Expense deleted',
      detail: `“${deletedItem.description}” was removed.`,
      life: 3500,
    })
  },
  onError: (error) => {
    toast.add({
      severity: 'error',
      summary: 'Could not delete item',
      detail: getAppError(error).message,
      life: 5000,
    })
  },
})

const confirmDeleteItem = (item: BudgetItem) => {
  confirm.require({
    header: `Delete ${item.type === 'INCOME' ? 'income' : 'expense'}?`,
    message: `“${item.description}” will be permanently removed from this budget.`,
    acceptLabel: 'Delete item',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
    accept: () => deleteMutation.mutate(item),
  })
}
</script>
