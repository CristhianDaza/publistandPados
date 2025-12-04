<template>
  <div class="min-h-screen">
    <div v-if="loading" class="h-[600px] flex items-center justify-center bg-background">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary" />
    </div>
    
    <HomeCarousel v-else-if="carouselItems.length > 0" :items="carouselItems" />
    
    <div v-else class="h-[600px] flex flex-col items-center justify-center bg-background text-center px-4">
      <h2 class="text-2xl font-bold mb-4">No hay items en el carrusel</h2>
    </div>

    <HomeInspiration />
    <HomeSocialProof />
    <HomeProcess />

    <UContainer class="py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4 text-primary">
          Bienvenido a PubliStand
        </h1>
        <p class="text-secondary text-lg max-w-2xl mx-auto">
          Tu plataforma moderna para gestionar productos y publicaciones.
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <UCard>
          <template #header>
            <h3 class="font-semibold">Sincronización de Productos</h3>
          </template>
          <p class="text-sm text-secondary mb-4">
            Sincroniza tus productos con la base de datos externa.
          </p>
          <template #footer>
            <UButton @click="syncProducts" :loading="syncLoading" block>
              Sincronizar Productos
            </UButton>
          </template>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const { carouselItems, loading, fetchCarousel } = useCarousel()
const syncLoading = ref(false)
const toast = useToast()

onMounted(() => {
  fetchCarousel()
})

const syncProducts = async () => {
  syncLoading.value = true
  try {
    const res = await $fetch('/api/sync-products', { method: 'POST' })
    toast.add({ title: 'Éxito', description: res.message })
  } catch (error) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Error al sincronizar', color: 'red' })
  } finally {
    syncLoading.value = false
  }
}
</script>
