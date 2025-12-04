<template>
  <div class="min-h-screen">
    <div v-if="loading" class="h-[600px] flex items-center justify-center bg-background">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary" />
    </div>
    
    <HomeCarousel v-else-if="carouselItems.length > 0" :items="carouselItems" />
    
    <div v-else class="h-[600px] flex flex-col items-center justify-center bg-background text-center px-4">
      <h2 class="text-2xl font-bold mb-4">Cargando...</h2>
    </div>

    <HomeInspiration />
    <HomeSocialProof />
    <HomeProcess />
    <HomeCTA />
  </div>
</template>

<script setup>
const { carouselItems, loading, fetchCarousel } = useCarousel()
const syncLoading = ref(false)
const toast = useToast()

onMounted(() => {
  fetchCarousel()
})

// const syncProducts = async () => {
//   syncLoading.value = true
//   try {
//     const res = await $fetch('/api/sync-products', { method: 'POST' })
//     toast.add({ title: 'Éxito', description: res.message })
//   } catch (error) {
//     toast.add({ title: 'Error', description: error.statusMessage || 'Error al sincronizar', color: 'red' })
//   } finally {
//     syncLoading.value = false
//   }
// }
</script>
