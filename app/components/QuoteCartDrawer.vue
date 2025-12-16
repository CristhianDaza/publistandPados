<script setup>
const { items, isCartOpen, closeCart, removeItem, clearCart, openSubmitFlow, totalUnits, openConfigurator, isSubmitModalOpen, closeSubmitModal, customerInfo, setCustomerField, sendQuote, isSubmitting } = useQuoteCart()
const { user } = useAuth()
const toast = useToast()
const infoBadge = 'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-[rgba(var(--theme-color-secondary),0.1)] dark:bg-[rgba(var(--theme-color-secondary),0.15)] text-gray-700 dark:text-gray-300'
const cardBg = 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20'

const empty = computed(() => !items.value.length)

const contactFormValid = computed(() => {
  if (user.value) return true
  return customerInfo.value.name?.trim() &&
    customerInfo.value.email?.trim() &&
    customerInfo.value.phone?.trim()
})

const handleCloseCart = () => {
  closeCart()
  if (isSubmitModalOpen.value) {
    closeSubmitModal()
  }
}

const handleRemove = (id) => {
  removeItem(id)
  toast.add({ title: 'Producto eliminado de la cotización', color: 'gray' })
}

const handleClear = () => {
  clearCart()
  toast.add({ title: 'Cotización limpia', color: 'gray' })
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

const handleSubmit = async () => {
  if (!items.value.length) {
    toast.add({
      title: 'Cotización vacía',
      description: 'Agrega productos antes de enviar la cotización',
      color: 'gray'
    })
    return
  }

  try {
    if (!user.value) {
      if (!contactFormValid.value) {
        toast.add({
          title: 'Datos incompletos',
          description: 'Por favor completa nombre, correo y teléfono para enviar la cotización',
          color: 'red'
        })
        return
      }
      await sendQuote()
      toast.add({
        title: 'Cotización enviada',
        description: 'Te contactaremos pronto al correo registrado',
        color: 'green',
        timeout: 5000
      })
      return
    }

    const result = await openSubmitFlow()

    if (user.value && result) {
      toast.add({
        title: 'Cotización enviada',
        description: 'Te contactaremos pronto al correo registrado',
        color: 'green',
        timeout: 5000
      })
    }
  } catch (error) {
    console.error('Error en flujo de envío de cotización:', error)
    toast.add({
      title: 'Error',
      description: error.message || 'No se pudo enviar la cotización',
      color: 'red'
    })
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="slide">
      <div
        v-if="isCartOpen"
        class="fixed inset-0 z-[110] flex"
      >
        <div class="flex-1 bg-black/50 backdrop-blur-sm" @click="handleCloseCart" />
        <div class="w-full max-w-lg h-full flex flex-col bg-[rgb(var(--theme-color-background))] border-l border-gray-200 dark:border-gray-700 shadow-[0_30px_120px_-70px_rgba(15,23,42,0.8)]">
          <header class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Cotización</p>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Carrito</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ items.length }} productos • {{ totalUnits }} unidades</p>
              </div>
              <button class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer transition-colors" @click="closeCart">
                <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
              </button>
            </div>
          </header>

          <div v-if="empty" class="flex-1 flex flex-col items-center justify-center text-center px-6">
            <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
            <p class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tu cotización está vacía</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Agrega productos y configura cantidades para enviar la solicitud.</p>
          </div>

          <div v-else class="flex-1 overflow-y-auto space-y-5 p-6 custom-scroll">
            <div
              v-for="item in items"
              :key="item.id"
              class="p-4 gap-4 grid grid-cols-[auto,1fr] items-start"
              :class="cardBg"
            >
              <img :src="item.productImage" :alt="item.productName" class="w-24 h-24 object-cover rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm" >
              <div class="space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p :class="infoBadge" class="mb-1">{{ item.productCategory?.[0] || 'Producto' }}</p>
                    <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ item.productName }}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ item.productId }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <UButton icon="i-heroicons-pencil" variant="ghost" size="xs" color="gray" class="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" @click="openConfigurator(item.productData, item)">
                      Editar
                    </UButton>
                    <UButton icon="i-heroicons-trash" color="red" variant="ghost" size="xs" class="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" @click="handleRemove(item.id)" />
                  </div>
                </div>

                <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm p-3">
                  <p class="text-xs uppercase mb-2 tracking-[0.25em] text-gray-500 dark:text-gray-400">Detalles</p>
                  <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li v-for="entry in item.entries" :key="entry.id" class="flex items-center justify-between">
                      <span>{{ entry.colorName }}</span>
                      <span class="font-semibold">{{ entry.quantity }} und</span>
                    </li>
                  </ul>
                  <div class="mt-3 text-xs flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Marcado: <b>{{ item.marked ? 'Sí' : 'No' }}</b></span>
                    <span>Colores: <b>{{ item.colorCount }}</b></span>
                  </div>
                </div>

                <p v-if="item.notes" class="text-sm text-gray-700 dark:text-gray-300">Nota: {{ item.notes }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Agregado el {{ formatDate(item.createdAt) }}</p>
              </div>
            </div>
          </div>

          <footer v-if="!empty" class="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div v-if="!user" class="space-y-4">
              <p class="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Datos de contacto
              </p>
              <div class="space-y-5">
                <div>
                  <label class="block text-gray-900 dark:text-white font-semibold text-sm mb-2">
                    Nombre completo <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    :model-value="customerInfo.name"
                    placeholder="Ej: Juan Pérez"
                    size="xl"
                    :ui="{
                      base: 'bg-white/90 dark:bg-slate-900/80 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700',
                      padding: { xl: 'px-4 py-3' },
                      color: {
                        white: {
                          outline: 'bg-white/90 dark:bg-slate-900/80 text-gray-900 dark:text-white ring-gray-300 dark:ring-slate-700 focus:ring-[rgb(var(--theme-color-primary))]'
                        }
                      }
                    }"
                    @update:model-value="setCustomerField('name', $event)"
                  />
                </div>
                <div>
                  <label class="block text-gray-900 dark:text-white font-semibold text-sm mb-2">
                    Correo electrónico <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    :model-value="customerInfo.email"
                    type="email"
                    placeholder="Ej: usuario@dominio.com"
                    size="xl"
                    :ui="{
                      base: 'bg-white/90 dark:bg-slate-900/80 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700',
                      padding: { xl: 'px-4 py-3' },
                      color: {
                        white: {
                          outline: 'bg-white/90 dark:bg-slate-900/80 text-gray-900 dark:text-white ring-gray-300 dark:ring-slate-700 focus:ring-[rgb(var(--theme-color-primary))]'
                        }
                      }
                    }"
                    @update:model-value="setCustomerField('email', $event)"
                  />
                </div>
                <div>
                  <label class="block text-gray-900 dark:text-white font-semibold text-sm mb-2">
                    Teléfono <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    :model-value="customerInfo.phone"
                    type="tel"
                    placeholder="Ej: +57 300 123 4567"
                    size="xl"
                    :ui="{
                      base: 'bg-white/90 dark:bg-slate-900/80 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700',
                      padding: { xl: 'px-4 py-3' },
                      color: {
                        white: {
                          outline: 'bg-white/90 dark:bg-slate-900/80 text-gray-900 dark:text-white ring-gray-300 dark:ring-slate-700 focus:ring-[rgb(var(--theme-color-primary))]'
                        }
                      }
                    }"
                    @update:model-value="setCustomerField('phone', $event)"
                  />
                </div>
              </div>
            </div>

            <div class="text-sm text-gray-600 dark:text-gray-400">
              Al enviar la cotización, nuestro equipo responderá al correo registrado.
            </div>
            <div class="flex items-center gap-3">
              <UButton
                variant="outline"
                color="gray"
                class="cursor-pointer flex-1 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                icon="i-heroicons-trash"
                @click="handleClear"
              >
                Limpiar
              </UButton>
              <UButton
                color="primary"
                class="cursor-pointer flex-[2] bg-[rgb(var(--theme-color-primary))] hover:opacity-90 font-semibold shadow-lg"
                icon="i-heroicons-paper-airplane"
                :loading="isSubmitting"
                :disabled="!contactFormValid || isSubmitting"
                @click="handleSubmit"
              >
                Enviar cotización
              </UButton>
            </div>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.5);
  border-radius: 999px;
}
</style>

