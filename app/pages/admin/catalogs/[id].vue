<script setup>
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const { getCatalogItem, addCatalog, editCatalog, catalogs } = useCatalogs()
const { deleteImage, getPublicIdFromUrl } = useCloudinary()

const isNew = route.params.id === 'new'
const itemId = isNew ? null : route.params.id
const loading = ref(false)
const saving = ref(false)
const originalImage = ref('')

useHead({
  title: isNew ? 'Nuevo Catálogo' : 'Editar Catálogo'
})

const form = reactive({
  image: '',
  title: '',
  description: '',
  link: '',
  order: 0
})

onMounted(async () => {
  if (!isNew) {
    loading.value = true
    try {
      const item = await getCatalogItem(itemId)
      if (item) {
        form.image = item.image || ''
        originalImage.value = item.image || ''
        form.title = item.title || ''
        form.description = item.description || ''
        form.link = item.link || ''
        form.order = item.order || 0
      } else {
        alert('Elemento no encontrado')
        router.push('/admin/catalogs')
      }
    } catch (e) {
      console.error(e)
      alert('Error al cargar elemento')
    } finally {
      loading.value = false
    }
  } else {
    if (catalogs.value && catalogs.value.length > 0) {
       const maxOrder = Math.max(...catalogs.value.map(i => Number(i.order) || 0))
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
    if (!data.link) data.link = ''
    if (!data.description) data.description = ''
    if (!data.title) data.title = ''

    if (!isNew && originalImage.value && form.image !== originalImage.value) {
       const publicId = getPublicIdFromUrl(originalImage.value)
       if (publicId) {
         await deleteImage(publicId)
       }
    }

    if (isNew) {
      await addCatalog(data)
    } else {
      await editCatalog(itemId, data)
    }
    router.push('/admin/catalogs')
  } catch (error) {
    console.error('Error saving item:', error)
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
  router.push('/admin/catalogs')
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto pb-12 px-4 md:px-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">
        {{ isNew ? 'Nuevo Catálogo' : 'Editar Catálogo' }}
      </h1>
      <p class="text-slate-400">Completa la información para tu catálogo.</p>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 bg-slate-900 rounded-xl border border-slate-800">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-blue-500 animate-spin mb-4" />
      <p class="text-slate-400">Cargando información...</p>
    </div>
    <form v-else @submit.prevent="handleSave" class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      
      <div class="p-8 space-y-8">
        <div>
          <label class="block text-white font-bold text-lg mb-3">Imagen de Portada</label>
          <div class="space-y-4">
             <AdminImageUploader v-model="form.image" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-white font-bold text-lg mb-3">Título</label>
            <UInput 
              v-model="form.title" 
              placeholder="Ej: Catálogo 2024" 
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
             <label class="block text-white font-bold text-lg mb-3">Enlace (URL o PDF)</label>
             <UInput 
              v-model="form.link" 
              placeholder="https://..." 
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
            <label class="block text-white font-bold text-lg mb-3">Descripción Corta</label>
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

      </div>

      <div class="p-8 bg-slate-950/30 border-t border-slate-800 flex flex-col md:flex-row gap-4 justify-end">
        <UButton 
          variant="ghost" 
          color="gray" 
          size="xl"
          @click="handleCancel"
          label="Cancelar"
          class="text-slate-400 hover:text-white px-8 cursor-pointer"
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
