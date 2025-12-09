<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold">Contacto</h1>
    <p class="mt-4">Pagina de contacto</p>
  </UContainer>
</template>

<script setup>
const { setPageSeo } = useSeo()

setPageSeo({
  title: 'Contacto',
  description: 'Contáctanos para cotizar artículos promocionales personalizados. Atención personalizada para tu empresa.'
})
</script>
