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
  layout: 'blank'
})
</script>

<template>
  <div class="login-page">
    <div class="animated-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <div class="login-container">
      <button class="back-button" @click="router.push('/')" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>Volver al inicio</span>
      </button>

      <div class="login-card">
        <div class="logo-container">
          <img 
            v-if="logo?.url" 
            :src="logo.url" 
            :alt="logo.name || 'Logo'" 
            class="logo-image"
          />
          <div v-else class="logo-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div class="login-header">
          <h1 class="login-title">Bienvenido</h1>
          <p class="login-subtitle">Ingresa tus credenciales para acceder al panel</p>
        </div>
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="input-group" :class="{ 'focused': isEmailFocused, 'has-value': email }">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
              class="login-input"
              placeholder="Correo electrónico"
              @focus="isEmailFocused = true"
              @blur="isEmailFocused = false"
            />
          </div>
          <div class="input-group" :class="{ 'focused': isPasswordFocused, 'has-value': password }">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
              class="login-input"
              placeholder="Contraseña"
              @focus="isPasswordFocused = true"
              @blur="isPasswordFocused = false"
            />
            <button 
              type="button" 
              class="password-toggle"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <Transition name="shake">
            <div v-if="error" class="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{{ error }}</span>
            </div>
          </Transition>
          <button
            type="submit"
            :disabled="loading"
            class="login-button"
          >
            <span v-if="loading" class="loading-spinner">
              <svg class="spinner" viewBox="0 0 24 24" fill="none">
                <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                <path class="spinner-head" d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
              <span>Iniciando sesión...</span>
            </span>
            <span v-else class="button-content">
              <span>Ingresar</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </button>
        </form>

        <div class="login-footer">
          <p>Panel de Administración</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, 
    rgb(var(--theme-color-background, 15 23 42)) 0%,
    rgb(var(--theme-color-primary, 59 130 246) / 0.1) 50%,
    rgb(var(--theme-color-background, 15 23 42)) 100%
  );
}

/* Animated Background */
.animated-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgb(var(--theme-color-primary, 59 130 246) / 0.4) 0%, transparent 70%);
  top: -200px;
  right: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgb(var(--theme-color-secondary, 168 85 247) / 0.3) 0%, transparent 70%);
  bottom: -150px;
  left: -150px;
  animation-delay: -7s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgb(var(--theme-color-primary, 59 130 246) / 0.2) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  75% {
    transform: translate(20px, 30px) scale(1.05);
  }
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.back-button:hover {
  color: white;
}

.back-button svg {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.back-button:hover svg {
  transform: translateX(-4px);
}

.login-card {
  background: #1e293b;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo-image {
  max-height: 60px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.logo-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, 
    rgb(var(--theme-color-primary, 59 130 246)) 0%,
    rgb(var(--theme-color-secondary, 168 85 247)) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: white;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.login-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.input-group:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.input-group.focused {
  border-color: rgb(var(--theme-color-primary, 59 130 246));
  box-shadow: 0 0 0 3px rgb(var(--theme-color-primary, 59 130 246) / 0.15);
  background: rgba(255, 255, 255, 0.08);
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.input-icon svg {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.3s ease;
}

.input-group.focused .input-icon svg,
.input-group.has-value .input-icon svg {
  color: rgb(var(--theme-color-primary, 59 130 246));
}

.login-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.875rem 0.875rem 0.875rem 0;
  font-size: 0.9375rem;
  color: white;
  width: 100%;
}

.login-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.login-input:-webkit-autofill,
.login-input:-webkit-autofill:hover,
.login-input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset;
  transition: background-color 5000s ease-in-out 0s;
}

.password-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 4px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.password-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.password-toggle svg {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.2s ease;
}

.password-toggle:hover svg {
  color: rgba(255, 255, 255, 0.8);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: #fca5a5;
  font-size: 0.875rem;
}

.error-message svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.shake-enter-active {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

.login-button {
  position: relative;
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, 
    rgb(var(--theme-color-primary, 59 130 246)) 0%,
    rgb(var(--theme-color-primary, 59 130 246) / 0.8) 100%
  );
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  margin-top: 0.5rem;
}

.login-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 10px 20px -10px rgb(var(--theme-color-primary, 59 130 246) / 0.5),
    0 0 40px -10px rgb(var(--theme-color-primary, 59 130 246) / 0.3);
}

.login-button:hover:not(:disabled)::before {
  opacity: 1;
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-content svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.login-button:hover:not(:disabled) .button-content svg {
  transform: translateX(4px);
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

.spinner-track {
  opacity: 0.25;
}

.spinner-head {
  opacity: 1;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.login-footer p {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (prefers-color-scheme: light) {
  .login-page {
    background: linear-gradient(135deg, 
      rgb(var(--theme-color-background, 241 245 249)) 0%,
      rgb(var(--theme-color-primary, 59 130 246) / 0.1) 50%,
      rgb(var(--theme-color-background, 241 245 249)) 100%
    );
  }
  
  .login-card {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .login-title {
    color: rgb(var(--theme-color-text, 15 23 42));
  }
  
  .login-subtitle {
    color: rgba(0, 0, 0, 0.6);
  }
  
  .input-group {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }
  
  .input-group:hover {
    border-color: rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.04);
  }
  
  .input-icon svg {
    color: rgba(0, 0, 0, 0.4);
  }
  
  .login-input {
    color: rgb(var(--theme-color-text, 15 23 42));
  }
  
  .login-input::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
  
  .password-toggle svg {
    color: rgba(0, 0, 0, 0.4);
  }
  
  .password-toggle:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  
  .password-toggle:hover svg {
    color: rgba(0, 0, 0, 0.7);
  }
  
  .login-footer {
    border-top-color: rgba(0, 0, 0, 0.1);
  }
  
  .login-footer p {
    color: rgba(0, 0, 0, 0.4);
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
}
</style>
