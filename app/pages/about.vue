<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold">Sobre Nosotros</h1>
    <p class="mt-4">Pagina de sobre nosotros</p>
  </UContainer>
</template>

<script setup>
const { setPageSeo } = useSeo()

setPageSeo({
  title: 'Sobre Nosotros',
  description: 'Conoce a Publistandpados, expertos en artículos promocionales y publicitarios personalizados para empresas en Colombia.'
})
</script>
