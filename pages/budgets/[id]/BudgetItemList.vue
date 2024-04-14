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
      v-if="items.length === 0"
    ></v-alert>
  </div>
</template>

<script setup lang="ts">
import type { BudgetItem } from "./index.vue";

const props = defineProps<{
  type: "INCOME" | "EXPENSES";
  items: BudgetItem[];
}>();

const { type, items } = toRefs(props);
</script>

<style scoped></style>
