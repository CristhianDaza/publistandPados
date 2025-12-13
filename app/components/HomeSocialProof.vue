<script setup>
const { items, loading, fetchSocialProof } = useSocialProof()

onMounted(() => {
  fetchSocialProof()
})

const displayItems = computed(() => {
  if (!items || !items.value || items.value.length === 0) return []

  return items.value.map((item, index) => ({
    ...item,
    uniqueKey: item.id || `item-${index}`
  }))
})
</script>

<template>
  <section class="py-12 relative overflow-hidden bg-secondary/5 border-y border-secondary/20">
    <div class="absolute inset-0 bg-primary/5 pointer-events-none"/>

    <div class="container mx-auto px-4 mb-8 text-center relative z-10">
      <p class="text-sm font-bold tracking-[0.2em] text-secondary uppercase">
        Marcas que confían en nosotros
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
       <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
    </div>

    <div v-else class="relative flex overflow-x-hidden group py-4">
      <div class="animate-marquee whitespace-nowrap flex items-center">
        <div
          v-for="item in displayItems"
          :key="item.uniqueKey"
          class="mx-8 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100 cursor-pointer transform hover:scale-110"
        >
          <img
            :src="item.logo"
            :alt="item.name"
            class="max-w-full max-h-full object-contain filter drop-shadow-sm"
          >
        </div>
      </div>

      <div class="absolute top-0 py-4 animate-marquee2 whitespace-nowrap flex items-center">
        <div
          v-for="item in displayItems"
          :key="item.uniqueKey + '-duplicate'"
          class="mx-8 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100 cursor-pointer transform hover:scale-110"
        >
          <img
            :src="item.logo"
            :alt="item.name"
            class="max-w-full max-h-full object-contain filter drop-shadow-sm"
          >
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-marquee {
  animation: marquee 25s linear infinite;
}

.animate-marquee2 {
  animation: marquee2 25s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes marquee2 {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
  }
}

.group:hover .animate-marquee,
.group:hover .animate-marquee2 {
  animation-play-state: paused;
}
</style>
