import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BudgetItemSection from './BudgetItemSection.vue'
import type { BudgetItem } from '@/types'

const makeItem = (id: string, description: string, position: number): BudgetItem => ({
  id,
  type: 'INCOME',
  description,
  value: 100,
  position,
  created_at: '2026-08-21T12:00:00.000Z',
  updated_at: '2026-08-21T12:00:00.000Z',
  budget_id: 'budget-id',
})

describe('BudgetItemSection', () => {
  it('emits the complete reordered sequence for keyboard reordering', async () => {
    const wrapper = mount(BudgetItemSection, {
      props: {
        type: 'INCOME',
        items: [makeItem('first', 'Salary', 0), makeItem('second', 'Bonus', 1)],
      },
      global: {
        stubs: { Button: true },
      },
    })

    await wrapper
      .get('article[aria-label="Reorder Salary. Use drag and drop or the arrow keys."]')
      .trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('reorder')).toEqual([['INCOME', ['second', 'first']]])
  })

  it('does not reorder beyond the list boundary', async () => {
    const wrapper = mount(BudgetItemSection, {
      props: {
        type: 'INCOME',
        items: [makeItem('first', 'Salary', 0), makeItem('second', 'Bonus', 1)],
      },
      global: {
        stubs: { Button: true },
      },
    })

    await wrapper
      .get('article[aria-label="Reorder Salary. Use drag and drop or the arrow keys."]')
      .trigger('keydown', { key: 'ArrowUp' })

    expect(wrapper.emitted('reorder')).toBeUndefined()
  })
})
