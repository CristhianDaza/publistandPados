<template>
  <div class="relative grid grid-cols-1 w-full overflow-hidden group bg-gray-900">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="col-start-1 row-start-1 w-full transition-opacity duration-1000 ease-in-out"
      :class="{ 'opacity-100 z-10': currentSlide === index, 'opacity-0 z-0': currentSlide !== index }"
    >
      <NuxtLink
        v-if="item.link"
        :to="item.link"
        class="block w-full h-full cursor-pointer"
      >
        <img
          :src="item.image"
          :alt="item.title || 'Carousel image'"
          class="w-full h-auto object-cover"
        />
      </NuxtLink>
      <img
        v-else
        :src="item.image"
        :alt="item.title || 'Carousel image'"
        class="w-full h-auto object-cover"
      />
      
      <div 
        v-if="item.title || item.description"
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
      ></div>

      <div 
        v-if="item.title || item.description"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div class="text-center px-4 max-w-4xl mx-auto transform transition-transform duration-1000 delay-300 pointer-events-auto"
             :class="{ 'translate-y-0 opacity-100': currentSlide === index, 'translate-y-10 opacity-0': currentSlide !== index }">
          <h2 v-if="item.title" class="text-xl md:text-5xl lg:text-7xl font-bold text-white mb-2 md:mb-6 tracking-tight">
            {{ item.title }}
          </h2>
          <p v-if="item.description" class="text-sm md:text-xl lg:text-2xl text-gray-200 mb-4 md:mb-8 font-light">
            {{ item.description }}
          </p>
          <UButton
            v-if="item.link"
            :to="item.link"
            size="xl"
            color="white"
            variant="solid"
            class="px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Ver más
          </UButton>
        </div>
      </div>
    </div>

    <button
      @click="prevSlide"
      class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110"
      style="background-color: rgba(var(--theme-color-primary), 0.8)"
    >
      <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 md:w-8 md:h-8" />
    </button>
    <button
      @click="nextSlide"
      class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110"
      style="background-color: rgba(var(--theme-color-primary), 0.8)"
    >
      <UIcon name="i-heroicons-chevron-right" class="w-6 h-6 md:w-8 md:h-8" />
    </button>

    <div class="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
      <button
        v-for="(_, index) in items"
        :key="index"
        @click="goToSlide(index)"
        class="h-3 rounded-full transition-all duration-300 cursor-pointer"
        :class="currentSlide === index ? 'w-8' : 'w-3 hover:bg-white/80'"
        :style="{ backgroundColor: currentSlide === index ? 'rgb(var(--theme-color-primary))' : 'rgba(var(--theme-color-primary), 0.3)' }"
      ></button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  autoplayInterval: {
    type: Number,
    default: 5000
  }
})

const currentSlide = ref(0)
let intervalId = null

const resetAutoplay = () => {
  stopAutoplay()
  startAutoplay()
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.items.length
  resetAutoplay()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + props.items.length) % props.items.length
  resetAutoplay()
}

const goToSlide = (index) => {
  currentSlide.value = index
  resetAutoplay()
}

const startAutoplay = () => {
  if (props.items.length > 1) {
    stopAutoplay()
    intervalId = setInterval(nextSlide, props.autoplayInterval)
  }
}

const stopAutoplay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>
