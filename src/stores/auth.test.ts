import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const authApi = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: { auth: authApi },
}))

import { useAuthStore } from './auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.history.replaceState({}, '', '/')
    authApi.getSession.mockResolvedValue({ data: { session: null } })
    authApi.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })
    authApi.signInWithOAuth.mockResolvedValue({ error: null })
    authApi.signOut.mockResolvedValue({ error: null })
  })

  it('restores the signed-in user and cleans OAuth callback fragments', async () => {
    window.history.replaceState({}, '', '/login#error_description=Access%20denied')
    authApi.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-id', email: 'person@example.com' },
        },
      },
    })

    const store = useAuthStore()
    await store.initialize()

    expect(store.user).toEqual({ id: 'user-id', email: 'person@example.com' })
    expect(store.callbackError).toBe('Access denied')
    expect(window.location.hash).toBe('')
    expect(store.initialized).toBe(true)
  })

  it('only remembers same-origin relative redirects', () => {
    const store = useAuthStore()

    store.rememberRedirect('/budgets/budget-id')
    expect(store.consumeRedirect()).toBe('/budgets/budget-id')

    store.rememberRedirect('//malicious.example')
    expect(store.consumeRedirect()).toBe('/budgets')
  })

  it('starts Google OAuth with the stable login callback', async () => {
    const store = useAuthStore()
    await store.signInWithGoogle()

    expect(authApi.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/login` },
    })
  })
})
