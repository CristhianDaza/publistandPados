<script setup>
import { isProductNew } from '~/utils/products'

const { products, getProducts } = useProducts()

onMounted(() => {
  if (!products.value.length) {
    getProducts()
  }
})

const newProducts = computed(() => {
  return (products.value || []).filter((product) => isProductNew(product))
})

const featuredProducts = computed(() => {
  return newProducts.value.slice(0, 3)
})

const totalNewProducts = computed(() => newProducts.value.length)
</script>

<template>
  <section v-if="totalNewProducts > 0" class="relative overflow-hidden bg-background py-20 md:py-24">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div class="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
    </div>

    <UContainer class="relative z-10">
      <NuxtLink
        to="/products?new=true"
        class="group block overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-background to-secondary/10 p-8 shadow-xl shadow-secondary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 md:p-10"
      >
        <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-3xl">
            <span class="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white">
              NUEVOS
            </span>

            <h2 class="mt-5 text-3xl font-black tracking-tight text-secondary dark:text-white md:text-5xl">
              Productos recien llegados al catalogo
            </h2>

            <p class="mt-4 max-w-2xl text-base leading-relaxed text-text/75 dark:text-white/70 md:text-lg">
              Descubre {{ totalNewProducts }} {{ totalNewProducts === 1 ? 'producto nuevo' : 'productos nuevos' }} y accede al filtro dedicado para verlos todos.
            </p>
          </div>

          <div class="flex items-center gap-3 self-start rounded-2xl border border-primary/20 bg-background/80 px-4 py-3 text-primary shadow-sm shadow-secondary/5 backdrop-blur-sm transition-colors group-hover:bg-primary group-hover:text-white dark:bg-secondary/20 dark:text-white">
            <UIcon name="i-heroicons-sparkles" class="h-6 w-6" />
            <span class="font-semibold">Ver novedades</span>
          </div>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="rounded-2xl border border-secondary/15 bg-background/75 p-4 backdrop-blur-sm transition-colors duration-300 group-hover:border-primary/20 dark:bg-secondary/15"
          >
            <div class="flex items-start gap-4">
              <div class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/80 p-3 shadow-sm dark:bg-black/20">
                <img
                  :src="product.mainImage"
                  :alt="product.name"
                  class="h-full w-full object-contain"
                >
              </div>

              <div class="min-w-0">
                <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Nuevo
                </p>
                <h3 class="mt-2 line-clamp-2 text-base font-bold text-text dark:text-white">
                  {{ product.name }}
                </h3>
                <p v-if="product.category?.[0]" class="mt-2 text-sm text-text/65 dark:text-white/60">
                  {{ product.category[0] }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </UContainer>
  </section>
</template>
