import { z } from 'zod'

export const budgetSchema = z.object({
  title: z.string().trim().min(1, 'Enter a budget name.'),
  is_pinned: z.boolean(),
})

export const moneySchema = z
  .number({ error: 'Enter an amount.' })
  .nonnegative('Amount cannot be negative.')
  .max(99_999_999.99, 'Amount is too large.')
  .multipleOf(0.01, 'Use no more than two decimal places.')

export const budgetItemSchema = z.object({
  description: z.string().trim().min(1, 'Enter a description.'),
  value: moneySchema,
})

export type BudgetItemFormValues = z.infer<typeof budgetItemSchema>
