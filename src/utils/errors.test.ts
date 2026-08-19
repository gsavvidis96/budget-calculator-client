import { describe, expect, it } from 'vitest'
import type { AxiosError } from 'axios'
import { getAppError } from './errors'
import type { ApiErrorBody } from '@/types'

describe('getAppError', () => {
  it('maps API status, message, and field errors', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: 'Validation failed',
          errors: [{ field: 'title', message: 'Required' }],
        },
      },
    } as AxiosError<ApiErrorBody>

    expect(getAppError(error)).toEqual({
      status: 400,
      message: 'Validation failed',
      fieldErrors: { title: 'Required' },
    })
  })

  it('returns a safe fallback for unknown failures', () => {
    expect(getAppError('failure')).toEqual({
      message: 'Something went wrong. Please try again.',
      fieldErrors: {},
    })
  })
})
