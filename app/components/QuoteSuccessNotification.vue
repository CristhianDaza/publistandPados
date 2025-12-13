<script setup>
const { lastQuoteId } = useQuoteCart()
const router = useRouter()

const showNotification = ref(false)

watch(lastQuoteId, (newId) => {
  if (newId) {
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
      lastQuoteId.value = null
    }, 8000)
  }
})

const handleViewQuote = () => {
  if (lastQuoteId.value) {
    router.push(`/quotes/${lastQuoteId.value}`)
    showNotification.value = false
    lastQuoteId.value = null
  }
}

const handleClose = () => {
  showNotification.value = false
  lastQuoteId.value = null
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="showNotification"
        class="fixed bottom-4 right-4 z-[100] max-w-md"
      >
        <div class="bg-white dark:bg-gray-800 border border-green-500/50 rounded-xl shadow-2xl p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
                ¡Cotización Enviada!
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Tu solicitud ha sido recibida. Nuestro equipo te contactará pronto.
              </p>
              <div class="flex items-center gap-2">
                <UButton
                  size="sm"
                  color="primary"
                  @click="handleViewQuote"
                >
                  Ver Detalles
                </UButton>
                <UButton
                  size="sm"
                  color="gray"
                  variant="ghost"
                  @click="handleClose"
                >
                  Cerrar
                </UButton>
              </div>
            </div>
            <button
              class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              @click="handleClose"
            >
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

