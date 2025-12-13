<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useTheme } from '~/composables/useTheme'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Tema'
})

const router = useRouter()
const { themes, loading, fetchThemes, deleteThemeConfig, setAsActive } = useTheme()

const deleteModalOpen = ref(false)
const themeToDelete = ref(null)
const deleting = ref(false)

onMounted(async () => {
  try {
    await fetchThemes()
    deleteModalOpen.value = false
  } catch (error) {
    console.error('Failed to fetch themes:', error)
  }
})

const handleCreate = () => {
  router.push('/admin/theme/new')
}

const handleEdit = (theme) => {
  router.push(`/admin/theme/${theme.id}`)
}

const handleDelete = (theme) => {
  themeToDelete.value = theme
  deleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!themeToDelete.value) return

  deleting.value = true
  try {
    await deleteThemeConfig(themeToDelete.value.id)
    deleteModalOpen.value = false
    themeToDelete.value = null
  } catch (error) {
    console.error('Error removing theme:', error)
  } finally {
    deleting.value = false
  }
}

const handleSetActive = async (theme) => {
  try {
    await setAsActive(theme.id)
  } catch (error) {
    console.error('Error setting theme as active:', error)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Temas</h1>
        <p class="text-slate-400">Gestiona los temas de color de la aplicación.</p>
      </div>
      <button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
        @click="handleCreate"
      >
        <UIcon name="i-heroicons-plus" class="w-5 h-5" />
        <span>Agregar Nuevo</span>
      </button>
    </div>

    <div v-if="loading && themes.length === 0" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
    </div>

    <div v-else-if="themes.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <p class="text-slate-400 mb-4">Aún no has creado ningún tema.</p>
      <button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
        @click="handleCreate"
      >
        <UIcon name="i-heroicons-plus" class="w-5 h-5" />
        <span>Crear el primer tema</span>
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="theme in themes"
        :key="theme.id"
        class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-white">{{ theme.name }}</h3>
              <p class="text-xs text-slate-500">ID: {{ theme.id }}</p>
            </div>
            <span
              v-if="theme.isActive"
              class="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400"
            >
              Activo
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <p class="text-xs text-slate-500 uppercase mb-2">Modo Claro</p>
              <div class="flex gap-2 items-center">
                <div class="w-8 h-8 rounded-full shadow-sm" :style="{ backgroundColor: theme.colors?.light?.primary }" title="Primario" />
                <div class="w-8 h-8 rounded-full shadow-sm" :style="{ backgroundColor: theme.colors?.light?.secondary }" title="Secundario" />
                <div class="w-8 h-8 rounded-full shadow-sm border border-slate-700" :style="{ backgroundColor: theme.colors?.light?.background }" title="Fondo" />
                <span class="ml-auto text-xs text-slate-400">Texto</span>
                <div class="w-6 h-6 rounded-full border border-slate-700" :style="{ backgroundColor: theme.colors?.light?.text }" />
              </div>
            </div>

            <div>
              <p class="text-xs text-slate-500 uppercase mb-2">Modo Oscuro</p>
              <div class="flex gap-2 items-center">
                <div class="w-8 h-8 rounded-full shadow-sm" :style="{ backgroundColor: theme.colors?.dark?.primary }" title="Primario" />
                <div class="w-8 h-8 rounded-full shadow-sm" :style="{ backgroundColor: theme.colors?.dark?.secondary }" title="Secundario" />
                <div class="w-8 h-8 rounded-full shadow-sm border border-slate-700" :style="{ backgroundColor: theme.colors?.dark?.background }" title="Fondo" />
                <span class="ml-auto text-xs text-slate-400">Texto</span>
                <div class="w-6 h-6 rounded-full border border-slate-700" :style="{ backgroundColor: theme.colors?.dark?.text }" />
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center gap-2">
          <button
            class="px-3 py-1 rounded-full text-xs font-medium border border-slate-700 text-slate-300 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1"
            :disabled="theme.isActive"
            @click="handleSetActive(theme)"
          >
            <UIcon name="i-heroicons-bolt" class="w-4 h-4" />
            <span>{{ theme.isActive ? 'Tema activo' : 'Activar tema' }}</span>
          </button>

          <div class="flex gap-2">
            <button
              class="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
              title="Editar"
              @click="handleEdit(theme)"
            >
              <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
            </button>
            <button
              class="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Eliminar"
              @click="handleDelete(theme)"
            >
              <UIcon name="i-heroicons-trash" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="deleteModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">¿Eliminar tema?</h3>
            <p class="text-slate-400 text-sm">Esta acción no se puede deshacer.</p>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <UButton
            color="gray"
            variant="ghost"
            label="Cancelar"
            class="text-slate-400 hover:text-white cursor-pointer"
            @click="deleteModalOpen = false"
          />
          <UButton
            color="red"
            variant="solid"
            label="Sí, eliminar"
            :loading="deleting"
            class="cursor-pointer"
            @click="confirmDelete"
          />
        </div>
      </div>
    </div>
  </div>
</template>
