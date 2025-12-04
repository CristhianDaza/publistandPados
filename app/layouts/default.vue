<template>
  <div class="min-h-screen flex flex-col bg-background text-text font-sans">
    <AppHeader />
    
    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-secondary/20 py-8">
      <UContainer>
        <div class="text-center text-secondary text-sm">
          &copy; {{ new Date().getFullYear() }} PubliStand. Todos los derechos reservados.
        </div>
      </UContainer>
    </footer>
  </div>
</template>
