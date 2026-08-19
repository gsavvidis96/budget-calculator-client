import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

const REDIRECT_KEY = 'budget-calculator:redirect'

const toUser = (session: Session | null): User | null => {
  if (!session?.user.email) return null

  return {
    id: session.user.id,
    email: session.user.email,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const initialized = ref(false)
  const callbackError = ref('')

  let unsubscribe: (() => void) | undefined

  const initialize = async () => {
    if (initialized.value) return

    const hash = new URLSearchParams(window.location.hash.slice(1))
    callbackError.value = hash.get('error_description') ?? ''

    const {
      data: { session },
    } = await supabase.auth.getSession()

    user.value = toUser(session)

    const { data } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, nextSession: Session | null) => {
        user.value = toUser(nextSession)
      },
    )

    unsubscribe = () => data.subscription.unsubscribe()
    initialized.value = true

    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        '',
        `${window.location.pathname}${window.location.search}`,
      )
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    })

    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const rememberRedirect = (path: string) => {
    if (path.startsWith('/') && !path.startsWith('//')) {
      sessionStorage.setItem(REDIRECT_KEY, path)
    }
  }

  const consumeRedirect = () => {
    const path = sessionStorage.getItem(REDIRECT_KEY)
    sessionStorage.removeItem(REDIRECT_KEY)
    return path?.startsWith('/') && !path.startsWith('//') ? path : '/budgets'
  }

  const clearCallbackError = () => {
    callbackError.value = ''
  }

  const dispose = () => unsubscribe?.()

  return {
    user,
    initialized,
    callbackError,
    initialize,
    signInWithGoogle,
    signOut,
    rememberRedirect,
    consumeRedirect,
    clearCallbackError,
    dispose,
  }
})
