import { describe, expect, it } from 'vitest'
import { budgetKeys } from './budgets'

describe('budget query keys', () => {
  it('separates list filters and pages', () => {
    const firstPage = budgetKeys.list({ sort: 'created_at:desc', limit: 12, offset: 0 })
    const secondPage = budgetKeys.list({ sort: 'created_at:desc', limit: 12, offset: 12 })
    const search = budgetKeys.list({
      search: 'travel',
      sort: 'created_at:desc',
      limit: 12,
      offset: 0,
    })

    expect(firstPage).not.toEqual(secondPage)
    expect(firstPage).not.toEqual(search)
    expect(firstPage).toEqual([
      'budgets',
      'list',
      { sort: 'created_at:desc', limit: 12, offset: 0 },
    ])
  })

  it('uses a stable detail namespace', () => {
    expect(budgetKeys.detail('budget-id')).toEqual(['budgets', 'detail', 'budget-id'])
  })
})
