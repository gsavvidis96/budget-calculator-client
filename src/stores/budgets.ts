import { DEFAULT_SORTBY } from '@/constants'
import type { Budget, BudgetList } from '@/types'

export const useBudgetsStore = defineStore('budgets', () => {
  const search = ref('')
  const sort = ref(DEFAULT_SORTBY)

  const budgets = ref<BudgetList | null>(null)
  const budgetsLoader = ref(false)
  const budgetsFetched = ref(false)

  const currentBudget = ref<Budget | null>(null)
  const currentBudgetLoader = ref(false)

  const { openSnackbar } = useBaseStore()

  const getBudgets = async ({ refresh = false } = {}) => {
    try {
      if (budgetsFetched.value && !refresh) return

      budgetsLoader.value = true

      const { data } = await apiClient.get<BudgetList>('/budgets', {
        params: {
          sort: sort.value,
          ...(search.value && { search: search.value }),
        },
      })

      budgets.value = data

      budgetsFetched.value = true
    } catch (e) {
      console.error(e)

      openSnackbar({
        color: 'error',
        text: 'Something went wrong.',
      })
    } finally {
      budgetsLoader.value = false
    }
  }

  const getBudgetById = async (budgetId: string) => {
    try {
      currentBudgetLoader.value = true

      const { data } = await apiClient.get<Budget>(`/budgets/${budgetId}`)

      currentBudget.value = data
    } catch (e) {
      console.error(e)

      openSnackbar({
        color: 'error',
        text: 'Something went wrong.',
      })

      throw e
    } finally {
      currentBudgetLoader.value = false
    }
  }

  const budgetsReset = () => {
    search.value = ''
    sort.value = DEFAULT_SORTBY
    budgets.value = null
    budgetsFetched.value = false
    currentBudget.value = null
  }

  return {
    budgets,
    budgetsLoader,
    getBudgets,
    budgetsReset,
    getBudgetById,
    currentBudget,
    currentBudgetLoader,
    sort,
    search,
    budgetsFetched,
  }
})
