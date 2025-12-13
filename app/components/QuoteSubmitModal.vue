<script setup>
const {
  isSubmitModalOpen,
  closeSubmitModal,
  customerInfo,
  setCustomerField,
  sendQuote,
  isSubmitting
} = useQuoteCart()
const toast = useToast()

const formValid = computed(() => {
  // Este modal solo se usa para NO logueados
  return customerInfo.value.name?.trim() &&
         customerInfo.value.email?.trim() &&
         customerInfo.value.phone?.trim()
})

const handleSubmit = async () => {
  if (!formValid.value) {
    toast.add({
      title: 'Datos incompletos',
      description: 'Por favor completa todos los campos',
      color: 'red'
    })
    return
  }

  try {
    await sendQuote()
    toast.add({
      title: 'Cotización enviada',
      description: 'Te contactaremos pronto al correo registrado',
      color: 'green',
      timeout: 5000
    })
  } catch (error) {
    console.error('Error enviando cotización:', error)
    toast.add({
      title: 'Error',
      description: error.message || 'No se pudo enviar la cotización',
      color: 'red'
    })
  }
}
</script>

<template>
  <UModal
    v-model="isSubmitModalOpen"
    :ui="{
      wrapper: 'z-[120]',
      overlay: { background: 'bg-black/50' },
      width: 'max-w-md'
    }"
  >
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Enviar Cotización
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Completa tus datos de contacto
            </p>
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            @click="closeSubmitModal"
          />
        </div>
      </template>

      <div class="space-y-4">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre completo <span class="text-red-500">*</span>
            </label>
            <UInput
              :model-value="customerInfo.name"
              placeholder="Tu nombre"
              size="lg"
              @update:model-value="setCustomerField('name', $event)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correo electrónico <span class="text-red-500">*</span>
            </label>
            <UInput
              :model-value="customerInfo.email"
              type="email"
              placeholder="tu@email.com"
              size="lg"
              @update:model-value="setCustomerField('email', $event)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Teléfono <span class="text-red-500">*</span>
            </label>
            <UInput
              :model-value="customerInfo.phone"
              type="tel"
              placeholder="+57 300 123 4567"
              size="lg"
              @update:model-value="setCustomerField('phone', $event)"
            />
          </div>
        </div>

        <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Nuestro equipo revisará tu cotización y te contactará al correo registrado con los detalles y precios.
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center gap-3">
          <UButton
            color="gray"
            variant="outline"
            class="flex-1"
            :disabled="isSubmitting"
            @click="closeSubmitModal"
          >
            Cancelar
          </UButton>
          <UButton
            color="primary"
            class="flex-1 bg-[rgb(var(--theme-color-primary))]"
            icon="i-heroicons-paper-airplane"
            :loading="isSubmitting"
            :disabled="!formValid || isSubmitting"
            @click="handleSubmit"
          >
            Enviar
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

