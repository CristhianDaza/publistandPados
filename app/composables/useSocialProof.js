import { getSocialProof, createSocialProofItem, updateSocialProofItem, deleteSocialProofItem } from '~/services/firebase/socialProofFirebase'

export const useSocialProof = () => {
  const socialProofItems = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchSocialProof = async () => {
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
