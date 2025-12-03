<template>
  <section class="py-24 relative bg-white dark:bg-gray-900 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-500/5 blur-3xl animate-pulse"></div>
      <div class="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <UContainer>
      <div class="text-center mb-16 relative z-10">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-700 via-primary-600 to-purple-700 dark:from-primary-400 dark:via-primary-300 dark:to-purple-400 bg-clip-text text-transparent animate-gradient-x pb-2">
          {{ title }}
        </h2>
      </div>

      <div class="relative grid gap-8 md:grid-cols-3">
        <div class="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent -z-10 border-t-2 border-dashed border-gray-300 dark:border-gray-700" />

        <div
          v-for="(step, index) in steps"
          :key="step.id"
          ref="stepRefs"
          class="relative group opacity-0 translate-y-8 transition-all duration-700 ease-out"
          :style="{ transitionDelay: `${index * 200}ms` }"
        >
          <div class="h-full p-8 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div class="mb-6 relative inline-block">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <UIcon :name="step.icon" class="w-8 h-8 text-white" />
              </div>
              <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-2 border-primary-500 flex items-center justify-center font-bold text-primary-500 shadow-sm">
                {{ index + 1 }}
              </div>
            </div>

            <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">
              {{ step.title }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>

      <div 
        ref="microCopyRef"
        class="mt-16 text-center opacity-0 translate-y-4 transition-all duration-700 ease-out delay-700"
      >
        <div class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400 font-medium text-sm">
          {{ guarantee }}
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup>
const { title, steps, guarantee } = useProcess()

const stepRefs = ref([])
const microCopyRef = ref(null)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-8', 'translate-y-4')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  })

  stepRefs.value.forEach((el) => {
    if (el) observer.observe(el)
  })

  if (microCopyRef.value) {
    observer.observe(microCopyRef.value)
  }
})
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

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 8s ease infinite;
}
</style>
