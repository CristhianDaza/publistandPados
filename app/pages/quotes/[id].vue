<script setup>
definePageMeta({
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
  deleteQuote,
  getStatusColor,
  getStatusLabel
} = useQuotes()

const quoteId = computed(() => route.params.id)

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }

  try {
    await fetchQuoteById(quoteId.value)

    useHead({
      title: `Cotización #${quoteId.value.substring(0, 8)}`
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'red'
    })
    router.push('/quotes')
  }
})

const handleDelete = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta cotización?')) return

  try {
    await deleteQuote(quoteId.value)
    toast.add({
      title: 'Cotización eliminada',
      color: 'green'
    })
    await router.push('/quotes')
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

const cardBg = 'bg-background/80 border border-secondary/20 rounded-2xl shadow-sm'
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-7xl">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-secondary" />
    </div>

    <div v-else-if="selectedQuote">
      <header class="mb-8">
        <div class="flex items-center gap-4 mb-4 flex-wrap">
          <UButton
            icon="i-heroicons-arrow-left"
            color="gray"
            variant="ghost"
            class="cursor-pointer"
            @click="router.push('/quotes')"
          >
            Volver
          </UButton>
          <div class="flex-1 min-w-[200px]">
            <div class="flex items-center gap-3 mb-2 flex-wrap">
              <h1 class="text-3xl font-bold text-text">
                Cotización #{{ quoteId.substring(0, 8) }}
              </h1>
              <UBadge :color="getStatusColor(selectedQuote.status)" variant="subtle">
                {{ getStatusLabel(selectedQuote.status) }}
              </UBadge>
            </div>
            <p class="text-secondary">
              Creada el {{ formatDate(selectedQuote.createdAt) }}
            </p>
          </div>
          <UButton
            icon="i-heroicons-trash"
            color="red"
            variant="ghost"
            class="cursor-pointer"
            @click="handleDelete"
          >
            Eliminar
          </UButton>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div :class="cardBg" class="p-6">
            <h2 class="text-xl font-bold text-text mb-4">Productos Cotizados</h2>
            <div class="space-y-4">
              <div
                v-for="item in selectedQuote.items"
                :key="item.id"
                class="bg-background/90 border border-secondary/20 rounded-2xl p-4 shadow-sm"
              >
                <div class="flex gap-4">
                  <img
                    v-if="item.productImage"
                    :src="item.productImage"
                    :alt="item.productName"
                    class="w-20 h-20 object-cover rounded-lg bg-background border border-secondary/30"
                  >
                  <div class="flex-1">
                    <h3 class="font-semibold text-text mb-1">{{ item.productName }}</h3>
                    <p class="text-xs text-secondary mb-2">SKU: {{ item.productSku || item.productId }}</p>

                    <div class="bg-background border border-secondary/20 rounded-xl p-3 mb-2">
                      <p class="text-xs text-secondary mb-2 uppercase tracking-wide">Colores y Cantidades</p>
                      <ul class="space-y-1">
                        <li
                          v-for="entry in item.entries"
                          :key="entry.id"
                          class="flex items-center justify-between text-sm"
                        >
                          <span class="text-text/80">{{ entry.colorName }}</span>
                          <span class="text-text font-semibold">{{ entry.quantity }} und</span>
                        </li>
                      </ul>
                    </div>

                    <div class="flex gap-4 text-xs text-secondary">
                      <span>Marcado: <strong class="text-text">{{ item.marked ? 'Sí' : 'No' }}</strong></span>
                      <span>Colores: <strong class="text-text">{{ item.colorCount }}</strong></span>
                    </div>

                    <p v-if="item.notes" class="text-sm text-text mt-2">
                      <span class="text-secondary">Nota:</span> {{ item.notes }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-secondary/20">
              <div class="flex justify-between text-lg">
                <span class="text-secondary">Total Productos:</span>
                <span class="text-text font-bold">{{ selectedQuote.summary?.itemCount || selectedQuote.items?.length }}</span>
              </div>
              <div class="flex justify-between text-lg">
                <span class="text-secondary">Total Unidades:</span>
                <span class="text-text font-bold">{{ selectedQuote.summary?.totalUnits || 0 }}</span>
              </div>
            </div>
          </div>

          <div v-if="selectedQuote.adminComments" :class="cardBg" class="p-6">
            <h2 class="text-xl font-bold text-text mb-4">Comentarios del Administrador</h2>
            <p class="text-text whitespace-pre-wrap">{{ selectedQuote.adminComments }}</p>
          </div>
        </div>

        <div class="space-y-6">
          <div :class="cardBg" class="p-6">
            <h2 class="text-lg font-bold text-text mb-4">Estado</h2>
            <div class="flex items-center justify-center mb-4">
              <UBadge :color="getStatusColor(selectedQuote.status)" variant="subtle" size="lg">
                {{ getStatusLabel(selectedQuote.status) }}
              </UBadge>
            </div>
            <div class="text-center text-sm text-secondary">
              <p v-if="selectedQuote.status === 'pendiente'">
                Tu cotización está siendo revisada por nuestro equipo.
              </p>
              <p v-else-if="selectedQuote.status === 'en-proceso'">
                Estamos trabajando en tu cotización.
              </p>
              <p v-else-if="selectedQuote.status === 'completada'">
                Tu cotización ha sido completada. Revisa tu correo electrónico.
              </p>
              <p v-else-if="selectedQuote.status === 'cancelada'">
                Esta cotización ha sido cancelada.
              </p>
              <p v-else-if="selectedQuote.status === 'rechazada'">
                Esta cotización ha sido rechazada.
              </p>
            </div>
          </div>

          <div :class="cardBg" class="p-6">
            <h2 class="text-lg font-bold text-text mb-4">Información de Contacto</h2>
            <div class="space-y-3 text-sm">
              <div>
                <p class="text-secondary mb-1">Nombre</p>
                <p class="text-text font-semibold">{{ selectedQuote.customer?.name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-secondary mb-1">Email</p>
                <p class="text-text">{{ selectedQuote.customer?.email || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-secondary mb-1">Teléfono</p>
                <p class="text-text">{{ selectedQuote.customer?.phone || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <div :class="cardBg" class="p-6">
            <h2 class="text-lg font-bold text-text mb-4">Información</h2>
            <div class="space-y-3 text-sm">
              <div>
                <p class="text-secondary mb-1">ID Completo</p>
                <p class="text-text font-mono text-xs break-all">{{ quoteId }}</p>
              </div>
              <div>
                <p class="text-secondary mb-1">Creada</p>
                <p class="text-text">{{ formatDate(selectedQuote.createdAt) }}</p>
              </div>
              <div>
                <p class="text-secondary mb-1">Última Actualización</p>
                <p class="text-text">{{ formatDate(selectedQuote.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

