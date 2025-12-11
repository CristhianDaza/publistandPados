<script setup>
const { isModalOpen, closeModal, contacts, fetchContacts, loading, currentMessage } = useWhatsApp()

onMounted(() => {
  fetchContacts()
})

const activeContacts = computed(() => {
  return contacts.value.filter(c => c.active)
})

const getWhatsAppLink = (contact) => {
  const phone = contact.phone.replace(/\D/g, '')
  const text = currentMessage.value ? `&text=${encodeURIComponent(currentMessage.value)}` : ''
  return `https://wa.me/${phone}?${text}`
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click="closeModal"
      >
        <div
          class="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all"
          @click.stop
        >
          <div class="bg-[#075E54] p-6 text-center relative overflow-hidden">
             <div class="absolute inset-0 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] opacity-10"/>
             <button
               class="cursor-pointer absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
               @click="closeModal"
             >
               <UIcon name="i-heroicons-x-mark" class="text-xl" />
             </button>

             <UIcon name="i-simple-icons-whatsapp" class="text-4xl text-white mb-2 relative z-10" />
             <h3 class="text-white font-bold text-xl relative z-10">Contáctanos</h3>
             <p class="text-white/80 text-sm relative z-10">Selecciona un asesor para chatear</p>
          </div>

          <div class="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div v-if="loading" class="flex justify-center py-8">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-[#25D366]" />
            </div>

            <div v-else-if="activeContacts.length === 0" class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400">No hay asesores disponibles en este momento.</p>
            </div>

            <div v-else class="space-y-3">
              <a
                v-for="contact in activeContacts"
                :key="contact.id"
                :href="getWhatsAppLink(contact)"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700 group"
              >
                  <div class="relative w-14 h-14">
                    <img
                      :src="contact.image || 'https://avatars.githubusercontent.com/u/739984?v=4'"
                      :alt="contact.name"
                      class="w-full h-full rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#25D366] transition-all"
                    >
                    <div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"/>
                  </div>

                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 dark:text-white group-hover:text-[#075E54] dark:group-hover:text-[#25D366] transition-colors">
                    {{ contact.name }}
                  </h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ contact.role }}</p>
                </div>

                <UIcon name="i-heroicons-chevron-right" class="text-gray-300 group-hover:text-[#25D366] transition-colors" />
              </a>
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-slate-950/50 text-center text-xs text-gray-400 border-t border-gray-100 dark:border-slate-800">
            Respuesta habitual en pocos minutos
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
</style>
