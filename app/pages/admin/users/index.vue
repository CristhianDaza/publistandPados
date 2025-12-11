<script setup>
import AdminTable from '~/components/admin/AdminTable.vue'
import { getUsers } from '~/services/firebase/usersFirebase'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Usuarios'
})

const loading = ref(true)
const items = ref([])

const columns = [
  { key: 'name', label: 'Nombre', type: 'text' },
  { key: 'email', label: 'Correo', type: 'text' },
  { key: 'role', label: 'Rol', type: 'text' },
  { key: 'active', label: 'Estado', type: 'boolean' }
]

onMounted(async () => {
  try {
    items.value = await getUsers()
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Usuarios</h1>
        <p class="text-slate-400">Ver lista de usuarios registrados.</p>
      </div>
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
