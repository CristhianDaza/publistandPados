import { getCatalogs, createCatalog, updateCatalog, deleteCatalog } from '~/services/firebase/catalogsFirebase'

export const useCatalogs = () => {
  const catalogs = useState('catalogs_list', () => [])
  const loading = useState('catalogs_loading', () => false)
  const error = useState('catalogs_error', () => null)

  const catalogsCache = useCookie('catalogs_cache', {
    maxAge: 60 * 60 * 24 * 365,
    default: () => null
  })

  const fetchCatalogs = async () => {
    const today = new Date().toDateString()

    if (catalogsCache.value && catalogsCache.value.date === today && catalogsCache.value.items?.length) {
      catalogs.value = catalogsCache.value.items
      return
    }

    loading.value = true
    error.value = null
    try {
      const items = await getCatalogs()
      catalogs.value = items

      catalogsCache.value = {
        date: today,
        items: items
      }
    } catch (e) {
      console.error('Error fetching catalogs:', e)
      error.value = e.message || 'An unknown error occurred'
    } finally {
      loading.value = false
    }
  }

  const addCatalog = async (item) => {
    loading.value = true
    try {
      await createCatalog(item)
      catalogsCache.value = null
      await fetchCatalogs()
    } catch (e) {
      console.error('Error adding catalog:', e)
      error.value = e.message || 'Error adding catalog'
    } finally {
      loading.value = false
    }
  }

  const editCatalog = async (id, item) => {
    loading.value = true
    try {
      await updateCatalog(id, item)
      catalogsCache.value = null
      await fetchCatalogs()
    } catch (e) {
      console.error('Error updating catalog:', e)
      error.value = e.message || 'Error updating catalog'
    } finally {
      loading.value = false
    }
  }

  const removeCatalog = async (id) => {
    loading.value = true
    try {
      await deleteCatalog(id)
      catalogsCache.value = null
      await fetchCatalogs()
    } catch (e) {
      console.error('Error deleting catalog:', e)
      error.value = e.message || 'Error deleting catalog'
    } finally {
      loading.value = false
    }
  }

  return {
    catalogs,
    loading,
    error,
    fetchCatalogs,
    addCatalog,
    editCatalog,
    removeCatalog
  }
}
