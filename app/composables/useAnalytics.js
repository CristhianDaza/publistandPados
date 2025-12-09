import { logEvent } from 'firebase/analytics'
import { getFirebaseAnalytics } from '~/services/firebase/config'

export const useAnalytics = () => {
  const { user } = useAuth()

  const shouldTrack = () => {
    if (!process.client) {
      console.log('[Analytics] Skipped: not on client')
      return false
    }
    if (user.value) {
      console.log('[Analytics] Skipped: user is logged in')
      return false
    }
    console.log('[Analytics] Tracking enabled for this user')
    return true
  }

  const trackProductView = async (product) => {
    console.log('[Analytics] trackProductView called', { product: product?.id, shouldTrack: shouldTrack() })
    if (!shouldTrack() || !product) return

    try {
      const analytics = await getFirebaseAnalytics()
      console.log('[Analytics] Analytics instance:', analytics ? 'OK' : 'NULL')
      if (!analytics) return

      logEvent(analytics, 'view_item', {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category?.join(', ') || '',
        currency: 'COP'
      })
      console.log('[Analytics] ✅ view_item event sent for:', product.id)
    } catch (e) {
      console.warn('Analytics trackProductView error:', e)
    }
  }

  const trackWhatsAppClick = async (context = 'global', productInfo = null) => {
    console.log('[Analytics] trackWhatsAppClick called', { context, shouldTrack: shouldTrack() })
    if (!shouldTrack()) return

    try {
      const analytics = await getFirebaseAnalytics()
      console.log('[Analytics] Analytics instance:', analytics ? 'OK' : 'NULL')
      if (!analytics) return

      const eventParams = {
        context,
        ...(productInfo && {
          item_id: productInfo.id,
          item_name: productInfo.name
        })
      }

      logEvent(analytics, 'whatsapp_click', eventParams)
      console.log('[Analytics] ✅ whatsapp_click event sent:', context)
    } catch (e) {
      console.warn('Analytics trackWhatsAppClick error:', e)
    }
  }

  const trackSearch = async (searchTerm, resultsCount) => {
    console.log('[Analytics] trackSearch called', { searchTerm, resultsCount, shouldTrack: shouldTrack() })
    if (!shouldTrack() || !searchTerm) return

    try {
      const analytics = await getFirebaseAnalytics()
      console.log('[Analytics] Analytics instance:', analytics ? 'OK' : 'NULL')
      if (!analytics) return

      logEvent(analytics, 'search', {
        search_term: searchTerm,
        results_count: resultsCount
      })
      console.log('[Analytics] ✅ search event sent:', searchTerm)
    } catch (e) {
      console.warn('Analytics trackSearch error:', e)
    }
  }

  const trackQuoteRequest = async (product) => {
    console.log('[Analytics] trackQuoteRequest called', { product: product?.id, shouldTrack: shouldTrack() })
    if (!shouldTrack() || !product) return

    try {
      const analytics = await getFirebaseAnalytics()
      console.log('[Analytics] Analytics instance:', analytics ? 'OK' : 'NULL')
      if (!analytics) return

      logEvent(analytics, 'quote_request', {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category?.join(', ') || '',
        currency: 'COP'
      })
      console.log('[Analytics] ✅ quote_request event sent:', product.id)
    } catch (e) {
      console.warn('Analytics trackQuoteRequest error:', e)
    }
  }

  const trackPageView = async (pageName, additionalParams = {}) => {
    console.log('[Analytics] trackPageView called', { pageName, shouldTrack: shouldTrack() })
    if (!shouldTrack()) return

    try {
      const analytics = await getFirebaseAnalytics()
      if (!analytics) return

      logEvent(analytics, 'page_view', {
        page_title: pageName,
        ...additionalParams
      })
      console.log('[Analytics] ✅ page_view event sent:', pageName)
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

