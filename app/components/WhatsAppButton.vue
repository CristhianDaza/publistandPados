<template>
  <ClientOnly>
    <Transition
      appear
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-50"
      enter-to-class="opacity-100 scale-100"
    >
      <div
        v-if="whatsappUrl"
        class="fixed bottom-6 left-6 z-50 flex items-center justify-center group"
      >
        <div class="absolute inset-0 z-0 animate-ping rounded-full bg-[#25D366] opacity-75 duration-1000"></div>
        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] hover:shadow-[#25D366]/60 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
          aria-label="Contact on WhatsApp"
        >
          <UIcon name="i-simple-icons-whatsapp" class="h-8 w-8" />
        </a>
        <div class="absolute left-full ml-4 w-max px-3 py-2 rounded-lg text-sm font-medium 
                    bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
                    text-gray-900 dark:text-white
                    ring-1 ring-gray-200 dark:ring-gray-800
                    shadow-xl
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-300 -translate-x-2 group-hover:translate-x-0
                    z-50 pointer-events-none"
        >
          ¡Chatea con nosotros ahora!
          <div class="absolute top-1/2 -left-1 -mt-1 h-2 w-2 rotate-45 
                      bg-white/90 dark:bg-gray-900/90 
                      border-l border-b border-gray-200 dark:border-gray-800"
          ></div>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup>
const { footerConfig } = useFooter()

const whatsappUrl = computed(() => {
  const phone = footerConfig.value?.contact?.phone
  if (!phone) return null
  const cleanPhone = phone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}`
})
</script>
