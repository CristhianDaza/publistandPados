<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { user } = useAuth()

const {
  selectedQuote,
  loading,
  fetchQuoteById,
  updateQuoteStatus,
  addComment,
  deleteQuote,
  isAdmin,
  getStatusColor,
  getStatusLabel,
  statusOptions
} = useQuotes()

const quoteId = computed(() => route.params.id)
const newComment = ref('')
const selectedStatus = ref('')
const adminComments = ref('')
const isUpdatingStatus = ref(false)

onMounted(async () => {
  try {
    await fetchQuoteById(quoteId.value)
    selectedStatus.value = selectedQuote.value?.status || 'pendiente'
    adminComments.value = selectedQuote.value?.adminComments || ''

    useHead({
      title: `Cotización #${quoteId.value.substring(0, 8)}`
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'red'
    })
    await router.push('/admin/quotes')
  }
})

const handleStatusUpdate = async () => {
  if (!isAdmin.value) {
    toast.add({
      title: 'Error',
      description: 'No tienes permisos para actualizar el estado',
      color: 'red'
    })
    return
  }

  isUpdatingStatus.value = true
  try {
    await updateQuoteStatus(quoteId.value, selectedStatus.value, adminComments.value)
    toast.add({
      title: 'Estado actualizado',
      color: 'green'
    })
    await fetchQuoteById(quoteId.value)
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'red'
    })
  } finally {
    isUpdatingStatus.value = false
  }
}

const handleAddComment = async () => {
  if (!newComment.value.trim()) return

  try {
    await addComment(quoteId.value, newComment.value)
    newComment.value = ''
    toast.add({
      title: 'Comentario agregado',
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

const handleDelete = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta cotización?')) return

  try {
    await deleteQuote(quoteId.value)
    toast.add({
      title: 'Cotización eliminada',
      color: 'green'
    })
    await  router.push('/admin/quotes')
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
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cardBg = 'bg-slate-900 border border-slate-800 rounded-xl'
</script>

<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-slate-400" />
    </div>

    <div v-else-if="selectedQuote">
      <header class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <UButton
            icon="i-heroicons-arrow-left"
            color="gray"
            variant="ghost"
            @click="router.push('/admin/quotes')"
          >
            Volver
          </UButton>
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold text-white">
                Cotización #{{ quoteId.substring(0, 8) }}
              </h1>
              <UBadge :color="getStatusColor(selectedQuote.status)" variant="subtle">
                {{ getStatusLabel(selectedQuote.status) }}
              </UBadge>
            </div>
            <p class="text-slate-400">
              Creada el {{ formatDate(selectedQuote.createdAt) }}
            </p>
          </div>
          <UButton
            v-if="isAdmin || selectedQuote.customer?.userId === user?.uid"
            icon="i-heroicons-trash"
            color="red"
            variant="ghost"
            @click="handleDelete"
          >
            Eliminar
          </UButton>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div :class="cardBg" class="p-6">
            <h2 class="text-xl font-bold text-white mb-4">Información del Cliente</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-slate-400 mb-1">Nombre</p>
                <p class="text-white font-semibold">{{ selectedQuote.customer?.name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-400 mb-1">Email</p>
                <p class="text-white">{{ selectedQuote.customer?.email || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-400 mb-1">Teléfono</p>
                <p class="text-white">{{ selectedQuote.customer?.phone || 'N/A' }}</p>
              </div>
              <div v-if="selectedQuote.customer?.userId">
                <p class="text-sm text-slate-400 mb-1">Usuario ID</p>
                <p class="text-white font-mono text-xs">{{ selectedQuote.customer.userId }}</p>
              </div>
            </div>
          </div>

          <div :class="cardBg" class="p-6">
            <h2 class="text-xl font-bold text-white mb-4">Productos Cotizados</h2>
            <div class="space-y-4">
              <div
                v-for="item in selectedQuote.items"
                :key="item.id"
                class="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
              >
                <div class="flex gap-4">
                  <img
                    v-if="item.productImage"
                    :src="item.productImage"
                    :alt="item.productName"
                    class="w-20 h-20 object-cover rounded-lg"
                  >
                  <div class="flex-1">
                    <h3 class="font-semibold text-white mb-1">{{ item.productName }}</h3>
                    <p class="text-xs text-slate-400 mb-2">SKU: {{ item.productSku || item.productId }}</p>

                    <!-- Entries -->
                    <div class="bg-slate-900/50 rounded-lg p-3 mb-2">
                      <p class="text-xs text-slate-400 mb-2 uppercase tracking-wide">Colores y Cantidades</p>
                      <ul class="space-y-1">
                        <li
                          v-for="entry in item.entries"
                          :key="entry.id"
                          class="flex items-center justify-between text-sm"
                        >
                          <span class="text-slate-300">{{ entry.colorName }}</span>
                          <span class="text-white font-semibold">{{ entry.quantity }} und</span>
                        </li>
                      </ul>
                    </div>

                    <div class="flex gap-4 text-xs text-slate-400">
                      <span>Marcado: <strong class="text-white">{{ item.marked ? 'Sí' : 'No' }}</strong></span>
                      <span>Colores: <strong class="text-white">{{ item.colorCount }}</strong></span>
                    </div>

                    <p v-if="item.notes" class="text-sm text-slate-300 mt-2">
                      <span class="text-slate-400">Nota:</span> {{ item.notes }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-700">
              <div class="flex justify-between text-lg">
                <span class="text-slate-400">Total Productos:</span>
                <span class="text-white font-bold">{{ selectedQuote.summary?.itemCount || selectedQuote.items?.length }}</span>
              </div>
              <div class="flex justify-between text-lg">
                <span class="text-slate-400">Total Unidades:</span>
                <span class="text-white font-bold">{{ selectedQuote.summary?.totalUnits || 0 }}</span>
              </div>
            </div>
          </div>

          <div v-if="isAdmin" :class="cardBg" class="p-6">
            <h2 class="text-xl font-bold text-white mb-4">Comentarios</h2>

            <div v-if="selectedQuote.comments?.length" class="space-y-3 mb-4">
              <div
                v-for="comment in selectedQuote.comments"
                :key="comment.id"
                class="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
              >
                <div class="flex items-start justify-between mb-2">
                  <p class="font-semibold text-white">{{ comment.author }}</p>
                  <p class="text-xs text-slate-400">
                    {{ formatDate(comment.createdAt?.toDate?.() || comment.createdAt) }}
                  </p>
                </div>
                <p class="text-slate-300">{{ comment.text }}</p>
              </div>
            </div>

            <div class="flex gap-2">
              <UTextarea
                v-model="newComment"
                placeholder="Agregar un comentario..."
                :rows="2"
                class="flex-1"
              />
              <UButton
                icon="i-heroicons-paper-airplane"
                color="primary"
                :disabled="!newComment.trim()"
                @click="handleAddComment"
              >
                Enviar
              </UButton>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div v-if="isAdmin" :class="cardBg" class="p-6">
            <h2 class="text-lg font-bold text-white mb-4">Gestionar Estado</h2>

            <UFormGroup label="Estado" class="mb-4">
              <USelectMenu
                v-model="selectedStatus"
                :options="statusOptions"
                value-attribute="value"
                option-attribute="label"
              />
            </UFormGroup>

            <UFormGroup label="Comentarios del Admin" class="mb-4">
              <UTextarea
                v-model="adminComments"
                placeholder="Notas internas sobre esta cotización..."
                :rows="4"
              />
            </UFormGroup>

            <UButton
              color="primary"
              block
              :loading="isUpdatingStatus"
              @click="handleStatusUpdate"
            >
              Actualizar Estado
            </UButton>
          </div>

          <div v-if="selectedQuote.adminComments" :class="cardBg" class="p-6">
            <h2 class="text-lg font-bold text-white mb-2">Notas del Admin</h2>
            <p class="text-slate-300 text-sm whitespace-pre-wrap">{{ selectedQuote.adminComments }}</p>
          </div>

          <div :class="cardBg" class="p-6">
            <h2 class="text-lg font-bold text-white mb-4">Información</h2>
            <div class="space-y-3 text-sm">
              <div>
                <p class="text-slate-400 mb-1">ID Completo</p>
                <p class="text-white font-mono text-xs break-all">{{ quoteId }}</p>
              </div>
              <div>
                <p class="text-slate-400 mb-1">Creada</p>
                <p class="text-white">{{ formatDate(selectedQuote.createdAt) }}</p>
              </div>
              <div>
                <p class="text-slate-400 mb-1">Última Actualización</p>
                <p class="text-white">{{ formatDate(selectedQuote.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

