<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-secondary/20 backdrop-blur-xl bg-background/70 transition-all duration-300 supports-[backdrop-filter]:bg-background/60"
    :class="{ 'shadow-sm': isScrolled }"
  >
    <UContainer class="h-16 flex items-center justify-between">
      <div class="flex items-center gap-2 z-50 relative">
        <NuxtLink to="/" class="group flex items-center gap-2" @click="isOpen = false">
          <ClientOnly>
            <div v-if="logo && (logo.url || logo.urlDark)" class="relative flex h-10 w-auto items-center justify-center transition-transform duration-300 group-hover:scale-105">
               <img :src="isDark && logo.urlDark ? logo.urlDark : logo.url" :alt="logo.name || 'Logo'" class="h-full w-auto object-contain" />
            </div>
            <div v-else class="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
               <span class="font-bold text-lg">P</span>
            </div>
          </ClientOnly>
          <span class="text-xl font-bold tracking-tight text-text group-hover:text-primary transition-colors">
            Publistand Pados
          </span>
        </NuxtLink>
      </div>
      <nav class="hidden md:flex items-center gap-2">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.id"
          :to="item.to"
          class="relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out
                 text-secondary
                 hover:bg-secondary/10 hover:text-primary
                 active:scale-95"
          active-class="!text-primary bg-primary/10 font-semibold"
        >
          {{ item.label }}
        </NuxtLink>
        <ClientOnly>
          <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
            color="gray"
            variant="ghost"
            aria-label="Theme"
            class="ml-2 cursor-pointer"
            @click="isDark = !isDark"
          />
        </ClientOnly>
      </nav>
      <div class="flex items-center gap-2 md:hidden">
        <ClientOnly>
          <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
            color="gray"
            variant="ghost"
            aria-label="Theme"
            class="cursor-pointer"
            @click="isDark = !isDark"
          />
        </ClientOnly>

        <button
          type="button"
          class="relative z-50 flex h-10 w-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-secondary/10 cursor-pointer"
          @click="isOpen = !isOpen"
          aria-label="Toggle menu"
        >
          <div class="relative h-4 w-5 overflow-hidden">
            <span
              class="absolute left-0 h-0.5 w-full bg-current transition-all duration-300 ease-out"
              :class="isOpen ? 'top-1.5 rotate-45' : 'top-0'"
            />
            <span
              class="absolute left-0 top-1.5 h-0.5 w-full bg-current transition-all duration-300 ease-out"
              :class="isOpen ? 'opacity-0 translate-x-full' : 'opacity-100'"
            />
            <span
              class="absolute left-0 h-0.5 w-full bg-current transition-all duration-300 ease-out"
              :class="isOpen ? 'top-1.5 -rotate-45' : 'top-3'"
            />
          </div>
        </button>
      </div>

      <ClientOnly>
        <Teleport to="body">
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
          >
            <div
              v-if="isOpen"
              class="fixed inset-0 z-40 flex flex-col bg-background/95 backdrop-blur-xl md:hidden pt-24 px-6"
            >
               <nav class="flex flex-col gap-6">
                  <NuxtLink
                    v-for="(item, index) in menuItems"
                    :key="item.id"
                    :to="item.to"
                    class="text-2xl font-semibold text-text hover:text-primary transition-all duration-200 active:scale-95 origin-left"
                    active-class="text-primary"
                    :style="{ transitionDelay: `${index * 50}ms` }"
                    @click="isOpen = false"
                  >
                    {{ item.label }}
                  </NuxtLink>
               </nav>
               <div v-if="menuItems.length === 0 && !loading" class="mt-auto mb-10">
                  <UButton
                    block
                    color="primary"
                    variant="soft"
                    size="xl"
                    @click="handleInitialize"
                  >
                    Initialize Menu
                  </UButton>
               </div>
            </div>
          </Transition>
        </Teleport>
      </ClientOnly>
    </UContainer>
  </header>
</template>

<script setup>
const { menuItems, fetchMenu, initializeMenu, loading } = useMenu()
const { logo, initializeLogo } = useLogo()
const isOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()
const colorMode = useColorMode()

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

await fetchMenu()
await initializeLogo()

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

const handleInitialize = async () => {
  await initializeMenu()
  isOpen.value = false
}

watch(isOpen, (value) => {
  if (import.meta.client) {
    if (value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

watch(() => route.path, () => {
  isOpen.value = false
})
</script>
