<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
    <AppHeader />
    
    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-gray-200 dark:border-gray-800 py-8">
      <UContainer>
        <div class="text-center text-gray-500 text-sm">
          &copy; {{ new Date().getFullYear() }} PubliStand. Todos los derechos reservados.
        </div>
      </UContainer>
    </footer>
    
    <UNotifications />
  </div>
</template>
