<script setup>
const { isLoading, loadingMessage } = useAppLoading()
const { logo } = useLogo()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div class="relative flex flex-col items-center">
        <div class="mb-8 relative">
          <div class="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
            <ClientOnly>
              <template #default>
                <img
                  v-if="logo?.url"
                  :src="logo.url"
                  alt="Logo"
                  class="w-full h-full object-contain"
                >
                <UIcon v-else name="i-heroicons-sparkles" class="w-12 h-12 text-gray-400" />
              </template>
              <template #fallback>
                <UIcon name="i-heroicons-sparkles" class="w-12 h-12 text-gray-400" />
              </template>
            </ClientOnly>
          </div>
          <div class="absolute -inset-4 rounded-full border-4 border-primary-500/30 border-t-primary-600 animate-spin"/>
        </div>
        <h2 class="text-xl font-medium text-gray-900 dark:text-white animate-pulse">
          {{ loadingMessage }}
        </h2>
        <div class="mt-8 w-48 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div class="h-full bg-primary-500 animate-progress"/>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes progress {
  0% { width: 0; transform: translateX(-100%); }
  50% { width: 50%; }
  100% { width: 100%; transform: translateX(100%); }
}

.animate-progress {
  animation: progress 1.5s infinite ease-in-out;
}
</style>
