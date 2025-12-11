<script setup>
import AdminTable from '~/components/admin/AdminTable.vue'
import { getFooterConfig, getSocialLinks } from '~/services/firebase/footerFirebase'

definePageMeta({
  layout: 'admin'
})

const loading = ref(true)
const config = ref(null)
const socialLinks = ref([])

const socialColumns = [
  { key: 'name', label: 'Network', type: 'text' },
  { key: 'to', label: 'URL', type: 'link' },
  { key: 'icon', label: 'Icon Code', type: 'text' }
]

onMounted(async () => {
  try {
    const [configData, linksData] = await Promise.all([
      getFooterConfig(),
      getSocialLinks()
    ])
    config.value = configData
    socialLinks.value = linksData
  } catch (error) {
    console.error('Failed to fetch footer data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Footer</h1>
        <p class="text-slate-400">Manage footer configuration and social links.</p>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin" />
    </div>

    <div v-else class="space-y-12">
      <section>
        <div class="flex items-center justify-between mb-4">
           <h2 class="text-xl font-semibold text-white flex items-center gap-2">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-blue-500" />
            General Information
          </h2>
          <button class="text-sm text-blue-400 hover:text-white transition-colors cursor-pointer">Edit Info</button>
        </div>

        <div v-if="config" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-slate-400 uppercase mb-4 tracking-wider">Contact Details</h3>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                 <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-slate-500 mt-0.5" />
                 <div>
                   <label class="text-xs text-slate-500 block">Address</label>
                   <p class="text-slate-300 whitespace-pre-line">{{ config.contact?.address }}</p>
                 </div>
              </div>
              <div class="flex items-start gap-3">
                 <UIcon name="i-heroicons-phone" class="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                   <label class="text-xs text-slate-500 block">Phone</label>
                   <p class="text-slate-300">{{ config.contact?.phone }}</p>
                 </div>
              </div>
              <div class="flex items-start gap-3">
                 <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                   <label class="text-xs text-slate-500 block">Email</label>
                   <p class="text-slate-300">{{ config.contact?.email }}</p>
                 </div>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 class="text-sm font-semibold text-slate-400 uppercase mb-4 tracking-wider">Footer CTA</h3>
            <div class="space-y-4">
               <div>
                 <label class="text-xs text-slate-500 block mb-1">Title</label>
                 <p class="text-lg font-medium text-white">{{ config.cta?.title }}</p>
               </div>
               <div>
                 <label class="text-xs text-slate-500 block mb-1">Text</label>
                 <p class="text-slate-400 text-sm">{{ config.cta?.text }}</p>
               </div>
               <div class="flex gap-4">
                  <div>
                     <label class="text-xs text-slate-500 block mb-1">Button Text</label>
                     <span class="inline-block px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">{{ config.cta?.buttonText }}</span>
                  </div>
                   <div>
                     <label class="text-xs text-slate-500 block mb-1">Button Link</label>
                     <span class="text-blue-400 text-sm">{{ config.cta?.buttonLink }}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-white flex items-center gap-2">
            <UIcon name="i-heroicons-share" class="w-5 h-5 text-blue-500" />
            Social Links
          </h2>
          <button class="px-3 py-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-medium transition-colors cursor-pointer border border-blue-500/20">
            Add Link
          </button>
        </div>

        <AdminTable
          :columns="socialColumns"
          :items="socialLinks"
        />
      </section>
    </div>
  </div>
</template>
