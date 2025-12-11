import { getSocialProof, createSocialProofItem, updateSocialProofItem, deleteSocialProofItem } from '~/services/firebase/socialProofFirebase'

export const useSocialProof = () => {
  const socialProofItems = useState('social_proof_items', () => [])
  const loading = useState('social_proof_loading', () => false)
  const error = useState('social_proof_error', () => null)

  const socialProofCache = useCookie('social_proof_cache', {
    maxAge: 60 * 60 * 24 * 365,
    default: () => null
  })

  const fetchSocialProof = async () => {
    const today = new Date().toDateString()

    if (socialProofCache.value && socialProofCache.value.date === today && socialProofCache.value.items?.length) {
      socialProofItems.value = socialProofCache.value.items
      return
    }

    loading.value = true
    error.value = null
    try {
      socialProofItems.value = await getSocialProof()
      if (socialProofItems.value.length === 0) {
        const initialItems = []
        if (socialProofItems.value.length === 0) {
          socialProofItems.value = initialItems
        }
      }
     
      socialProofCache.value = {
        date: today,
        items: socialProofItems.value
      }
    } catch (e) {
      error.value = e.message
      console.error('Error fetching social proof:', e)
    } finally {
      loading.value = false
    }
  }

  const addItem = async (item) => {
    loading.value = true
    try {
      const id = await createSocialProofItem(item)
      socialProofCache.value = null
      await fetchSocialProof()
      return id
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id, item) => {
    loading.value = true
    try {
      await updateSocialProofItem(id, item)
      socialProofCache.value = null
      await fetchSocialProof()
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id) => {
    loading.value = true
    try {
      await deleteSocialProofItem(id)
      socialProofCache.value = null
      await fetchSocialProof()
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    socialProofItems,
    loading,
    error,
    fetchSocialProof,
    addItem,
    updateItem,
    deleteItem
  }
}
