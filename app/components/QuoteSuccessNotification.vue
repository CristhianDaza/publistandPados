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
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showNotification"
        class="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <div class="bg-slate-900 border border-green-500/30 rounded-xl p-8 w-full max-w-md shadow-2xl">
          <div class="flex flex-col items-center text-center gap-4">
            <div class="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
              <UIcon name="i-heroicons-check" class="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 class="text-2xl font-bold text-white mb-2">
                ¡Cotización enviada!
              </h3>
              <p class="text-sm text-slate-300 max-w-sm">
                Tu solicitud ha sido recibida. Nuestro equipo revisará la cotización y te contactará pronto.
              </p>
            </div>
            <div class="mt-6 flex flex-col sm:flex-row sm:justify-center sm:gap-10 w-full text-sm font-medium">
              <button
                type="button"
                class="text-green-400 hover:text-green-300 cursor-pointer mb-2 sm:mb-0"
                @click="handleViewQuote"
              >
                Ver detalles de la cotización
              </button>
              <button
                type="button"
                class="text-slate-200 hover:text-white cursor-pointer"
                @click="handleClose"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
