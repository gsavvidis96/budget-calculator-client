import { apiClient } from '@/lib/apiClient'
import type {
  BudgetDetails,
  BudgetInput,
  BudgetItem,
  BudgetItemInput,
  BudgetListParams,
  BudgetListResponse,
  BudgetSummary,
} from '@/types'

export const getBudgets = async (params: BudgetListParams) => {
  const { data } = await apiClient.get<BudgetListResponse>('/budgets', { params })
  return data
}

export const getBudget = async (budgetId: string) => {
  const { data } = await apiClient.get<BudgetDetails>(`/budgets/${budgetId}`)
  return data
}

export const createBudget = async (input: BudgetInput) => {
  const { data } = await apiClient.post<BudgetSummary>('/budgets', input)
  return data
}

export const updateBudget = async ({
  budgetId,
  input,
}: {
  budgetId: string
  input: Partial<BudgetInput>
}) => {
  const { data } = await apiClient.patch<BudgetSummary>(`/budgets/${budgetId}`, input)
  return data
}

export const deleteBudget = async (budgetId: string) => {
  const { data } = await apiClient.delete<BudgetSummary>(`/budgets/${budgetId}`)
  return data
}

export const createBudgetItem = async ({
  budgetId,
  input,
}: {
  budgetId: string
  input: BudgetItemInput
}) => {
  const { data } = await apiClient.post<BudgetItem>(`/budgets/${budgetId}/budget-items`, input)
  return data
}

export const updateBudgetItem = async ({
  budgetId,
  itemId,
  input,
}: {
  budgetId: string
  itemId: string
  input: Partial<BudgetItemInput>
}) => {
  const { data } = await apiClient.patch<BudgetItem>(
    `/budgets/${budgetId}/budget-items/${itemId}`,
    input,
  )
  return data
}

export const deleteBudgetItem = async ({
  budgetId,
  itemId,
}: {
  budgetId: string
  itemId: string
}) => {
  const { data } = await apiClient.delete<BudgetItem>(`/budgets/${budgetId}/budget-items/${itemId}`)
  return data
}
