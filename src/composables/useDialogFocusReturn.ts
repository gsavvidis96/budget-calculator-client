import { onBeforeUnmount } from 'vue'

// Keep dialog focus restoration, but don't carry an input's focus ring back
// to the trigger after a pointer interaction. Keyboard interaction restores it.
export function useDialogFocusReturn() {
  let trigger: HTMLElement | null = null
  let pointerInteraction = false
  let clearReturnedFocus = () => {}

  const onPointerDown = () => {
    pointerInteraction = true
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (!['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) pointerInteraction = false
  }
  const stopTracking = () => {
    document.removeEventListener('pointerdown', onPointerDown, true)
    document.removeEventListener('keydown', onKeyDown, true)
  }

  const onShow = () => {
    clearReturnedFocus()
    stopTracking()
    trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    pointerInteraction = Boolean(trigger && !trigger.matches(':focus-visible'))
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
  }

  const onHide = () => {
    stopTracking()
    const target = trigger
    trigger = null
    if (!pointerInteraction || !target?.isConnected) return

    target.classList.add('dialog-pointer-return')
    const clear = () => {
      target.classList.remove('dialog-pointer-return')
      target.removeEventListener('blur', clear)
      document.removeEventListener('keydown', clearOnKeyboard, true)
    }
    const clearOnKeyboard = (event: KeyboardEvent) => {
      if (!['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) clear()
    }
    target.addEventListener('blur', clear, { once: true })
    document.addEventListener('keydown', clearOnKeyboard, true)
    clearReturnedFocus = clear
  }

  onBeforeUnmount(() => {
    stopTracking()
    clearReturnedFocus()
  })

  return { onShow, onHide }
}
