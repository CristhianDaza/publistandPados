import { getInspiration, createInspirationItem, seedInspiration, updateInspirationItem, deleteInspirationItem, getInspirationItemById } from '~/services/firebase/inspirationFirebase'

export const useInspiration = () => {
  const inspirationItems = useState('inspiration_items', () => [])
  const loading = useState('inspiration_loading', () => false)
  const error = useState('inspiration_error', () => null)

  const inspirationCache = useCookie('inspiration_cache', {
    maxAge: 60 * 60 * 24 * 365,
    default: () => null
  })

  const fetchInspiration = async () => {
    const today = new Date().toDateString()

    if (inspirationCache.value && inspirationCache.value.date === today && inspirationCache.value.items?.length) {
      inspirationItems.value = inspirationCache.value.items
      return
    }

    loading.value = true
    error.value = null
    try {
      const items = await getInspiration()
      if (items.length === 0) {
        const initialItems = []
        await seedInspiration(initialItems)
        inspirationItems.value = initialItems
        inspirationCache.value = {
          date: today,
          items: initialItems
        }
      } else {
        inspirationItems.value = items
        inspirationCache.value = {
          date: today,
          items: items
        }
      }
    } catch (e) {
      console.error('Error fetching inspiration:', e)
      error.value = e.message || 'An unknown error occurred'
    } finally {
      loading.value = false
    }
  }

  const addInspirationItem = async (item) => {
    try {
      const id = await createInspirationItem(item)
      inspirationCache.value = null
      await fetchInspiration()
      return id
    } catch (e) {
      console.error('Error adding inspiration item:', e)
      throw e
    }
  }

  const updateInspiration = async (id, item) => {
    try {
      await updateInspirationItem(id, item)
      inspirationCache.value = null
      await fetchInspiration()
    } catch (e) {
      console.error('Error updating inspiration item:', e)
      throw e
    }
  }

  const deleteInspiration = async (id) => {
    try {
      await deleteInspirationItem(id)
      inspirationCache.value = null
      await fetchInspiration()
    } catch (e) {
      console.error('Error deleting inspiration item:', e)
      throw e
    }
  }

  const getInspirationItem = async (id) => {
    try {
      if (inspirationItems.value.length > 0) {
        const item = inspirationItems.value.find(i => i.id === id)
        if (item) return item
      }
      return await getInspirationItemById(id)
    } catch (e) {
      console.error('Error getting inspiration item:', e)
      throw e
    }
  }

  const addItem = addInspirationItem

  return {
    inspirationItems,
    loading,
    error,
    fetchInspiration,
    addInspirationItem,
    updateInspiration,
    deleteInspiration,
    getInspirationItem,
    addItem
  }
}
