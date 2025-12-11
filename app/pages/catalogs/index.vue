<script setup>
import { ref, onMounted } from 'vue'
import { getCatalogs } from '~/services/firebase/catalogsFirebase'

const catalogs = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    catalogs.value = await getCatalogs()
  } catch (error) {
    console.error('Error fetching catalogs:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Catálogos Virtuales',
  meta: [
    { name: 'description', content: 'Explora nuestros catálogos virtuales y descubre nuestros productos.' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-text tracking-tight sm:text-5xl">
          Nuestros Catálogos
        </h1>
        <p class="mt-4 max-w-2xl mx-auto text-xl text-secondary">
          Explora nuestras colecciones y encuentra lo que buscas.
        </p>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"/>
      </div>

      <div v-else-if="catalogs.length === 0" class="text-center py-20">
        <p class="text-xl text-secondary">No hay catálogos disponibles en este momento.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="catalog in catalogs"
          :key="catalog.id"
          class="group relative bg-secondary/5 rounded-2xl border border-secondary/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="aspect-w-3 aspect-h-4 bg-secondary/10 relative overflow-hidden">
            <img
              :src="catalog.image"
              :alt="catalog.title || 'Catálogo'"
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            >
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <a
                :href="catalog.link"
                target="_blank"
                rel="noopener noreferrer"
                class="relative z-20 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg"
              >
                Ver Catálogo
                <svg class="ml-2 -mr-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-text group-hover:text-primary transition-colors">
              {{ catalog.title || 'Catálogo' }}
            </h3>
            <p v-if="catalog.description" class="mt-2 text-secondary line-clamp-2">
              {{ catalog.description }}
            </p>
          </div>
          <a :href="catalog.link" target="_blank" rel="noopener noreferrer" class="absolute inset-0 z-10" aria-label="Ver catálogo"></a>
        </article>
      </div>
    </div>
  </div>
</template>
