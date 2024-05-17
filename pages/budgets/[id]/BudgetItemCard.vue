<template>
  <div class="d-flex flex-column">
    <v-divider />

    <div class="d-flex align-center text-body-1 px-2 py-3 card-content">
      <div class="mr-auto">
        {{ budgetItem.description }}
      </div>

      <div
        class="d-flex align-center ga-2"
        :class="budgetItem.type === 'INCOME' ? 'text-primary' : 'text-error'"
      >
        <v-chip
          size="small"
          v-if="budgetItem.type === 'EXPENSES' && currentBudget!.income_items.length"
        >
          {{ budgetItem.expense_percentage!.toFixed(2) }}%
        </v-chip>

        <div>
          {{ budgetItem.type === "INCOME" ? "+" : "-" }}
          {{ budgetItem.value.toFixed(2) }}€
        </div>

        <v-btn
          density="compact"
          variant="text"
          :color="budgetItem.type === 'INCOME' ? 'primary' : 'error'"
          icon
        >
          <template v-slot:default>
            <v-icon size="20px">mdi-pencil-outline</v-icon>
          </template>
        </v-btn>

        <v-btn
          density="compact"
          variant="text"
          :color="budgetItem.type === 'INCOME' ? 'primary' : 'error'"
          icon
        >
          <template v-slot:default>
            <v-icon size="20px">mdi-delete-outline</v-icon>
          </template>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  budgetItem: BudgetItem;
}>();

const { budgetItem } = toRefs(props);

const currentBudgetStore = useCurrentBudgetStore();

const { currentBudget } = storeToRefs(currentBudgetStore);

console.log(JSON.parse(JSON.stringify(budgetItem.value)));
</script>

<style scoped lang="scss">
.card-content {
  transition: all 0.2s;

  &:hover {
    background-color: rgb(var(--v-theme-background3));
  }
}
</style>
