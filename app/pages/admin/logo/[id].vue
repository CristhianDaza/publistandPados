<script setup>
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const { getLogoById, addLogo, editLogo, setActive } = useLogo()
const { deleteImage, getPublicIdFromUrl } = useCloudinary()

const isNew = route.params.id === 'new'
const itemId = isNew ? null : route.params.id
const loading = ref(false)
const saving = ref(false)

const original = ref({ url: '', urlDark: '', isActive: false })

useHead({
  title: isNew ? 'Nuevo Logo' : 'Editar Logo'
})

const form = reactive({
  name: '',
  url: '',
  urlDark: '',
  isActive: false
})

onMounted(async () => {
  if (!isNew) {
    loading.value = true
    try {
      const item = await getLogoById(itemId)
      if (item) {
        form.name = item.name || ''
        form.url = item.url || ''
        form.urlDark = item.urlDark || ''
        form.isActive = !!item.isActive
        original.value = {
          url: item.url || '',
          urlDark: item.urlDark || '',
          isActive: !!item.isActive
        }
      } else {
        await router.push('/admin/logo')
      }
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  } else {
    form.isActive = false
  }
})

const handleSave = async () => {
  saving.value = true
  try {
    const data = { ...form }
    data.name = (data.name || '').trim()
    if (!isNew && original.value.url && form.url && form.url !== original.value.url) {
      const publicId = getPublicIdFromUrl(original.value.url)
      if (publicId) {
        await deleteImage(publicId)
      }
    }
    if (!isNew && original.value.urlDark && form.urlDark && form.urlDark !== original.value.urlDark) {
      const publicIdDark = getPublicIdFromUrl(original.value.urlDark)
      if (publicIdDark) {
        await deleteImage(publicIdDark)
      }
    }

    let newId = itemId
    if (isNew) {
      newId = await addLogo({
        name: data.name,
        url: data.url,
        urlDark: data.urlDark,
        isActive: false
      })
    } else {
      await editLogo(itemId, {
        name: data.name,
        url: data.url,
        urlDark: data.urlDark
      })
    }

    if (data.isActive) {
      await setActive(newId)
    }

    await router.push('/admin/logo')
  } catch (error) {
    console.error('Error saving logo:', error)
  } finally {
    saving.value = false
  }
}

const handleCancel = async () => {
  if (isNew) {
    if (form.url) {
      const publicId = getPublicIdFromUrl(form.url)
      if (publicId) {
        await deleteImage(publicId)
      }
    }
    if (form.urlDark) {
      const publicIdDark = getPublicIdFromUrl(form.urlDark)
      if (publicIdDark) {
        await deleteImage(publicIdDark)
      }
    }
  } else {
    if (form.url && form.url !== original.value.url) {
      const publicId = getPublicIdFromUrl(form.url)
      if (publicId) {
        await deleteImage(publicId)
      }
    }
    if (form.urlDark && form.urlDark !== original.value.urlDark) {
      const publicIdDark = getPublicIdFromUrl(form.urlDark)
      if (publicIdDark) {
        await deleteImage(publicIdDark)
      }
    }
  }

  await router.push('/admin/logo')
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto pb-12 px-4 md:px-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">
        {{ isNew ? 'Nuevo Logo' : 'Editar Logo' }}
      </h1>
      <p class="text-slate-400">Configura el logo en modo claro y oscuro de la aplicación.</p>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 bg-slate-900 rounded-xl border border-slate-800">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-blue-500 animate-spin mb-4" />
      <p class="text-slate-400">Cargando información...</p>
    </div>

    <form v-else class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg" @submit.prevent="handleSave">
      <div class="p-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-white font-bold text-lg mb-3">Logo Modo Claro</label>
            <div class="space-y-4">
              <AdminImageUploader v-model="form.url" />
            </div>
          </div>

          <div>
            <label class="block text-white font-bold text-lg mb-3">Logo Modo Oscuro</label>
            <div class="space-y-4">
              <AdminImageUploader v-model="form.urlDark" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-white font-bold text-lg mb-3">Nombre</label>
            <UInput
              v-model="form.name"
              placeholder="Ej: Logo principal"
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
          <div class="flex items-center mt-8">
            <label class="inline-flex items-center gap-3 cursor-pointer">
              <UCheckbox v-model="form.isActive" />
              <span class="text-slate-200">Definir como logo activo</span>
            </label>
          </div>
        </div>
      </div>

      <div class="p-8 bg-slate-950/30 border-t border-slate-800 flex flex-col md:flex-row gap-4 justify-end">
        <UButton
          variant="ghost"
          color="gray"
          size="xl"
          class="text-slate-400 hover:text-white px-8 cursor-pointer"
          label="Cancelar"
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

