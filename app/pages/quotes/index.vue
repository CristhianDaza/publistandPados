<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Mis Cotizaciones'
})

const { user } = useAuth()
const {
  quotes,
  loading,
  fetchQuotes,
  deleteQuote,
  getStatusColor,
  getStatusLabel
} = useQuotes()
const toast = useToast()
const router = useRouter()

const searchQuery = ref('')

onMounted(async () => {
  if (!user.value) {
    await router.push('/login')
    return
  }
  await fetchQuotes()
})

const filteredQuotes = computed(() => {
  if (!searchQuery.value) return quotes.value

  const query = searchQuery.value.toLowerCase()
  return quotes.value.filter(quote =>
    quote.id.toLowerCase().includes(query) ||
    quote.status?.toLowerCase().includes(query)
  )
})

const handleView = (quote) => {
  router.push(`/quotes/${quote.id}`)
}

const handleDelete = async (quote) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta cotización?')) return

  try {
    await deleteQuote(quote.id)
    toast.add({
      title: 'Cotización eliminada',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'red'
    })
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-7xl">
    <header class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mis Cotizaciones
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Consulta el estado de tus solicitudes de cotización
          </p>
        </div>
        <UButton
          icon="i-heroicons-arrow-path"
          color="gray"
          variant="ghost"
          :loading="loading"
          @click="fetchQuotes"
        >
          Actualizar
        </UButton>
      </div>

      <div class="flex items-center gap-4">
        <UInput
          v-model="searchQuery"
          placeholder="Buscar por ID o estado..."
          icon="i-heroicons-magnifying-glass"
          class="flex-1"
        />
      </div>
    </header>

    <div v-if="loading && !quotes.length" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <div v-else-if="!quotes.length" class="text-center py-20">
      <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
      <p class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tienes cotizaciones</p>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Agrega productos al carrito y envía tu primera cotización
      </p>
      <UButton
        icon="i-heroicons-shopping-cart"
        color="primary"
        @click="router.push('/products')"
      >
        Ver Productos
      </UButton>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="quote in filteredQuotes"
        :key="quote.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 font-mono">
              #{{ quote.id.substring(0, 8) }}
            </p>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {{ quote.summary?.itemCount || quote.items?.length || 0 }} Productos
            </h3>
            <UBadge :color="getStatusColor(quote.status)" variant="subtle">
              {{ getStatusLabel(quote.status) }}
            </UBadge>
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Total Unidades:</span>
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ quote.summary?.totalUnits || 0 }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Fecha:</span>
            <span class="text-gray-900 dark:text-white">
              {{ formatDate(quote.createdAt) }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton
            icon="i-heroicons-eye"
            size="sm"
            color="gray"
            variant="outline"
            class="flex-1"
            @click="handleView(quote)"
          >
            Ver Detalles
          </UButton>
          <UButton
            icon="i-heroicons-trash"
            size="sm"
            color="red"
            variant="ghost"
            @click="handleDelete(quote)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

