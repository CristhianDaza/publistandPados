<script setup>
const { fetchActiveTheme } = useTheme()
const { initAuth } = useAuth()

onMounted(async () => {
  initAuth()
  await fetchActiveTheme()
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
