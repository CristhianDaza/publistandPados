import { ref } from 'vue'
import { getCTAConfig, updateCTAConfig, createCTAConfig } from '~/services/firebase/ctaFirebase'
import { getSocialLinks } from '~/services/firebase/footerFirebase'

export const useHomeCTA = () => {
  const ctaConfig = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchCTA = async () => {
    loading.value = true
    error.value = null
    try {
      let config = await getCTAConfig()

      if (!config) {
        config = []
        await createCTAConfig(config)
      }

      try {
        const socialLinks = await getSocialLinks()
        const whatsapp = socialLinks.find(link => link.name === 'WhatsApp')
        if (whatsapp && whatsapp.to) {
          if (!config.primaryButton.link) {
            config.primaryButton.link = whatsapp.to
          }
        }
      } catch (e) {
        console.error("Error fetching social links for CTA:", e)
      }

      ctaConfig.value = config
    } catch (e) {
      console.error('Error fetching CTA config:', e)
      error.value = e
    } finally {
      loading.value = false
    }
  }

  const updateCTA = async (newConfig) => {
    loading.value = true
    try {
      await updateCTAConfig(newConfig)
      ctaConfig.value = { ...ctaConfig.value, ...newConfig }
    } catch (e) {
      console.error('Error updating CTA config:', e)
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return {
    ctaConfig,
    loading,
    error,
    fetchCTA,
    updateCTA
  }
}
