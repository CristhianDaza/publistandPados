import { getCarousel, createCarouselItem, updateCarouselItem, deleteCarouselItem } from '~/services/firebase/carouselFirebase'

export const useCarousel = () => {
  const carouselItems = useState('carousel_items', () => [])
  const loading = useState('carousel_loading', () => false)
  const error = useState('carousel_error', () => null)

  const carouselCache = useCookie('carousel_cache', {
    maxAge: 60 * 60 * 24 * 365,
    default: () => null
  })

  const fetchCarousel = async () => {
    const today = new Date().toDateString()

    if (carouselCache.value && carouselCache.value.date === today && carouselCache.value.items?.length) {
      carouselItems.value = carouselCache.value.items
      return
    }

    loading.value = true
    try {
      const items = await getCarousel()
      carouselItems.value = items

      carouselCache.value = {
        date: today,
        items: items
      }
    } catch (e) {
      error.value = e
      console.error('Error fetching carousel:', e)
    } finally {
      loading.value = false
    }
  }

  const addCarouselItem = async (item) => {
    try {
      await createCarouselItem(item)
      carouselCache.value = null
      await fetchCarousel()
    } catch (e) {
      console.error('Error adding carousel item:', e)
    }
  }

  const updateItem = async (id, item) => {
    try {
      await updateCarouselItem(id, item)
      carouselCache.value = null
      await fetchCarousel()
    } catch (e) {
      console.error('Error updating carousel item:', e)
    }
  }

  const deleteItem = async (id) => {
    try {
      await deleteCarouselItem(id)
      carouselCache.value = null
      await fetchCarousel()
    } catch (e) {
      console.error('Error deleting carousel item:', e)
    }
  }

  return {
    carouselItems,
    loading,
    error,
    fetchCarousel,
    addCarouselItem,
    updateItem,
    deleteItem
  }
}
