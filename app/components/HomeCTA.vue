<script setup>
import { onMounted } from 'vue'
import { useHomeCTA } from '~/composables/useHomeCTA'

const { ctaConfig, loading, fetchCTA } = useHomeCTA()
const { openModal } = useWhatsApp()

onMounted(() => {
  fetchCTA()
})
</script>

<template>
  <section class="relative py-24 md:py-32 overflow-hidden bg-background">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl animate-pulse"/>
      <div class="absolute bottom-0 left-0 w-[30%] h-[30%] rounded-full bg-secondary/5 blur-3xl animate-pulse delay-1000"/>
    </div>

    <UContainer class="relative z-10">
      <div v-if="loading" class="flex justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary" />
      </div>

      <div v-else-if="ctaConfig" class="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">

        <div class="flex-1 text-center lg:text-left space-y-8">

          <div class="inline-flex items-center gap-3 justify-center lg:justify-start">
            <div class="h-px w-8 bg-primary/50"/>
            <span class="text-primary font-bold tracking-[0.2em] text-xs uppercase">
              {{ ctaConfig.tagline }}
            </span>
            <div class="h-px w-8 bg-primary/50"/>
          </div>

          <h2 class="text-4xl md:text-5xl lg:text-6xl font-black text-text leading-tight tracking-tight">
            {{ ctaConfig.title }}
            <br >
            <span class="text-primary relative inline-block">
              {{ ctaConfig.subtitle }}
              <svg class="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C50 3 100 2 150 6C200 10 250 8 298 4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </span>
          </h2>

          <p class="text-lg md:text-xl text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
            {{ ctaConfig.description }}
          </p>

          <ul class="space-y-4 text-left max-w-xl mx-auto lg:mx-0 pt-2">
            <li v-for="(feature, index) in ctaConfig.features" :key="index" class="flex items-center gap-4 group">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <UIcon name="i-heroicons-check" class="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <span class="text-text font-medium text-lg">{{ feature }}</span>
            </li>
          </ul>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
            <UButton
              v-if="ctaConfig.primaryButton"
              size="xl"
              class="font-bold shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              :ui="{ rounded: 'rounded-full', padding: { xl: 'px-8 py-4' } }"
              color="primary"
              icon="i-logos-whatsapp-icon"
              @click="openModal()"
            >
              {{ ctaConfig.primaryButton.text }}
            </UButton>

            <UButton
              v-if="ctaConfig.secondaryButton"
              :to="ctaConfig.secondaryButton.link"
              size="xl"
              variant="outline"
              class="font-bold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              :ui="{ rounded: 'rounded-full', padding: { xl: 'px-8 py-4' } }"
              color="gray"
              icon="i-heroicons-document-arrow-down"
            >
              {{ ctaConfig.secondaryButton.text }}
            </UButton>
          </div>

          <div class="flex flex-wrap gap-8 justify-center lg:justify-start pt-8 border-t border-gray-200 dark:border-gray-800">
            <div v-for="(stat, index) in ctaConfig.stats" :key="index" class="text-center">
              <div class="text-3xl font-black text-text">{{ stat.value }}</div>
              <div class="text-sm text-secondary font-medium uppercase tracking-wider">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <div class="flex-1 relative w-full max-w-md lg:max-w-xl">
          <div class="relative group">
            <div class="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2rem] transform rotate-3 group-hover:rotate-6 transition-transform duration-500"/>
            <div class="relative rounded-[2rem] overflow-hidden shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-white dark:bg-gray-900">
               <img
                :src="ctaConfig.image"
                :alt="ctaConfig.title"
                class="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              >
              <div class="absolute bottom-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 animate-bounce-slow">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                     <UIcon name="i-heroicons-chat-bubble-left-right" class="w-6 h-6" />
                  </div>
                  <div>
                    <div class="text-xs text-secondary font-bold uppercase">Soporte</div>
                    <div class="text-sm font-black text-text">En línea ahora</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounce 3s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
