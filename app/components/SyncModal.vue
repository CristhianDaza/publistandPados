<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-100 dark:border-gray-700">
      <div class="mb-6 flex justify-center">
        <div class="relative w-20 h-20">
          <div class="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"/>
          <div class="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"/>
        </div>
      </div>

      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Sincronizando Productos
      </h3>

      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Se han detectado actualizaciones recientes. Por favor espere mientras sincronizamos el catálogo...
      </p>

      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2 overflow-hidden">
        <div class="bg-primary-500 h-2.5 rounded-full animate-pulse w-full"/>
      </div>

      <p class="text-xs text-gray-500 dark:text-gray-400">
        No cierre esta ventana ni recargue la página.
      </p>
    </div>
  </div>
</template>
