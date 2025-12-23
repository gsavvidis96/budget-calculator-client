<template>
  <v-alert
    :text="type === 'INCOME' ? 'You have no income yet' : 'You have no expenses yet'"
    type="info"
    variant="tonal"
    density="comfortable"
    :color="type === 'INCOME' ? 'primary' : 'error'"
    v-if="budgetItems.length === 0"
  />

  <BudgetItemCard
    v-for="budgetItem in budgetItems"
    :budget-item="budgetItem"
    :key="budgetItem.id"
    @edit-budget-item="onEditBudgetItem"
    @delete-budget-item="onDeleteBudgetItem"
  />

  <FormDialog v-model="dialog.open" @close-dialog="dialog.open = false">
    <BudgetItemForm
      @close-dialog="dialog.open = false"
      :budget-id="currentBudget!.id"
      :budget-item="dialog.budgetItem!"
      :type="type"
    />
  </FormDialog>

  <v-menu
    v-model="deleteMenu.open"
    :target="`#delete-menu-${deleteMenu.budgetItem?.id}`"
    location="bottom end"
    :scrim="true"
    :close-on-content-click="false"
  >
    <v-card class="d-flex flex-column elevation-5 pa-3 ga-4 rounded bg-surface-light">
      <div class="text-subtitle-1 text-center">
        Are you sure you want to delete
        {{ deleteMenu.budgetItem!.type === 'EXPENSES' ? 'expense' : 'income' }} "<strong>{{
          deleteMenu.budgetItem!.description
        }}</strong
        >" (<span
          class="text-body-2"
          :class="deleteMenu.budgetItem!.type === 'EXPENSES' ? 'text-error' : 'text-primary'"
          v-price="deleteMenu.budgetItem!.value"
        />) ?
      </div>

      <div class="d-flex align-center justify-center ga-2">
        <v-btn variant="text" color="primary" size="small" @click="deleteMenu.open = false"
          >Cancel</v-btn
        >

        <v-btn
          color="error"
          size="small"
          :loading="deleteLoader"
          @click="deleteBudget(deleteMenu.budgetItem!.id)"
          >Delete</v-btn
        >
      </div>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import type { BudgetItem } from '@/types'

const { type } = defineProps<{
  type: 'INCOME' | 'EXPENSES'
}>()

const budgetStore = useBudgetsStore()

const { getBudgetById } = budgetStore

const { currentBudget, budgetsFetched } = storeToRefs(budgetStore)

const { openSnackbar } = useBaseStore()

const dialog = ref<{
  open: boolean
  budgetItem: BudgetItem | null
}>({
  open: false,
  budgetItem: null,
})

const deleteMenu = ref<{ open: boolean; budgetItem: BudgetItem | null }>({
  open: false,
  budgetItem: null,
})

const budgetItems = computed(() =>
  type === 'INCOME' ? currentBudget.value!.income_items : currentBudget.value!.expense_items,
)

const deleteLoader = ref(false)

const onEditBudgetItem = (budgetItem: BudgetItem) => {
  dialog.value = {
    open: true,
    budgetItem,
  }
}

const onDeleteBudgetItem = (budgetItem: BudgetItem) => {
  deleteMenu.value = {
    open: true,
    budgetItem,
  }
}

const deleteBudget = async (budgetItemId: string) => {
  deleteLoader.value = true

  try {
    const { data: deletedBudget } = await apiClient.delete(
      `/budgets/${currentBudget.value?.id}/budget-items/${budgetItemId}`,
    )

    await getBudgetById(currentBudget.value!.id)

    budgetsFetched.value = false

    openSnackbar({
      color: 'warning',
      text: `${deletedBudget.type === 'EXPENSES' ? 'Expense' : 'Income'} "${
        deletedBudget.description
      }" was deleted.`,
    })

    deleteMenu.value.open = false
  } catch (e) {
    console.error(e)

    openSnackbar({
      color: 'error',
      text: 'Something went wrong.',
    })
  } finally {
    deleteLoader.value = false
  }
}
</script>

<style scoped></style>
