<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8 md:py-16 transition-all duration-500">
    <Teleport to="body">
      <Transition name="lightbox">
        <div 
          v-if="showLightbox" 
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl cursor-zoom-out"
          @click="showLightbox = false"
        >
          <button 
            class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10 p-2 rounded-full hover:bg-white/10"
            @click.stop="showLightbox = false"
          >
            <UIcon name="i-heroicons-x-mark" class="text-3xl" />
          </button>

          <button 
            v-if="allImages.length > 1"
            class="absolute left-4 md:left-8 text-white/70 hover:text-white transition-all z-10 p-3 rounded-full hover:bg-white/10 hover:scale-110"
            @click.stop="navigateLightbox(-1)"
          >
            <UIcon name="i-heroicons-chevron-left" class="text-4xl" />
          </button>
          <button 
            v-if="allImages.length > 1"
            class="absolute right-4 md:right-8 text-white/70 hover:text-white transition-all z-10 p-3 rounded-full hover:bg-white/10 hover:scale-110"
            @click.stop="navigateLightbox(1)"
          >
            <UIcon name="i-heroicons-chevron-right" class="text-4xl" />
          </button>
          
          <img 
            :src="selectedImage" 
            :alt="product?.name"
            class="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl animate-lightbox-enter"
            @click.stop
          />
          
          <div v-if="allImages.length > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-medium">
            {{ currentImageIndex + 1 }} / {{ allImages.length }}
          </div>
        </div>
      </Transition>
    </Teleport>

    <UContainer class="max-w-7xl">
      <nav class="mb-8 flex items-center gap-2 text-sm">
        <NuxtLink 
          to="/" 
          class="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
        >
          Inicio
        </NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="text-gray-400 text-xs" />
        <NuxtLink 
          to="/products" 
          class="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
        >
          Productos
        </NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="text-gray-400 text-xs" />
        <span class="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
          {{ product?.name || 'Cargando...' }}
        </span>
      </nav>

      <div v-if="loading" class="flex flex-col justify-center items-center h-[60vh] gap-6">
        <div class="relative">
          <div class="w-20 h-20 border-4 border-primary/20 rounded-full"></div>
          <div class="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        <p class="text-gray-500 dark:text-gray-400 animate-pulse">Cargando producto...</p>
      </div>

      <div v-else-if="error" class="text-center py-16 px-4">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
          <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl text-red-500" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Error al cargar el producto</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">{{ error }}</p>
        <UButton to="/products" color="primary" size="lg" class="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
          <UIcon name="i-heroicons-arrow-left" class="mr-2" />
          Regresar al catálogo
        </UButton>
      </div>

      <div v-else-if="product" class="animate-fade-in">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          <div class="lg:col-span-7 space-y-6">
            <div 
              class="relative aspect-square bg-white dark:bg-gray-800/80 rounded-3xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/20 border border-gray-100/80 dark:border-gray-700/50 group cursor-zoom-in backdrop-blur-sm"
              @click="openLightbox"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-100/30 dark:from-gray-700/20 dark:to-transparent pointer-events-none z-10"></div>
              
              <div class="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <span v-if="isNew" class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/30">
                  ✨ NUEVO
                </span>
                <span v-if="totalStock > 100" class="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-green-500/30">
                  ⚡ ALTA DISPONIBILIDAD
                </span>
              </div>
              
              <img 
                :src="selectedImage" 
                :alt="product.name"
                class="w-full h-full object-contain p-8 md:p-12 transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
              />
              
              <div class="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 shadow-lg">
                <UIcon name="i-heroicons-magnifying-glass-plus" class="text-lg" />
                <span class="text-sm font-medium">Click para ampliar</span>
              </div>
            </div>

            <div v-if="allImages.length > 1" class="relative mt-4">
              <div class="px-2 py-3 -mx-2 overflow-visible">
                <div class="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-hide scroll-smooth">
                  <button
                    v-for="(img, index) in allImages"
                    :key="index"
                    @click="selectImage(img, index)"
                    class="relative flex-shrink-0 transition-all duration-300 group/thumb"
                    :class="[
                      selectedImage === img 
                        ? 'scale-105' 
                        : 'hover:scale-105'
                    ]"
                  >
                    <div 
                      class="w-18 h-18 md:w-22 md:h-22 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-white dark:bg-gray-800 shadow-md"
                      :class="[
                        selectedImage === img 
                          ? 'border-primary shadow-lg shadow-primary/25' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg'
                      ]"
                    >
                      <img 
                        :src="img" 
                        :alt="`Vista ${index + 1}`"
                        class="w-full h-full object-contain p-2 transition-transform duration-300 group-hover/thumb:scale-105" 
                      />
                    </div>
                    <div 
                      v-if="selectedImage === img"
                      class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full shadow-sm"
                    ></div>
                  </button>
                </div>
              </div>
              
              <div v-if="allImages.length > 5" class="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between pointer-events-none px-0">
                <button 
                  @click="scrollThumbnails(-1)"
                  class="pointer-events-auto w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary hover:border-primary transition-colors -ml-4"
                >
                  <UIcon name="i-heroicons-chevron-left" class="text-sm" />
                </button>
                <button 
                  @click="scrollThumbnails(1)"
                  class="pointer-events-auto w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary hover:border-primary transition-colors -mr-4"
                >
                  <UIcon name="i-heroicons-chevron-right" class="text-sm" />
                </button>
              </div>
              
              <div v-if="allImages.length > 1" class="flex justify-center mt-2 gap-1.5">
                <button 
                  v-for="(_, i) in allImages" 
                  :key="i"
                  @click="selectImage(allImages[i], i)"
                  class="w-2 h-2 rounded-full transition-all duration-300"
                  :class="currentImageIndex === i ? 'bg-primary w-6' : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary/50'"
                ></button>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 space-y-8">
            <div class="space-y-4">
              <div class="flex flex-wrap items-center gap-2">
                <span 
                  v-if="product.id" 
                  class="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-mono"
                >
                  <UIcon name="i-heroicons-hashtag" class="text-gray-400" />
                  {{ product.id }}
                </span>
                <span 
                  v-for="cat in product.category" 
                  :key="cat" 
                  class="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ cat }}
                </span>
              </div>
              
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                {{ product.name }}
              </h1>
              
              <div class="flex items-end gap-3 pt-2">
                <span class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                  {{ priceDisplay }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400 font-medium pb-2 flex items-center gap-1">
                  <UIcon name="i-heroicons-plus-small" class="text-xs" />
                  IVA
                </span>
              </div>
            </div>

            <div v-if="product.description" class="relative">
              <div class="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-transparent rounded-full"></div>
              <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed pl-2">
                {{ product.description }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 p-4 rounded-2xl border border-green-100 dark:border-green-800/30">
                <div class="flex items-center gap-2 mb-1">
                  <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span class="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider">Stock Total</span>
                </div>
                <span class="text-2xl font-bold text-green-700 dark:text-green-300">{{ formattedTotalStock }}</span>
                <span class="text-sm text-green-600 dark:text-green-400 ml-1">unidades</span>
              </div>
              <div class="bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary/10 dark:to-primary/5 p-4 rounded-2xl border border-primary-100 dark:border-primary/20">
                <div class="flex items-center gap-2 mb-1">
                  <UIcon name="i-heroicons-swatch" class="text-primary text-sm" />
                  <span class="text-xs font-medium text-primary uppercase tracking-wider">Colores</span>
                </div>
                <span class="text-2xl font-bold text-primary">{{ uniqueColorsCount }}</span>
                <span class="text-sm text-primary/70 ml-1">disponibles</span>
              </div>
            </div>

            <div v-if="hasVariants" class="bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm">
              <div class="p-5 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800/50">
                <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-3 text-lg">
                  <span class="p-2 bg-primary/10 rounded-lg">
                    <UIcon name="i-heroicons-swatch" class="text-primary text-xl" />
                  </span>
                  Disponibilidad por Color
                </h3>
              </div>
              <div class="overflow-x-auto max-h-80 overflow-y-auto scrollbar-thin">
                <table class="w-full text-sm">
                  <thead class="text-xs text-gray-500 uppercase bg-gray-50/80 dark:bg-gray-800/80 sticky top-0 backdrop-blur-sm">
                    <tr>
                      <th class="px-5 py-4 text-left font-semibold">Color</th>
                      <th class="px-5 py-4 text-right font-semibold">Precio</th>
                      <th class="px-5 py-4 text-right font-semibold">Stock</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
                    <tr 
                      v-for="(variant, idx) in product.tableQuantity" 
                      :key="idx"
                      class="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors group"
                    >
                      <td class="px-5 py-4">
                        <div class="flex items-center gap-3">
                          <span 
                            class="w-6 h-6 rounded-full shadow-inner ring-2 ring-white dark:ring-gray-700 transition-transform group-hover:scale-110"
                            :style="{ backgroundColor: getColorHex(variant.colorName || variant.color) }"
                          ></span>
                          <span class="font-medium text-gray-900 dark:text-white">
                            {{ variant.colorName || variant.color }}
                          </span>
                        </div>
                      </td>
                      <td class="px-5 py-4 text-right">
                        <span class="font-mono text-gray-700 dark:text-gray-300 font-medium">
                          {{ formatCurrency(variant.price) }}
                        </span>
                      </td>
                      <td class="px-5 py-4 text-right">
                        <span 
                          class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                          :class="variant.quantity > 0 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/40 dark:to-emerald-900/30 dark:text-green-300' 
                            : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 dark:from-red-900/40 dark:to-rose-900/30 dark:text-red-300'"
                        >
                          <span class="w-1.5 h-1.5 rounded-full" :class="variant.quantity > 0 ? 'bg-green-500' : 'bg-red-500'"></span>
                          {{ variant.quantity }} un.
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                <UIcon name="i-heroicons-information-circle" class="text-primary" />
                Especificaciones
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  v-if="product.material" 
                  class="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/60 dark:to-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                >
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-heroicons-cube" class="text-primary/70" />
                    <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Material</span>
                  </div>
                  <span class="font-semibold text-gray-900 dark:text-white text-lg">{{ product.material }}</span>
                </div>
                
                <div 
                  v-if="product.size" 
                  class="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/60 dark:to-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                >
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-heroicons-arrows-pointing-out" class="text-primary/70" />
                    <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Medidas</span>
                  </div>
                  <span class="font-semibold text-gray-900 dark:text-white text-lg">{{ product.size }}</span>
                </div>
                
                <div 
                  v-if="product.areaPrinting" 
                  class="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/60 dark:to-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                >
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-heroicons-photo" class="text-primary/70" />
                    <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Área de Impresión</span>
                  </div>
                  <span class="font-semibold text-gray-900 dark:text-white text-lg">{{ product.areaPrinting }}</span>
                </div>
                
                <div 
                  v-if="product.printing" 
                  class="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/60 dark:to-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                >
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-heroicons-paint-brush" class="text-primary/70" />
                    <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Técnica de Marca</span>
                  </div>
                  <span class="font-semibold text-gray-900 dark:text-white text-lg">{{ product.printing }}</span>
                </div>
                
                <div 
                  v-if="product.packaging" 
                  class="group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/60 dark:to-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden col-span-1 sm:col-span-2"
                >
                  <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-heroicons-gift" class="text-primary/70" />
                    <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Empaque</span>
                  </div>
                  <span class="font-medium text-gray-900 dark:text-white leading-relaxed">{{ product.packaging }}</span>
                </div>
              </div>
            </div>

            <div class="pt-6 border-t border-gray-100 dark:border-gray-700/50">
              <div class="flex flex-col sm:flex-row gap-4">
                <UButton 
                  to="/products" 
                  variant="outline" 
                  color="gray" 
                  size="xl"
                  class="flex-1 justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <UIcon name="i-heroicons-arrow-left" class="mr-2" />
                  Volver al Catálogo
                </UButton>
              </div>
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
const showLightbox = ref(false)
const currentImageIndex = ref(0)

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

const totalStock = computed(() => {
  if (!product.value?.tableQuantity) return 0
  return product.value.tableQuantity.reduce((acc, item) => {
    const qty = Number(item.quantity)
    return acc + (qty > 0 ? qty : 0)
  }, 0)
})

const formattedTotalStock = computed(() => {
  return new Intl.NumberFormat('es-CO').format(totalStock.value)
})

const uniqueColorsCount = computed(() => {
  if (!product.value?.tableQuantity) return 0
  const colors = new Set()
  product.value.tableQuantity.forEach(item => {
    if (item.colorName) colors.add(item.colorName)
    else if (item.color) colors.add(item.color)
  })
  return colors.size
})

const isNew = computed(() => {
  return product.value?.labels?.some(l => 
    l.name?.toLowerCase().includes('novedad') || l.name?.toLowerCase().includes('nuevo')
  )
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

const selectImage = (img, index) => {
  selectedImage.value = img
  currentImageIndex.value = index
}

const openLightbox = () => {
  showLightbox.value = true
}

const navigateLightbox = (direction) => {
  const newIndex = currentImageIndex.value + direction
  if (newIndex >= 0 && newIndex < allImages.value.length) {
    currentImageIndex.value = newIndex
    selectedImage.value = allImages.value[newIndex]
  } else if (newIndex < 0) {
    currentImageIndex.value = allImages.value.length - 1
    selectedImage.value = allImages.value[currentImageIndex.value]
  } else {
    currentImageIndex.value = 0
    selectedImage.value = allImages.value[0]
  }
}

const scrollThumbnails = (direction) => {
  const container = document.querySelector('.scrollbar-hide.scroll-smooth')
  if (container) {
    const scrollAmount = 200
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
  }
}

// Keyboard navigation for lightbox
const handleKeydown = (e) => {
  if (!showLightbox.value) return
  
  if (e.key === 'Escape') {
    showLightbox.value = false
  } else if (e.key === 'ArrowLeft') {
    navigateLightbox(-1)
  } else if (e.key === 'ArrowRight') {
    navigateLightbox(1)
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  
  try {
    const data = await getProductById(route.params.id)
    if (data) {
      product.value = data
      selectedImage.value = data.mainImage || (allImages.value.length > 0 ? allImages.value[0] : '')
      currentImageIndex.value = 0
    }
  } catch (e) {
    console.error('Failed to load product', e)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    try {
      const data = await getProductById(newId)
      if (data) {
        product.value = data
        selectedImage.value = data.mainImage || (allImages.value.length > 0 ? allImages.value[0] : '')
        currentImageIndex.value = 0
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

.scrollbar-thin::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.8);
}

@keyframes fade-in {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

@keyframes lightbox-enter {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-lightbox-enter {
  animation: lightbox-enter 0.3s ease-out forwards;
}

/* Lightbox transitions */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: all 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-from .animate-lightbox-enter,
.lightbox-leave-to .animate-lightbox-enter {
  transform: scale(0.9);
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}

.w-18 {
  width: 4.5rem;
}
.h-18 {
  height: 4.5rem;
}
.w-22 {
  width: 5.5rem;
}
.h-22 {
  height: 5.5rem;
}
</style>
