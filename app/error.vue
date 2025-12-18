
<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

const statusCode = computed(() => props.error?.statusCode || 500)

const errorIcon = computed(() => {
  switch (statusCode.value) {
    case 404:
      return 'i-heroicons-magnifying-glass-circle'
    case 500:
      return 'i-heroicons-exclamation-triangle'
    case 403:
      return 'i-heroicons-no-symbol'
    default:
      return 'i-heroicons-exclamation-circle'
  }
})

const errorTitle = computed(() => {
  switch (statusCode.value) {
    case 404:
      return 'Página no encontrada'
    case 500:
      return 'Error del servidor'
    case 503:
      return 'Servicio no disponible'
    case 403:
      return 'Acceso denegado'
    default:
      return 'Algo salió mal'
  }
})

const errorDescription = computed(() => {
  switch (statusCode.value) {
    case 404:
      return 'Lo sentimos, la página que buscas no existe o ha sido movida. Verifica la URL o explora nuestros productos.'
    case 500:
      return 'Estamos experimentando problemas técnicos. Por favor, intenta de nuevo en unos momentos.'
    case 503:
      return 'El servicio está temporalmente fuera de línea por mantenimiento. Volveremos pronto.'
    case 403:
      return 'No tienes permisos para acceder a esta página. Si crees que esto es un error, contáctanos.'
    default:
      return 'Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y estamos trabajando para solucionarlo.'
  }
})

const handleError = () => {
  clearError({ redirect: '/' })
}

const retry = () => {
  clearError({ redirect: props.error?.url || '/' })
}

const openWhatsApp = () => {
  window.open('https://wa.me/573142847632', '_blank')
}

// Set page metadata
useHead({
  title: `${statusCode.value} - ${errorTitle.value}`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<template>
  <UApp>
    <div class="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div class="max-w-2xl w-full text-center">
        <div class="mb-8 flex justify-center">
          <div class="relative">
            <div 
              class="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"
              :style="{ width: '200px', height: '200px' }"
            ></div>
            <UIcon 
              :name="errorIcon" 
              class="w-32 h-32 text-primary relative z-10 animate-bounce-slow"
            />
          </div>
        </div>
        <h1 class="text-8xl md:text-9xl font-bold text-primary mb-4 tracking-tight">
          {{ statusCode }}
        </h1>
        <h2 class="text-3xl md:text-4xl font-bold text-text mb-4">
          {{ errorTitle }}
        </h2>
        <p class="text-lg text-text/70 mb-8 max-w-md mx-auto">
          {{ errorDescription }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <UButton
            size="lg"
            color="primary"
            variant="solid"
            icon="i-heroicons-home"
            @click="handleError"
            class="cursor-pointer min-w-[200px]"
          >
            Volver al inicio
          </UButton>

          <UButton
            v-if="statusCode === 404"
            size="lg"
            color="primary"
            variant="outline"
            icon="i-heroicons-magnifying-glass"
            to="/products"
            class="cursor-pointer min-w-[200px]"
          >
            Ver productos
          </UButton>

          <UButton
            v-else
            size="lg"
            color="primary"
            variant="outline"
            icon="i-heroicons-arrow-path"
            @click="retry"
            class="cursor-pointer min-w-[200px]"
          >
            Intentar nuevamente
          </UButton>
        </div>

        <div class="mt-12 pt-8 border-t border-text/10">
          <p class="text-sm text-text/60 mb-4">
            ¿Necesitas ayuda? Contáctanos
          </p>
          <div class="flex justify-center gap-4">
            <UButton
              size="sm"
              color="gray"
              variant="ghost"
              icon="i-heroicons-phone"
              to="/contact"
            >
              Contacto
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UApp>
</template>

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}
</style>
