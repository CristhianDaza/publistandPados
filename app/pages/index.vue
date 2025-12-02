<template>
  <UContainer class="py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
        Bienvenido a PubliStand
      </h1>
      <p class="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
        Tu plataforma moderna para gestionar productos y publicaciones.
      </p>
    </div>

    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <!-- Example Card -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">Sincronización de Productos</h3>
        </template>
        <p class="text-sm text-gray-500 mb-4">
          Sincroniza tus productos con la base de datos externa.
        </p>
        <template #footer>
          <UButton @click="syncProducts" :loading="loading" block>
            Sincronizar Productos
          </UButton>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup>
const loading = ref(false)
const toast = useToast()

const syncProducts = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/sync-products', { method: 'POST' })
    toast.add({ title: 'Éxito', description: res.message })
  } catch (error) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Error al sincronizar', color: 'red' })
  } finally {
    loading.value = false
  }
}
</script>
