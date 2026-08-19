import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, formatPercentage } from './format'

describe('format utilities', () => {
  it('formats positive and negative euro values consistently', () => {
    expect(formatCurrency(1234.5)).toBe('€1,234.50')
    expect(formatCurrency(-12)).toBe('-€12.00')
  })

  it('keeps day-first dates and fixed percentages', () => {
    expect(formatDate('2026-08-19T08:00:00.000Z')).toMatch(/^19\/08\/2026$/)
    expect(formatPercentage(12.5)).toBe('12.50%')
  })
})
