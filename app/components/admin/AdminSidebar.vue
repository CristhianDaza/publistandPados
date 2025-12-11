<script setup>
const route = useRoute()
const router = useRouter()
const { logout } = useAuth()

const handleLogout = async () => {
  try {
    await logout()
    await router.push('/login')
  } catch (e) {
    console.error('Logout error:', e)
  }
}

const links = [
  { label: 'Dashboard', path: '/admin', icon: 'i-heroicons-home' },
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
  <aside class="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-50">
    <div class="p-6 border-b border-slate-800 flex items-center gap-3">
      <div class="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">P</div>
      <h1 class="text-xl font-bold text-white tracking-tight">Admin</h1>
    </div>

    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-3">
        <li v-for="link in links" :key="link.path">
          <NuxtLink
            :to="link.path"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group"
            :class="[
              route.path === link.path
                ? 'bg-blue-600/10 text-blue-400 font-medium'
                : 'hover:bg-slate-800 hover:text-white'
            ]"
          >
            <UIcon :name="link.icon" class="w-5 h-5 flex-shrink-0" :class="route.path === link.path ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'" />
            <span>{{ link.label }}</span>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <div class="flex items-center gap-3 px-3 py-2">
        <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <UIcon name="i-heroicons-user" class="w-5 h-5 text-slate-300" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">Admin User</p>
          <p class="text-xs text-slate-500 truncate">admin@publistand.com</p>
        </div>
        <button
          class="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          title="Cerrar Sesión"
          @click="handleLogout"
        >
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </aside>
</template>
