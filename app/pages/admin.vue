<script setup>
const { logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (e) {
    console.error('Logout error:', e)
  }
}

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})
</script>

<template>
  <div class="min-h-screen bg-slate-900 p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-white">
          Panel de Administración
        </h1>
        <div class="flex items-center gap-4">
          <button
            @click="router.push('/')"
            class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span>Ir al inicio</span>
          </button>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
      
      <div class="bg-slate-800 rounded-2xl shadow-xl p-6 border border-white/10">
        <p class="text-slate-300">
          Bienvenido al panel de administración. Aquí podrás gestionar el contenido de tu sitio.
        </p>
      </div>
    </div>
  </div>
</template>
