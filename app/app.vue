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
      const {
        api1DateMs,
        api2DateMs,
        syncRecoveryV2Done
      } = await $fetch('/api/get-sync-status')

      const validApi1DateMs = typeof api1DateMs === 'number' && Number.isFinite(api1DateMs) ? api1DateMs : null
      const validApi2DateMs = typeof api2DateMs === 'number' && Number.isFinite(api2DateMs) ? api2DateMs : null

      const shouldForceRecoverySync = syncRecoveryV2Done !== true
      const shouldSyncByDate = validApi2DateMs !== null && (validApi1DateMs === null || validApi2DateMs > validApi1DateMs)
      const shouldSyncFallback = validApi1DateMs === null && validApi2DateMs === null

      const shouldSync = shouldForceRecoverySync || shouldSyncByDate || shouldSyncFallback

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
