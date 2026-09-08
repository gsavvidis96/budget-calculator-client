import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { useDialogFocusReturn } from './useDialogFocusReturn'

enableAutoUnmount(afterEach)

const Harness = defineComponent({
  setup: () => useDialogFocusReturn(),
  template: '<div><button class="p-button">Edit</button><input /></div>',
})

function openDialog() {
  const wrapper = mount(Harness, { attachTo: document.body })
  const trigger = wrapper.get('button').element
  trigger.focus()
  wrapper.vm.onShow()
  wrapper.get('input').element.focus()
  return { wrapper, trigger }
}

function pointerClose() {
  const context = openDialog()
  document.dispatchEvent(new Event('pointerdown', { bubbles: true }))
  context.wrapper.vm.onHide()
  // PrimeVue restores focus after emitting hide.
  context.trigger.focus()
  return context
}

describe('dialog focus return', () => {
  it('suppresses the pointer-close ring without removing focus from the trigger', () => {
    const { trigger } = pointerClose()
    expect(document.activeElement).toBe(trigger)
    expect(trigger.classList.contains('dialog-pointer-return')).toBe(true)
  })

  it('keeps the focus ring when closing with Escape after pointer use', () => {
    const { wrapper, trigger } = openDialog()
    document.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    wrapper.vm.onHide()
    trigger.focus()
    expect(document.activeElement).toBe(trigger)
    expect(trigger.classList.contains('dialog-pointer-return')).toBe(false)
  })

  it('restores the ring as soon as keyboard navigation resumes', () => {
    const { trigger } = pointerClose()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(trigger.classList.contains('dialog-pointer-return')).toBe(false)
  })

  it('clears the override on blur so a later keyboard visit uses normal focus styling', () => {
    const { wrapper, trigger } = pointerClose()
    wrapper.get('input').element.focus()
    expect(trigger.classList.contains('dialog-pointer-return')).toBe(false)
  })

  it('clears the override on unmount', () => {
    const { wrapper, trigger } = pointerClose()
    wrapper.unmount()
    expect(trigger.classList.contains('dialog-pointer-return')).toBe(false)
  })
})
