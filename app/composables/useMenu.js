import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem, seedMenu, getMenuById } from '~/services/firebase/menuFirebase'

export const useMenu = () => {
  const menuItems = useState('menu_items', () => [])
  const loading = useState('menu_loading', () => false)
  const error = useState('menu_error', () => null)

  const menuCache = useCookie('menu_cache', {
    maxAge: 60 * 60 * 24 * 365, // 1 year, we control invalidation manually
    default: () => null
  })

  const fetchMenu = async () => {
    const today = new Date().toDateString()

    if (menuCache.value && menuCache.value.date === today && menuCache.value.items?.length) {
      menuItems.value = menuCache.value.items
      return
    }

    loading.value = true
    try {
      const items = await getMenu()
      menuItems.value = items

      menuCache.value = {
        date: today,
        items: items
      }
    } catch (e) {
      console.error('Error fetching menu:', e)
      error.value = e.message || 'Error al cargar el menú'
    } finally {
      loading.value = false
    }
  }

  const addMenuItem = async (item) => {
    try {
      await createMenuItem(item)
      menuCache.value = null
      await fetchMenu()
    } catch (e) {
      console.error('Error adding menu item:', e)
    }
  }

  const updateItem = async (id, item) => {
    try {
      await updateMenuItem(id, item)
      menuCache.value = null
      await fetchMenu()
    } catch (e) {
      console.error('Error updating menu item:', e)
    }
  }

  const deleteItem = async (id) => {
    try {
      await deleteMenuItem(id)
      menuCache.value = null
      await fetchMenu()
    } catch (e) {
      console.error('Error deleting menu item:', e)
    }
  }

  const getMenuItem = async (id) => {
    if (menuItems.value && menuItems.value.length) {
      const found = menuItems.value.find(i => i.id === id)
      if (found) return found
    }
    try {
      return await getMenuById(id)
    } catch (e) {
      console.error('Error getting menu item:', e)
      return null
    }
  }

  const initializeMenu = async () => {
    const initialData = []
    try {
      await seedMenu(initialData)
      menuCache.value = null
      await fetchMenu()
    } catch (e) {
      console.error('Error seeding menu:', e)
    }
  }

  return {
    menuItems,
    loading,
    error,
    fetchMenu,
    addMenuItem,
    updateItem,
    deleteItem,
    getMenuItem,
    initializeMenu
  }
}
