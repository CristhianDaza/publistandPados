<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
    <UContainer>
      <div class="mb-8">
        <UButton
          to="/products"
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="gray"
          class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Volver a Productos
        </UButton>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-96">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-primary-500" />
      </div>
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 mb-4">
          <UIcon name="i-heroicons-exclamation-circle" class="text-5xl" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error al cargar el producto</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
        <UButton to="/products" color="primary">Regresar al catálogo</UButton>
      </div>

      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
        
        <div class="space-y-6">
          <div class="relative aspect-square bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group">
            <img 
              :src="selectedImage" 
              :alt="product.name"
              class="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <UIcon name="i-heroicons-magnifying-glass-plus" class="text-xl" />
            </div>
          </div>
          <div v-if="allImages.length > 1" class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button
              v-for="(img, index) in allImages"
              :key="index"
              @click="selectedImage = img"
              class="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white dark:bg-gray-800"
              :class="selectedImage === img ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'"
            >
              <img :src="img" class="w-full h-full object-contain p-1" />
            </button>
          </div>
        </div>

        <div class="space-y-8">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <UBadge v-if="product.id" color="gray" variant="solid" size="sm">{{ product.id }}</UBadge>
              <UBadge v-for="cat in product.category" :key="cat" color="primary" variant="subtle" size="sm">{{ cat }}</UBadge>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {{ product.name }}
            </h1>
            
            <div class="flex items-baseline gap-2">
               <span class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {{ priceDisplay }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">+ IVA</span>
            </div>
          </div>

          <div class="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <p>{{ product.description }}</p>
          </div>
          <div v-if="hasVariants" class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-heroicons-swatch" class="text-primary-500" />
                Disponibilidad por Color
              </h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th class="px-6 py-3">Color</th>
                    <th class="px-6 py-3 text-right">Precio</th>
                    <th class="px-6 py-3 text-right">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(variant, idx) in product.tableQuantity" 
                    :key="idx"
                    class="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td class="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                      <span 
                        class="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm"
                        :style="{ backgroundColor: getColorHex(variant.colorName || variant.color) }"
                      ></span>
                      {{ variant.colorName || variant.color }}
                    </td>
                    <td class="px-6 py-4 text-right font-mono">
                      {{ formatCurrency(variant.price) }}
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span 
                        class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="variant.quantity > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'"
                      >
                        {{ variant.quantity }} un.
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-if="product.material" class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <span class="text-xs text-gray-500 uppercase tracking-wider block mb-1">Material</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ product.material }}</span>
            </div>
            <div v-if="product.size" class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <span class="text-xs text-gray-500 uppercase tracking-wider block mb-1">Medidas</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ product.size }}</span>
            </div>
            <div v-if="product.areaPrinting" class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <span class="text-xs text-gray-500 uppercase tracking-wider block mb-1">Área de Impresión</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ product.areaPrinting }}</span>
            </div>
            <div v-if="product.printing" class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <span class="text-xs text-gray-500 uppercase tracking-wider block mb-1">Técnica de Marca</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ product.printing }}</span>
            </div>
             <div v-if="product.packaging" class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 col-span-1 sm:col-span-2">
              <span class="text-xs text-gray-500 uppercase tracking-wider block mb-1">Empaque</span>
              <span class="font-medium text-gray-900 dark:text-white text-sm leading-relaxed">{{ product.packaging }}</span>
            </div>
          </div>

        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const route = useRoute()
import { getColorHex } from '~/utils/colorMap'
const { getProductById, loading, error } = useProducts()

const product = ref(null)
const selectedImage = ref('')

const allImages = computed(() => {
  if (!product.value) return []
  
  const images = []
  
  if (product.value.mainImage) {
    images.push(product.value.mainImage)
  }
  if (product.value.images && Array.isArray(product.value.images)) {
    product.value.images.forEach(imgGroup => {
      if (imgGroup.urlImage && Array.isArray(imgGroup.urlImage)) {
        images.push(...imgGroup.urlImage)
      } else if (typeof imgGroup.urlImage === 'string') {
        images.push(imgGroup.urlImage)
      }
    })
  }
  
  return [...new Set(images.filter(Boolean))]
})

const hasVariants = computed(() => {
  return product.value?.tableQuantity && product.value.tableQuantity.length > 0
})

const priceDisplay = computed(() => {
  if (!hasVariants.value) return 'Consultar'
  
  const prices = product.value.tableQuantity
    .map(v => parseFloat(v.price))
    .filter(p => !isNaN(p) && p > 0)
    
  if (prices.length === 0) return 'Consultar'
  
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  
  if (minPrice === maxPrice) {
    return formatCurrency(minPrice)
  }
  
  return `De ${formatCurrency(minPrice)} a ${formatCurrency(maxPrice)}`
})

const formatCurrency = (value) => {
  if (!value || isNaN(value)) return 'Consultar'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value)
}



onMounted(async () => {
  try {
    const data = await getProductById(route.params.id)
    if (data) {
      product.value = data
      selectedImage.value = data.mainImage || (allImages.value.length > 0 ? allImages.value[0] : '')
    }
  } catch (e) {
    console.error('Failed to load product', e)
  }
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    try {
      const data = await getProductById(newId)
      if (data) {
        product.value = data
        selectedImage.value = data.mainImage || (allImages.value.length > 0 ? allImages.value[0] : '')
      }
    } catch (e) {
      console.error('Failed to reload product', e)
    }
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
