<script setup>
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const { contacts, fetchContacts, addContact, updateContact, getContact } = useWhatsApp()
const { deleteImage, getPublicIdFromUrl } = useCloudinary()

const isNew = route.params.id === 'new'
const itemId = isNew ? null : route.params.id
const loading = ref(false)
const saving = ref(false)
const originalImage = ref('')

useHead({
  title: isNew ? 'Nuevo contacto WhatsApp' : 'Editar contacto WhatsApp'
})

const form = reactive({
  image: '',
  name: '',
  phone: '',
  role: '',
  order: 0,
  active: true
})

onMounted(async () => {
  if (!contacts.value || contacts.value.length === 0) {
    await fetchContacts()
  }

  if (!isNew) {
    loading.value = true
    try {
      const item = await getContact(itemId)
      if (item) {
        form.image = item.image || ''
        originalImage.value = item.image || ''
        form.name = item.name || ''
        form.phone = item.phone || ''
        form.role = item.role || ''
        form.order = item.order || 0
        form.active = typeof item.active === 'boolean' ? item.active : true
      } else {
        await router.push('/admin/whatsapp')
      }
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  } else {
    if (contacts.value && contacts.value.length > 0) {
      const maxOrder = Math.max(...contacts.value.map(i => Number(i.order) || 0))
      form.order = maxOrder + 1
    } else {
      form.order = 1
    }
  }
})

const handleSave = async () => {
  if (!form.name || !form.phone) {
    return
  }

  saving.value = true
  try {
    const data = { ...form }
    data.order = Number(data.order)
    data.active = !!data.active

    if (!isNew && originalImage.value && form.image !== originalImage.value) {
      const publicId = getPublicIdFromUrl(originalImage.value)
      if (publicId) {
        await deleteImage(publicId)
      }
    }

    if (isNew) {
      await addContact(data)
    } else {
      await updateContact(itemId, data)
    }
    await router.push('/admin/whatsapp')
  } catch (error) {
    console.error('Error saving whatsapp contact:', error)
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
  await router.push('/admin/whatsapp')
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto pb-12 px-4 md:px-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">
        {{ isNew ? 'Nuevo contacto WhatsApp' : 'Editar contacto WhatsApp' }}
      </h1>
      <p class="text-slate-400">Configura la información del contacto de WhatsApp.</p>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 bg-slate-900 rounded-xl border border-slate-800">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-blue-500 animate-spin mb-4" />
      <p class="text-slate-400">Cargando información...</p>
    </div>
    <form v-else class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg" @submit.prevent="handleSave">
      <div class="p-8 space-y-8">
        <div>
          <label class="block text-white font-bold text-lg mb-3">Avatar</label>
          <div class="space-y-4">
            <AdminImageUploader v-model="form.image" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-white font-bold text-lg mb-3">Nombre</label>
            <UInput
              v-model="form.name"
              placeholder="Ej: Agente de soporte"
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
            <label class="block text-white font-bold text-lg mb-3">Teléfono</label>
            <UInput
              v-model="form.phone"
              placeholder="Ej: +52 1 55 1234 5678"
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
            <label class="block text-white font-bold text-lg mb-3">Rol</label>
            <UInput
              v-model="form.role"
              placeholder="Ej: Ventas, Soporte, Atención a clientes"
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

          <div class="flex items-center gap-3">
            <UCheckbox v-model="form.active" label="Contacto activo" />
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
          label="Guardar cambios"
          class="px-8 font-bold cursor-pointer"
        />
      </div>
    </form>
  </div>
</template>
