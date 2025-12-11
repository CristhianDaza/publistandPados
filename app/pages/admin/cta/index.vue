<script setup>
import { getCTAConfig } from '~/services/firebase/ctaFirebase'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Llamada a la Acción'
})

const loading = ref(true)
const config = ref(null)

onMounted(async () => {
  try {
    config.value = await getCTAConfig()
  } catch (error) {
    console.error('Failed to fetch CTA config:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Llamada a la Acción</h1>
        <p class="text-slate-400">Gestiona la sección principal de Llamada a la Acción de la página de inicio.</p>
      </div>
      <button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/20">
        <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
        <span>Editar Contenido</span>
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
    </div>

    <div v-else-if="config" class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="space-y-6">
          <div>
            <label class="block text-xs uppercase text-slate-500 font-semibold mb-1">Título</label>
            <p class="text-2xl font-bold text-white">{{ config.title }}</p>
          </div>

          <div>
            <label class="block text-xs uppercase text-slate-500 font-semibold mb-1">Texto del Botón</label>
             <span class="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/20">
              {{ config.buttonText }}
            </span>
          </div>

          <div>
             <label class="block text-xs uppercase text-slate-500 font-semibold mb-1">Enlace del Botón</label>
             <a :href="config.buttonLink" target="_blank" class="text-blue-400 hover:underline">{{ config.buttonLink }}</a>
          </div>

           <div>
            <label class="block text-xs uppercase text-slate-500 font-semibold mb-1">Texto de Descripción</label>
            <p class="text-slate-300 leading-relaxed">{{ config.text }}</p>
          </div>
        </div>

        <div v-if="config.image" class="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-800 aspect-video">
           <img :src="config.image" alt="CTA Image" class="w-full h-full object-cover" />
           <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="text-white font-medium">Vista Previa de Imagen</span>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>
