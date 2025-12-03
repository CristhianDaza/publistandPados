<template>
  <section class="relative bg-white dark:bg-gray-900 overflow-hidden">
    <!-- New Background: Subtle Stains/Blobs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-500/5 blur-3xl animate-pulse"></div>
      <div class="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style="animation-delay: 4s;"></div>
    </div>
    
    <UContainer class="py-32 relative z-10">
      <div class="text-center mb-32 relative z-10 animate-fade-in">
        <div class="inline-flex items-center gap-3 mb-8">
          <div class="h-px w-12 bg-gradient-to-r from-transparent to-primary-500"></div>
          <span class="py-2 px-4 rounded-full bg-gradient-to-r from-primary-500/10 via-primary-600/10 to-purple-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm">
            Lifestyle & Business
          </span>
          <div class="h-px w-12 bg-gradient-to-l from-transparent to-primary-500"></div>
        </div>
        
        <h2 class="text-6xl md:text-8xl font-black mb-10 tracking-tight leading-[0.9] px-4">
          <span class="inline-block text-gray-900 dark:text-white transform hover:scale-105 transition-transform duration-300">
            Inspiración
          </span>
          <br />
          <!-- Improved Text Visibility: Darker gradient start and end -->
          <span class="inline-block bg-gradient-to-r from-primary-700 via-primary-600 to-purple-700 dark:from-primary-400 dark:via-primary-300 dark:to-purple-400 bg-clip-text text-transparent animate-gradient-x pb-2">
            que Transforma
          </span>
        </h2>
        
        <p class="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed px-4">
          Donde cada <span class="relative inline-block font-semibold text-primary-600 dark:text-primary-400">
            detalle cuenta
            <svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 10C50 5 100 2 150 5C200 8 250 3 298 7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </span> una historia
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-24">
        <div class="relative">
          <UIcon name="i-heroicons-arrow-path" class="w-16 h-16 animate-spin text-primary-500" />
          <div class="absolute inset-0 blur-xl bg-primary-500/20 animate-pulse"></div>
        </div>
      </div>

      <div v-else class="space-y-48">
        <div
          v-for="(item, index) in inspirationItems"
          :key="item.id"
          :class="[
            'group relative grid md:grid-cols-2 gap-12 lg:gap-20 items-center',
            index % 2 === 1 ? 'md:grid-flow-dense' : ''
          ]"
          :style="{ animationDelay: `${index * 100}ms` }"
          class="animate-slide-up"
        >
          <div 
            :class="[
              'relative overflow-hidden rounded-3xl shadow-2xl min-h-[500px] lg:min-h-[600px] parallax-container',
              index % 2 === 1 ? 'md:col-start-2' : ''
            ]"
          >
            <div class="absolute inset-0 parallax-image scale-110 transition-transform duration-[1500ms] ease-out group-hover:scale-100">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover"
              />
            </div>
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700"></div>
            
            <div class="absolute top-8 right-8 z-10">
              <div class="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-700">
                <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-white" />
              </div>
            </div>

             <div v-if="item.buttons && item.buttons.length" class="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 md:hidden">
              <span class="inline-block px-3 py-1 rounded-full bg-primary-500/90 backdrop-blur-sm text-white text-xs font-bold tracking-wider uppercase mb-3">
                {{ item.collection }}
              </span>
              <button class="flex items-center gap-2 text-white font-semibold text-lg group-hover:gap-4 transition-all">
                {{ item.buttons[0].label }}
                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div 
            :class="[
              'relative space-y-8 px-4 md:px-0',
              index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''
            ]"
          >
            <div class="inline-flex items-center gap-3 mb-4">
              <div class="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"></div>
              <span class="text-primary-600 dark:text-primary-400 font-bold tracking-[0.15em] text-sm uppercase">
                {{ item.collection }}
              </span>
            </div>

            <h3 class="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight">
              <span class="inline-block text-gray-900 dark:text-white transform group-hover:translate-x-2 transition-transform duration-500">
                {{ item.title.split(' ')[0] }}
              </span>
              <br v-if="item.title.split(' ').length > 1" />
              <span 
                v-if="item.title.split(' ').length > 1"
                class="inline-block bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent transform group-hover:translate-x-2 transition-transform duration-700"
              >
                {{ item.title.split(' ').slice(1).join(' ') }}
              </span>
            </h3>

            <p class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-light max-w-xl">
              {{ item.description }}
            </p>

            <div v-if="item.buttons && item.buttons.length > 0" class="flex flex-wrap gap-4 pt-4">
              <UButton
                v-for="btn in item.buttons"
                :key="btn.label"
                :to="btn.link"
                :variant="btn.variant === 'primary' ? 'solid' : 'outline'"
                :color="btn.variant === 'primary' ? 'primary' : 'gray'"
                size="xl"
                :ui="{ 
                  rounded: 'rounded-full', 
                  padding: { xl: 'px-8 py-4' },
                  font: 'font-bold',
                  variant: {
                    solid: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl hover:shadow-primary-500/30',
                    outline: 'border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                  }
                }"
                class="transition-all duration-300 hover:-translate-y-1"
              >
                {{ btn.label }}
                <template #trailing>
                   <UIcon v-if="btn.variant === 'primary'" name="i-heroicons-arrow-right" class="w-5 h-5" />
                </template>
              </UButton>
            </div>

            <div v-if="item.footer" class="flex items-center gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-4">
                 <div class="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 ring-1 ring-primary-100 dark:ring-primary-800">
                    <UIcon name="i-heroicons-star" class="w-6 h-6" />
                 </div>
                 <div>
                    <p class="font-bold text-lg text-gray-900 dark:text-white leading-tight">{{ item.footer.highlight }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.footer.subtext }}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, nextTick } from 'vue'

const { inspirationItems, loading, fetchInspiration } = useInspiration()
let observer = null

const setupObserver = () => {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    },
    { threshold: 0.1 }
  )

  const animateElements = document.querySelectorAll('.animate-slide-up, .animate-fade-in')
  animateElements.forEach((el) => observer.observe(el))
}

onMounted(() => {
  fetchInspiration()
  window.addEventListener('scroll', handleScroll)
  setupObserver()
})

watch(inspirationItems, async () => {
  await nextTick()
  setupObserver()
}, { deep: true })

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer) observer.disconnect()
})

const handleScroll = () => {
  const containers = document.querySelectorAll('.parallax-container')
  
  containers.forEach(container => {
    const rect = container.getBoundingClientRect()
    const windowHeight = window.innerHeight
    
    if (rect.top < windowHeight && rect.bottom > 0) {
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height)
      const parallaxImage = container.querySelector('.parallax-image')
      
      if (parallaxImage) {
        const translateY = (scrollProgress - 0.5) * -60
        parallaxImage.style.transform = `translateY(${translateY}px) scale(1.1)`
      }
    }
  })
}
</script>

<style scoped>
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 8s ease infinite;
}

.animate-slide-up {
  opacity: 0;
  transform: translateY(60px);
}

.animate-slide-up.in-view {
  animation: slide-up 0.8s ease forwards;
}

.animate-fade-in {
  opacity: 0;
}

.animate-fade-in.in-view {
  animation: fade-in 1s ease forwards;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}
</style>
