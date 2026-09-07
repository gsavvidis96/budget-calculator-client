import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import BudgetItemSection from './BudgetItemSection.vue'
import type { BudgetItem } from '@/types'

enableAutoUnmount(afterEach)
afterEach(() => Reflect.deleteProperty(document, 'elementFromPoint'))

const pointerEvent = async (
  element: EventTarget,
  type: string,
  properties: Record<string, unknown> = {},
) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  for (const [key, value] of Object.entries({
    pointerType: 'mouse',
    pointerId: 1,
    button: 0,
    isPrimary: true,
    clientX: 10,
    clientY: 260,
    ...properties,
  }))
    Object.defineProperty(event, key, { value })
  element.dispatchEvent(event)
  await nextTick()
}

const mockCapture = (element: Element) => {
  const capture = {
    setPointerCapture: vi.fn(),
    hasPointerCapture: () => true,
    releasePointerCapture: vi.fn(),
  }
  Object.assign(element, capture)
  return capture
}

const mockRowAtPointer = (element: Element) => {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ top: 200, height: 80 } as DOMRect)
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: vi.fn(() => element),
  })
}

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

  it('keeps rows scrollable and only enables touch dragging from the reorder handle', async () => {
    const wrapper = mount(BudgetItemSection, {
      props: {
        type: 'INCOME',
        items: [makeItem('salary', 'Salary', 0), makeItem('bonus', 'Bonus', 1)],
      },
      global,
    })

    expect(wrapper.get('article').classes()).toContain('touch-pan-y')
    expect(wrapper.find('[data-touch-reorder-handle]').exists()).toBe(false)
    await wrapper.get('[data-mobile-reorder-toggle]').trigger('click')

    expect(wrapper.get('article').classes()).toContain('touch-pan-y')
    expect(wrapper.get('[data-touch-reorder-handle]').classes()).toContain('touch-none')
    expect(wrapper.text()).toContain('Drag items to arrange')
    expect(wrapper.get('[data-mobile-reorder-toggle]').attributes('aria-pressed')).toBe('true')
  })

  it('clears the dragging state when pointer capture is unexpectedly lost', async () => {
    const wrapper = mount(BudgetItemSection, {
      props: {
        type: 'INCOME',
        items: [makeItem('salary', 'Salary', 0), makeItem('bonus', 'Bonus', 1)],
      },
      global,
    })
    await wrapper.get('[data-mobile-reorder-toggle]').trigger('click')
    const handle = wrapper.get('[data-touch-reorder-handle]')
    Object.assign(handle.element, {
      setPointerCapture: () => undefined,
      hasPointerCapture: () => false,
      releasePointerCapture: () => undefined,
    })

    await pointerEvent(handle.element, 'pointerdown', { pointerType: 'touch', pointerId: 7 })
    expect(wrapper.get('article').classes()).toContain('opacity-55')

    await pointerEvent(handle.element, 'lostpointercapture', { pointerType: 'touch', pointerId: 7 })
    expect(wrapper.get('article').classes()).not.toContain('opacity-55')
  })

  it('can touch-drag upward through multiple rows without moving the captured element in the DOM', async () => {
    const wrapper = mount(BudgetItemSection, {
      props: {
        type: 'INCOME',
        items: [
          makeItem('first', 'Salary', 0),
          makeItem('second', 'Bonus', 1),
          makeItem('third', 'Interest', 2),
        ],
      },
      global,
    })
    await wrapper.get('[data-mobile-reorder-toggle]').trigger('click')
    const handles = wrapper.findAll('[data-touch-reorder-handle]')
    const handle = handles[2]!
    const releasePointerCapture = vi.fn()
    Object.assign(handle.element, {
      setPointerCapture: vi.fn(),
      hasPointerCapture: () => true,
      releasePointerCapture,
    })
    const rows = wrapper.findAll('article')
    for (const row of rows) {
      vi.spyOn(row.element, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        height: 80,
      } as DOMRect)
    }
    const hitTest = vi.fn(() => rows[1]!.element)
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: hitTest,
    })

    try {
      await pointerEvent(handle.element, 'pointerdown', { pointerType: 'touch', pointerId: 8 })
      const movePointer = (pointerId = 8) =>
        pointerEvent(handle.element, 'pointermove', {
          pointerType: 'touch',
          pointerId,
          clientY: 110,
        })
      await movePointer()
      expect(rows[2]!.element.style.order).toBe('1')
      expect(
        wrapper.findAll('article').map((row) => row.attributes('data-budget-item-id')),
      ).toEqual(['first', 'second', 'third'])
      expect(wrapper.emitted('reorder')).toBeUndefined()

      hitTest.mockReturnValue(rows[0]!.element)
      await movePointer(9)
      expect(rows[2]!.element.style.order).toBe('1')
      await movePointer()
      expect(rows[2]!.element.style.order).toBe('0')
      await pointerEvent(handle.element, 'pointerup', { pointerType: 'touch', pointerId: 8 })
      await pointerEvent(handle.element, 'lostpointercapture', {
        pointerType: 'touch',
        pointerId: 8,
      })

      expect(wrapper.emitted('reorder')).toEqual([['INCOME', ['third', 'first', 'second']]])
      expect(releasePointerCapture).toHaveBeenCalledWith(8)
      expect(
        wrapper.findAll('article').map((row) => row.attributes('data-budget-item-id')),
      ).toEqual(['third', 'first', 'second'])
    } finally {
      Reflect.deleteProperty(document, 'elementFromPoint')
    }
  })

  it('previews mouse dragging without relocating the source or oscillating over child elements', async () => {
    const wrapper = mount(BudgetItemSection, {
      props: {
        type: 'INCOME',
        items: [makeItem('first', 'Salary', 0), makeItem('second', 'Bonus', 1)],
      },
      global,
    })
    const [first, second] = wrapper.findAll('article')
    mockCapture(first!.element)
    mockRowAtPointer(second!.element)
    await pointerEvent(first!.element, 'pointerdown')
    await pointerEvent(first!.element, 'pointermove', { clientY: 220 })
    expect(first!.element.style.order).toBe('0')
    await pointerEvent(first!.element, 'pointermove')
    expect(first!.element.style.order).toBe('1')
    expect(wrapper.findAll('article')[0]!.element).toBe(first!.element)
    await pointerEvent(first!.get('p').element, 'pointermove')
    expect(first!.element.style.order).toBe('1')
    expect(wrapper.emitted('reorder')).toBeUndefined()

    await pointerEvent(first!.element, 'pointerup')
    await pointerEvent(first!.element, 'lostpointercapture')
    expect(wrapper.emitted('reorder')).toEqual([['INCOME', ['second', 'first']]])
    expect(wrapper.findAll('article')[1]!.element).toBe(first!.element)
    expect(first!.attributes('draggable')).toBe('false')
  })

  it.each(['pointercancel', 'lostpointercapture', 'blur', 'Escape'])(
    'restores the original order when a drag is interrupted by %s',
    async (interruption) => {
      const wrapper = mount(BudgetItemSection, {
        props: {
          type: 'INCOME',
          items: [makeItem('first', 'Salary', 0), makeItem('second', 'Bonus', 1)],
        },
        global,
      })
      const [first, second] = wrapper.findAll('article')
      mockCapture(first!.element)
      mockRowAtPointer(second!.element)
      await pointerEvent(first!.element, 'pointerdown')
      await pointerEvent(first!.element, 'pointermove')
      expect(first!.element.style.order).toBe('1')
      if (interruption === 'Escape') {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
        await nextTick()
      } else if (interruption === 'blur') {
        window.dispatchEvent(new Event('blur'))
        await nextTick()
      } else {
        await pointerEvent(first!.element, interruption)
      }
      expect(first!.element.style.order).toBe('0')
      expect(wrapper.emitted('reorder')).toBeUndefined()
      expect(first!.classes()).not.toContain('opacity-55')
    },
  )

  it('ignores secondary buttons, interactive controls, and disabled reordering', async () => {
    const wrapper = mount(BudgetItemSection, {
      props: {
        type: 'EXPENSES',
        items: [makeExpense(false), { ...makeExpense(false), id: 'food' }],
      },
      global,
    })
    const row = wrapper.get('article')
    const capture = mockCapture(row.element)
    await pointerEvent(row.element, 'pointerdown', { button: 2 })
    await pointerEvent(row.get('input').element, 'pointerdown')
    await pointerEvent(row.element, 'pointerdown', { pointerType: 'touch' })
    await wrapper.setProps({ reorderDisabled: true })
    await pointerEvent(row.element, 'pointerdown')
    expect(capture.setPointerCapture).not.toHaveBeenCalled()
    expect(wrapper.emitted('reorder')).toBeUndefined()
  })

  it('saves once when pointer-up is received outside the component', async () => {
    const wrapper = mount(BudgetItemSection, {
      props: {
        type: 'INCOME',
        items: [makeItem('first', 'Salary', 0), makeItem('second', 'Bonus', 1)],
      },
      global,
    })
    const [first, second] = wrapper.findAll('article')
    mockCapture(first!.element)
    mockRowAtPointer(second!.element)
    await pointerEvent(first!.element, 'pointerdown')
    await pointerEvent(first!.element, 'pointermove')
    await pointerEvent(window, 'pointerup')
    await pointerEvent(first!.element, 'lostpointercapture')
    expect(wrapper.emitted('reorder')).toEqual([['INCOME', ['second', 'first']]])
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
