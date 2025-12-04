<template>
  <section class="relative py-16 md:py-20 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-700/80 to-primary-900/90"></div>
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </div>
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
      <div class="absolute top-20 right-20 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-100"></div>
      <div class="absolute bottom-16 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse delay-200"></div>
      <div class="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse delay-300"></div>
    </div>

    <UContainer class="relative z-10">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">

        <div class="flex-1 text-center lg:text-left space-y-5">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/25 backdrop-blur-sm rounded-full border border-white/40 shadow-md">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span class="text-white font-semibold text-xs">Material POP Personalizado</span>
          </div>

          <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
            ¿Tienes un evento <br />
            <span class="relative inline-block">
              <span class="text-white drop-shadow-xl">urgente?</span>
              <svg class="absolute -bottom-1 left-0 w-full h-2 text-white/30" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C50 3 100 2 150 6C200 10 250 8 298 4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </span>
          </h2>

          <div class="space-y-3">
            <h3 class="text-xl md:text-2xl font-bold text-white/95">
              Creamos tu material POP ideal
            </h3>
            <p class="text-base md:text-lg text-white/85 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Displays, banners, stands, señalética y todo lo que necesites para destacar en tu punto de venta.
              <span class="font-bold text-white">Diseños únicos que venden.</span>
            </p>
          </div>

          <ul class="space-y-2.5 text-white/90 text-left max-w-xl mx-auto lg:mx-0">
            <li class="flex items-center gap-2.5">
              <svg class="w-5 h-5 flex-shrink-0 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="font-medium text-sm md:text-base">Producción rápida y entrega express</span>
            </li>
            <li class="flex items-center gap-2.5">
              <svg class="w-5 h-5 flex-shrink-0 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="font-medium text-sm md:text-base">Diseños personalizados sin costo extra</span>
            </li>
            <li class="flex items-center gap-2.5">
              <svg class="w-5 h-5 flex-shrink-0 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="font-medium text-sm md:text-base">Materiales de alta calidad garantizados</span>
            </li>
          </ul>

          <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-3">
            <UButton
              to="https://wa.me/1234567890"
              target="_blank"
              size="lg"
              class="font-bold bg-green-500 hover:bg-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group border-0"
              icon="i-logos-whatsapp-icon"
            >
              <span class="group-hover:scale-110 transition-transform">Hablar por WhatsApp</span>
            </UButton>

            <UButton
              to="#"
              size="lg"
              color="white"
              variant="outline"
              class="font-bold text-white border-2 border-white hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              icon="i-heroicons-document-arrow-down"
            >
              Catálogo Digital
            </UButton>
          </div>

          <div class="flex flex-wrap gap-6 justify-center lg:justify-start pt-5 border-t border-white/20">
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-black text-white">500+</div>
              <div class="text-xs text-white/80 font-medium">Proyectos Exitosos</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-black text-white">24h</div>
              <div class="text-xs text-white/80 font-medium">Respuesta Rápida</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-black text-white">100%</div>
              <div class="text-xs text-white/80 font-medium">Satisfacción</div>
            </div>
          </div>
        </div>

        <div class="flex-1 relative w-full max-w-sm lg:max-w-md">
          <div class="relative group">
            <div class="absolute inset-0 bg-white/10 rounded-full blur-2xl scale-110 group-hover:scale-125 transition-transform duration-700"></div>
            <div class="absolute inset-0 border-4 border-white/30 rounded-full scale-105 group-hover:scale-110 transition-transform duration-500"></div>
            <div class="absolute -inset-8 bg-gradient-to-r from-white/20 via-white/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
            <div class="relative z-10">
              <img
                src="/images/cta-agent.png"
                alt="Expertos en Material POP - PubliStand"
                class="w-full h-auto drop-shadow-2xl transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-1 filter brightness-105"
              />
            </div>

            <div class="absolute -top-3 -right-3 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-xl animate-bounce">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </UContainer>
  </section>
</template>

<script setup>
</script>

<style scoped>
.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}
</style>
