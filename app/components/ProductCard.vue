<script setup>
import { computed } from 'vue'
import { getColorHex } from '~/utils/colorMap'
import { isProductNew } from '~/utils/products'
const { user } = useAuth()
const { formatPriceRange } = usePricing()
const { openConfigurator } = useQuoteCart()

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const isNew = computed(() => {
  return isProductNew(props.product)
})

const hasDiscount = computed(() => {
  return props.product.discount !== null && props.product.discount > 0
})

const discountPercentage = computed(() => {
  return props.product.discount
})

const formattedPrice = computed(() => {
  const prices = props.product.tableQuantity
    ?.map(item => Number(item.price))
    .filter(p => !isNaN(p) && p > 0)

  if (!prices?.length) return 'Consultar'
  return formatPriceRange(prices)
})

const totalStock = computed(() => {
  if (!props.product.tableQuantity) return 0
  return props.product.tableQuantity.reduce((acc, item) => {
    const qty = Number(item.quantity)
    return acc + (qty > 0 ? qty : 0)
  }, 0)
})

const hasStock = computed(() => totalStock.value > 0)

const formattedQuantity = computed(() => {
  return new Intl.NumberFormat('es-CO').format(totalStock.value)
})

const uniqueColors = computed(() => {
  if (!props.product.tableQuantity) return []

  const colors = new Map()

  props.product.tableQuantity.forEach(item => {
    if (item.colorName && !colors.has(item.colorName)) {
      colors.set(item.colorName, {
        name: item.colorName,
        hex: getColorHex(item.color)
      })
    }
  })

  return Array.from(colors.values())
})

const displayedColors = computed(() => uniqueColors.value.slice(0, 5))
const remainingColorsCount = computed(() => Math.max(0, uniqueColors.value.length - 5))

const handleQuoteClick = (event) => {
  event.preventDefault()
  event.stopPropagation()
  openConfigurator(props.product)
}
</script>

<template>
  <NuxtLink
    :to="`/products/${product.id}`"
    class="group relative w-full bg-secondary/5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-secondary/20 hover:-translate-y-2 flex flex-col h-full cursor-pointer"
  >
    <div class="absolute top-3 left-3 z-10 flex flex-col gap-2">
      <span v-if="isNew" class="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90">
        NUEVO
      </span>
      <span v-if="hasDiscount" class="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90">
        -{{ discountPercentage }}%
      </span>
    </div>

    <div class="relative aspect-square overflow-hidden bg-white p-6">
      <img
        :src="product.mainImage"
        :alt="product.name"
        class="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 ease-out"
      >

      <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
        <span class="bg-primary text-text px-4 py-2 rounded-full text-sm font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          Ver Detalles
        </span>
      </div>
    </div>

    <div class="p-5 flex flex-col flex-grow relative">
      <span v-if="product.category && product.category[0]" class="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">
        {{ product.category[0] }}
      </span>

      <h3 class="font-bold text-secondary mb-2 line-clamp-2 min-h-[2.5rem] text-sm md:text-base group-hover:text-primary transition-colors">
        {{ product.name }}
      </h3>

      <div v-if="user" class="mb-4">
        <div class="flex items-baseline gap-2">
          <p class="text-primary font-bold text-lg md:text-xl">
            {{ formattedPrice }}
          </p>
          <span class="text-[10px] text-text font-bold uppercase tracking-wide bg-secondary/20 px-1.5 py-0.5 rounded">
            + IVA
          </span>
        </div>
      </div>

      <div class="mt-auto space-y-3">
        <div v-if="uniqueColors.length > 0" class="flex items-center gap-2">
          <div class="flex -space-x-1.5">
            <div
              v-for="color in displayedColors"
              :key="color.name"
              class="w-5 h-5 rounded-full border border-white dark:border-gray-800 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
              :style="{ backgroundColor: color.hex }"
              :title="color.name"
            />
            <div v-if="remainingColorsCount > 0" class="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 border border-white dark:border-gray-800 flex items-center justify-center text-[8px] font-bold text-gray-600 dark:text-gray-300 ring-1 ring-black/5 dark:ring-white/10">
              +{{ remainingColorsCount }}
            </div>
          </div>
          <span class="text-xs text-text font-medium">{{ uniqueColors.length }} {{  uniqueColors.length === 1 ? 'color' : 'colores' }}</span>
        </div>

        <div class="pt-3 border-t border-secondary/20 flex justify-between items-center text-xs">
          <div class="flex items-center gap-1.5">
            <div class="w-2 h-2 rounded-full" :class="hasStock ? 'bg-green-500' : 'bg-red-500'"/>
            <span :class="hasStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="font-medium">
              {{ hasStock ? 'Disponible' : 'Agotado' }}
            </span>
          </div>
          <span class="font-bold text-text bg-secondary/5 px-2 py-1 rounded-md border border-primary/10">
            {{ formattedQuantity }} {{  formattedQuantity.length === 1 ? 'unidad' : 'unidades' }}
          </span>
        </div>

        <UButton
          size="sm"
          color="primary"
          block
          variant="outline"
          class="mt-4 cursor-pointer"
          icon="i-heroicons-shopping-bag"
          @click="handleQuoteClick"
        >
          Cotizar
        </UButton>
      </div>
    </div>
  </NuxtLink>
</template>
