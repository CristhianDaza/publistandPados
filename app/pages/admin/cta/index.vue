<script setup>
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Editar Llamada a la Acción'
})

const { ctaConfig, loading, fetchCTA, updateCTA } = useHomeCTA()
const { deleteImage, getPublicIdFromUrl } = useCloudinary()

const saving = ref(false)
const originalImage = ref('')

const form = reactive({
  title: '',
  subtitle: '',
  tagline: '',
  description: '', 
  image: '',
  primaryButton: { text: '', link: '' },
  secondaryButton: { text: '', link: '' },
  features: [],
  stats: []
})

onMounted(async () => {
  await fetchCTA()
  if (ctaConfig.value) {
    form.title = ctaConfig.value.title || ''
    form.subtitle = ctaConfig.value.subtitle || ''
    form.tagline = ctaConfig.value.tagline || ''
    form.description = ctaConfig.value.description || ctaConfig.value.text || ''
    form.image = ctaConfig.value.image || ''
    originalImage.value = ctaConfig.value.image || ''
    
    form.primaryButton = { 
      text: ctaConfig.value.primaryButton?.text || '', 
      link: ctaConfig.value.primaryButton?.link || '' 
    }
    form.secondaryButton = { 
      text: ctaConfig.value.secondaryButton?.text || '', 
      link: ctaConfig.value.secondaryButton?.link || '' 
    }
    
    form.features = Array.isArray(ctaConfig.value.features) 
      ? [...ctaConfig.value.features] 
      : []
      
    form.stats = Array.isArray(ctaConfig.value.stats) 
      ? ctaConfig.value.stats.map(s => ({...s}))
      : []
  }
})

const handleSave = async () => {
  saving.value = true
  try {
    if (originalImage.value && form.image !== originalImage.value) {
       const publicId = getPublicIdFromUrl(originalImage.value)
       if (publicId) {
         await deleteImage(publicId)
       }
    }

    const dataToSave = {
      ...form,
      features: [...form.features],
      stats: form.stats.map(s => ({ label: s.label || '', value: s.value || '' }))
    }

    await updateCTA(dataToSave)
    originalImage.value = form.image
    showSuccessModal.value = true
    setTimeout(() => {
      showSuccessModal.value = false
    }, 3000)
  } catch (error) {
    console.error('Error saving CTA:', error)
    alert('Error al guardar la configuración')
  } finally {
    saving.value = false
  }
}

const addFeature = () => {
  form.features.push('')
}
const removeFeature = (index) => {
  form.features.splice(index, 1)
}

const addStat = () => {
  form.stats.push({ label: '', value: '' })
}
const removeStat = (index) => {
  form.stats.splice(index, 1)
}

const showSuccessModal = ref(false)
</script>

<template>
  <div class="w-full max-w-5xl mx-auto pb-12 px-4 md:px-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Editar Llamada a la Acción</h1>
      <p class="text-slate-400">Personaliza la sección principal de CTA.</p>
    </div>

    <div v-if="loading" class="flex justify-center py-24 bg-slate-900 rounded-xl border border-slate-800">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-blue-500 animate-spin" />
    </div>

    <form v-else @submit.prevent="handleSave" class="space-y-8">
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-lg">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <UIcon name="i-heroicons-photo" class="w-6 h-6 text-blue-500" />
          Información Principal e Imagen
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-6">
             <div>
              <label class="block text-white font-semibold mb-2">Imagen de Fondo / Principal</label>
              <AdminImageUploader v-model="form.image" />
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-white font-semibold mb-2">Tagline (Texto pequeño arriba)</label>
              <UInput v-model="form.tagline" placeholder="Ej: Nueva Colección" />
            </div>
            
            <div>
              <label class="block text-white font-semibold mb-2">Título Principal</label>
              <UInput v-model="form.title" size="lg" placeholder="Título grande..." />
            </div>

            <div>
              <label class="block text-white font-semibold mb-2">Subtítulo</label>
              <UInput v-model="form.subtitle" placeholder="Subtítulo..." />
            </div>

            <div>
              <label class="block text-white font-semibold mb-2">Descripción</label>
              <UTextarea v-model="form.description" :rows="4" placeholder="Descripción detallada..." />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-lg">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <UIcon name="i-heroicons-cursor-arrow-rays" class="w-6 h-6 text-blue-500" />
          Botones de Acción
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
            <h3 class="text-white font-bold mb-4">Botón Primario</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-slate-400 text-sm mb-1">Texto</label>
                <UInput v-model="form.primaryButton.text" placeholder="Ej: Comprar Ahora" />
              </div>
              <div>
                <label class="block text-slate-400 text-sm mb-1">Enlace</label>
                <UInput v-model="form.primaryButton.link" placeholder="https://..." />
              </div>
            </div>
          </div>

          <div class="p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
            <h3 class="text-white font-bold mb-4">Botón Secundario</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-slate-400 text-sm mb-1">Texto</label>
                <UInput v-model="form.secondaryButton.text" placeholder="Ej: Ver Catálogo" />
              </div>
              <div>
                <label class="block text-slate-400 text-sm mb-1">Enlace</label>
                <UInput v-model="form.secondaryButton.link" placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <UIcon name="i-heroicons-list-bullet" class="w-6 h-6 text-blue-500" />
            Características (Features)
          </h2>
          <UButton 
            size="sm" 
            color="blue" 
            variant="soft" 
            icon="i-heroicons-plus" 
            label="Agregar"
            @click="addFeature" 
            class="cursor-pointer"
          />
        </div>

        <div class="space-y-3">
          <div v-for="(feature, index) in form.features" :key="index" class="flex items-center gap-2">
            <UInput v-model="form.features[index]" class="flex-1" placeholder="Describe una característica..." />
            <UButton 
              color="red" 
              variant="ghost" 
              icon="i-heroicons-trash" 
              size="sm"
              class="cursor-pointer"
              @click="removeFeature(index)"
            />
          </div>
          <div v-if="form.features.length === 0" class="text-center py-4 text-slate-500 text-sm italic">
            No hay características agregadas
          </div>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
             <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-blue-500" />
            Estadísticas (Stats)
          </h2>
          <UButton 
            size="sm" 
            color="blue" 
            variant="soft" 
            icon="i-heroicons-plus" 
            label="Agregar"
            @click="addStat" 
            class="cursor-pointer"
          />
        </div>

        <div class="space-y-4">
          <div v-for="(stat, index) in form.stats" :key="index" class="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-950/30 p-3 rounded-lg border border-slate-800/50">
            <div class="flex-1 w-full">
              <label class="block text-xs text-slate-500 mb-1" v-if="index === 0">Valor (ej: +50)</label>
              <UInput v-model="stat.value" placeholder="Valor" />
            </div>
             <div class="flex-1 w-full">
              <label class="block text-xs text-slate-500 mb-1" v-if="index === 0">Etiqueta (ej: Clientes Felices)</label>
              <UInput v-model="stat.label" placeholder="Etiqueta" />
            </div>
            <UButton 
              color="red" 
              variant="ghost" 
              icon="i-heroicons-trash" 
              class="mt-auto cursor-pointer"
              @click="removeStat(index)"
            />
          </div>
          <div v-if="form.stats.length === 0" class="text-center py-4 text-slate-500 text-sm italic">
            No hay estadísticas agregadas
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
            <p class="text-slate-400">La configuración se ha actualizado correctamente.</p>
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
