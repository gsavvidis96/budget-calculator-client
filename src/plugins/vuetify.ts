import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'

const light: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#26a69a',
    error: '#F44336',
  },
}

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#26a69a',
    error: '#F44336',
  },
}

const isDark = useDark()

const vuetify = createVuetify({
  theme: {
    defaultTheme: isDark.value ? 'dark' : 'light',
    themes: {
      light,
      dark,
    },
  },
  defaults: {
    VBtn: {
      variant: 'flat',
    },
  },
})

export default vuetify
