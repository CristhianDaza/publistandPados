<script setup>
import AdminTable from '~/components/admin/AdminTable.vue'
import { useRouter } from 'vue-router'
import { useUsers } from '~/composables/useUsers'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Usuarios'
})

const router = useRouter()
const { users, loading, fetchUsers, deleteUser, sendPasswordReset } = useUsers()

const deleteModalOpen = ref(false)
const itemToDelete = ref(null)
const deleting = ref(false)

const columns = [
  { key: 'name', label: 'Nombre', type: 'text' },
  { key: 'email', label: 'Correo', type: 'text' },
  { key: 'role', label: 'Rol', type: 'text' },
  { key: 'priceIncrease', label: 'Incremento %', type: 'text' },
  { key: 'active', label: 'Estado', type: 'boolean' }
]

onMounted(async () => {
  await fetchUsers()
  deleteModalOpen.value = false
})

const handleCreate = () => {
  router.push('/admin/users/new')
}

const handleEdit = (item) => {
  router.push(`/admin/users/${item.id}`)
}

const handleDelete = (item) => {
  itemToDelete.value = item
  deleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  deleting.value = true
  try {
    await deleteUser(itemToDelete.value.id)
    deleteModalOpen.value = false
    itemToDelete.value = null
  } catch (error) {
    console.error('Error removing user:', error)
  } finally {
    deleting.value = false
  }
}

const handleSendReset = async (item) => {
  try {
    await sendPasswordReset(item.email)
  } catch (error) {
    console.error('Error sending password reset email:', error)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Usuarios</h1>
        <p class="text-slate-400">Gestiona los usuarios registrados.</p>
      </div>
      <button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
        @click="handleCreate"
      >
        <UIcon name="i-heroicons-plus" class="w-5 h-5" />
        <span>Agregar Nuevo</span>
      </button>
    </div>

    <div v-if="loading && users.length === 0" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
    </div>

    <AdminTable
      v-else
      :columns="columns"
      :items="users"
      @edit="handleEdit"
      @delete="handleDelete"
      @reset-password="handleSendReset"
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
            <h3 class="text-lg font-bold text-white">¿Eliminar usuario?</h3>
            <p class="text-slate-400 text-sm">Esta acción no se puede deshacer.</p>
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
