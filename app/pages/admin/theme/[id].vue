<script setup>
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const { themes, fetchThemes, addTheme, updateThemeConfig } = useTheme()

const isNew = computed(() => route.params.id === 'new')
const themeId = computed(() => (isNew.value ? null : route.params.id))

const loading = ref(false)
const saving = ref(false)
const validationErrors = ref({})

useHead({
  title: computed(() => (isNew.value ? 'Nuevo Tema' : 'Editar Tema'))
})

const defaultColors = {
  light: {
    background: '#ffffff',
    primary: '#3b82f6',
    secondary: '#64748b',
    text: '#0f172a'
  },
  dark: {
    background: '#0f172a',
    primary: '#60a5fa',
    secondary: '#94a3b8',
    text: '#f8fafc'
  }
}

const form = reactive({
  name: '',
  isActive: false,
  colors: JSON.parse(JSON.stringify(defaultColors))
})

const findThemeById = async (id) => {
  if (themes.value && themes.value.length) {
    const found = themes.value.find(t => t.id === id)
    if (found) return found
  }
  await fetchThemes()
  return themes.value.find(t => t.id === id) || null
}

onMounted(async () => {
  if (!isNew.value) {
    loading.value = true
    try {
      const theme = await findThemeById(themeId.value)
      if (!theme) {
        await router.push('/admin/theme')
        return
      }

      form.name = theme.name || ''
      form.isActive = !!theme.isActive
      form.colors.light = {
        background: theme.colors?.light?.background || defaultColors.light.background,
        primary: theme.colors?.light?.primary || defaultColors.light.primary,
        secondary: theme.colors?.light?.secondary || defaultColors.light.secondary,
        text: theme.colors?.light?.text || defaultColors.light.text
      }
      form.colors.dark = {
        background: theme.colors?.dark?.background || defaultColors.dark.background,
        primary: theme.colors?.dark?.primary || defaultColors.dark.primary,
        secondary: theme.colors?.dark?.secondary || defaultColors.dark.secondary,
        text: theme.colors?.dark?.text || defaultColors.dark.text
      }
    } catch (e) {
      console.error('Error loading theme:', e)
    } finally {
      loading.value = false
    }
  }
})

const isValidHex = (value) => {
  if (!value) return false
  return /^#([0-9A-Fa-f]{6})$/.test(value)
}

const validateForm = () => {
  const errors = {}

  if (!form.name.trim()) {
    errors.name = 'El nombre es obligatorio.'
  }

  const modes = ['light', 'dark']
  const keys = ['background', 'primary', 'secondary', 'text']

  modes.forEach(mode => {
    keys.forEach(key => {
      const value = form.colors?.[mode]?.[key]
      if (!isValidHex(value)) {
        if (!errors.colors) errors.colors = {}
        if (!errors.colors[mode]) errors.colors[mode] = {}
        errors.colors[mode][key] = 'Debe ser un color hexadecimal válido (#RRGGBB).'
      }
    })
  })

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const handleSave = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    const payload = {
      name: form.name.trim(),
      isActive: !!form.isActive,
      colors: {
        light: { ...form.colors.light },
        dark: { ...form.colors.dark }
      }
    }

    if (isNew.value) {
      // Crear siempre como inactivo; se activa desde el listado para mantener la invariancia de "único activo"
      payload.isActive = false
      await addTheme(payload)
    } else {
      await updateThemeConfig(themeId.value, payload)
    }

    await router.push('/admin/theme')
  } catch (error) {
    console.error('Error saving theme:', error)
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  router.push('/admin/theme')
}
</script>

<template>
  <div class="w-full max-w-5xl mx-auto pb-12 px-4 md:px-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">
        {{ isNew ? 'Nuevo Tema' : 'Editar Tema' }}
      </h1>
      <p class="text-slate-400">Configura los colores para el tema de la aplicación.</p>
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
      <div class="p-8 space-y-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-2">
            <label class="block text-white font-bold text-lg mb-3">Nombre del tema</label>
            <UInput
              v-model="form.name"
              placeholder="Ej: Tema corporativo"
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
            <p v-if="validationErrors.name" class="mt-2 text-sm text-red-400">
              {{ validationErrors.name }}
            </p>
          </div>

          <div class="flex items-center gap-3 mt-6 md:mt-0">
            <span class="text-slate-300 text-sm">Activo</span>
            <UTooltip text="El estado activo se gestiona desde el listado para garantizar que solo haya uno.">
              <USwitch v-model="form.isActive" disabled />
            </UTooltip>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section class="bg-slate-950/40 rounded-xl border border-slate-800 p-6 space-y-6">
            <header class="flex items-center justify-between mb-2">
              <div>
                <h2 class="text-lg font-semibold text-white">Modo Claro</h2>
                <p class="text-xs text-slate-500">Colores usados cuando el usuario tiene el modo claro activo.</p>
              </div>
              <div
                class="w-20 h-12 rounded-lg border border-slate-700 flex items-center justify-center text-xs font-medium"
                :style="{
                  backgroundColor: form.colors.light.background,
                  color: form.colors.light.text
                }"
              >
                Preview
              </div>
            </header>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="key in ['background', 'primary', 'secondary', 'text']" :key="`light-${key}`" class="space-y-2">
                <label class="block text-sm font-medium text-slate-200 capitalize">
                  {{ key === 'background' ? 'Fondo' : key === 'primary' ? 'Primario' : key === 'secondary' ? 'Secundario' : 'Texto' }}
                </label>
                <div class="flex items-center gap-3">
                  <input
                    v-model="form.colors.light[key]"
                    type="color"
                    class="w-10 h-10 rounded-md border border-slate-700 bg-slate-800 cursor-pointer"
                  >
                  <UInput
                    v-model="form.colors.light[key]"
                    size="sm"
                    placeholder="#000000"
                    :ui="{
                      base: 'bg-slate-800 text-white',
                      padding: { sm: 'px-3 py-2' },
                      color: {
                        white: {
                          outline: 'bg-slate-800 text-white ring-slate-700 focus:ring-blue-500'
                        }
                      }
                    }"
                  />
                </div>
                <p
                  v-if="validationErrors.colors && validationErrors.colors.light && validationErrors.colors.light[key]"
                  class="text-xs text-red-400"
                >
                  {{ validationErrors.colors.light[key] }}
                </p>
              </div>
            </div>
          </section>

          <section class="bg-slate-950/40 rounded-xl border border-slate-800 p-6 space-y-6">
            <header class="flex items-center justify-between mb-2">
              <div>
                <h2 class="text-lg font-semibold text-white">Modo Oscuro</h2>
                <p class="text-xs text-slate-500">Colores usados cuando el usuario tiene el modo oscuro activo.</p>
              </div>
              <div
                class="w-20 h-12 rounded-lg border border-slate-700 flex items-center justify-center text-xs font-medium"
                :style="{
                  backgroundColor: form.colors.dark.background,
                  color: form.colors.dark.text
                }"
              >
                Preview
              </div>
            </header>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="key in ['background', 'primary', 'secondary', 'text']" :key="`dark-${key}`" class="space-y-2">
                <label class="block text-sm font-medium text-slate-200 capitalize">
                  {{ key === 'background' ? 'Fondo' : key === 'primary' ? 'Primario' : key === 'secondary' ? 'Secundario' : 'Texto' }}
                </label>
                <div class="flex items-center gap-3">
                  <input
                    v-model="form.colors.dark[key]"
                    type="color"
                    class="w-10 h-10 rounded-md border border-slate-700 bg-slate-800 cursor-pointer"
                  >
                  <UInput
                    v-model="form.colors.dark[key]"
                    size="sm"
                    placeholder="#000000"
                    :ui="{
                      base: 'bg-slate-800 text-white',
                      padding: { sm: 'px-3 py-2' },
                      color: {
                        white: {
                          outline: 'bg-slate-800 text-white ring-slate-700 focus:ring-blue-500'
                        }
                      }
                    }"
                  />
                </div>
                <p
                  v-if="validationErrors.colors && validationErrors.colors.dark && validationErrors.colors.dark[key]"
                  class="text-xs text-red-400"
                >
                  {{ validationErrors.colors.dark[key] }}
                </p>
              </div>
            </div>
          </section>
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
