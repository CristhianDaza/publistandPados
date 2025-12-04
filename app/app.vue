<script setup>
const { fetchActiveTheme } = useTheme()

onMounted(async () => {
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
