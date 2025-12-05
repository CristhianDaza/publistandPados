<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700 flex flex-col h-full">

    <div class="relative aspect-square overflow-hidden bg-white">
      <img 
        :src="product.mainImage" 
        :alt="product.name"
        class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
      />
    </div>

    <div class="p-4 flex flex-col flex-grow">
      <h3 class="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]" :title="product.name">
        {{ product.name }}
      </h3>

      <div class="mb-3">
        <p class="text-primary font-bold text-lg">
          {{ formattedPrice }}
          <span class="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">+ IVA</span>
        </p>
      </div>

      <div class="mb-3 flex-grow">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Colores disponibles:</p>
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="color in uniqueColors" 
            :key="color.name" 
            class="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm hover:scale-110 transition-transform hover:ring-2 hover:ring-primary hover:ring-offset-1 dark:hover:ring-offset-gray-800 ring-1 ring-inset ring-black/5 dark:ring-white/10"
            :style="{ backgroundColor: color.hex }"
          ></div>
        </div>
      </div>

      <div class="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
        <span class="text-gray-500 dark:text-gray-400">Disponibles:</span>
        <span class="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">
          {{ formattedQuantity }} und
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getColorHex } from '~/utils/colorMap'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const formattedPrice = computed(() => {
  if (!props.product.tableQuantity || props.product.tableQuantity.length === 0) {
    return 'Consultar'
  }

  const prices = props.product.tableQuantity
    .map(item => Number(item.price))
    .filter(p => !isNaN(p) && p > 0)

  if (prices.length === 0) return 'Consultar'

  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  const format = (p) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p)

  if (minPrice === maxPrice) {
    return format(minPrice)
  } else {
    return `De ${format(minPrice)} hasta ${format(maxPrice)}`
  }
})

const formattedQuantity = computed(() => {
  if (!props.product.tableQuantity) return '0'
  
  const total = props.product.tableQuantity.reduce((acc, item) => {
    const qty = Number(item.quantity)
    return acc + (qty > 0 ? qty : 0)
  }, 0)

  return new Intl.NumberFormat('es-CO').format(total)
})

const uniqueColors = computed(() => {
  if (!props.product.tableQuantity) return []

  const colors = new Map()
  
  props.product.tableQuantity.forEach(item => {
    if (item.colorName && !colors.has(item.colorName)) {
      colors.set(item.colorName, {
        name: item.colorName,
        hex: getColorHex(item.colorName)
      })
    }
  })

  return Array.from(colors.values())
})
</script>
