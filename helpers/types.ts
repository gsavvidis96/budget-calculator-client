export interface BudgetListItem {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  is_pinned: boolean;
  balance: number;
  user_id: string;
}
