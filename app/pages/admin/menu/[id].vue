<script setup>
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const { getMenuItem, addMenuItem, updateItem, menuItems } = useMenu()

const isNew = route.params.id === 'new'
const itemId = isNew ? null : route.params.id
const loading = ref(false)
const saving = ref(false)

useHead({
  title: isNew ? 'Nuevo Elemento de Menú' : 'Editar Elemento de Menú'
})

const form = reactive({
  label: '',
  to: '',
  order: 0
})

onMounted(async () => {
  if (!isNew) {
    loading.value = true
    try {
      const item = await getMenuItem(itemId)
      if (item) {
        form.label = item.label || ''
        form.to = item.to || ''
        form.order = item.order || 0
      } else {
        await router.push('/admin/menu')
      }
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  } else {
    if (menuItems.value && menuItems.value.length > 0) {
      const maxOrder = Math.max(...menuItems.value.map(i => Number(i.order) || 0))
      form.order = maxOrder + 1
    } else {
      form.order = 1
    }
  }
})

const handleSave = async () => {
  saving.value = true
  try {
    const data = { ...form }
    data.order = Number(data.order)
    if (!data.label) data.label = ''
    if (!data.to) data.to = ''

    if (isNew) {
      await addMenuItem(data)
    } else {
      await updateItem(itemId, data)
    }
    await router.push('/admin/menu')
  } catch (error) {
    console.error('Error saving item:', error)
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  router.push('/admin/menu')
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto pb-12 px-4 md:px-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">
        {{ isNew ? 'Nuevo Elemento de Menú' : 'Editar Elemento de Menú' }}
      </h1>
      <p class="text-slate-400">Configura los enlaces del menú de navegación.</p>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 bg-slate-900 rounded-xl border border-slate-800">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-blue-500 animate-spin mb-4" />
      <p class="text-slate-400">Cargando información...</p>
    </div>

    <form
      v-else
      class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg"
      @submit.prevent="handleSave"
    >
      <div class="p-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-white font-bold text-lg mb-3">Etiqueta</label>
            <UInput
              v-model="form.label"
              placeholder="Ej: Inicio"
              size="xl"
              :ui="{
                base: 'bg-slate-800 text-white',
                padding: { xl: 'px-4 py-3' },
                color: {
                  white: {
                    outline: 'bg-slate-800 text-white ring-slate-700 focus:ring-blue-500'
                  }
                }
              }"
            />
          </div>

          <div>
            <label class="block text-white font-bold text-lg mb-3">Destino (ruta)</label>
            <UInput
              v-model="form.to"
              placeholder="/ruta"
              size="xl"
              :ui="{
                base: 'bg-slate-800 text-white',
                padding: { xl: 'px-4 py-3' },
                color: {
                  white: {
                    outline: 'bg-slate-800 text-white ring-slate-700 focus:ring-blue-500'
                  }
                }
              }"
            />
          </div>

          <div>
            <label class="block text-white font-bold text-lg mb-3">Orden de aparición</label>
            <UInput
              v-model="form.order"
              type="number"
              size="xl"
              placeholder="0"
              :ui="{
                base: 'bg-slate-800 text-white',
                padding: { xl: 'px-4 py-3' },
                color: {
                  white: {
                    outline: 'bg-slate-800 text-white ring-slate-700 focus:ring-blue-500'
                  }
                }
              }"
            />
          </div>
        </div>
      </div>

      <div class="p-8 bg-slate-950/30 border-t border-slate-800 flex flex-col md:flex-row gap-4 justify-end">
        <UButton
          variant="ghost"
          color="gray"
          size="xl"
          label="Cancelar"
          class="text-slate-400 hover:text-white px-8 cursor-pointer"
          @click="handleCancel"
        />
        <UButton
          type="submit"
          color="blue"
          size="xl"
          :loading="saving"
          label="Guardar Cambios"
          class="px-8 font-bold cursor-pointer"
        />
      </div>
    </form>
  </div>
</template>
