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
  deleteCompletedQuotes,
  getStatusColor,
  getStatusLabel,
  isAdmin
} = useQuotes()
const toast = useToast()
const router = useRouter()

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(9)
const itemsPerPageOptions = [9, 18, 27, 45, 90]

const deleteCompletedModalOpen = ref(false)
const cleaningInfo = ref('')

watch(user, async (newUser) => {
  if (newUser) {
    await fetchQuotes()
  } else {
    await router.push('/login')
  }
}, { immediate: true })

const filteredQuotes = computed(() => {
  let result = quotes.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(quote =>
      quote.id.toLowerCase().includes(query) ||
      quote.status?.toLowerCase().includes(query) ||
      quote.customer?.name?.toLowerCase().includes(query) ||
      quote.customer?.email?.toLowerCase().includes(query)
    )
  }

  // Add UI helper properties
  return result.map(quote => ({
    ...quote,
    _statusColor: getStatusColor(quote.status),
    _statusLabel: getStatusLabel(quote.status)
  }))
})

const totalPages = computed(() => Math.ceil(filteredQuotes.value.length / itemsPerPage.value))

const paginatedQuotes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredQuotes.value.slice(start, end)
})

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

const handleClearCompleted = () => {
  const count = quotes.value.filter(q => q.status === 'completada').length
  if (count === 0) {
    toast.add({
       title: 'No hay cotizaciones completadas',
       color: 'orange'
    })
    return
  }
  cleaningInfo.value = `Se eliminarán ${count} cotizaciones completadas.`
  deleteCompletedModalOpen.value = true
}

const confirmClearCompleted = async () => {
  try {
    const deletedCount = await deleteCompletedQuotes()
    deleteCompletedModalOpen.value = false
    toast.add({
      title: 'Limpieza completada',
      description: `Se eliminaron ${deletedCount} cotizaciones.`,
      color: 'green'
    })
  } catch (error) {
     toast.add({
      title: 'Error al limpiar',
      description: error.message,
      color: 'red'
    })
  }
}

const handleDownloadCSV = () => {
  if (!filteredQuotes.value.length) {
     toast.add({ title: 'No hay datos para exportar', color: 'orange' })
     return
  }

  const csvRows = []
  csvRows.push(['ID', 'Fecha', 'Cliente', 'Email', 'Estado', 'Items', 'Unidades', 'Notas'])

  filteredQuotes.value.forEach(q => {
    const date = new Date(q.createdAt).toLocaleDateString()
    const id = q.id
    const client = q.customer?.name || 'N/A'
    const email = q.customer?.email || 'N/A'
    const status = getStatusLabel(q.status)
    const items = q.summary?.itemCount || q.items?.length || 0
    const units = q.summary?.totalUnits || 0
    const notes = q.comments?.length ? 'Tiene comentarios' : ''

    csvRows.push([id, date, client, email, status, items, units, notes])
  })

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n")
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `cotizaciones_${new Date().toISOString().slice(0,10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-7xl relative">
    <header class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mis Cotizaciones
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Administra tus solicitudes de cotización
          </p>
        </div>
        <div class="flex gap-2">
           <UButton
            v-if="isAdmin"
            icon="i-heroicons-trash"
            color="red"
            variant="soft"
            class="cursor-pointer"
            @click="handleClearCompleted"
          >
            Limpiar Completadas
          </UButton>
          <UButton
             icon="i-heroicons-arrow-down-tray"
             color="gray"
             variant="solid"
             class="cursor-pointer"
             @click="handleDownloadCSV"
          >
            Exportar CSV
          </UButton>
          <UButton
            icon="i-heroicons-arrow-path"
            color="gray"
            variant="ghost"
            :loading="loading"
            class="cursor-pointer"
            @click="fetchQuotes"
          >
            Actualizar
          </UButton>
        </div>
      </div>

      <div class="flex flex-col md:flex-row items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
        <QuoteSearchInput v-model="searchQuery" class="flex-1 w-full" />

        <div class="flex items-center gap-2">
           <span class="text-sm text-gray-500 whitespace-nowrap">Ver por página:</span>
           <select
             v-model="itemsPerPage"
             class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg text-sm p-2 outline-none focus:ring-2 focus:ring-primary-500"
           >
              <option v-for="opt in itemsPerPageOptions" :key="opt" :value="opt">
                {{ opt }}
              </option>
           </select>
        </div>
      </div>
    </header>

    <div v-if="loading && !quotes.length" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <div v-else-if="!filteredQuotes.length" class="text-center py-20">
      <UIcon name="i-heroicons-document-search" class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
      <p class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No se encontraron cotizaciones</p>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Intenta con otra búsqueda o crea una nueva cotización
      </p>
    </div>

    <div v-else>
       <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <QuoteCard
          v-for="quote in paginatedQuotes"
          :key="quote.id"
          :quote="quote"
          :loading="loading"
          @view="handleView"
          @delete="handleDelete"
        />
      </div>

      <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
         <UButton
            icon="i-heroicons-chevron-left"
            variant="ghost"
            :disabled="currentPage === 1"
            class="cursor-pointer"
            @click="currentPage--"
         />
         <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Página {{ currentPage }} de {{ totalPages }}
         </span>
         <UButton
            icon="i-heroicons-chevron-right"
            variant="ghost"
            :disabled="currentPage === totalPages"
            class="cursor-pointer"
            @click="currentPage++"
         />
      </div>
    </div>

     <div
      v-if="deleteCompletedModalOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 dark:bg-black/80 backdrop-blur-sm p-4"
     >
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Confirmar limpieza</h3>
          </div>
        </div>

        <p class="text-gray-600 dark:text-gray-400 mb-6">
           {{ cleaningInfo }}
           <br>Esta acción eliminará permanentemente todas las cotizaciones con estado "Completada". No se puede deshacer.
        </p>

        <div class="flex justify-end gap-3">
          <UButton
            color="gray"
            variant="ghost"
            label="Cancelar"
            class="cursor-pointer"
            @click="deleteCompletedModalOpen = false"
          />
          <UButton
            color="red"
            variant="solid"
            label="Eliminar Completadas"
            :loading="loading"
            class="cursor-pointer"
            @click="confirmClearCompleted"
          />
        </div>
      </div>
    </div>
  </div>
</template>
