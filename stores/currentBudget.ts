import { getJwt } from "~/helpers/getJwt";

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

export const useCurrentBudgetStore = defineStore("currentBudget", () => {
  const {
    public: { apiUrl },
  } = useRuntimeConfig();

  const currentBudgetLoader = ref(false);
  const currentBudget = ref<Budget | null>(null);

  const fetchCurrentBudget = async (id: string) => {
    try {
      currentBudgetLoader.value = true;

      const budget = await $fetch<Budget>(`${apiUrl}/budgets/${id}`, {
        headers: {
          Authorization: `Bearer ${await getJwt()}`,
        },
        parseResponse: (r) => JSON.parse(r),
      });

      currentBudget.value = budget;
    } catch (e) {
      throw e;
    } finally {
      currentBudgetLoader.value = false;
    }
  };

  return { currentBudgetLoader, currentBudget, fetchCurrentBudget };
});
