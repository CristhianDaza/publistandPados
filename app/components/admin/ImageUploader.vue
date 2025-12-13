<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  folder: {
    type: String,
    default: 'publistandpados'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const { uploadImage } = useCloudinary()
const toast = useToast()

const dragging = ref(false)
const uploading = ref(false)
const fileInput = ref(null)

const handleDrop = async (e) => {
  dragging.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    await handleUpload(files[0])
  }
}

const handleFileSelect = async (e) => {
  const files = e.target.files
  if (files.length > 0) {
    await handleUpload(files[0])
  }
}

const handleUpload = async (file) => {
  if (!file.type.startsWith('image/')) {
    toast.add({ title: 'Error', description: 'Por favor sube solo imágenes', color: 'red' })
    return
  }

  uploading.value = true
  try {
    const data = await uploadImage(file)
    emit('update:modelValue', data.secure_url)
    emit('change', data.secure_url)
    toast.add({ title: 'Éxito', description: 'Imagen subida correctamente' })
  } catch (error) {
    toast.add({ title: 'Error', description: 'Error al subir la imagen', color: 'red' })
  } finally {
    uploading.value = false
  }
}

const removeImage = () => {
  emit('update:modelValue', '')
  emit('change', '')
}

const triggerSelect = () => {
  fileInput.value.click()
}
</script>

<template>
  <div class="w-full">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    >
    <div 
      v-if="modelValue" 
      class="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-video md:aspect-[21/9] flex items-center justify-center"
    >
      <img :src="modelValue" class="w-full h-full object-contain" />
      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
        <UButton
          color="white"
          variant="solid"
          icon="i-heroicons-arrow-path"
          label="Cambiar"
          class="cursor-pointer"
          @click="triggerSelect"
        />
        <UButton
          color="red"
          variant="soft"
          icon="i-heroicons-trash"
          label="Eliminar"
          class="cursor-pointer"
          @click="removeImage"
        />
      </div>
    </div>
    <div
      v-else
      class="relative rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-8 md:p-12 cursor-pointer group"
      :class="[
        dragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800'
      ]"
      @dragenter.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="triggerSelect"
    >
      <div v-if="uploading" class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p class="text-white font-medium">Subiendo imagen...</p>
      </div>

      <div v-else class="text-center pointer-events-none">
        <div class="w-16 h-16 rounded-full bg-slate-800 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
          <UIcon name="i-heroicons-cloud-arrow-up" class="w-8 h-8 text-blue-400" />
        </div>
        <p class="text-lg font-bold text-white mb-1">Haz clic o arrastra una imagen aquí</p>
        <p class="text-slate-400 text-sm">Soporta JPG, PNG, WEBP</p>
      </div>
    </div>
  </div>
</template>
