import { normalizeText } from '~/utils/search'

const NEW_BOOLEAN_KEYS = ['isNew', 'new', 'nuevo', 'novedad']
const TRUE_LIKE_VALUES = new Set(['true', '1', 'yes', 'si'])
const NEW_LABEL_TOKENS = ['nuevo', 'novedad']

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key)

const isTruthyFlag = (value) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  if (typeof value === 'string') return TRUE_LIKE_VALUES.has(normalizeText(value).trim())
  return false
}

const hasNewFlagProperty = (product) => {
  if (!product || typeof product !== 'object') return false

  return NEW_BOOLEAN_KEYS.some((key) => hasOwn(product, key) && isTruthyFlag(product[key]))
}

const hasNewLabel = (product) => {
  if (!Array.isArray(product?.labels)) return false

  return product.labels.some((label) => {
    const normalizedName = normalizeText(label?.name)
    return NEW_LABEL_TOKENS.some((token) => normalizedName.includes(token))
  })
}

export const isProductNew = (product) => {
  return hasNewFlagProperty(product) || hasNewLabel(product)
}
