import { logEvent } from 'firebase/analytics'
import { getFirebaseAnalytics } from '~/services/firebase/config'

export const useAnalytics = () => {
  const { user } = useAuth()

  const shouldTrack = () => {
    if (!import.meta.client) return false
    return !user.value;
    
  }

  const trackProductView = async (product) => {
    if (!shouldTrack() || !product) return

    try {
      const analytics = await getFirebaseAnalytics()
      if (!analytics) return

      logEvent(analytics, 'view_item', {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category?.join(', ') || '',
        currency: 'COP'
      })
    } catch (e) {
      console.warn('Analytics trackProductView error:', e)
    }
  }

  const trackWhatsAppClick = async (context = 'global', productInfo = null) => {
    if (!shouldTrack()) return

    try {
      const analytics = await getFirebaseAnalytics()
      if (!analytics) return

      const eventParams = {
        context,
        ...(productInfo && {
          item_id: productInfo.id,
          item_name: productInfo.name
        })
      }

      logEvent(analytics, 'whatsapp_click', eventParams)
    } catch (e) {
      console.warn('Analytics trackWhatsAppClick error:', e)
    }
  }

  const trackSearch = async (searchTerm, resultsCount) => {
    if (!shouldTrack() || !searchTerm) return

    try {
      const analytics = await getFirebaseAnalytics()
      if (!analytics) return

      logEvent(analytics, 'search', {
        search_term: searchTerm,
        results_count: resultsCount
      })
    } catch (e) {
      console.warn('Analytics trackSearch error:', e)
    }
  }

  const trackQuoteRequest = async (product) => {
    if (!shouldTrack() || !product) return

    try {
      const analytics = await getFirebaseAnalytics()
      if (!analytics) return

      logEvent(analytics, 'quote_request', {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category?.join(', ') || '',
        currency: 'COP'
      })
    } catch (e) {
      console.warn('Analytics trackQuoteRequest error:', e)
    }
  }

  const trackPageView = async (pageName, additionalParams = {}) => {
    if (!shouldTrack()) return

    try {
      const analytics = await getFirebaseAnalytics()
      if (!analytics) return

      logEvent(analytics, 'page_view', {
        page_title: pageName,
        ...additionalParams
      })
    } catch (e) {
      console.warn('Analytics trackPageView error:', e)
    }
  }

  return {
    trackProductView,
    trackWhatsAppClick,
    trackSearch,
    trackQuoteRequest,
    trackPageView,
    shouldTrack
  }
}
