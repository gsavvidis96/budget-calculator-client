<template>
  <div class="page-wrapper">
    <div class="inner-wrapper d-flex flex-column flex-grow-1 ga-2">
      <v-progress-linear
        color="primary"
        indeterminate
        v-if="loader"
      ></v-progress-linear>

      <template v-else>
        <v-btn
          size="x-small"
          variant="text"
          prepend-icon="mdi-chevron-left"
          class="align-self-start"
          to="/budgets"
          >Back to budgets</v-btn
        >

        <div class="d-flex flex-column flex-grow-1 ga-8">
          <budget-info :budget="currentBudget!" />

          <div class="d-flex flex-column flex-md-row ga-12">
            <div class="d-flex flex-column flex-1-0 ga-6">
              <div class="d-flex justify-center align-center ga-2">
                <div class="text-h6 text-primary">Income</div>

                <v-btn
                  density="comfortable"
                  size="small"
                  icon="mdi-playlist-plus"
                  variant="elevated"
                  color="primary"
                />
              </div>

              <div class="d-flex flex-column">
                <budget-item-list
                  type="INCOME"
                  :items="currentBudget!.income_items"
                />
              </div>
            </div>

            <div class="d-flex flex-column flex-1-0 ga-6">
              <div class="d-flex justify-center align-center ga-2">
                <div class="text-h6 text-error">Expenses</div>

                <v-btn
                  density="comfortable"
                  size="small"
                  icon="mdi-playlist-plus"
                  variant="elevated"
                  color="error"
                />
              </div>

              <div class="d-flex flex-column">
                <budget-item-list
                  type="EXPENSES"
                  :items="currentBudget!.expense_items"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getJwt } from "~/helpers/getJwt";
import BudgetInfo from "./BudgetInfo.vue";
import BudgetItemList from "./BudgetItemList.vue";

definePageMeta({
  middleware: "requires-auth",
});

export interface BudgetItem {
  id: string;
  type: "INCOME" | "EXPENSES";
  description: string;
  value: number;
  created_at: string;
  updated_at: string;
  budget_id: string;
}

export interface Budget {
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
