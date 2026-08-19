import { describe, expect, it } from 'vitest'
import { budgetItemSchema, budgetSchema, moneySchema } from './budgets'

describe('budget schemas', () => {
  it('trims names and rejects blank values', () => {
    expect(budgetSchema.parse({ title: '  Monthly  ', is_pinned: false }).title).toBe('Monthly')
    expect(budgetSchema.safeParse({ title: '  ', is_pinned: false }).success).toBe(false)
  })

  it('matches the API monetary boundary', () => {
    expect(moneySchema.safeParse(0).success).toBe(true)
    expect(moneySchema.safeParse(99_999_999.99).success).toBe(true)
    expect(moneySchema.safeParse(-0.01).success).toBe(false)
    expect(moneySchema.safeParse(100_000_000).success).toBe(false)
    expect(moneySchema.safeParse(1.001).success).toBe(false)
  })

  it('validates item descriptions and amounts together', () => {
    expect(budgetItemSchema.safeParse({ description: 'Rent', value: 950 }).success).toBe(true)
    expect(budgetItemSchema.safeParse({ description: '', value: 950 }).success).toBe(false)
  })
})
