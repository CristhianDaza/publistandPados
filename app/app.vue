<script setup>
const { user, loading: authLoading } = useAuth()
const { getProducts: fetchProducts } = useProducts()
const { initApp } = useAppLoading()
const isSyncing = ref(false)

onMounted(async () => {
  await initApp()
})

watch(authLoading, async (newLoading) => {
  if (!newLoading) {
    await checkAndSync()
  }
})

const checkAndSync = async () => {
  try {
    if (user.value?.role === 'admin') {
      const { api1Date, api2Date } = await $fetch('/api/get-sync-status')

      let shouldSync = false
      if (!api1Date && api2Date) {
        shouldSync = true
      } else if (api1Date && api2Date) {
        const date1 = new Date(api1Date)
        const date2 = new Date(api2Date)
        if (date2 > date1) {
          shouldSync = true
        }
      }

      if (shouldSync) {
        isSyncing.value = true
        try {
          await $fetch('/api/sync-products', { method: 'POST' })
          await fetchProducts(true)
        } catch (error) {
          console.error('Sync failed:', error)
        } finally {
          isSyncing.value = false
        }
      } else {
        await fetchProducts()
      }
    } else {
      await fetchProducts()
    }
  } catch (error) {
    console.error('Error checking sync status:', error)
    await fetchProducts()
  }
}
</script>

<template>
  <UApp>
    <GlobalLoader />
    <SyncModal :is-open="isSyncing" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
