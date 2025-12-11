<script setup>
import { getThemes } from '~/services/firebase/themeFirebase'

definePageMeta({
  layout: 'admin'
})

const loading = ref(true)
const items = ref([])

onMounted(async () => {
  try {
    items.value = await getThemes()
  } catch (error) {
    console.error('Failed to fetch themes:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Themes</h1>
        <p class="text-slate-400">Manage application color themes.</p>
      </div>
      <button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/20">
        <UIcon name="i-heroicons-plus" class="w-5 h-5" />
        <span>Add New</span>
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="theme in items"
        :key="theme.id"
        class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">{{ theme.name }}</h3>
            <span
              v-if="theme.isActive"
              class="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400"
            >
              Active
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <p class="text-xs text-slate-500 uppercase mb-2">Light Mode</p>
              <div class="flex gap-2">
                <div class="w-8 h-8 rounded-full shadow-sm" :style="{ backgroundColor: theme.colors?.light?.primary }" title="Primary"></div>
                <div class="w-8 h-8 rounded-full shadow-sm" :style="{ backgroundColor: theme.colors?.light?.secondary }" title="Secondary"></div>
                <div class="w-8 h-8 rounded-full shadow-sm border border-slate-700" :style="{ backgroundColor: theme.colors?.light?.background }" title="Background"></div>
              </div>
            </div>

            <div>
              <p class="text-xs text-slate-500 uppercase mb-2">Dark Mode</p>
              <div class="flex gap-2">
                <div class="w-8 h-8 rounded-full shadow-sm" :style="{ backgroundColor: theme.colors?.dark?.primary }" title="Primary"></div>
                <div class="w-8 h-8 rounded-full shadow-sm" :style="{ backgroundColor: theme.colors?.dark?.secondary }" title="Secondary"></div>
                <div class="w-8 h-8 rounded-full shadow-sm border border-slate-700" :style="{ backgroundColor: theme.colors?.dark?.background }" title="Background"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-2">
           <button class="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer">
              <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
            </button>
            <button class="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
              <UIcon name="i-heroicons-trash" class="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  </div>
</template>
