<script setup>
const { login } = useAuth()
const router = useRouter()
const toast = useToast()
const { logo, initializeLogo } = useLogo()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)
const showPassword = ref(false)
const isEmailFocused = ref(false)
const isPasswordFocused = ref(false)

onMounted(async () => {
  await initializeLogo()
})

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Por favor ingresa email y contraseña'
    return
  }

  loading.value = true
  error.value = null

  try {
    await login(email.value, password.value)
    toast.add({ title: 'Bienvenido', description: 'Has iniciado sesión correctamente', color: 'green' })
    router.push('/admin')
  } catch (e) {
    console.error(e)
    if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
      error.value = 'Credenciales inválidas'
    } else if (e.code === 'auth/too-many-requests') {
      error.value = 'Demasiados intentos fallidos. Intenta más tarde.'
    } else {
      error.value = 'Error al iniciar sesión: ' + e.message
    }
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'auth'
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-500/10 to-slate-900">
    <div class="absolute inset-0 overflow-hidden z-0">
      <div class="absolute w-[600px] h-[600px] rounded-full blur-[80px] opacity-60 -top-[200px] -right-[200px] bg-[radial-gradient(circle,rgb(var(--theme-color-primary)/0.4)_0%,transparent_70%)] animate-float"></div>
      <div class="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-60 -bottom-[150px] -left-[150px] bg-[radial-gradient(circle,rgb(var(--theme-color-secondary)/0.3)_0%,transparent_70%)] animate-float-delayed"></div>
      <div class="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgb(var(--theme-color-primary)/0.2)_0%,transparent_70%)] animate-float-slow"></div>
    </div>

    <div class="relative z-10 w-full max-w-[420px] animate-slide-up">
      <button 
        class="flex items-center gap-2 bg-transparent border-none text-white/70 text-sm cursor-pointer py-2 mb-4 transition-all duration-200 hover:text-white group"
        @click="router.push('/')" 
        type="button"
      >
        <svg class="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>Volver al inicio</span>
      </button>

      <div class="bg-slate-800 backdrop-blur-xl rounded-3xl border border-white/10 p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
        <div class="flex justify-center mb-6">
          <img
            src="https://res.cloudinary.com/dcdfhi8qz/image/upload/v1764904108/a2w9wriie5tvoxbhz67h.png" 
            alt="Logo Publistand Pados" 
            class="max-h-[60px] w-auto object-contain drop-shadow-lg"
          />
        </div>

        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2 tracking-tight">Bienvenido</h1>
          <p class="text-sm text-white/60">Ingresa tus credenciales para acceder al panel</p>
        </div>

        <form class="flex flex-col gap-5" @submit.prevent="handleLogin">
          <div 
            class="relative flex items-center bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
            :class="{ 
              'border-primary-500 shadow-[0_0_0_3px_rgba(var(--theme-color-primary),0.15)] bg-white/[0.08]': isEmailFocused 
            }"
          >
            <div class="flex items-center justify-center w-12 h-12 shrink-0">
              <svg 
                class="w-5 h-5 transition-colors duration-300"
                :class="isEmailFocused || email ? 'text-primary-500' : 'text-white/40'"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="flex-1 bg-transparent border-none outline-none py-3.5 pr-3.5 pl-0 text-[0.9375rem] text-white w-full placeholder:text-white/40"
              placeholder="Correo electrónico"
              @focus="isEmailFocused = true"
              @blur="isEmailFocused = false"
            />
          </div>

          <div 
            class="relative flex items-center bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
            :class="{ 
              'border-primary-500 shadow-[0_0_0_3px_rgba(var(--theme-color-primary),0.15)] bg-white/[0.08]': isPasswordFocused 
            }"
          >
            <div class="flex items-center justify-center w-12 h-12 shrink-0">
              <svg 
                class="w-5 h-5 transition-colors duration-300"
                :class="isPasswordFocused || password ? 'text-primary-500' : 'text-white/40'"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <input
              id="password"
              v-model="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="flex-1 bg-transparent border-none outline-none py-3.5 pr-0 pl-0 text-[0.9375rem] text-white w-full placeholder:text-white/40"
              placeholder="Contraseña"
              @focus="isPasswordFocused = true"
              @blur="isPasswordFocused = false"
            />
            <button 
              type="button" 
              class="flex items-center justify-center w-11 h-11 bg-transparent border-none cursor-pointer p-0 mr-1 rounded-lg transition-all duration-200 hover:bg-white/10"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <svg v-if="showPassword" class="w-5 h-5 text-white/40 hover:text-white/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
              <svg v-else class="w-5 h-5 text-white/40 hover:text-white/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <Transition name="shake">
            <div 
              v-if="error" 
              class="flex items-center gap-2 py-3.5 px-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-sm"
            >
              <svg class="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{{ error }}</span>
            </div>
          </Transition>

          <button
            type="submit"
            :disabled="loading"
            class="relative w-full py-4 px-6 bg-gradient-to-br from-primary-500 to-primary-500/80 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-300 overflow-hidden mt-2 hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_10px_20px_-10px_rgba(var(--theme-color-primary),0.5),0_0_40px_-10px_rgba(var(--theme-color-primary),0.3)] active:enabled:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            <span v-if="loading" class="flex items-center justify-center gap-3">
              <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                <path class="opacity-100" d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
              <span>Iniciando sesión...</span>
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <span>Ingresar</span>
              <svg class="w-5 h-5 transition-transform duration-300 group-hover:enabled:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </button>
        </form>

        <div class="text-center mt-8 pt-6 border-t border-white/10">
          <p class="text-xs text-white/40 uppercase tracking-wider">Panel de Administración</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(20px, 30px) scale(1.05); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

.animate-float { animation: float 20s infinite ease-in-out; }
.animate-float-delayed { animation: float 20s infinite ease-in-out -7s; }
.animate-float-slow { animation: float 20s infinite ease-in-out -14s; }
.animate-slide-up { animation: slideUp 0.6s ease-out; }

.shake-enter-active { animation: shake 0.5s ease-in-out; }

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
