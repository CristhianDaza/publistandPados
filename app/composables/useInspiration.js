import { getInspiration, createInspirationItem, seedInspiration } from '~/services/firebase/inspirationFirebase'

export const useInspiration = () => {
  const inspirationItems = useState('inspiration_items', () => [])
  const loading = useState('inspiration_loading', () => false)
  const error = useState('inspiration_error', () => null)

  const fetchInspiration = async () => {
    loading.value = true
    error.value = null
    try {
      const items = await getInspiration()
      if (items.length === 0) {
        const initialItems = []
        await seedInspiration(initialItems)
        inspirationItems.value = initialItems
      } else {
        inspirationItems.value = items
      }
    } catch (e) {
      console.error('Error fetching inspiration:', e)
      error.value = e.message || 'An unknown error occurred'
    } finally {
      loading.value = false
    }
  }

  const addItem = async (item) => {
    try {
      const id = await createInspirationItem(item)
      inspirationItems.value.push({ id, ...item })
      return id
    } catch (e) {
      console.error('Error adding inspiration item:', e)
      throw e
    }
  }

  return {
    inspirationItems,
    loading,
    error,
    fetchInspiration,
    addItem
  }
}
