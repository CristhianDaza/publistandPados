<script setup>
import AdminTable from '~/components/admin/AdminTable.vue'
import { getCarousel } from '~/services/firebase/carouselFirebase'

definePageMeta({
  layout: 'admin'
})

const loading = ref(true)
const items = ref([])

const columns = [
  { key: 'image', label: 'Image', type: 'image' },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'order', label: 'Order', type: 'text' },
  { key: 'active', label: 'Status', type: 'boolean' }
]

onMounted(async () => {
  try {
    items.value = await getCarousel()
  } catch (error) {
    console.error('Failed to fetch carousel items:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Carousel</h1>
        <p class="text-slate-400">Manage the main carousel images and content.</p>
      </div>
      <button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/20">
        <UIcon name="i-heroicons-plus" class="w-5 h-5" />
        <span>Add New</span>
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
