<script setup>
const modelValue = defineModel({ type: String, default: '' })
</script>

<template>
  <div class="relative group w-full">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <UIcon
        name="i-heroicons-magnifying-glass"
        class="w-5 h-5 text-secondary group-focus-within:text-primary transition-colors duration-200"
      />
    </div>
    <input
      v-model="modelValue"
      type="text"
      placeholder="Buscar por nombre, correo, teléfono, estado o ID..."
      class="w-full pl-10 pr-4 py-2.5 text-sm
             bg-white dark:bg-gray-900/80
             border border-gray-300 dark:border-secondary/30
             rounded-xl
             text-black dark:text-white
             placeholder-gray-400 dark:placeholder-secondary/60
             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
             transition-all duration-200
             hover:border-primary/50 dark:hover:border-secondary/50
             shadow-sm"
    >
  </div>
</template>

