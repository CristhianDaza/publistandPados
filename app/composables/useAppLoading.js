export const useAppLoading = () => {
  const isLoading = useState('app_loading', () => true)
  const loadingMessage = useState('app_loading_message', () => 'Iniciando...')

  const { fetchActiveTheme } = useTheme()
  const { initAuth, loading: authLoading } = useAuth()
  const { getProducts } = useProducts()
  const { fetchActiveLogo } = useLogo()

  const initApp = async () => {
    isLoading.value = true
    try {
      loadingMessage.value = 'Cargando tema...'
      await fetchActiveTheme()

      loadingMessage.value = 'Verificando sesión...'
      initAuth()

      if (authLoading.value) {
        await new Promise((resolve) => {
          const unwatch = watch(authLoading, (newVal) => {
            if (!newVal) {
              unwatch()
              resolve()
            }
          })
        })
      }

      loadingMessage.value = 'Cargando contenido...'
      await Promise.all([
        getProducts(),
        fetchActiveLogo()
      ])

    } catch (error) {
      console.error('Error initializing app:', error)
    } finally {
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  }

  return {
    isLoading,
    loadingMessage,
    initApp
  }
}
