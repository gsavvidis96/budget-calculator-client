<template>
  <div
    class="pa-6 budget-info rounded d-flex flex-column align-center text-center ga-2"
  >
    <div class="text-body-1">{{ currentBudget!.title }}</div>

    <div class="text-h4">{{ currentBudget!.balance }}€</div>

    <div class="d-flex pa-2 rounded align-center bg-primary category">
      <div class="text-subtitle-2 mr-auto">INCOME</div>

      <div class="text-subtitle-2">
        + {{ currentBudget!.total_income.toFixed(2) }}€
      </div>
    </div>

    <div class="d-flex pa-2 rounded align-center bg-error category">
      <div class="text-subtitle-2 mr-auto">EXPENSES</div>

      <div class="text-subtitle-2">
        - {{ currentBudget!.total_expenses.toFixed(2) }}€
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentBudgetStore = useCurrentBudgetStore();

const { currentBudget } = storeToRefs(currentBudgetStore);
</script>

<style scoped lang="scss">
.budget-info {
  background-color: rgb(var(--v-theme-background3));
}

.category {
  width: 350px;

  @media only screen and (max-width: 599px) {
    width: 100%;
  }
}
</style>
