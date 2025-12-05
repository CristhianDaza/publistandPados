<script setup>
const colorMode = useColorMode()
const savedPreference = ref(null)

onMounted(() => {
  savedPreference.value = colorMode.preference
  colorMode.preference = 'dark'
})

onUnmounted(() => {
  if (savedPreference.value) {
    colorMode.preference = savedPreference.value
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-900">
    <slot />
  </div>
</template>
