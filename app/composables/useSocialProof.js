import { getSocialProof, createSocialProofItem, updateSocialProofItem, deleteSocialProofItem } from '~/services/firebase/socialProofFirebase'

export const useSocialProof = () => {
  const items = useState('social_proof_list', () => [])
  const loading = useState('social_proof_loading', () => false)
  const error = useState('social_proof_error', () => null)

  const cache = useCookie('social_proof_cache', {
    maxAge: 60 * 60 * 24 * 365,
    default: () => null
  })

  const fetchSocialProof = async () => {
    const today = new Date().toDateString()

    if (cache.value && cache.value.date === today && cache.value.items?.length) {
      items.value = cache.value.items
      return
    }

    loading.value = true
    error.value = null
    try {
      const data = await getSocialProof()
      items.value = data

      cache.value = {
        date: today,
        items: data
      }
    } catch (e) {
      console.error('Error fetching social proof:', e)
      error.value = e.message || 'An unknown error occurred'
    } finally {
      loading.value = false
    }
  }

  const addSocialProofItem = async (item) => {
    loading.value = true
    try {
      await createSocialProofItem(item)
      cache.value = null
      await fetchSocialProof()
    } catch (e) {
      console.error('Error adding social proof item:', e)
      error.value = e.message || 'Error adding social proof item'
    } finally {
      loading.value = false
    }
  }

  const editSocialProofItem = async (id, item) => {
    loading.value = true
    try {
      await updateSocialProofItem(id, item)
      cache.value = null
      await fetchSocialProof()
    } catch (e) {
      console.error('Error updating social proof item:', e)
      error.value = e.message || 'Error updating social proof item'
    } finally {
      loading.value = false
    }
  }

  const removeSocialProofItem = async (id) => {
    loading.value = true
    try {
      await deleteSocialProofItem(id)
      cache.value = null
      await fetchSocialProof()
    } catch (e) {
      console.error('Error deleting social proof item:', e)
      error.value = e.message || 'Error deleting social proof item'
    } finally {
      loading.value = false
    }
  }

  const getSocialProofItem = async (id) => {
    try {
      if (items.value.length > 0) {
        const found = items.value.find(i => i.id === id)
        if (found) return found
      }
      await fetchSocialProof()
      return items.value.find(i => i.id === id) || null
    } catch (e) {
      console.error('Error getting social proof item:', e)
      throw e
    }
  }

  return {
    items,
    loading,
    error,
    fetchSocialProof,
    addSocialProofItem,
    editSocialProofItem,
    removeSocialProofItem,
    getSocialProofItem
  }
}

