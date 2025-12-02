<template>
  <header
    class="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/75 dark:bg-gray-900/75 border-b border-gray-200 dark:border-gray-800 transition-all duration-300"
    :class="{ 'shadow-sm': isScrolled }"
  >
    <UContainer class="h-16 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <NuxtLink to="/" class="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
          Publistand Pados
        </NuxtLink>
      </div>
      <nav class="hidden md:flex items-center gap-1">
        <UButton
          v-for="item in menuItems"
          :key="item.id"
          :to="item.to"
          variant="ghost"
          color="gray"
          class="font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          active-class="text-primary-500 bg-primary-50 dark:bg-primary-900/10"
        >
          {{ item.label }}
        </UButton>
      </nav>
      <UButton
        icon="i-heroicons-bars-3"
        color="gray"
        variant="ghost"
        class="md:hidden"
        @click="isOpen = true"
      />
      <USlideover v-model="isOpen">
        <div class="p-4 flex-1 flex flex-col gap-4 bg-white dark:bg-gray-900">
          <div class="flex items-center justify-between mb-4">
            <span class="text-lg font-bold">Menu</span>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              @click="isOpen = false"
            />
          </div>
          
          <nav class="flex flex-col gap-2">
            <UButton
              v-for="item in menuItems"
              :key="item.id"
              :to="item.to"
              variant="ghost"
              color="gray"
              class="justify-start text-lg"
              active-class="text-primary-500 bg-primary-50 dark:bg-primary-900/10"
              @click="isOpen = false"
            >
              {{ item.label }}
            </UButton>
          </nav>
          <div v-if="menuItems.length === 0 && !loading" class="mt-auto">
            <UButton
              block
              color="gray"
              variant="outline"
              @click="handleInitialize"
            >
              Initialize Menu
            </UButton>
          </div>
        </div>
      </USlideover>
    </UContainer>
  </header>
</template>

<script setup>
const { menuItems, fetchMenu, initializeMenu, loading } = useMenu()
const isOpen = ref(false)
const isScrolled = ref(false)
await fetchMenu()
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

const handleInitialize = async () => {
  await initializeMenu()
}
</script>
