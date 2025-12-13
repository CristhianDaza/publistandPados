<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUsers } from '~/composables/useUsers'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const { getUserById, createUser, updateUser } = useUsers()

const isNew = route.params.id === 'new'
const itemId = isNew ? null : route.params.id
const loading = ref(false)
const saving = ref(false)
const validationErrors = ref({})

useHead({
  title: isNew ? 'Nuevo usuario' : 'Editar usuario'
})

const form = reactive({
  id: '',
  name: '',
  email: '',
  role: 'cliente',
  priceIncrease: 0,
  active: true,
  password: ''
})

const validateForm = () => {
  const errors = {}
  if (!form.name || !form.name.trim()) {
    errors.name = 'El nombre es obligatorio'
  }
  if (!form.email || !form.email.trim()) {
    errors.email = 'El correo es obligatorio'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      errors.email = 'El correo no es válido'
    }
  }
  if (!form.role) {
    errors.role = 'El rol es obligatorio'
  } else if (!['admin', 'cliente', 'asesor'].includes(form.role)) {
    errors.role = 'Rol no válido'
  }
  const value = Number(form.priceIncrease)
  if (Number.isNaN(value)) {
    errors.priceIncrease = 'El incremento debe ser un número'
  } else if (value < 0 || value > 100) {
    errors.priceIncrease = 'El incremento debe estar entre 0 y 100'
  }
  if (isNew && (!form.password || !form.password.trim())) {
    errors.password = 'La contraseña es obligatoria'
  }
  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

onMounted(async () => {
  if (!isNew) {
    loading.value = true
    try {
      const item = await getUserById(itemId)
      if (item) {
        form.id = item.id || ''
        form.name = item.name || ''
        form.email = item.email || ''
        form.role = item.role || 'cliente'
        form.priceIncrease = item.priceIncrease ?? 0
        form.active = typeof item.active === 'boolean' ? item.active : true
      }
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }
})

const handleSave = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    if (!form.id && !isNew) {
      form.id = itemId || ''
    }

    const baseData = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      priceIncrease: Number(form.priceIncrease),
      active: !!form.active
    }

    if (isNew) {
      const data = {
        ...baseData,
        password: form.password.trim()
      }
      await createUser(data)
    } else if (itemId) {
      const data = {
        id: form.id,
        ...baseData
      }
      await updateUser(itemId, data)
    }

    await router.push('/admin/users')
  } catch (error) {
    console.error('Error saving user:', error)
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  router.push('/admin/users')
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto pb-12 px-4 md:px-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">
        {{ isNew ? 'Nuevo usuario' : 'Editar usuario' }}
      </h1>
      <p class="text-slate-400">Configura la información del usuario.</p>
    </div>

    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-24 bg-slate-900 rounded-xl border border-slate-800"
    >
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-blue-500 animate-spin mb-4" />
      <p class="text-slate-400">Cargando información...</p>
    </div>

    <form
      v-else
      class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg"
      @submit.prevent="handleSave"
    >
      <div class="p-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-white font-bold text-lg mb-3">Nombre</label>
            <UInput
              v-model="form.name"
              placeholder="Ej: Juan Pérez"
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
            <p v-if="validationErrors.name" class="text-red-400 text-sm mt-1">
              {{ validationErrors.name }}
            </p>
          </div>

          <div>
            <label class="block text-white font-bold text-lg mb-3">Correo</label>
            <UInput
              v-model="form.email"
              placeholder="Ej: usuario@dominio.com"
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
            <p v-if="validationErrors.email" class="text-red-400 text-sm mt-1">
              {{ validationErrors.email }}
            </p>
          </div>

          <div v-if="isNew">
            <label class="block text-white font-bold text-lg mb-3">Contraseña</label>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Contraseña del usuario"
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
            <p v-if="validationErrors.password" class="text-red-400 text-sm mt-1">
              {{ validationErrors.password }}
            </p>
          </div>

          <div>
            <label class="block text-white font-bold text-lg mb-3">Rol</label>
            <div class="relative">
              <select
                v-model="form.role"
                class="w-full bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="admin">Admin</option>
                <option value="cliente">Cliente</option>
                <option value="asesor">Asesor</option>
              </select>
              <UIcon
                name="i-heroicons-chevron-down"
                class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              />
            </div>
            <p v-if="validationErrors.role" class="text-red-400 text-sm mt-1">
              {{ validationErrors.role }}
            </p>
          </div>

          <div>
            <label class="block text-white font-bold text-lg mb-3">Incremento de precio (%)</label>
            <UInput
              v-model="form.priceIncrease"
              type="number"
              size="xl"
              min="0"
              max="100"
              placeholder="0"
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
            <p v-if="validationErrors.priceIncrease" class="text-red-400 text-sm mt-1">
              {{ validationErrors.priceIncrease }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <UCheckbox v-model="form.active" label="Usuario activo" />
          </div>
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
          label="Guardar cambios"
          class="px-8 font-bold cursor-pointer"
        />
      </div>
    </form>
  </div>
</template>

