<script setup>
const { isConfiguratorOpen, configuratorProduct, closeConfigurator, addItem, editingItemId, items } = useQuoteCart()
const { trackQuoteRequest } = useAnalytics()
const toast = useToast()

const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.3em] text-text/60'
const panelClass = 'rounded-2xl border border-text/20 bg-background/60 backdrop-blur-sm shadow-lg shadow-black/5 dark:shadow-black/20 p-4'
const controlClass = 'w-full rounded-2xl border border-text/20 bg-background text-sm text-text px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow shadow-sm disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-text/5'
const textareaClass = `${controlClass} resize-none`

const entries = ref([
  { id: crypto?.randomUUID?.() || `${Date.now()}-1`, colorName: '', colorHex: '', quantity: '', maxQuantity: 0 }
])
const marked = ref(false)
const colorCount = ref(0)
const notes = ref('')
const isSaving = ref(false)
const editingItem = computed(() => items.value.find(item => item.id === editingItemId.value) || null)

watch(isConfiguratorOpen, (open) => {
  if (!open) {
    entries.value = [{ id: crypto?.randomUUID?.() || `${Date.now()}-1`, colorName: '', colorHex: '', quantity: '', maxQuantity: 0 }]
    marked.value = false
    colorCount.value = 0
    notes.value = ''
  } else if (editingItem.value) {
    entries.value = editingItem.value.entries.map(entry => ({ ...entry }))
    marked.value = editingItem.value.marked
    colorCount.value = editingItem.value.colorCount
    notes.value = editingItem.value.notes
  }
})

const colorOptions = computed(() => {
  const product = configuratorProduct.value
  if (!product?.tableQuantity) return []
  const map = new Map()
  product.tableQuantity.forEach(item => {
    const key = item.colorName || item.color || 'Sin color'
    if (!map.has(key)) {
      map.set(key, {
        name: key,
        hex: item.color || '#ccc',
        quantity: Number(item.quantity || 0)
      })
    }
  })
  return Array.from(map.values())
})

const addEntry = () => {
  entries.value.push({ id: crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`, colorName: '', colorHex: '', quantity: '', maxQuantity: 0 })
}

const removeEntry = (entryId) => {
  entries.value = entries.value.filter(entry => entry.id !== entryId)
  if (!entries.value.length) {
    addEntry()
  }
}

const handleColorChange = (entry, color) => {
  entry.colorName = color?.name || ''
  entry.colorHex = color?.hex || ''
  entry.maxQuantity = color?.quantity || 0
  if (entry.quantity > entry.maxQuantity) {
    entry.quantity = entry.maxQuantity
  }
}

const validateEntryQuantity = (entry) => {
  if (entry.quantity > entry.maxQuantity) {
    entry.quantity = entry.maxQuantity
  }
}

const isValid = computed(() => {
  if (!configuratorProduct.value) return false
  if (!entries.value.length) return false
  return entries.value.every(entry => entry.colorName && Number(entry.quantity) > 0)
})

const handleSave = async () => {
  if (!isValid.value) {
    toast.add({ title: 'Datos incompletos', color: 'red' })
    return
  }
  try {
    isSaving.value = true
    addItem({
      entries: entries.value,
      marked: marked.value,
      colorCount: colorCount.value,
      notes: notes.value
    })
    if (configuratorProduct.value) {
      await trackQuoteRequest(configuratorProduct.value)
    }
    toast.add({ title: 'Producto agregado a la cotización', color: 'green' })
  } catch (error) {
    console.error('Error saving quote item:', error)
    toast.add({ title: 'Error al agregar', description: error.message, color: 'red' })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isConfiguratorOpen"
        class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="closeConfigurator"
      >
        <div class="w-full max-w-4xl max-h-[92vh] overflow-y-auto custom-scroll rounded-[2.5rem] border border-text/20 bg-background p-6 md:p-10 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.65)]">
          <header class="flex items-start justify-between gap-4 mb-6">
            <div>
              <p class="text-xs uppercase text-text/60 tracking-[0.3em]">Cotización</p>
              <h2 class="text-2xl font-bold text-text">{{ configuratorProduct?.name }}</h2>
              <p class="text-sm text-text/80">{{ editingItemId ? 'Actualiza' : 'Configura' }} cantidades y colores para este producto</p>
            </div>
            <button class="text-text/60 hover:text-text cursor-pointer transition-colors" @click="closeConfigurator">
              <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
            </button>
          </header>

          <div class="space-y-6">
            <section class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-text">Cantidades por color</h3>
                <UButton icon="i-heroicons-plus" variant="ghost" color="gray" class="cursor-pointer text-text/80 hover:text-text" @click="addEntry">Agregar línea</UButton>
              </div>
              <div class="space-y-4">
                <div
                  v-for="entry in entries"
                  :key="entry.id"
                  class="grid grid-cols-1 md:grid-cols-12 gap-4"
                >
                  <div class="md:col-span-5" :class="panelClass">
                    <label :class="labelClass">Color</label>
                    <select
                      class="mt-3 bg-[length:12px_12px]"
                      :class="controlClass"
                      :value="entry.colorName"
                      @change="handleColorChange(entry, colorOptions.find(opt => opt.name === $event.target.value))"
                    >
                      <option value="" disabled>Selecciona color</option>
                      <option v-for="color in colorOptions" :key="color.name" :value="color.name">
                        {{ color.name }}
                      </option>
                    </select>
                  </div>
                  <div class="md:col-span-5" :class="panelClass">
                    <label :class="labelClass">Cantidad</label>
                    <input
                      v-model.number="entry.quantity"
                      type="number"
                      min="1"
                      class="mt-3"
                      :class="controlClass"
                      placeholder="Ej. 100"
                      :disabled="!entry.colorName"
                      :max="entry.maxQuantity"
                      @input="validateEntryQuantity(entry)"
                    >
                    <p v-if="entry.colorName" class="text-xs text-text/60 mt-1 ml-1">
                      Disponible: {{ entry.maxQuantity }}
                    </p>
                  </div>
                  <div class="md:col-span-2 flex items-end">
                    <UButton color="red" variant="ghost" icon="i-heroicons-trash" class="w-full cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" @click="removeEntry(entry.id)" />
                  </div>
                </div>
              </div>
            </section>

            <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div :class="panelClass">
                <label :class="labelClass">Marcado</label>
                <label class="mt-4 flex items-center gap-3 text-sm text-text/80">
                  <input v-model="marked" type="checkbox" class="h-5 w-5 rounded border-text/20 text-primary focus:ring-primary">
                  ¿Requiere marcaje?
                </label>
              </div>
              <div :class="panelClass">
                <label :class="labelClass">Colores de impresión</label>
                <select v-model.number="colorCount" class="mt-3" :class="controlClass" :disabled="!marked">
                  <option v-for="n in 5" :key="n-1" :value="n-1">{{ n-1 }}</option>
                </select>
              </div>
              <div :class="panelClass">
                <label :class="labelClass">Total estimado</label>
                <p class="text-2xl font-bold mt-3 text-primary">
                  {{ entries.reduce((sum, e) => sum + Number(e.quantity || 0), 0) }} und
                </p>
              </div>
            </section>

            <section>
              <div :class="panelClass">
                <label :class="labelClass">Comentarios</label>
                <textarea
                  v-model="notes"
                  placeholder="Describe necesidades especiales, tiempos o instrucciones adicionales"
                  rows="4"
                  class="mt-3"
                  :class="textareaClass"
                />
              </div>
            </section>
          </div>

          <footer class="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="text-sm text-text/60">
              Se agregará este producto al carrito de cotización para enviarlo más tarde.
            </div>
            <div class="flex gap-3">
              <UButton
                variant="outline"
                color="gray"
                class="cursor-pointer text-text/80 border-text/20 hover:bg-text/5"
                @click="closeConfigurator"
              >
                Cancelar
              </UButton>
              <UButton
                color="primary"
                class="cursor-pointer bg-primary hover:opacity-90 font-semibold shadow-lg"
                :loading="isSaving"
                :disabled="!isValid"
                icon="i-heroicons-check-circle"
                @click="handleSave"
              >
                {{ editingItemId ? 'Actualizar' : 'Guardar' }}
              </UButton>
            </div>
          </footer>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

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
