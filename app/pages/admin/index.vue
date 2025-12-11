<script setup>
definePageMeta({
  layout: 'admin'
})

const summaryItems = [
  { label: 'Carousel', path: '/admin/carousel', icon: 'i-heroicons-photo' },
  { label: 'Catalogs', path: '/admin/catalogs', icon: 'i-heroicons-book-open' },
  { label: 'Call to Action', path: '/admin/cta', icon: 'i-heroicons-megaphone' },
  { label: 'Footer', path: '/admin/footer', icon: 'i-heroicons-bars-3-bottom-left' },
  { label: 'Inspiration', path: '/admin/inspiration', icon: 'i-heroicons-light-bulb' },
  { label: 'Logos', path: '/admin/logo', icon: 'i-heroicons-camera' },
  { label: 'Menu', path: '/admin/menu', icon: 'i-heroicons-list-bullet' },
  { label: 'Social Proof', path: '/admin/social-proof', icon: 'i-heroicons-chat-bubble-left-right' },
  { label: 'Theme', path: '/admin/theme', icon: 'i-heroicons-swatch' },
  { label: 'WhatsApp', path: '/admin/whatsapp', icon: 'i-heroicons-chat-bubble-oval-left' },
]
</script>

<template>
  <div>
    <header class="mb-10">
      <h1 class="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
      <p class="text-slate-400">Welcome back. Here's a quick overview of your content.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="item in summaryItems"
        :key="item.path"
        :to="item.path"
        class="group relative bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500" />

        <div class="relative z-10 flex items-start justify-between mb-4">
          <div class="p-3 bg-slate-800 rounded-lg group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors duration-300">
            <UIcon :name="item.icon" class="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-slate-600 group-hover:text-blue-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
        </div>

        <div class="relative z-10">
          <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{{ item.label }}</h3>
          <p class="text-sm text-slate-500 group-hover:text-slate-400">Manage {{ item.label.toLowerCase() }} content</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
