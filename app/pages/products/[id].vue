<template>
  <UContainer class="py-12">
    <div class="max-w-7xl mx-auto">
      <UButton 
        to="/products"
        icon="i-heroicons-arrow-left" 
        variant="ghost" 
        color="gray" 
        class="mb-8 hover:text-primary"
      >
        Volver a Productos
      </UButton>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <h1 class="text-3xl font-bold mb-4">Producto {{ route.params.id }}</h1>
        <p class="text-gray-500">Detalles del producto próximamente.</p>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
const route = useRoute()
</script>
