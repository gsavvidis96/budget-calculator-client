import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const reset = () => {
    user.value = null
  }

  return { user, reset }
})
