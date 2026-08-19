export type User = {
  id: string
  email: string
}

export type BudgetItemType = 'INCOME' | 'EXPENSES'

export type BudgetSummary = {
  id: string
  created_at: string
  updated_at: string
  title: string
  is_pinned: boolean
  balance: number
  user_id: string
}

export type BudgetListResponse = {
  budgets: BudgetSummary[]
  page_number: number
  page_size: number
  total_count: number
}

export type BudgetItem = {
  id: string
  type: BudgetItemType
  description: string
  value: number
  expense_percentage?: number
  created_at: string
  updated_at: string
  budget_id: string
}

export type BudgetDetails = {
  id: string
  title: string
  is_pinned: boolean
  balance: number
  expenses_percentage: number
  total_income: number
  total_expenses: number
  expense_items: BudgetItem[]
  income_items: BudgetItem[]
  created_at: string
  updated_at: string
  user_id: string
}

export type BudgetSort = 'created_at:desc' | 'created_at:asc' | 'balance:desc' | 'balance:asc'

export type BudgetListParams = {
  search?: string
  sort: BudgetSort
  limit: number
  offset: number
}

export type BudgetInput = {
  title: string
  is_pinned: boolean
}

export type BudgetItemInput = {
  description: string
  value: number
  type: BudgetItemType
}

export type ApiErrorBody = {
  message: string
  errors?: Array<{
    field?: string
    message: string
  }>
}
