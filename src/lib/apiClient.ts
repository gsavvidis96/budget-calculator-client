import axios from 'axios'
import { supabase } from '@/lib/supabase'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15_000,
})

apiClient.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await supabase.auth.signOut({ scope: 'local' })
    }

    return Promise.reject(error instanceof Error ? error : new Error('Request failed'))
  },
)
