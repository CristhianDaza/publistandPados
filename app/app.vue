<script setup>
const { user, loading: authLoading } = useAuth()
const { getProducts: fetchProducts } = useProducts()
const { initApp } = useAppLoading()
const isSyncing = ref(false)
const isCheckingSync = ref(false)
const hasLoadedProducts = ref(false)

const SYNC_TIME_ZONE = 'America/Bogota'
const HOURLY_RETRY_MS = 60 * 60 * 1000
let syncRetryTimer = null

const normalizeDateMs = (value) => {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

const getDayKey = (value) => {
  if (value === null || value === undefined) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SYNC_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

const clearSyncRetryTimer = () => {
  if (syncRetryTimer) {
    clearInterval(syncRetryTimer)
    syncRetryTimer = null
  }
}

const ensureSyncRetryTimer = (shouldRetry) => {
  if (!shouldRetry) {
    clearSyncRetryTimer()
    return
  }

  if (!syncRetryTimer) {
    syncRetryTimer = setInterval(() => {
      void checkAndSync()
    }, HOURLY_RETRY_MS)
  }
}

onMounted(async () => {
  await initApp()
})

onUnmounted(() => {
  clearSyncRetryTimer()
})

watch(authLoading, async (loading) => {
  if (!loading) {
    await checkAndSync({ loadProductsIfNeeded: true })
  }
})

watch(() => user.value?.role, async (role, previousRole) => {
  if (authLoading.value || role === previousRole) return
  await checkAndSync({ loadProductsIfNeeded: true })
})

const checkAndSync = async ({ loadProductsIfNeeded = false } = {}) => {
  if (isCheckingSync.value) return
  isCheckingSync.value = true

  try {
    if (user.value?.role !== 'admin') {
      clearSyncRetryTimer()
      if (loadProductsIfNeeded || !hasLoadedProducts.value) {
        await fetchProducts()
        hasLoadedProducts.value = true
      }
      return
    }

    const {
      api1DateMs,
      api2DateMs,
      syncRecoveryV2Done
    } = await $fetch('/api/get-sync-status')

    const validApi1DateMs = normalizeDateMs(api1DateMs)
    const validApi2DateMs = normalizeDateMs(api2DateMs)
    const todayKey = getDayKey(Date.now())
    const api1DayKey = getDayKey(validApi1DateMs)
    const api2DayKey = getDayKey(validApi2DateMs)

    const shouldForceRecoverySync = syncRecoveryV2Done !== true
    const shouldSyncFallback = validApi1DateMs === null && validApi2DateMs === null
    const isApi2UpdatedToday = api2DayKey !== null && api2DayKey === todayKey
    const isApi1SyncedToday = api1DayKey !== null && api1DayKey === todayKey
    const needsSyncToday = isApi2UpdatedToday && !isApi1SyncedToday

    const shouldSync = shouldForceRecoverySync || needsSyncToday || shouldSyncFallback
    const shouldRetryHourly = shouldForceRecoverySync || shouldSyncFallback || !isApi2UpdatedToday || needsSyncToday

    if (shouldSync) {
      isSyncing.value = true
      try {
        await $fetch('/api/sync-products', { method: 'POST' })
        await fetchProducts(true)
        hasLoadedProducts.value = true
      } catch (error) {
        console.error('Sync failed:', error)
      } finally {
        isSyncing.value = false
      }
    } else if (loadProductsIfNeeded || !hasLoadedProducts.value) {
      await fetchProducts()
      hasLoadedProducts.value = true
    }

    ensureSyncRetryTimer(shouldRetryHourly)
  } catch (error) {
    console.error('Error checking sync status:', error)
    if (loadProductsIfNeeded || !hasLoadedProducts.value) {
      await fetchProducts()
      hasLoadedProducts.value = true
    }
  } finally {
    isCheckingSync.value = false
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
