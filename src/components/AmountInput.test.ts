/* eslint-disable vue/one-component-per-file -- Test harnesses for standalone and form usage. */
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import PrimeVue from 'primevue/config'
import { Form as PrimeForm, FormField } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { budgetItemSchema } from '@/schemas/budgets'
import AmountInput from './AmountInput.vue'

enableAutoUnmount(afterEach)

function mountAmount(value: number | null) {
  return mount(
    defineComponent({
      components: { AmountInput },
      setup: () => ({ amount: ref(value) }),
      template: '<AmountInput v-model="amount" input-id="amount" />',
    }),
    { attachTo: document.body, global: { plugins: [PrimeVue] } },
  )
}

describe('AmountInput', () => {
  it('starts empty and preserves decimal typing across blur and refocus', async () => {
    const wrapper = mountAmount(null)
    const input = wrapper.get('input')
    expect(input.element.value).toBe('')
    expect(input.attributes('placeholder')).toBe('0.00')
    input.element.focus()
    await input.setValue('250.')
    expect(input.element.value).toBe('250.')
    await input.setValue('250.5')
    expect(input.element.value).toBe('250.5')
    input.element.blur()
    await nextTick()
    expect(input.element.value).toBe('250.5')
    input.element.focus()
    await nextTick()
    expect(input.element.value).toBe('250.5')
    expect(wrapper.findComponent(AmountInput).props('modelValue')).toBe(250.5)
  })

  it('leaves native cursor placement and selection alone on first and later clicks', async () => {
    const wrapper = mountAmount(80)
    const input = wrapper.get('input')
    expect(input.element.value).toBe('80')
    const click = new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 })
    input.element.dispatchEvent(click)
    expect(click.defaultPrevented).toBe(false)
    input.element.setSelectionRange(1, 1)
    input.element.focus()
    await nextTick()
    expect([input.element.selectionStart, input.element.selectionEnd]).toEqual([1, 1])
    expect(input.element.value).toBe('80')
    await input.trigger('mousedown', { button: 0 })
    await input.trigger('click')
    expect([input.element.selectionStart, input.element.selectionEnd]).toEqual([1, 1])
    await input.setValue('95')
    input.element.blur()
    await nextTick()
    expect(input.element.value).toBe('95')
    input.element.setSelectionRange(1, 1)
    input.element.focus()
    await nextTick()
    expect([input.element.selectionStart, input.element.selectionEnd]).toEqual([1, 1])
  })

  it('preserves existing cents and accepts a comma decimal separator', async () => {
    const wrapper = mountAmount(80.25)
    const input = wrapper.get('input')
    input.element.focus()
    await nextTick()
    expect(input.element.value).toBe('80.25')
    expect(input.element.selectionEnd).toBe(5)
    await input.setValue('95,50')
    expect(input.element.value).toBe('95,50')
    expect(wrapper.findComponent(AmountInput).props('modelValue')).toBe(95.5)
    input.element.blur()
    await nextTick()
    expect(input.element.value).toBe('95,50')
    input.element.focus()
    await nextTick()
    expect(input.element.value).toBe('95,50')
  })

  it.each(['€95,50', '95.50 €'])(
    'accepts a pasted currency symbol in %j without rewriting the input',
    async (value) => {
      const wrapper = mountAmount(null)
      const input = wrapper.get('input')
      await input.setValue(value)
      expect(input.element.value).toBe(value)
      expect(wrapper.findComponent(AmountInput).props('modelValue')).toBe(95.5)
    },
  )

  it.each(['', 'abc', '1,234.56', '1.234', '-5', '100000000'])(
    'keeps invalid input %j visible instead of silently changing the amount',
    async (value) => {
      const wrapper = mountAmount(80)
      const input = wrapper.get('input')
      input.element.focus()
      await input.setValue(value)
      input.element.blur()
      await nextTick()
      expect(input.element.value).toBe(value)
      expect(
        budgetItemSchema.shape.value.safeParse(
          wrapper.findComponent(AmountInput).props('modelValue'),
        ).success,
      ).toBe(false)
    },
  )

  it('updates numeric form values and dirty state without marking focus as an edit', async () => {
    const wrapper = mount(
      defineComponent({
        components: { PrimeForm, FormField, AmountInput },
        setup: () => ({ resolver: zodResolver(budgetItemSchema) }),
        template: `
        <PrimeForm :initial-values="{ description: 'Rent', value: 80 }" :resolver="resolver">
          <FormField v-slot="field" name="value">
            <AmountInput input-id="amount" :model-value="field.value"
              @update:model-value="field.props.onChange({ value: $event })"
              @blur="field.props.onBlur" />
            <span data-state>{{ JSON.stringify({ value: field.value, dirty: field.dirty }) }}</span>
          </FormField>
        </PrimeForm>
      `,
      }),
      { attachTo: document.body, global: { plugins: [PrimeVue] } },
    )
    const input = wrapper.get('input')
    input.element.focus()
    await nextTick()
    expect(JSON.parse(wrapper.get('[data-state]').text())).toEqual({ value: 80, dirty: false })
    await input.setValue('95,50')
    expect(JSON.parse(wrapper.get('[data-state]').text())).toEqual({ value: 95.5, dirty: true })
    await input.setValue('')
    expect(JSON.parse(wrapper.get('[data-state]').text())).toEqual({ value: null, dirty: true })
  })
})
