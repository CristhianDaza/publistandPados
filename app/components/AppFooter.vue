<template>
  <footer class="border-t border-secondary/20 bg-background/50 backdrop-blur-sm mt-auto">
    <UContainer class="pt-12 pb-8 md:pt-16 md:pb-8 max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div class="space-y-4">
          <NuxtLink to="/" class="flex items-center gap-2 group">
          <ClientOnly>
            <div v-if="logo && (logo.url || logo.urlDark)" class="relative flex h-10 w-auto items-center justify-center transition-transform duration-300 group-hover:scale-105">
               <img :src="isDark && logo.urlDark ? logo.urlDark : logo.url" :alt="logo.name || 'Logo'" class="h-full w-auto object-contain" />
            </div>
            <div v-else class="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
               <span class="font-bold text-lg">P</span>
            </div>
          </ClientOnly>
            <span class="text-2xl font-bold tracking-tight text-text group-hover:text-primary transition-colors">
              Publistandpados
            </span>
          </NuxtLink>
          <p class="text-secondary text-sm leading-relaxed max-w-xs">
            Transformamos espacios en experiencias memorables. Diseño y producción de stands que cautivan.
          </p>
          <div class="flex gap-4 pt-2">
            <UButton
              v-for="social in socialLinks"
              :key="social.id"
              :to="handleSocialLink(social) ? undefined : social.to"
              target="_blank"
              color="gray"
              variant="ghost"
              :icon="social.icon"
              size="lg"
              class="hover:text-primary hover:bg-primary/10 transition-colors"
              @click="handleSocialClick($event, social)"
            />
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-text mb-4 text-lg">Enlaces Rápidos</h3>
          <ul class="space-y-3">
            <li v-for="item in menuItems" :key="item.id">
              <NuxtLink 
                :to="item.to"
                class="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-2 group"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-text mb-4 text-lg">Contacto</h3>
          <ul class="space-y-4" v-if="footerConfig?.contact">
            <li v-if="footerConfig.contact.address" class="flex items-start gap-3 text-sm text-secondary">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span class="whitespace-pre-line">{{ footerConfig.contact.address }}</span>
            </li>
            <li v-if="footerConfig.contact.phone" class="flex items-center gap-3 text-sm text-secondary">
              <UIcon name="i-heroicons-phone" class="w-5 h-5 text-primary shrink-0" />
              <button @click="openModal()" class="hover:text-primary transition-colors text-left">
                {{ footerConfig.contact.phone }}
              </button>
            </li>
            <li v-if="footerConfig.contact.email" class="flex items-center gap-3 text-sm text-secondary">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-primary shrink-0" />
              <span>{{ footerConfig.contact.email }}</span>
            </li>
          </ul>
        </div>

        <div v-if="footerConfig?.cta">
          <h3 class="font-semibold text-text mb-4 text-lg">{{ footerConfig.cta.title }}</h3>
          <p class="text-secondary text-sm mb-6">
            {{ footerConfig.cta.text }}
          </p>
          <UButton
            block
            size="lg"
            color="primary"
            variant="solid"
            :label="footerConfig.cta.buttonText"
            class="cursor-pointer font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
            :ui="{ rounded: 'rounded-xl' }"
            @click="openModal('Hola, quisiera iniciar un proyecto con ustedes.')"
          />
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-secondary text-sm text-center md:text-left">
          &copy; {{ new Date().getFullYear() }} PubliStand. Todos los derechos reservados.
        </p>
        <div class="flex gap-6 text-sm text-secondary">
          <!-- <NuxtLink to="/privacidad" class="hover:text-primary transition-colors">Privacidad</NuxtLink> -->
          <!-- <NuxtLink to="/terminos" class="hover:text-primary transition-colors">Términos</NuxtLink> -->
        </div>
      </div>
    </UContainer>
    <div class="border-t border-gray-200 bg-gray-50 py-4 text-center text-sm text-gray-500">
      <p>
        Designed & Developed by
        <a
          href="https://cris-dev.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-300 underline underline-offset-2 decoration-gray-400 hover:decoration-indigo-600"
        >
          cris-dev.com
        </a>
        <span> | Made with </span>
        <span class="ml-1 text-blue-500 animate-pulse">💙</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
const { menuItems, fetchMenu } = useMenu()
const { socialLinks, footerConfig, fetchFooterData } = useFooter()
const { logo, initializeLogo } = useLogo()
const { openModal } = useWhatsApp()
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

await Promise.all([
  fetchMenu(),
  fetchFooterData(),
  initializeLogo()
])

const handleSocialLink = (social) => {
  return social.icon?.toLowerCase().includes('whatsapp') || social.to?.includes('wa.me') || social.to?.includes('whatsapp')
}

const handleSocialClick = (e, social) => {
  if (handleSocialLink(social)) {
    e.preventDefault()
    openModal()
  }
}
</script>
