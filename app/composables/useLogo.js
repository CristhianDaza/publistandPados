import { getLogos, getActiveLogo, createLogo, updateLogo, deleteLogo, setActiveLogo, seedLogo } from '../services/firebase/logoFirebase'

export const useLogo = () => {
  const logo = useState('logo_active', () => null)
  const logos = useState('logos_list', () => [])
  const loading = useState('logo_loading', () => false)
  const error = useState('logo_error', () => null)

  const logoCache = useCookie('logo_cache', {
    maxAge: 60 * 60 * 24 * 365,
    default: () => null
  })

  const fetchActiveLogo = async () => {
    const today = new Date().toDateString()

    if (logoCache.value && logoCache.value.date === today && logoCache.value.activeLogo) {
      logo.value = logoCache.value.activeLogo
      return
    }

    loading.value = true
    try {
      logo.value = await getActiveLogo()
     logoCache.value = {
        ...logoCache.value,
        date: today,
        activeLogo: logo.value
      }
    } catch (e) {
      console.error('Error fetching active logo:', e)
      error.value = e.message || 'An unknown error occurred'

    } finally {
      loading.value = false
    }
  }

  const fetchLogos = async () => {
    const today = new Date().toDateString()

    if (logoCache.value && logoCache.value.date === today && logoCache.value.logos?.length) {
      logos.value = logoCache.value.logos
      return
    }

    loading.value = true
    try {
      logos.value = await getLogos()
      logoCache.value = {
        ...logoCache.value,
        date: today,
        logos: logos.value
      }
    } catch (e) {
      console.error('Error fetching logos:', e)
      error.value = e.message || 'An unknown error occurred'

    } finally {
      loading.value = false
    }
  }

  const initializeLogo = async () => {
    loading.value = true
    try {
      await seedLogo()
      await fetchActiveLogo()
    } catch (e) {
      console.error('Error initializing logo:', e)
      error.value = e.message || 'An unknown error occurred'

    } finally {
      loading.value = false
    }
  }

  const addLogo = async (newLogo) => {
    loading.value = true
    try {
      await createLogo(newLogo)
      logoCache.value = null
      await fetchLogos()
    } catch (e) {
      console.error('Error adding logo:', e)
      error.value = e.message || 'An unknown error occurred'

    } finally {
      loading.value = false
    }
  }

  const editLogo = async (id, updatedLogo) => {
    loading.value = true
    try {
      await updateLogo(id, updatedLogo)
      logoCache.value = null
      await fetchLogos()
      if (logo.value && logo.value.id === id) {
        await fetchActiveLogo()
      }
    } catch (e) {
      console.error('Error updating logo:', e)
      error.value = e.message || 'An unknown error occurred'

    } finally {
      loading.value = false
    }
  }

  const removeLogo = async (id) => {
    loading.value = true
    try {
      await deleteLogo(id)
      logoCache.value = null
      await fetchLogos()
      if (logo.value && logo.value.id === id) {
        logo.value = null
        await fetchActiveLogo()
      }
    } catch (e) {
      console.error('Error deleting logo:', e)
      error.value = e.message || 'An unknown error occurred'

    } finally {
      loading.value = false
    }
  }

  const setLogoActive = async (id) => {
    loading.value = true
    try {
      await setActiveLogo(id)
      logoCache.value = null
      await fetchLogos()
      await fetchActiveLogo()
    } catch (e) {
      console.error('Error setting active logo:', e)
      error.value = e.message || 'An unknown error occurred'

    } finally {
      loading.value = false
    }
  }

  return {
    logo,
    logos,
    loading,
    error,
    fetchActiveLogo,
    fetchLogos,
    initializeLogo,
    addLogo,
    editLogo,
    removeLogo,
    setLogoActive
  }
}
