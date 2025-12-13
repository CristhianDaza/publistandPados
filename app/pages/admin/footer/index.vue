<script setup>
import { 
  getFooterConfig, 
  getSocialLinks, 
  updateFooterConfig, 
  addSocialLink, 
  updateSocialLink, 
  deleteSocialLink 
} from '~/services/firebase/footerFirebase'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Editar Pie de Página'
})

const loading = ref(true)
const saving = ref(false)
const showSuccessModal = ref(false)

const originalSocialLinks = ref([])

const form = reactive({
  contact: {
    address: '',
    phone: '',
    email: ''
  },
  cta: {
    title: '',
    text: '',
    buttonText: ''
  },
  socialLinks: [] 
})

onMounted(async () => {
  try {
    const [configData, linksData] = await Promise.all([
      getFooterConfig(),
      getSocialLinks()
    ])
    
    if (configData) {
      form.contact = { 
        address: configData.contact?.address || '',
        phone: configData.contact?.phone || '',
        email: configData.contact?.email || ''
      }
      form.cta = {
        title: configData.cta?.title || '',
        text: configData.cta?.text || '',
        buttonText: configData.cta?.buttonText || ''
      }
    }

    if (linksData) {
      originalSocialLinks.value = JSON.parse(JSON.stringify(linksData))
      form.socialLinks = linksData.map(link => ({ ...link }))
    }

  } catch (error) {
    console.error('Failed to fetch footer data:', error)
  } finally {
    loading.value = false
  }
})

const addSocialLinkItem = () => {
  form.socialLinks.push({ name: '', to: '', icon: '' })
}

const removeSocialLinkItem = (index) => {
  form.socialLinks.splice(index, 1)
}

const handleSave = async () => {
  saving.value = true
  try {
    const configToSave = {
       contact: { ...form.contact },
       cta: { ...form.cta }
    }
    await updateFooterConfig(configToSave)

    const currentIds = form.socialLinks.filter(l => l.id).map(l => l.id)
    const linksToDelete = originalSocialLinks.filter(l => !currentIds.includes(l.id))

    for (const link of linksToDelete) {
      await deleteSocialLink(link.id)
    }

    for (const link of form.socialLinks) {
      if (link.id) {
        await updateSocialLink(link.id, {
          name: link.name,
          to: link.to,
          icon: link.icon
        })
      } else {
        await addSocialLink({
          name: link.name,
          to: link.to,
          icon: link.icon
        })
      }
    }

    const updatedLinks = await getSocialLinks()
    originalSocialLinks.value = JSON.parse(JSON.stringify(updatedLinks))
    form.socialLinks = updatedLinks.map(link => ({ ...link }))

    showSuccessModal.value = true
    setTimeout(() => {
      showSuccessModal.value = false
    }, 3000)

  } catch (error) {
    console.error('Error saving footer settings:', error)
    alert('Error al guardar la configuración')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-5xl mx-auto pb-12 px-4 md:px-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Editar Pie de Página</h1>
      <p class="text-slate-400">Personaliza la información de contacto, CTA y redes sociales.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-24 bg-slate-900 rounded-xl border border-slate-800">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-blue-500 animate-spin" />
    </div>

    <form v-else @submit.prevent="handleSave" class="space-y-8">

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-lg">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <UIcon name="i-heroicons-building-office-2" class="w-6 h-6 text-blue-500" />
          Información de Contacto
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div>
              <label class="block text-white font-semibold mb-2">Dirección</label>
              <UTextarea v-model="form.contact.address" :rows="3" placeholder="Dirección física..." />
            </div>
             <div>
              <label class="block text-white font-semibold mb-2">Teléfono</label>
              <UInput v-model="form.contact.phone" placeholder="+57 300..." />
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-white font-semibold mb-2">Email</label>
              <UInput v-model="form.contact.email" type="email" placeholder="contacto@..." />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-lg">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <UIcon name="i-heroicons-megaphone" class="w-6 h-6 text-blue-500" />
          CTA del Footer
        </h2>
        <p class="text-sm text-slate-400 mb-6 bg-slate-950/50 p-3 rounded border border-blue-500/10 border-l-4 border-l-blue-500">
           Nota: Este botón abrirá automáticamente el modal de WhatsApp. No requiere un enlace.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div>
              <label class="block text-white font-semibold mb-2">Título CTA</label>
              <UInput v-model="form.cta.title" placeholder="Ej: Inicia tu Proyecto" />
            </div>
            <div>
              <label class="block text-white font-semibold mb-2">Texto del botón</label>
              <UInput v-model="form.cta.buttonText" placeholder="Ej: Cotizar Ahora" />
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-white font-semibold mb-2">Texto Descriptivo</label>
              <UTextarea v-model="form.cta.text" :rows="4" placeholder="Texto persuasivo..." />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <UIcon name="i-heroicons-share" class="w-6 h-6 text-blue-500" />
            Redes Sociales
          </h2>
          <UButton 
            size="sm" 
            color="blue" 
            variant="soft" 
            icon="i-heroicons-plus" 
            label="Agregar Red"
            @click="addSocialLinkItem" 
            class="cursor-pointer"
          />
        </div>

        <div class="space-y-4">
          <div v-for="(link, index) in form.socialLinks" :key="index" class="flex flex-col md:flex-row gap-4 items-start md:items-center bg-slate-950/30 p-4 rounded-lg border border-slate-800/50">
            <div class="flex-1 w-full md:w-auto">
              <label class="block text-xs text-slate-500 mb-1" v-if="index === 0">Nombre (ej: Instagram)</label>
              <UInput v-model="link.name" placeholder="Nombre" />
            </div>
            <div class="flex-1 w-full md:w-auto">
              <label class="block text-xs text-slate-500 mb-1" v-if="index === 0">URL (ej: https://...)</label>
              <UInput v-model="link.to" placeholder="Enlace" />
            </div>
            <div class="flex-1 w-full md:w-auto">
              <label class="block text-xs text-slate-500 mb-1" v-if="index === 0">Código Ícono (ej: i-simple-icons-instagram)</label>
              <div class="flex gap-2 items-center">
                 <UInput v-model="link.icon" class="flex-1" placeholder="Código de ícono" />
                 <div v-if="link.icon" class="w-8 h-8 flex items-center justify-center bg-slate-800 rounded border border-slate-700">
                    <UIcon :name="link.icon" class="w-5 h-5 text-white" />
                 </div>
              </div>
            </div>
            <UButton 
              color="red" 
              variant="ghost" 
              icon="i-heroicons-trash" 
              class="mt-auto cursor-pointer self-end md:self-center"
              @click="removeSocialLinkItem(index)"
            />
          </div>
          <div v-if="form.socialLinks.length === 0" class="text-center py-8 text-slate-500 italic">
            No hay redes sociales configuradas
          </div>
        </div>
      </div>

      <div class="sticky bottom-4 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-2xl flex justify-end gap-4">
        <UButton 
          type="submit" 
          color="blue"
          size="xl"
          :loading="saving"
          label="Guardar Configuración"
          class="px-8 font-bold cursor-pointer transition-transform active:scale-95"
          block
        />
      </div>

    </form>

    <div 
      v-if="showSuccessModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div class="bg-slate-900 border border-green-500/30 rounded-xl p-6 w-full max-w-sm shadow-2xl scale-100 transform transition-all">
        <div class="flex flex-col items-center text-center gap-4">
          <div class="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <UIcon name="i-heroicons-check" class="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-white mb-1">¡Guardado!</h3>
            <p class="text-slate-400">La configuración del footer ha sido actualizada.</p>
          </div>
          <UButton
            color="green"
            variant="solid"
            label="Entendido"
            class="w-full mt-2 cursor-pointer"
            @click="showSuccessModal = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
