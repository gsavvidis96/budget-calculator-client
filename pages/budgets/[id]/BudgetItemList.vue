<template>
  <div>
    <v-alert
      :text="
        type === 'INCOME'
          ? 'You have no income yet'
          : 'You have no expenses yet'
      "
      type="info"
      variant="tonal"
      density="comfortable"
      :color="type === 'INCOME' ? 'primary' : 'error'"
      v-if="budgetItems.length === 0"
    ></v-alert>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: "INCOME" | "EXPENSES";
}>();

const { type } = toRefs(props);

const currentBudgetStore = useCurrentBudgetStore();

const { currentBudget } = storeToRefs(currentBudgetStore);

const budgetItems = computed(() =>
  type.value === "INCOME"
    ? currentBudget.value!.income_items
    : currentBudget.value!.expense_items
);
</script>

<style scoped></style>
