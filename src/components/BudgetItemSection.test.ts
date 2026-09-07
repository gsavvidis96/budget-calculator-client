import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import BudgetItemSection from './BudgetItemSection.vue'
import type { BudgetItem } from '@/types'

const CheckboxStub = defineComponent({
  name: 'Checkbox',
  props: {
    modelValue: Boolean,
    disabled: Boolean,
  },
  emits: ['update:modelValue'],
  template: '<input type="checkbox" :checked="modelValue" :disabled="disabled" />',
})

const global = {
  stubs: {
    Button: true,
    Checkbox: CheckboxStub,
  },
}

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

const makeExpense = (checked: boolean): BudgetItem => ({
  ...makeItem('rent', 'Rent', 0),
  type: 'EXPENSES',
  is_checked: checked,
  expense_percentage: checked ? 0 : 25,
})

describe('BudgetItemSection', () => {
  it('emits the complete reordered sequence for keyboard reordering', async () => {
    const wrapper = mount(BudgetItemSection, {
      props: {
        type: 'INCOME',
        items: [makeItem('first', 'Salary', 0), makeItem('second', 'Bonus', 1)],
      },
      global,
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
      global,
    })

    await wrapper
      .get('article[aria-label="Reorder Salary. Use drag and drop or the arrow keys."]')
      .trigger('keydown', { key: 'ArrowUp' })

    expect(wrapper.emitted('reorder')).toBeUndefined()
  })

  it('keeps rows scrollable normally and makes the whole row draggable in reorder mode', async () => {
    const wrapper = mount(BudgetItemSection, {
      props: {
        type: 'INCOME',
        items: [makeItem('salary', 'Salary', 0), makeItem('bonus', 'Bonus', 1)],
      },
      global,
    })

    expect(wrapper.get('article').classes()).toContain('touch-pan-y')
    await wrapper.get('[data-mobile-reorder-toggle]').trigger('click')

    expect(wrapper.get('article').classes()).toContain('touch-none')
    expect(wrapper.text()).toContain('Drag items to arrange')
    expect(wrapper.get('[data-mobile-reorder-toggle]').attributes('aria-pressed')).toBe('true')
  })

  it('only renders checked-state controls for expenses', () => {
    const income = mount(BudgetItemSection, {
      props: { type: 'INCOME', items: [makeItem('salary', 'Salary', 0)] },
      global,
    })
    const expenses = mount(BudgetItemSection, {
      props: { type: 'EXPENSES', items: [makeExpense(false)] },
      global,
    })

    expect(income.findComponent({ name: 'Checkbox' }).exists()).toBe(false)
    expect(expenses.findComponent({ name: 'Checkbox' }).exists()).toBe(true)
  })

  it('emits a checked-state change for an expense', async () => {
    const wrapper = mount(BudgetItemSection, {
      props: { type: 'EXPENSES', items: [makeExpense(false)] },
      global,
    })

    wrapper.findComponent(CheckboxStub).vm.$emit('update:modelValue', true)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('check')).toEqual([[expect.objectContaining({ id: 'rent' }), true]])
  })

  it('subdues checked expenses and disables their controls while saving', () => {
    const wrapper = mount(BudgetItemSection, {
      props: {
        type: 'EXPENSES',
        items: [makeExpense(true)],
        checkingItemId: 'rent',
        checkDisabled: true,
      },
      global,
    })

    expect(wrapper.get('article').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('article p').classes()).toContain('line-through')
    expect(wrapper.findComponent(CheckboxStub).props('disabled')).toBe(true)
  })
})
