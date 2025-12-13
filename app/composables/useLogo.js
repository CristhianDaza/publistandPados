import {
  createLogo,
  deleteLogo,
  getActiveLogo,
  getLogos,
  setActiveLogo,
  updateLogo
} from '~/services/firebase/logoFirebase'

export const useLogo = () => {
  const logos = useState('logos_list', () => [])
  const activeLogo = useState('logos_active', () => null)
  const loading = useState('logos_loading', () => false)
  const error = useState('logos_error', () => null)

  const logo = computed(() => activeLogo.value)

  const fetchLogos = async () => {
    loading.value = true
    error.value = null
    try {
      logos.value = await getLogos()
    } catch (e) {
      console.error('Error fetching logos:', e)
      error.value = e.message || 'Error fetching logos'
    } finally {
      loading.value = false
    }
  }

  const fetchActiveLogo = async () => {
    try {
      activeLogo.value = await getActiveLogo()
    } catch (e) {
      console.error('Error fetching active logo:', e)
    }
  }

  const initializeLogo = async () => {
    await fetchActiveLogo()
  }

  const addLogo = async (item) => {
    loading.value = true
    try {
      await createLogo(item)
      await fetchLogos()
    } catch (e) {
      console.error('Error adding logo:', e)
      error.value = e.message || 'Error adding logo'
    } finally {
      loading.value = false
    }
  }

  const editLogo = async (id, item) => {
    loading.value = true
    try {
      await updateLogo(id, item)
      await fetchLogos()
    } catch (e) {
      console.error('Error updating logo:', e)
      error.value = e.message || 'Error updating logo'
    } finally {
      loading.value = false
    }
  }

  const removeLogo = async (id) => {
    loading.value = true
    try {
      await deleteLogo(id)
      await fetchLogos()
    } catch (e) {
      console.error('Error deleting logo:', e)
      error.value = e.message || 'Error deleting logo'
    } finally {
      loading.value = false
    }
  }

  const setActive = async (id) => {
    loading.value = true
    try {
      await setActiveLogo(id)
      await fetchLogos()
      await fetchActiveLogo()
    } catch (e) {
      console.error('Error setting active logo:', e)
      error.value = e.message || 'Error setting active logo'
    } finally {
      loading.value = false
    }
  }

  const getLogoById = async (id) => {
    if (logos.value.length) {
      const item = logos.value.find(l => l.id === id)
      if (item) return item
    }
    const items = await getLogos()
    return items.find(l => l.id === id) || null
  }

  return {
    logos,
    activeLogo,
    logo,
    loading,
    error,
    fetchLogos,
    fetchActiveLogo,
    initializeLogo,
    addLogo,
    editLogo,
    removeLogo,
    setActive,
    getLogoById
  }
}
