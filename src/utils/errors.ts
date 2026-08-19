import axios from 'axios'
import type { ApiErrorBody } from '@/types'

export type AppError = {
  status?: number
  message: string
  fieldErrors: Record<string, string>
}

export const getAppError = (error: unknown): AppError => {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return { message: 'Something went wrong. Please try again.', fieldErrors: {} }
  }

  const body = error.response?.data
  const fieldErrors = Object.fromEntries(
    (body?.errors ?? []).flatMap((item) => (item.field ? [[item.field, item.message]] : [])),
  )

  return {
    status: error.response?.status,
    message: body?.message || 'Something went wrong. Please try again.',
    fieldErrors,
  }
}
