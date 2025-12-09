<template>
  <div class="min-h-screen flex flex-col bg-background text-text font-sans">
    <AppHeader />
    
    <main class="flex-1">
      <slot />
    </main>

    <AppFooter />
    <WhatsAppButton />
    <ScrollToTop />
  </div>
</template>
