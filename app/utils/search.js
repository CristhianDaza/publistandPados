export const normalizeText = (text) => {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export const getSearchVariations = (query) => {
  const normalized = normalizeText(query).trim()
  if (!normalized) return []

  const variations = new Set([normalized])

  if (normalized.endsWith('s')) {
    variations.add(normalized.slice(0, -1))
  }
  if (normalized.endsWith('es')) {
    variations.add(normalized.slice(0, -2))
  }

  if (!normalized.endsWith('s')) {
    variations.add(normalized + 's')
    variations.add(normalized + 'es')
  }

  return Array.from(variations)
    .filter(v => v.length >= 3)
}

export const filterProducts = (products, searchQuery) => {
  if (!searchQuery || searchQuery.length < 3) return []

  const variations = getSearchVariations(searchQuery)

  if (variations.length === 0) return []

  return products.filter(product => {
    const normalizedId = normalizeText(product.id)
    const normalizedName = normalizeText(product.name)
    const normalizedDescription = normalizeText(product.description)
    const normalizedCategories = product.category?.map(cat => normalizeText(cat)) || []
    return variations.some(query => {
      if (normalizedId.includes(query)) return true
      if (normalizedName.includes(query)) return true
      if (normalizedDescription.includes(query)) return true
      return normalizedCategories.some(cat => cat.includes(query));
    })
  })
}
