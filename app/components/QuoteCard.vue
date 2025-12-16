<script setup>
const props = defineProps({
  quote: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view', 'delete'])

const handleView = () => {
  emit('view', props.quote)
}

const handleDelete = () => {
  emit('delete', props.quote)
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

const { formatCurrency } = usePricing()
</script>

<template>
  <div
    class="group relative w-full bg-secondary/5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-secondary/20 hover:-translate-y-2 flex flex-col h-full"
  >
    <div class="p-5 flex flex-col flex-grow relative">
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 font-mono flex items-center justify-between">
        <span>#{{ quote.id.substring(0, 8) }}</span>
        <UBadge :color="quote._statusColor" variant="subtle">
          {{ quote._statusLabel || quote.status }}
        </UBadge>
      </p>

      <h3 class="font-bold text-secondary mb-2 text-base group-hover:text-primary transition-colors">
        {{ quote.summary?.itemCount || quote.items?.length || 0 }} {{ (quote.summary?.itemCount || quote.items?.length || 0) === 1 ? 'producto' : 'productos' }}
      </h3>

      <div class="space-y-2 mb-4 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Total unidades</span>
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ quote.summary?.totalUnits || 0 }}
          </span>
        </div>
        <div v-if="quote.summary?.totalPrice" class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Total Estimado</span>
          <span class="font-bold text-primary">
            {{ formatCurrency(quote.summary.totalPrice) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">Fecha</span>
          <span class="text-gray-900 dark:text-white">
            {{ formatDate(quote.createdAt) }}
          </span>
        </div>

        <div v-if="quote.customer" class="pt-3 border-t border-secondary/10 mt-3">
          <div class="flex items-center justify-between mb-1">
             <span class="text-xs font-semibold text-secondary">Cliente</span>
             <UBadge :color="quote.customer.userId ? 'green' : 'gray'" variant="soft" size="xs">
                {{ quote.customer.userId ? 'Registrado' : 'Invitado' }}
             </UBadge>
          </div>
          <p class="text-xs text-text truncate" :title="quote.customer.name">{{ quote.customer.name }}</p>
          <p class="text-xs text-secondary truncate" :title="quote.customer.email">{{ quote.customer.email }}</p>
        </div>
      </div>

      <div class="mt-auto flex items-center gap-2 pt-3 border-t border-secondary/20">
        <UButton
          icon="i-heroicons-eye"
          size="sm"
          color="gray"
          variant="outline"
          class="flex-1 cursor-pointer"
          :loading="loading"
          @click="handleView"
        >
          Ver detalles
        </UButton>
        <UButton
          icon="i-heroicons-trash"
          size="sm"
          color="red"
          variant="ghost"
          class="cursor-pointer"
          :loading="loading"
          @click="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

