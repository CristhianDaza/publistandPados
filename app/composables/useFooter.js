import {
  getSocialLinks,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getFooterConfig,
  updateFooterConfig,
  seedFooter
} from '~/services/firebase/footerFirebase'

export const useFooter = () => {
  const socialLinks = useState('footer_social_links', () => [])
  const footerConfig = useState('footer_config', () => null)
  const loading = useState('footer_loading', () => false)
  const error = useState('footer_error', () => null)

  const footerCache = useCookie('footer_cache', {
    maxAge: 60 * 60 * 24 * 365,
    default: () => null
  })

  const fetchFooterData = async () => {
    const today = new Date().toDateString()

    if (footerCache.value && footerCache.value.date === today && (footerCache.value.socialLinks?.length || footerCache.value.footerConfig)) {
      socialLinks.value = footerCache.value.socialLinks || []
      footerConfig.value = footerCache.value.footerConfig
      return
    }

    loading.value = true
    try {
      const [links, config] = await Promise.all([
        getSocialLinks(),
        getFooterConfig()
      ])

      if (links.length === 0 && !config) {
        await seedFooter()
        const [newLinks, newConfig] = await Promise.all([
          getSocialLinks(),
          getFooterConfig()
        ])
        socialLinks.value = newLinks
        footerConfig.value = newConfig

        footerCache.value = {
          date: today,
          socialLinks: newLinks,
          footerConfig: newConfig
        }
      } else {
        socialLinks.value = links
        footerConfig.value = config

        footerCache.value = {
          date: today,
          socialLinks: links,
          footerConfig: config
        }
      }
    } catch (e) {
      error.value = e.message || 'An unknown error occurred'
      console.error('Error fetching footer data:', e)
    } finally {
      loading.value = false
    }
  }

  const addSocial = async (link) => {
    try {
      await addSocialLink(link)
      footerCache.value = null
      socialLinks.value = await getSocialLinks()
    } catch (e) {
      console.error('Error adding social link:', e)
    }
  }

  const updateSocial = async (id, link) => {
    try {
      await updateSocialLink(id, link)
      footerCache.value = null
      socialLinks.value = await getSocialLinks()
    } catch (e) {
      console.error('Error updating social link:', e)
    }
  }

  const removeSocial = async (id) => {
    try {
      await deleteSocialLink(id)
      footerCache.value = null
      socialLinks.value = await getSocialLinks()
    } catch (e) {
      console.error('Error deleting social link:', e)
    }
  }

  const updateConfig = async (config) => {
    try {
      await updateFooterConfig(config)
      footerCache.value = null
      footerConfig.value = await getFooterConfig()
    } catch (e) {
      console.error('Error updating footer config:', e)
    }
  }

  return {
    socialLinks,
    footerConfig,
    loading,
    error,
    fetchFooterData,
    addSocial,
    updateSocial,
    removeSocial,
    updateConfig
  }
}
