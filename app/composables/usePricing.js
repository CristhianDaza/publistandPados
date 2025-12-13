import { computed } from 'vue'

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
})

const clampPercentage = (value) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 0
  return Math.min(100, Math.max(0, numeric))
}

const sanitizePrice = (value) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric <= 0) return null
  return numeric
}

export const usePricing = () => {
  const { user } = useAuth()

  const userPriceIncrease = computed(() => clampPercentage(user.value?.priceIncrease))

  const applyPriceIncrease = (value, overridePercentage) => {
    const base = sanitizePrice(value)
    if (base === null) return null

    const percent = typeof overridePercentage === 'number'
      ? clampPercentage(overridePercentage)
      : userPriceIncrease.value

    const multiplier = 1 + percent / 100
    return Math.round(base * multiplier)
  }

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'Consultar'
    return currencyFormatter.format(value)
  }

  const formatPrice = (value, overridePercentage) => {
    const adjusted = applyPriceIncrease(value, overridePercentage)
    if (adjusted === null) return 'Consultar'
    return formatCurrency(adjusted)
  }

  const formatPriceRange = (values, overridePercentage) => {
    if (!Array.isArray(values) || values.length === 0) return 'Consultar'

    const adjustedValues = values
      .map(item => applyPriceIncrease(item, overridePercentage))
      .filter(item => item !== null)

    if (!adjustedValues.length) return 'Consultar'

    const min = Math.min(...adjustedValues)
    const max = Math.max(...adjustedValues)

    if (min === max) {
      return formatCurrency(min)
    }

    return `De ${formatCurrency(min)} a ${formatCurrency(max)}`
  }

  return {
    userPriceIncrease,
    applyPriceIncrease,
    formatPrice,
    formatPriceRange,
    formatCurrency
  }
}

