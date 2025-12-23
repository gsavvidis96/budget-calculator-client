import 'unfonts.css'
import './styles/style.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import dayjs from 'dayjs'

const app = createApp(App)

app.config.globalProperties.$dayjs = dayjs

const formatPrice = (el: HTMLElement, binding: DirectiveBinding<number>) => {
  let prefix = ''

  if (binding.modifiers.plus) {
    prefix = '+'
  } else if (binding.modifiers.minus && binding.value !== 0) {
    prefix = '-'
  }

  el.textContent =
    prefix +
    binding.value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    '€'
}

app.directive('price', {
  mounted: formatPrice,
  updated: formatPrice,
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
