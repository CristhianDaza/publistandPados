<script setup>
import { filterProducts } from '~/utils/search'

const route = useRoute()
const router = useRouter()
const { getProducts, products, loading } = useProducts()
const { setPageSeo } = useSeo()

onMounted(() => {
  getProducts()
})

const selectedCategory = computed(() => route.query.category)
const searchQuery = computed(() => route.query.search)

const pageTitle = computed(() => {
  if (searchQuery.value) return 'Resultados de Búsqueda'
  if (selectedCategory.value) return selectedCategory.value
  return 'Nuestras Categorías'
})

const seoTitle = computed(() => {
  if (searchQuery.value) return `Búsqueda: ${searchQuery.value}`
  if (selectedCategory.value) return `${selectedCategory.value} - Catálogo`
  return 'Catálogo de Productos'
})

const seoDescription = computed(() => {
  if (searchQuery.value) {
    return `Resultados de búsqueda para "${searchQuery.value}" en artículos promocionales.`
  }
  if (selectedCategory.value) {
    return `Explora nuestra colección de ${selectedCategory.value}. Artículos promocionales de alta calidad.`
  }
  return 'Explora nuestro catálogo completo de artículos promocionales. Bolígrafos, mugs, tecnología, bolsos y más.'
})

watchEffect(() => {
  setPageSeo({
    title: seoTitle.value,
    description: seoDescription.value
  })
})

const categoriasCards = [
  {
    titulo: "Bolígrafos y Escritura",
    icono: "i-heroicons-pencil",
    items: [
      "Bolígrafos plásticos",
      "Bolígrafos metálicos",
      "Bolígrafos ecológicos",
      "Boligrafos en aluminio",
      "Bolígrafos con resaltador",
      "Bolígrafo USB",
      "Resaltadores",
      "Lápices, colores y crayolas",
      "Portaminas"
    ]
  },
  {
    titulo: "Mugs, Vasos y Bebidas",
    icono: "i-heroicons-beaker",
    items: [
      "Mugs y vasos metálicos",
      "Mugs de cerámica",
      "Mug ceramica",
      "Vasos plásticos y ecológicos",
      "Botellas en acero",
      "Botellas en aluminio",
      "Botellas deportivas plásticas",
      "Termos",
      "Vacuum"
    ]
  },
  {
    titulo: "Paraguas e Impermeables",
    icono: "i-heroicons-cloud",
    items: [
      "Paraguas",
      "Paraguas 21\"",
      "Paraguas Mini",
      "Paraguas Fashion",
      "Paraguas Golf",
      "Paraguas 23\"",
      "Paraguas 30\"",
      "Impermeables"
    ]
  },
  {
    titulo: "Tecnología y Audio",
    icono: "i-heroicons-speaker-wave",
    items: [
      "Audífonos",
      "Altavoz",
      "Pilas power bank",
      "Cables y adaptadores de carga",
      "Usb",
      "Mouse pad",
      "Accesorios para móviles"
    ]
  },
  {
    titulo: "Bolsos y Maletines",
    icono: "i-heroicons-briefcase",
    items: [
      "Morrales",
      "Maletines",
      "Maletines deportivos",
      "Trolley",
      "Neveras",
      "Canguros",
      "Manos libres",
      "Tula, morral",
      "Bolsos de mano",
      "Maletas y estuches de viaje"
    ]
  },
  {
    titulo: "Oficina y Negocios",
    icono: "i-heroicons-building-office",
    items: [
      "Libretas",
      "Libretas ecológicas",
      "Libretas plásticas",
      "Memos y adhesivos",
      "Calculadoras",
      "Cintas métricas",
      "Identificadores - oficina",
      "Tarjeteros",
      "Portafolios",
      "Accesorios de escritorio"
    ]
  },
  {
    titulo: "Hogar y Herramientas",
    icono: "i-heroicons-wrench-screwdriver",
    items: [
      "Herramientas",
      "Linternas",
      "Llaveros",
      "Llaveros metálicos",
      "Accesorios de cocina",
      "Set de BBQ",
      "Bar",
      "Relojes",
      "Accesorios de hogar"
    ]
  },
  {
    titulo: "Salud, Belleza y Deportes",
    icono: "i-heroicons-heart",
    items: [
      "Cuidado personal",
      "Salud y Belleza",
      "Limas y manicure",
      "Gafas",
      "Deportes",
      "Fútbol",
      "Bicicleta",
      "Tiempo Libre",
      "Gorras"
    ]
  },
  {
    titulo: "Ecológicos y Materiales",
    icono: "i-heroicons-globe-alt",
    items: [
      "Bambú",
      "Corcho",
      "Paja de trigo",
      "Elaborado de café",
      "Aluminio reciclado",
      "Cartón reciclado"
    ]
  }
];

const filteredProducts = computed(() => {
  if (searchQuery.value) {
    return filterProducts(products.value, searchQuery.value)
  }

  if (!selectedCategory.value) return []

  const targetCategory = selectedCategory.value.toLowerCase()

  const categoryMatches = products.value.filter(product => {
    if (!product.category || !Array.isArray(product.category)) return false
    return product.category.some(cat => cat.toLowerCase() === targetCategory)
  })

  const searchMatches = filterProducts(products.value, selectedCategory.value)

  const combined = new Map()
  categoryMatches.forEach(p => combined.set(p.id, p))
  searchMatches.forEach(p => combined.set(p.id, p))

  return Array.from(combined.values())
})

const currentPage = ref(1)
const itemsPerPage = ref(16)

onMounted(() => {
  if (route.query.limit) {
    const limit = parseInt(route.query.limit)
    if (!isNaN(limit) && (itemsPerPageOptions.some(opt => opt.value === limit) || limit === -1)) {
      itemsPerPage.value = limit
    }
  }

  if (route.query.page) {
    const page = parseInt(route.query.page)
    if (!isNaN(page) && page > 0) {
      currentPage.value = page
    }
  }
})

watch(currentPage, (newPage) => {
  updateUrl({ page: newPage })
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

watch(itemsPerPage, (newLimit) => {
  currentPage.value = 1
  updateUrl({ limit: newLimit, page: 1 })
})

const updateUrl = (params) => {
  router.push({
    query: {
      ...route.query,
      ...params
    }
  })
}

watch(() => route.query.page, (newPage) => {
  const page = parseInt(newPage)
  if (!isNaN(page) && page > 0) {
    currentPage.value = page
  } else {
    currentPage.value = 1
  }
})

watch(() => route.query.limit, (newLimit) => {
  const limit = parseInt(newLimit)
  if (!isNaN(limit) && (itemsPerPageOptions.some(opt => opt.value === limit) || limit === -1)) {
    itemsPerPage.value = limit
  } else {
    itemsPerPage.value = 16
  }
})

const itemsPerPageOptions = [
  { label: '16 por pág', value: 16 },
  { label: '32 por pág', value: 32 },
  { label: '48 por pág', value: 48 },
  { label: '64 por pág', value: 64 },
  { label: 'Ver todos', value: -1 }
]

const totalProducts = computed(() => filteredProducts.value.length)

const totalPages = computed(() => {
  if (itemsPerPage.value === -1) return 1
  return Math.ceil(totalProducts.value / itemsPerPage.value)
})

const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  range.forEach(i => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

const paginatedProducts = computed(() => {
  if (itemsPerPage.value === -1) return filteredProducts.value

  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const startItem = computed(() => {
  if (totalProducts.value === 0) return 0
  return (currentPage.value - 1) * (itemsPerPage.value === -1 ? totalProducts.value : itemsPerPage.value) + 1
})

const endItem = computed(() => {
  if (itemsPerPage.value === -1) return totalProducts.value
  return Math.min(currentPage.value * itemsPerPage.value, totalProducts.value)
})

watch(selectedCategory, () => {
  currentPage.value = 1
})

const selectCategory = (categoryItem) => {
  router.push({ query: { category: categoryItem } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearFilters = () => {
  router.push({ query: { category: undefined, search: undefined, page: undefined, limit: undefined } })
}
</script>

<template>
  <UContainer class="py-12">
    <div class="max-w-7xl mx-auto">

      <div class="text-center mb-12">
        <span class="text-primary font-bold tracking-wider uppercase text-sm">Catálogo</span>
        <h2 class="text-3xl md:text-4xl font-bold mt-2 mb-4">
          {{ pageTitle }}
        </h2>
        <p v-if="searchQuery" class="text-gray-500 dark:text-gray-400 mb-2">
          Resultados para: "{{ searchQuery }}"
        </p>
        <div class="w-24 h-1 bg-primary mx-auto rounded-full"/>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary" />
      </div>
      <div v-else-if="selectedCategory || searchQuery" class="animate-fade-in">
        <div class="mb-8 flex items-center justify-between">
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="gray"
            class="hover:text-primary dark:hover:text-primary hover:bg-transparent dark:hover:bg-transparent cursor-pointer transition-colors"
            @click="clearFilters"
          >
            {{ searchQuery ? 'Limpiar búsqueda' : 'Volver a Categorías' }}
          </UButton>
          <span class="text-sm text-gray-500">{{ filteredProducts.length }} productos encontrados</span>
        </div>

        <div v-if="filteredProducts.length > 0">
          <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-secondary/5 p-4 rounded-xl border border-secondary/20">
            <div class="flex items-center gap-3">
              <span class="text-sm text-secondary font-medium">Mostrar:</span>
              <div class="relative">
                <select
                  v-model="itemsPerPage"
                  :disabled="totalProducts <= 16"
                  class="appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-1.5 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option v-for="option in itemsPerPageOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4">
               <span class="text-sm text-secondary">
                 <span class="hidden sm:inline">Página</span> <span class="font-bold text-secondary">{{ currentPage }}</span> de <span class="font-bold text-secondary">{{ totalPages }}</span>
                 <span class="hidden sm:inline mx-2">-</span>
                 <span class="text-xs sm:text-sm">Mostrando {{ startItem }} - {{ endItem }} de {{ totalProducts }}</span>
               </span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
            />
          </div>

          <div v-if="totalPages > 1" class="flex justify-center mt-8 gap-2">
            <UButton
              icon="i-heroicons-chevron-left"
              color="gray"
              variant="ghost"
              :disabled="currentPage === 1"
              class="cursor-pointer hover:scale-105 transition-transform w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="currentPage--"
            />

            <button
              v-for="page in displayedPages"
              :key="page"
              :class="[
                'cursor-pointer hover:scale-105 w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200',
                page === currentPage
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : typeof page === 'number'
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-gray-400 cursor-default'
              ]"
              :disabled="typeof page !== 'number'"
              @click="typeof page === 'number' ? currentPage = page : null"
            >
              {{ page }}
            </button>

            <UButton
              icon="i-heroicons-chevron-right"
              color="gray"
              variant="ghost"
              :disabled="currentPage === totalPages"
              class="cursor-pointer hover:scale-105 transition-transform w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="currentPage++"
            />
          </div>
        </div>

        <div v-else class="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <UIcon name="i-heroicons-face-frown" class="w-16 h-16 text-gray-400 mb-4 mx-auto" />
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No se encontraron productos</h3>
          <p class="text-gray-500">Intenta con otra categoría o regresa al inicio.</p>
          <UButton class="mt-6 px-8 py-3 cursor-pointer hover:scale-105 transition-transform" @click="clearFilters">Ver todas las categorías</UButton>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
        <div
          v-for="card in categoriasCards"
          :key="card.titulo"
          class="group relative bg-secondary/5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-secondary/20 hover:-translate-y-2"
        >
          <div class="absolute -top-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 rotate-12">
            <UIcon :name="card.icono" class="w-48 h-48 text-primary" />
          </div>

          <div class="p-8 relative z-10 h-full flex flex-col">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
              <UIcon :name="card.icono" class="w-7 h-7 text-primary group-hover:text-white transition-colors" />
            </div>

            <h3 class="text-xl font-bold mb-4 text-secondary group-hover:text-primary transition-colors">
              {{ card.titulo }}
            </h3>

            <ul class="space-y-3 flex-grow">
              <li
                v-for="item in card.items"
                :key="item"
                class="flex items-start text-sm text-secondary hover:text-primary cursor-pointer group-hover/item:translate-x-1 transition-all duration-300 p-1 -ml-1 rounded-md hover:bg-primary/5"
                @click="selectCategory(item)"
              >
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 mr-3 text-primary/60 flex-shrink-0 mt-0.5" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </UContainer>
</template>
