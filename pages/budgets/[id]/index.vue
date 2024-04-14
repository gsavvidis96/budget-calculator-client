<template>
  <div class="page-wrapper">
    <div class="inner-wrapper d-flex flex-column flex-grow-1 ga-4">
      <v-progress-linear
        color="primary"
        indeterminate
        v-if="loader"
      ></v-progress-linear>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getJwt } from "~/helpers/getJwt";

definePageMeta({
  middleware: "requires-auth",
});

interface BudgetItem {
  id: string;
  type: "INCOME" | "EXPENSES";
  description: string;
  value: number;
  created_at: string;
  updated_at: string;
  budget_id: string;
}

interface Budget {
  id: string;
  title: string;
  is_pinned: boolean;
  balance: number;
  total_income: number;
  total_expenses: number;
  expense_items: BudgetItem[];
  income_items: BudgetItem[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

const {
  public: { apiUrl },
} = useRuntimeConfig();
const { params } = useRoute();

const loader = ref(true);
const currentBudget = ref<Budget | null>(null);

const onFetchCurrentBudget = async () => {
  try {
    const { id } = params;

    const budget = await $fetch<Budget>(`${apiUrl}/budgets/${id}`, {
      headers: {
        Authorization: `Bearer ${await getJwt()}`,
      },
      parseResponse: (r) => JSON.parse(r),
    });

    currentBudget.value = budget;
  } catch (e) {
    navigateTo("/budgets");
  } finally {
    loader.value = false;
  }
};

onFetchCurrentBudget();
</script>

<style scoped></style>
