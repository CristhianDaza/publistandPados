<script setup>
import AdminTable from '~/components/admin/AdminTable.vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Carrusel'
})

const router = useRouter()
const { carouselItems, loading, fetchCarousel, deleteItem } = useCarousel()
const { deleteImage, getPublicIdFromUrl } = useCloudinary()

const deleteModalOpen = ref(false)
const itemToDelete = ref(null)
const deleting = ref(false)
const columns = [
  { key: 'image', label: 'Imagen', type: 'image' },
  { key: 'title', label: 'Título', type: 'text' },
  { key: 'description', label: 'Descripción', type: 'text' },
  { key: 'order', label: 'Orden', type: 'text' },
  { key: 'active', label: 'Estado', type: 'boolean' },
  { key: 'link', label: 'Link', type: 'link' }
]

onMounted(() => {
  fetchCarousel()
  deleteModalOpen.value = false
})

const handleCreate = () => {
  router.push('/admin/carousel/new')
}

const handleEdit = (item) => {
  router.push(`/admin/carousel/${item.id}`)
}

const handleDelete = (item) => {
  console.log('Opening delete modal for:', item)
  itemToDelete.value = item
  deleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  deleting.value = true
  try {
    if (itemToDelete.value.image) {
      const publicId = getPublicIdFromUrl(itemToDelete.value.image)
      if (publicId) {
        await deleteImage(publicId)
      }
    }

    await deleteItem(itemToDelete.value.id)
    
    deleteModalOpen.value = false
    itemToDelete.value = null
  } catch (error) {
    console.error('Error removing item:', error)
    alert('Error al eliminar el elemento')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Carrusel</h1>
        <p class="text-slate-400">Gestiona las imágenes y el contenido del carrusel principal.</p>
      </div>
      <button 
        @click="handleCreate"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
      >
        <UIcon name="i-heroicons-plus" class="w-5 h-5" />
        <span>Agregar Nuevo</span>
      </button>
    </div>

    <div v-if="loading && carouselItems.length === 0" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
    </div>

    <AdminTable
      v-else
      :columns="columns"
      :items="carouselItems"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <div 
      v-if="deleteModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">¿Eliminar elemento?</h3>
            <p class="text-slate-400 text-sm">Esta acción no se puede deshacer. La imagen también será eliminada del servidor.</p>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <UButton
            color="gray"
            variant="ghost"
            label="Cancelar"
            class="text-slate-400 hover:text-white cursor-pointer"
            @click="deleteModalOpen = false"
          />
          <UButton
            color="red"
            variant="solid"
            label="Sí, eliminar"
            :loading="deleting"
            class="cursor-pointer"
            @click="confirmDelete"
          />
        </div>
      </div>
    </div>
  </div>
</template>
