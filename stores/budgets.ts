import { getJwt } from "~/helpers/getJwt";

export const DEFAULT_SORTBY = "created_at:desc";

export interface BudgetListItem {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  is_pinned: boolean;
  balance: number;
  user_id: string;
}

export interface BudgetsResponse {
  budgets: BudgetListItem[];
  page_number: number;
  page_size: number;
  total_count: number;
}

export const useBudgetStore = defineStore("budgets", () => {
  const {
    public: { apiUrl },
  } = useRuntimeConfig();

  const sort = ref(DEFAULT_SORTBY);
  const search = ref("");
  const budgetsResponse = ref<BudgetsResponse | null>(null);
  const budgetsFetched = ref(false);
  const budgetsLoader = ref(false);

  const fetchBudgets = async ({ refresh = false } = {}) => {
    try {
      if (budgetsFetched.value && !refresh) return budgetsResponse.value;

      budgetsLoader.value = true;

      const response = await $fetch<BudgetsResponse>(`${apiUrl}/budgets`, {
        headers: {
          Authorization: `Bearer ${await getJwt()}`,
        },
        query: {
          sort: sort.value,
          search: search.value,
        },
        parseResponse: (r) => JSON.parse(r),
      });

      budgetsResponse.value = response;

      budgetsFetched.value = true;
    } catch (e) {
      throw e;
    } finally {
      budgetsLoader.value = false;
    }
  };

  return {
    sort,
    search,
    budgetsResponse,
    budgetsLoader,
    budgetsFetched,
    fetchBudgets,
  };
});
