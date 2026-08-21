import './styles/main.css'
import '@fontsource-variable/roboto-mono'

import { createPinia } from 'pinia'
import { createApp, watch } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { initializePwaInstall } from './composables/usePwaInstall'
import { registerSW } from 'virtual:pwa-register'

const BudgetTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{teal.50}',
      100: '{teal.100}',
      200: '{teal.200}',
      300: '{teal.300}',
      400: '{teal.400}',
      500: '{teal.500}',
      600: '{teal.600}',
      700: '{teal.700}',
      800: '{teal.800}',
      900: '{teal.900}',
      950: '{teal.950}',
    },
  },
})

const app = createApp(App)
initializePwaInstall()
registerSW({ immediate: true })
const pinia = createPinia()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

app.use(pinia)
app.use(PrimeVue, {
  license: import.meta.env.VITE_PRIMEUI_LICENSE,
  ripple: true,
  theme: {
    preset: BudgetTheme,
    options: {
      darkModeSelector: '.app-dark',
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
    },
  },
})
app.use(ToastService)
app.use(ConfirmationService)
app.use(VueQueryPlugin, { queryClient })

const auth = useAuthStore(pinia)
await auth.initialize()

watch(
  () => auth.user,
  (user, previousUser) => {
    if (!user && previousUser) queryClient.clear()
  },
)

app.use(router)
await router.isReady()
app.mount('#app')
