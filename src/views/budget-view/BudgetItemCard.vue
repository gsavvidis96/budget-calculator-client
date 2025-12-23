<template>
  <div class="d-flex flex-column card">
    <v-divider />

    <div class="d-flex align-center text-body-1 px-2 py-3 ga-2">
      <div class="mr-auto card-title">
        {{ budgetItem.description }}
      </div>

      <div
        class="d-flex align-center ga-2"
        :class="budgetItem.type === 'INCOME' ? 'text-primary' : 'text-error'"
      >
        <v-chip
          size="small"
          class="font-weight-bold"
          v-if="budgetItem.type === 'EXPENSES' && currentBudget!.income_items.length"
        >
          {{ budgetItem.expense_percentage!.toFixed(2) }}%
        </v-chip>

        <div
          v-if="budgetItem.type === 'INCOME'"
          class="text-subtitle-2"
          v-price.plus="budgetItem.value"
        />
        <div v-else class="text-subtitle-2" v-price.minus="budgetItem.value" />

        <v-btn
          density="compact"
          icon
          variant="text"
          :color="budgetItem.type === 'INCOME' ? 'primary' : 'error'"
          @click="emit('edit-budget-item', budgetItem)"
        >
          <v-icon size="20px"> mdi-pencil-outline </v-icon>

          <v-tooltip activator="parent" location="right">Edit</v-tooltip>
        </v-btn>

        <v-btn
          density="compact"
          icon
          variant="text"
          :color="budgetItem.type === 'INCOME' ? 'primary' : 'error'"
          :id="`delete-menu-${budgetItem.id}`"
          @click="emit('delete-budget-item', budgetItem)"
        >
          <v-icon size="20px"> mdi-delete-outline </v-icon>

          <v-tooltip activator="parent" location="right">Delete</v-tooltip>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BudgetItem } from '@/types'

const { budgetItem } = defineProps<{
  budgetItem: BudgetItem
}>()

const emit = defineEmits<{
  (e: 'edit-budget-item', budget: BudgetItem): void
  (e: 'delete-budget-item', budget: BudgetItem): void
}>()

const budgetStore = useBudgetsStore()

const { currentBudget } = storeToRefs(budgetStore)
</script>

<style scoped lang="scss">
.card {
  transition: all 0.2s;

  &:hover {
    background-color: rgb(var(--v-theme-surface-light));
  }

  .card-title {
    white-space: nowrap;
    overflow-x: auto;
  }
}
</style>
