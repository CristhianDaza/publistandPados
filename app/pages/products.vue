<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold">Productos</h1>
    <p class="mt-4">Pagina de productos</p>
    <div class="mt-8 flex gap-4">
      <UButton @click="handleFetchProducts" :loading="loading">
        Traer Productos
      </UButton>
      <UButton @click="syncProducts" :loading="syncLoading" color="gray">
        Sincronizar APIs
      </UButton>
    </div>
  </UContainer>
</template>

<script setup>
const { getProducts, products, loading } = useProducts()
const syncLoading = ref(false)
const toast = useToast()

const handleFetchProducts = async () => {
  await getProducts()
  
  if (products.value && products.value.length > 0) {
    console.log('Products:', products.value)
    const apis = [...new Set(products.value.map(p => p.api).filter(Boolean))]
    console.log('Unique APIs:', apis)

    const categories = [...new Set(products.value.flatMap(p => p.category || []))]
    console.log('Unique Categories:', categories)
  } else {
    console.log('No products found or empty list.')
  }
}

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
