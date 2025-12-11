import { ref } from 'vue'
import { getCTAConfig, updateCTAConfig, createCTAConfig } from '~/services/firebase/ctaFirebase'
import { getSocialLinks } from '~/services/firebase/footerFirebase'

export const useHomeCTA = () => {
  const ctaConfig = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const ctaCache = useCookie('cta_cache', {
    maxAge: 60 * 60 * 24 * 365,
    default: () => null
  })

  const fetchCTA = async () => {
    const today = new Date().toDateString()

    if (ctaCache.value && ctaCache.value.date === today && ctaCache.value.config) {
      ctaConfig.value = ctaCache.value.config
      return
    }

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
      ctaCache.value = {
        date: today,
        config: config
      }
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
      ctaCache.value = null
      ctaConfig.value = { ...ctaConfig.value, ...newConfig }
      await fetchCTA()
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
