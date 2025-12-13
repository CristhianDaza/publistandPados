import { computed, watch } from 'vue'

const storageKey = 'quote_cart_items'
const makeCustomer = () => ({ name: '', email: '', phone: '' })
const snapshotProduct = (product) => {
  try {
    return JSON.parse(JSON.stringify(product))
  } catch (error) {
    console.warn('No se pudo serializar producto para la cotización', error)
    return product
  }
}

export const useQuoteCart = () => {
  const items = useState('quote_cart_items', () => [])
  const isConfiguratorOpen = useState('quote_configurator_open', () => false)
  const configuratorProduct = useState('quote_configurator_product', () => null)
  const editingItemId = useState('quote_configurator_editing', () => null)
  const isCartOpen = useState('quote_cart_open', () => false)
  const isSubmitModalOpen = useState('quote_submit_modal_open', () => false)
  const customerInfo = useState('quote_customer_info', () => makeCustomer())
  const isLoaded = useState('quote_cart_loaded', () => false)
  const isSubmitting = useState('quote_cart_submitting', () => false)
  const lastQuoteId = useState('quote_cart_last_id', () => null)
  const { user } = useAuth()

  const ensureLoaded = () => {
    if (!import.meta.client || isLoaded.value) return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          items.value = parsed
        }
      }
    } catch (error) {
      console.error('Error loading quote cart:', error)
    } finally {
      isLoaded.value = true
    }
  }

  ensureLoaded()

  if (import.meta.client) {
    watch(items, (value) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value))
      } catch (error) {
        console.error('Error persisting quote cart:', error)
      }
    }, { deep: true })
  }

  const cartCount = computed(() => items.value.length)
  const totalUnits = computed(() => {
    return items.value.reduce((acc, item) => {
      const entrySum = item.entries?.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0) || 0
      return acc + entrySum
    }, 0)
  })

  const openConfigurator = (product, itemToEdit = null) => {
    configuratorProduct.value = product
    editingItemId.value = itemToEdit?.id || null
    isConfiguratorOpen.value = true
  }

  const closeConfigurator = () => {
    isConfiguratorOpen.value = false
    configuratorProduct.value = null
    editingItemId.value = null
  }

  const openCart = () => {
    if (!items.value.length) return
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  const toggleCart = () => {
    if (!items.value.length) return
    isCartOpen.value = !isCartOpen.value
  }

  const addItem = ({ entries, marked, colorCount, notes }) => {
    const product = configuratorProduct.value
    if (!product || !Array.isArray(entries) || entries.length === 0) return
    const id = editingItemId.value || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)
    const sanitizedEntries = entries.map(entry => ({
      id: entry.id || `${id}-${Math.random()}`,
      colorName: entry.colorName,
      colorHex: entry.colorHex || null,
      quantity: Number(entry.quantity)
    }))
    const now = Date.now()
    const payload = {
      id,
      productId: product.id,
      productName: product.name,
      productSku: product.reference || product.sku || '',
      productImage: product.mainImage || '',
      productCategory: product.category || [],
      productData: snapshotProduct(product),
      entries: sanitizedEntries,
      marked: !!marked,
      colorCount: Number(colorCount) || 1,
      notes: notes?.trim() || '',
      createdAt: editingItemId.value ? items.value.find(item => item.id === editingItemId.value)?.createdAt || now : now,
      updatedAt: now
    }
    if (editingItemId.value) {
      items.value = items.value.map(item => item.id === editingItemId.value ? payload : item)
    } else {
      items.value = [payload, ...items.value]
    }
    closeConfigurator()
    isCartOpen.value = true
  }

  const removeItem = (id) => {
    items.value = items.value.filter(item => item.id !== id)
    if (!items.value.length) {
      isCartOpen.value = false
    }
  }

  const clearCart = () => {
    items.value = []
    if (import.meta.client) {
      localStorage.removeItem(storageKey)
    }
  }

  const openSubmitModal = () => {
    if (!items.value.length) return
    if (user.value) {
      customerInfo.value = {
        name: user.value.name || user.value.displayName || '',
        email: user.value.email || '',
        phone: user.value.phone || ''
      }
    }
    isSubmitModalOpen.value = true
  }

  const closeSubmitModal = () => {
    isSubmitModalOpen.value = false
    if (!user.value) {
      customerInfo.value = makeCustomer()
    }
  }

  const setCustomerField = (field, value) => {
    customerInfo.value = {
      ...customerInfo.value,
      [field]: value
    }
  }

  const sendQuote = async () => {
    if (!items.value.length) {
      throw new Error('No hay productos para cotizar')
    }
    const baseCustomer = user.value ? {
      userId: user.value.uid,
      name: user.value.name || user.value.displayName || '',
      email: user.value.email || '',
      phone: user.value.phone || ''
    } : customerInfo.value
    if (!baseCustomer || (!baseCustomer.userId && (!baseCustomer.name || !baseCustomer.email || !baseCustomer.phone))) {
      throw new Error('Datos de contacto incompletos')
    }
    isSubmitting.value = true
    try {
      const body = {
        items: items.value,
        summary: {
          totalUnits: totalUnits.value,
          itemCount: items.value.length
        },
        customer: baseCustomer
      }
      const response = await $fetch('/api/quotes', {
        method: 'POST',
        body
      })
      lastQuoteId.value = response?.id || null
      clearCart()
      closeSubmitModal()
      closeCart()
      customerInfo.value = user.value ? customerInfo.value : makeCustomer()
      return response
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    items,
    cartCount,
    totalUnits,
    isConfiguratorOpen,
    configuratorProduct,
    editingItemId,
    isCartOpen,
    isSubmitModalOpen,
    customerInfo,
    isSubmitting,
    lastQuoteId,
    openConfigurator,
    closeConfigurator,
    addItem,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    openSubmitModal,
    closeSubmitModal,
    setCustomerField,
    sendQuote
  }
}
