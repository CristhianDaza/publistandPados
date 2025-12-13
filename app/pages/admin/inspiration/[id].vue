<script setup>
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const { getInspirationItem, addInspirationItem, updateInspiration, inspirationItems } = useInspiration()
const { deleteImage, getPublicIdFromUrl } = useCloudinary()

const isNew = route.params.id === 'new'
const itemId = isNew ? null : route.params.id
const loading = ref(false)
const saving = ref(false)
const originalImage = ref('')

useHead({
  title: isNew ? 'Nueva Inspiración' : 'Editar Inspiración'
})

const form = reactive({
  image: '',
  title: '',
  description: '',
  collection: '',
  order: 0,
  footer: {
    highlight: '',
    subtext: ''
  },
  buttons: []
})

onMounted(async () => {
  if (!isNew) {
    loading.value = true
    try {
      const item = await getInspirationItem(itemId)
      if (item) {
        form.image = item.image || ''
        originalImage.value = item.image || ''
        form.title = item.title || ''
        form.description = item.description || ''
        form.collection = item.collection || ''
        form.order = item.order || 0
        form.footer = {
          highlight: (item.footer && typeof item.footer.highlight === 'string') ? item.footer.highlight : '',
          subtext: (item.footer && item.footer.subtext) || ''
        }
        form.buttons = Array.isArray(item.buttons) ? item.buttons.map(btn => ({
          label: btn.label || '',
          link: btn.link || '',
          variant: ['primary', 'secondary', 'outline'].includes(btn.variant) ? btn.variant : 'primary'
        })) : []
      } else {
        await router.push('/admin/inspiration')
      }
    } catch (e) {
      console.error(e)
      await router.push('/admin/inspiration')
    } finally {
      loading.value = false
    }
  } else {
    if (inspirationItems.value.length > 0) {
      const maxOrder = Math.max(...inspirationItems.value.map(i => Number(i.order) || 0))
      form.order = maxOrder + 1
    }
  }
})

const handleAddButton = () => {
  form.buttons.push({
    label: '',
    link: '',
    variant: 'primary'
  })
}

const handleRemoveButton = (index) => {
  form.buttons.splice(index, 1)
}

const handleSave = async () => {
  saving.value = true
  try {
    const data = JSON.parse(JSON.stringify(form))

    data.order = Number(data.order) || 0
    data.title = data.title || ''
    data.description = data.description || ''
    data.collection = data.collection || ''

    data.footer = data.footer || {}
    data.footer.highlight = typeof data.footer.highlight === 'string' ? data.footer.highlight : ''
    data.footer.subtext = data.footer.subtext || ''

    data.buttons = Array.isArray(data.buttons)
      ? data.buttons.map(btn => ({
          label: btn.label || '',
          link: btn.link || '',
          variant: ['primary', 'secondary', 'outline'].includes(btn.variant) ? btn.variant : 'primary'
        }))
      : []

    if (!isNew && originalImage.value && form.image !== originalImage.value) {
      const publicId = getPublicIdFromUrl(originalImage.value)
      if (publicId) {
        await deleteImage(publicId)
      }
    }

    if (isNew) {
      await addInspirationItem(data)
    } else {
      await updateInspiration(itemId, data)
    }

    await router.push('/admin/inspiration')
  } catch (error) {
    console.error('Error saving inspiration item:', error)
    alert('Hubo un error al guardar el elemento')
  } finally {
    saving.value = false
  }
}

const handleCancel = async () => {
  if (form.image && form.image !== originalImage.value) {
    const publicId = getPublicIdFromUrl(form.image)
    if (publicId) {
      await deleteImage(publicId)
    }
  }
  await router.push('/admin/inspiration')
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto pb-12 px-4 md:px-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">
        {{ isNew ? 'Nueva Inspiración' : 'Editar Inspiración' }}
      </h1>
      <p class="text-slate-400">Completa la información para la sección de inspiración.</p>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 bg-slate-900 rounded-xl border border-slate-800">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-blue-500 animate-spin mb-4" />
      <p class="text-slate-400">Cargando información...</p>
    </div>

    <form v-else class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg" @submit.prevent="handleSave">
      <div class="p-8 space-y-8">
        <div>
          <label class="block text-white font-bold text-lg mb-3">Imagen de inspiración</label>
          <div class="space-y-4">
            <AdminImageUploader v-model="form.image" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-white font-bold text-lg mb-3">Título</label>
            <UInput
              v-model="form.title"
              placeholder="Ej: Inspiración nórdica"
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
            <label class="block text-white font-bold text-lg mb-3">Colección</label>
            <UInput
              v-model="form.collection"
              placeholder="Ej: Colección Verano"
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
            <label class="block text-white font-bold text-lg mb-3">Descripción</label>
            <UInput
              v-model="form.description"
              placeholder="Breve descripción..."
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-white font-bold text-lg mb-3">Footer highlight</label>
            <UInput
              v-model="form.footer.highlight"
              placeholder="Texto destacado del footer"
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
            <label class="block text-white font-bold text-lg mb-3">Footer subtexto</label>
            <UInput
              v-model="form.footer.subtext"
              placeholder="Texto adicional para el footer"
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
        </div>

        <div>
          <div class="flex items-center justify-between mb-4">
            <label class="block text-white font-bold text-lg">Botones</label>
            <UButton
              class="cursor-pointer"
              color="blue"
              icon="i-heroicons-plus"
              label="Añadir botón"
              variant="soft"
              @click="handleAddButton"
            />
          </div>

          <div v-if="form.buttons.length === 0" class="text-slate-500 text-sm">
            No hay botones añadidos todavía.
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(button, index) in form.buttons"
              :key="index"
              class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-950/40 border border-slate-800 rounded-lg p-4"
            >
              <div>
                <label class="block text-white text-sm font-medium mb-1">Etiqueta</label>
                <UInput
                  v-model="button.label"
                  placeholder="Ej: Ver más"
                  size="xl"
                  :ui="{
                    base: 'bg-slate-800 text-white',
                    padding: { xl: 'px-4 py-3' },
                    color: { white: { outline: 'bg-slate-800 text-white ring-slate-700 focus:ring-blue-500' } }
                  }"
                />
              </div>

              <div>
                <label class="block text-white text-sm font-medium mb-1">Enlace</label>
                <UInput
                  v-model="button.link"
                  placeholder="/ruta-o-url"
                  size="xl"
                  :ui="{
                    base: 'bg-slate-800 text-white',
                    padding: { xl: 'px-4 py-3' },
                    color: { white: { outline: 'bg-slate-800 text-white ring-slate-700 focus:ring-blue-500' } }
                  }"
                />
              </div>

              <div>
                <label class="block text-white text-sm font-medium mb-1">Variante</label>
                <select
                  v-model="button.variant"
                  class="w-full rounded-md bg-slate-800 text-white px-4 py-3 text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                </select>
              </div>

              <div class="flex justify-end">
                <UButton
                  class="cursor-pointer"
                  color="red"
                  icon="i-heroicons-trash"
                  label="Eliminar"
                  variant="ghost"
                  @click="handleRemoveButton(index)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-8 bg-slate-950/30 border-t border-slate-800 flex flex-col md:flex-row gap-4 justify-end">
        <UButton
          class="text-slate-400 hover:text-white px-8 cursor-pointer"
          color="gray"
          label="Cancelar"
          size="xl"
          variant="ghost"
          @click="handleCancel"
        />
        <UButton
          class="px-8 font-bold cursor-pointer"
          color="blue"
          label="Guardar Cambios"
          size="xl"
          type="submit"
          :loading="saving"
        />
      </div>
    </form>
  </div>
</template>
