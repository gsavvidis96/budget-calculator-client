import { useDark, useToggle } from '@vueuse/core'

export const useAppTheme = () => {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'app-dark',
    valueLight: 'app-light',
    storageKey: 'budget-calculator:theme',
  })

  return {
    isDark,
    toggleTheme: useToggle(isDark),
  }
}
