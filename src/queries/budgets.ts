import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { computed, type ComputedRef } from 'vue'
import { getBudget, getBudgets } from '@/api/budgets'
import type { BudgetListParams } from '@/types'

export const budgetKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetKeys.all, 'list'] as const,
  list: (params: BudgetListParams) => [...budgetKeys.lists(), params] as const,
  details: () => [...budgetKeys.all, 'detail'] as const,
  detail: (budgetId: string) => [...budgetKeys.details(), budgetId] as const,
}

export const useBudgetsQuery = (params: ComputedRef<BudgetListParams>) =>
  useQuery({
    queryKey: computed(() => budgetKeys.list(params.value)),
    queryFn: () => getBudgets(params.value),
    placeholderData: keepPreviousData,
  })

export const useBudgetQuery = (budgetId: ComputedRef<string>) =>
  useQuery({
    queryKey: computed(() => budgetKeys.detail(budgetId.value)),
    queryFn: () => getBudget(budgetId.value),
    enabled: computed(() => Boolean(budgetId.value)),
  })
