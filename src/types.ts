export interface User {
  id: string
  email: string
}

export interface BudgetListItem {
  id: string
  created_at: string
  updated_at: string
  title: string
  is_pinned: boolean
  balance: number
  user_id: string
}

export interface BudgetList {
  budgets: BudgetListItem[]
  page_number: number
  page_size: number
  total_count: number
}

export interface BudgetItem {
  id: string
  type: 'INCOME' | 'EXPENSES'
  description: string
  value: number
  expense_percentage?: number
  created_at: string
  updated_at: string
  budget_id: string
}

export interface Budget {
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
