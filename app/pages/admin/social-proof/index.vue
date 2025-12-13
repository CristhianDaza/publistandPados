<script setup>
import AdminTable from '~/components/admin/AdminTable.vue'
import { useRouter } from 'vue-router'
import { useSocialProof } from '~/composables/useSocialProof'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Redes Sociales'
})

const router = useRouter()
const { items, loading, fetchSocialProof, removeSocialProofItem } = useSocialProof()
const { deleteImage, getPublicIdFromUrl } = useCloudinary()

const deleteModalOpen = ref(false)
const itemToDelete = ref(null)
const deleting = ref(false)

const columns = [
  { key: 'logo', label: 'Imagen', type: 'image' },
  { key: 'name', label: 'Nombre', type: 'text' },
  { key: 'order', label: 'Orden', type: 'text' }
]

onMounted(() => {
  fetchSocialProof()
  deleteModalOpen.value = false
})

const handleCreate = () => {
  router.push('/admin/social-proof/new')
}

const handleEdit = (item) => {
  router.push(`/admin/social-proof/${item.id}`)
}

const handleDelete = (item) => {
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

    await removeSocialProofItem(itemToDelete.value.id)

    deleteModalOpen.value = false
    itemToDelete.value = null
  } catch (error) {
    console.error('Error removing social proof item:', error)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Logos Clientes</h1>
        <p class="text-slate-400">Gestiona logos de marcas de clientes.</p>
      </div>
      <button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
        @click="handleCreate"
      >
        <UIcon name="i-heroicons-plus" class="w-5 h-5" />
        <span>Agregar Nuevo</span>
      </button>
    </div>

    <div v-if="loading && items.length === 0" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
    </div>

    <AdminTable
      v-else
      :columns="columns"
      :items="items"
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
            <h3 class="text-lg font-bold text-white">¿Eliminar logo de cliente?</h3>
            <p class="text-slate-400 text-sm">Esta acción no se puede deshacer. La imagen también será eliminada.</p>
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
