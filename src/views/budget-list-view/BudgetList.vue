<template>
  <div class="page-wrapper">
    <v-container class="page-container ga-5">
      <BudgetListToolbar />

      <v-progress-linear color="primary" indeterminate v-if="budgetsLoader" />

      <div v-if="!budgetsLoader && budgets?.budgets.length === 0">
        <v-alert
          :text="search ? 'No budgets found' : 'You have no budgets yet'"
          :type="search ? 'warning' : 'info'"
          color="primary"
          variant="tonal"
        ></v-alert>
      </div>

      <template v-if="budgets?.budgets.length && !budgetsLoader">
        <BudgetCard
          v-for="budget in budgets?.budgets"
          :budget="budget"
          :key="budget.id"
          @edit-budget="onEditBudget"
          @delete-budget="onDeleteBudget"
        />
      </template>
    </v-container>

    <FormDialog v-model="dialog.open" @close-dialog="dialog.open = false">
      <BudgetForm @close-dialog="dialog.open = false" :budget="dialog.budget!" />
    </FormDialog>

    <v-menu
      v-model="deleteMenu.open"
      :target="`#delete-menu-${deleteMenu.budget?.id}`"
      location="bottom end"
      :scrim="true"
      :close-on-content-click="false"
    >
      <v-card class="d-flex flex-column elevation-5 pa-3 ga-4 rounded bg-surface-light">
        <div class="text-subtitle-1 text-center">
          Are you sure you want to delete budget "<strong>{{ deleteMenu.budget?.title }}</strong
          >" ?
        </div>

        <div class="d-flex align-center justify-center ga-2">
          <v-btn
            variant="text"
            color="primary"
            size="small"
            @click="deleteMenu.open = false"
            :disabled="deleteLoaders.has(deleteMenu.budget?.id ?? '')"
            >Cancel</v-btn
          >

          <v-btn
            color="error"
            size="small"
            :loading="deleteLoaders.has(deleteMenu.budget?.id ?? '')"
            @click="deleteBudget(deleteMenu.budget!.id)"
            >Delete</v-btn
          >
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import type { BudgetListItem } from '@/types'

const budgetStore = useBudgetsStore()

const { getBudgets } = budgetStore

const { sort, search, budgetsLoader, budgets } = storeToRefs(budgetStore)

const { openSnackbar } = useBaseStore()

const dialog = ref<{ open: boolean; budget: BudgetListItem | null }>({ open: false, budget: null })
const deleteMenu = ref<{ open: boolean; budget: BudgetListItem | null }>({
  open: false,
  budget: null,
})
const deleteLoaders = ref<Set<string>>(new Set())

onMounted(() => {
  getBudgets()
})

const onEditBudget = (budget: BudgetListItem) => {
  dialog.value = {
    open: true,
    budget,
  }
}

const onDeleteBudget = (budget: BudgetListItem) => {
  deleteMenu.value = {
    open: true,
    budget,
  }
}

const deleteBudget = async (budgetId: string) => {
  deleteLoaders.value.add(budgetId)

  try {
    const { data: deletedBudget } = await apiClient.delete(`/budgets/${budgetId}`)

    await getBudgets({ refresh: true })

    openSnackbar({
      color: 'warning',
      text: `Budget "${deletedBudget.title}" was deleted.`,
    })

    deleteMenu.value.open = false
  } catch (e) {
    console.error(e)

    openSnackbar({
      color: 'error',
      text: 'Something went wrong.',
    })
  } finally {
    deleteLoaders.value.delete(budgetId)
  }
}

watch([search, sort], () => {
  getBudgets({ refresh: true })
})
</script>

<style scoped lang="scss"></style>
