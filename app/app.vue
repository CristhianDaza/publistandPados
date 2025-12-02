<template>
  <div>
    <h1>publistandPados</h1>
    <UButton @click="syncProducts" :loading="loading">Sync Products</UButton>
  </div>
</template>

<script setup>
const loading = ref(false)
const toast = useToast()

const syncProducts = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/sync-products', { method: 'POST' })
    toast.add({ title: 'Success', description: res.message })
  } catch (error) {
    toast.add({ title: 'Error', description: error.statusMessage || 'Failed to sync', color: 'red' })
  } finally {
    loading.value = false
  }
}
</script>
