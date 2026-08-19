const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export const formatCurrency = (value: number) => currencyFormatter.format(value)

export const formatDate = (value: string) => dateFormatter.format(new Date(value))

export const formatPercentage = (value: number) => `${value.toFixed(2)}%`
