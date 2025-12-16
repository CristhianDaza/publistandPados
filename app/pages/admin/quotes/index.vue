<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Cotizaciones'
})

const { user } = useAuth()
const {
  quotes,
  loading,
  fetchQuotes,
  deleteQuote,
  isAdmin,
  getStatusColor,
  getStatusLabel
} = useQuotes()
const toast = useToast()
const router = useRouter()

const searchQuery = ref('')

watch(user, async (newUser) => {
  if (newUser) {
    await fetchQuotes()
  }
}, { immediate: true })

const filteredQuotes = computed(() => {
  if (!searchQuery.value) return quotes.value

  const query = searchQuery.value.toLowerCase()
  return quotes.value.filter(quote =>
    quote.customer?.name?.toLowerCase().includes(query) ||
    quote.customer?.email?.toLowerCase().includes(query) ||
    quote.id.toLowerCase().includes(query) ||
    quote.status?.toLowerCase().includes(query)
  )
})

const handleView = (quote) => {
  router.push(`/admin/quotes/${quote.id}`)
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

const columns = [
  { key: 'quote_id', label: 'ID', sortable: true, id: 'quote_id' },
  { key: 'customer', label: 'Cliente', sortable: true, id: 'customer' },
  { key: 'items', label: 'Productos', sortable: true, id: 'items' },
  { key: 'units', label: 'Unidades', sortable: true, id: 'units' },
  { key: 'status', label: 'Estado', sortable: true, id: 'status' },
  { key: 'createdAt', label: 'Fecha', sortable: true, id: 'createdAt' },
  { key: 'actions', label: 'Acciones', id: 'actions' }
]

const rows = computed(() => {
  return filteredQuotes.value.map(quote => ({
    quote_id: quote.id,
    customer: quote.customer?.name || quote.customer?.email || 'Sin nombre',
    email: quote.customer?.email || 'N/A',
    phone: quote.customer?.phone || 'N/A',
    items: quote.summary?.itemCount || quote.items?.length || 0,
    units: quote.summary?.totalUnits || 0,
    status: quote.status || 'pendiente',
    createdAt: quote.createdAt,
    _raw: quote
  }))
})
</script>

<template>
  <div>
    <header class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">
            {{ isAdmin ? 'Todas las Cotizaciones' : 'Mis Cotizaciones' }}
          </h1>
          <p class="text-slate-400">
            {{ isAdmin ? 'Gestiona todas las cotizaciones de los clientes' : 'Consulta y gestiona tus cotizaciones' }}
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
          placeholder="Buscar por cliente, email o ID..."
          icon="i-heroicons-magnifying-glass"
          class="flex-1"
        />
      </div>
    </header>

    <div v-if="loading && !quotes.length" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-slate-400" />
    </div>

    <div v-else-if="!quotes.length" class="text-center py-20">
      <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <p class="text-lg font-semibold text-white mb-2">No hay cotizaciones</p>
      <p class="text-slate-400">
        {{ isAdmin ? 'Aún no se han recibido cotizaciones' : 'No tienes cotizaciones registradas' }}
      </p>
    </div>

    <div v-else class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <UTable
        :columns="columns"
        :rows="rows"
        :loading="loading"
      >
        <template #quote_id-data="{ row }">
          <span class="font-mono text-xs text-slate-400">
            {{ row.quote_id.substring(0, 8) }}...
          </span>
        </template>

        <template #customer-data="{ row }">
          <div>
            <p class="font-semibold text-white">{{ row.customer }}</p>
            <p class="text-xs text-slate-400">{{ row.email }}</p>
          </div>
        </template>

        <template #items-data="{ row }">
          <span class="text-white">{{ row.items }}</span>
        </template>

        <template #units-data="{ row }">
          <span class="text-white font-semibold">{{ row.units }}</span>
        </template>

        <template #status-data="{ row }">
          <UBadge
            :color="getStatusColor(row.status)"
            variant="subtle"
          >
            {{ getStatusLabel(row.status) }}
          </UBadge>
        </template>

        <template #createdAt-data="{ row }">
          <span class="text-sm text-slate-400">
            {{ formatDate(row.createdAt) }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-eye"
              size="xs"
              color="blue"
              variant="ghost"
              @click="handleView(row._raw)"
            >
              Ver
            </UButton>
            <UButton
              icon="i-heroicons-trash"
              size="xs"
              color="red"
              variant="ghost"
              @click="handleDelete(row._raw)"
            >
              Eliminar
            </UButton>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

