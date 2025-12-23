/// <reference types="vite/client" />

import type dayjs from 'dayjs'

declare module 'vue' {
  interface ComponentCustomProperties {
    $dayjs: typeof dayjs
  }
}
