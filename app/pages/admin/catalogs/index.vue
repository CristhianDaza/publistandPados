<script setup>
import AdminTable from '~/components/admin/AdminTable.vue'
import { getCatalogs } from '~/services/firebase/catalogsFirebase'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Catálogos'
})

const loading = ref(true)
const items = ref([])

const columns = [
  { key: 'image', label: 'Imagen de Portada', type: 'image' },
  { key: 'title', label: 'Título', type: 'text' },
  { key: 'description', label: 'Descripción', type: 'text' },
  { key: 'file', label: 'Enlace PDF', type: 'link' },
  { key: 'order', label: 'Orden', type: 'text' }
]

onMounted(async () => {
  try {
    items.value = await getCatalogs()
  } catch (error) {
    console.error('Failed to fetch catalogs:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Catálogos</h1>
        <p class="text-slate-400">Gestiona tus catálogos de productos.</p>
      </div>
      <button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/20">
        <UIcon name="i-heroicons-plus" class="w-5 h-5" />
        <span>Agregar Nuevo</span>
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
    </div>

    <AdminTable
      v-else
      :columns="columns"
      :items="items"
    />
  </div>
</template>
