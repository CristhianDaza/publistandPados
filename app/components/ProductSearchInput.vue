<template>
  <div class="relative" ref="searchContainer">
    <div class="relative group">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <UIcon 
          name="i-heroicons-magnifying-glass" 
          class="w-5 h-5 text-secondary group-focus-within:text-primary transition-colors duration-200" 
        />
      </div>
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        placeholder="Buscar productos..."
        class="w-full pl-10 pr-10 py-2.5 text-sm 
               bg-white dark:bg-gray-900/80 
               border border-gray-300 dark:border-secondary/30 
               rounded-xl
               text-black dark:text-white 
               placeholder-gray-400 dark:placeholder-secondary/60
               focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
               transition-all duration-200
               hover:border-primary/50 dark:hover:border-secondary/50 
               shadow-sm"
        @keydown.enter="handleSearch"
        @focus="showDropdown = true"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-10 flex items-center pr-2 cursor-pointer"
      >
        <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-secondary hover:text-primary transition-colors" />
      </button>
      <button
        @click="handleSearch"
        :disabled="!canSearch"
        class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UIcon name="i-heroicons-arrow-right-circle" class="w-5 h-5 text-primary hover:scale-110 transition-transform" />
      </button>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div 
        v-if="showHint && searchQuery.length > 0 && searchQuery.length < 3" 
        class="absolute top-full left-0 right-0 mt-1 px-3 py-2 text-xs text-primary bg-primary/10 rounded-lg border border-primary/20 z-[60]"
      >
        <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline mr-1" />
        Escribe al menos 3 caracteres para buscar
      </div>
    </Transition>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="showDropdown && canSearch && searchResults.length > 0"
        :class="[
          'bg-background shadow-2xl border border-secondary/20 overflow-hidden z-[60] backdrop-blur-xl',
          overlayMode 
            ? 'fixed top-[4.5rem] left-4 right-4 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl border border-secondary/20' 
            : 'absolute top-full left-0 right-0 mt-2 rounded-xl'
        ]"
      >
        <div class="p-2 border-b border-secondary/20 flex justify-between items-center bg-secondary/5">
          <span class="text-xs text-secondary font-medium px-2">
            {{ searchResults.length === 1 ? '1 resultado' : `${Math.min(searchResults.length, 5)} de ${searchResults.length} resultados` }}
          </span>
          <span v-if="searchResults.length > 1" class="text-xs text-primary font-medium px-2">
            Enter para ver todos
          </span>
        </div>
        
        <ul class="max-h-80 overflow-y-auto">
          <li 
            v-for="product in displayedResults" 
            :key="product.id"
            @click="goToProduct(product)"
            class="flex items-center gap-3 p-3 hover:bg-secondary/10 cursor-pointer transition-colors duration-150 border-b border-secondary/10 last:border-b-0"
          >
            <div class="w-12 h-12 rounded-lg overflow-hidden bg-background flex-shrink-0 border border-secondary/20 shadow-sm">
              <img 
                :src="product.mainImage" 
                :alt="product.name" 
                class="w-full h-full object-contain"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text truncate">
                {{ product.name }}
              </p>
              <p class="text-xs text-secondary">
                ID: {{ product.id }}
              </p>
            </div>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-secondary flex-shrink-0" />
          </li>
        </ul>

        <div 
          v-if="searchResults.length > 5"
          @click="handleSearch"
          class="p-3 text-center bg-secondary/5 cursor-pointer hover:bg-secondary/10 transition-colors border-t border-secondary/10"
        >
          <span class="text-sm text-primary font-medium">
            Ver todos los {{ searchResults.length }} resultados
          </span>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="showDropdown && canSearch && searchResults.length === 0 && !isSearching"
        class="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-2xl border border-secondary/20 p-6 text-center z-[60]"
      >
        <UIcon name="i-heroicons-face-frown" class="w-10 h-10 text-secondary/50 mx-auto mb-2" />
        <p class="text-sm text-secondary">No se encontraron productos para "{{ searchQuery }}"</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  overlayMode: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const { products, getProducts } = useProducts()

const searchContainer = ref(null)
const searchInput = ref(null)
const searchQuery = ref('')
const showDropdown = ref(false)
const showHint = ref(true)
const isSearching = ref(false)

onMounted(async () => {
  await getProducts()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    showDropdown.value = false
  }
}

const canSearch = computed(() => searchQuery.value.length >= 3)

const searchResults = computed(() => {
  if (!canSearch.value) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  
  return products.value.filter(product => {
    if (product.id?.toLowerCase().includes(query)) return true
    if (product.name?.toLowerCase().includes(query)) return true
    if (product.description?.toLowerCase().includes(query)) return true
    if (product.category?.some(cat => cat.toLowerCase().includes(query))) return true
    
    return false
  })
})

const displayedResults = computed(() => searchResults.value.slice(0, 5))

let debounceTimer = null
watch(searchQuery, () => {
  isSearching.value = true
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    isSearching.value = false
  }, 300)
})

const handleSearch = () => {
  if (!canSearch.value) return
  
  showDropdown.value = false
  
  const query = searchQuery.value
  const results = searchResults.value
  
  searchQuery.value = ''
  
  if (results.length === 1) {
    router.push(`/products/${results[0].id}`)
  } else {
    router.push({ path: '/products', query: { search: query } })
  }
}

const goToProduct = (product) => {
  showDropdown.value = false
  searchQuery.value = ''
  router.push(`/products/${product.id}`)
}

const clearSearch = () => {
  searchQuery.value = ''
  showDropdown.value = false
  searchInput.value?.focus()
}
const focusInput = () => {
  searchInput.value?.focus()
}

defineExpose({
  focusInput
})
</script>
