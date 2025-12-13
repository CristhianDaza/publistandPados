import { quotesFirebase } from '~/services/firebase/quotesFirebase'

export const useQuotes = () => {
  const quotes = useState('quotes_list', () => [])
  const loading = useState('quotes_loading', () => false)
  const error = useState('quotes_error', () => null)
  const selectedQuote = useState('quotes_selected', () => null)
  const { user } = useAuth()

  const isAdmin = computed(() => {
    return user.value?.role === 'admin' || user.value?.isAdmin === true
  })

  const fetchQuotes = async () => {
    loading.value = true
    error.value = null
    try {
      if (isAdmin.value) {
        quotes.value = await quotesFirebase.getAll()
      } else if (user.value?.uid) {
        quotes.value = await quotesFirebase.getByUserId(user.value.uid)
      } else {
        quotes.value = []
      }
    } catch (e) {
      error.value = e
      console.error('Error fetching quotes:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchQuoteById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const quote = await quotesFirebase.getById(id)

      if (!isAdmin.value && quote.customer?.userId !== user.value?.uid) {
        throw new Error('No tienes permiso para ver esta cotización')
      }
      
      selectedQuote.value = quote
      return quote
    } catch (e) {
      error.value = e
      console.error('Error fetching quote:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateQuoteStatus = async (id, status, comments = null) => {
    if (!isAdmin.value) {
      throw new Error('No tienes permiso para actualizar el estado')
    }
    
    loading.value = true
    error.value = null
    try {
      await quotesFirebase.updateStatus(id, status, comments)
      await fetchQuotes()
    } catch (e) {
      error.value = e
      console.error('Error updating quote status:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const addComment = async (id, commentText) => {
    if (!isAdmin.value) {
      throw new Error('No tienes permiso para agregar comentarios')
    }
    
    loading.value = true
    error.value = null
    try {
      await quotesFirebase.addComment(id, {
        text: commentText,
        author: user.value?.name || user.value?.displayName || user.value?.email || 'Admin',
        authorId: user.value?.uid
      })
      
      if (selectedQuote.value?.id === id) {
        await fetchQuoteById(id)
      }
    } catch (e) {
      error.value = e
      console.error('Error adding comment:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteQuote = async (id) => {
    loading.value = true
    error.value = null
    try {
      const quote = await quotesFirebase.getById(id)

      if (!isAdmin.value && quote.customer?.userId !== user.value?.uid) {
        throw new Error('No tienes permiso para eliminar esta cotización')
      }
      
      await quotesFirebase.delete(id)
      await fetchQuotes()
    } catch (e) {
      error.value = e
      console.error('Error deleting quote:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'pendiente': 'amber',
      'en-proceso': 'blue',
      'completada': 'green',
      'cancelada': 'red',
      'rechazada': 'gray'
    }
    return colors[status] || 'gray'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pendiente': 'Pendiente',
      'en-proceso': 'En Proceso',
      'completada': 'Completada',
      'cancelada': 'Cancelada',
      'rechazada': 'Rechazada'
    }
    return labels[status] || status
  }

  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en-proceso', label: 'En Proceso' },
    { value: 'completada', label: 'Completada' },
    { value: 'cancelada', label: 'Cancelada' },
    { value: 'rechazada', label: 'Rechazada' }
  ]

  return {
    quotes,
    loading,
    error,
    selectedQuote,
    isAdmin,
    fetchQuotes,
    fetchQuoteById,
    updateQuoteStatus,
    addComment,
    deleteQuote,
    getStatusColor,
    getStatusLabel,
    statusOptions
  }
}

