<script setup>
import emailjs from '@emailjs/browser'

const { setPageSeo } = useSeo()
const config = useRuntimeConfig()
const toast = useToast()

setPageSeo({
  title: 'Contacto',
  description: 'Contáctanos para tus necesidades de artículos promocionales.'
})

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const sent = ref(false)

const sendEmail = async () => {
  if (loading.value) return

  loading.value = true
  const emailServiceId = config.public.emailjsServiceId
  const emailTemplateId = config.public.emailjsTemplateId
  const emailPublicKey = config.public.emailjsPublicKey

  if (!emailServiceId || !emailTemplateId || !emailPublicKey) {
    console.error('EmailJS configuration missing')
    toast.add({
      title: 'Error de configuración',
      description: 'Hubo un problema con la configuración del correo.',
      color: 'red'
    })
    loading.value = false
    return
  }

  try {
    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      subject: form.subject,
      message: form.message,
      to_email: config.public.emailjsToEmail
    }
    
    await emailjs.send(
      emailServiceId,
      emailTemplateId,
      templateParams,
      { publicKey: emailPublicKey }
    )
    
    sent.value = true
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    
    toast.add({
      title: 'Mensaje enviado',
      description: 'Gracias por contactarnos. Te responderemos pronto.',
      color: 'green'
    })
  } catch (error) {
    console.error('Error sending email:', error)
    toast.add({
      title: 'Error al enviar',
      description: 'Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-background min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl -z-10 animate-blob"></div>
    <div class="absolute top-20 left-10 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10 animate-blob animation-delay-2000"></div>
    <div class="absolute bottom-10 left-1/4 w-[350px] h-[350px] bg-primary/12 rounded-full blur-3xl -z-10 animate-blob animation-delay-4000"></div>
    <div class="absolute bottom-32 right-1/3 w-[300px] h-[300px] bg-primary/8 rounded-full blur-3xl -z-10 animate-blob animation-delay-6000"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.06] rounded-full blur-3xl -z-10"></div>
    
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <span class="text-primary font-bold tracking-wider uppercase text-sm">Contacto</span>
        <h1 class="text-4xl font-extrabold text-text tracking-tight sm:text-5xl mt-2 mb-4">
          Hablemos de tu proyecto
        </h1>
        <p class="text-lg text-text/70 leading-relaxed">
          ¿Tienes alguna pregunta o proyecto en mente? Estamos aquí para ayudarte a hacer realidad tus ideas.
        </p>
        <div class="w-24 h-1 bg-primary mx-auto rounded-full mt-4"/>
      </div>

      <div class="relative">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur opacity-50"></div>
        
        <div class="relative bg-white/5 backdrop-blur-sm border border-primary/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <form @submit.prevent="sendEmail" class="space-y-7">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="group">
                <label for="name" class="block text-sm font-semibold text-text/90 mb-2.5">Nombre completo</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UIcon name="i-heroicons-user" class="h-5 w-5 text-text/40 group-focus-within:text-primary transition-colors duration-200" />
                  </div>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="block w-full rounded-2xl border-0 bg-background/60 py-3.5 pl-11 pr-4 text-text shadow-sm ring-1 ring-inset ring-primary/20 placeholder:text-text/40 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all duration-200 hover:ring-primary/30 hover:bg-background/70"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>
              
              <div class="group">
                <label for="email" class="block text-sm font-semibold text-text/90 mb-2.5">Correo electrónico</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UIcon name="i-heroicons-envelope" class="h-5 w-5 text-text/40 group-focus-within:text-primary transition-colors duration-200" />
                  </div>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="block w-full rounded-2xl border-0 bg-background/60 py-3.5 pl-11 pr-4 text-text shadow-sm ring-1 ring-inset ring-primary/20 placeholder:text-text/40 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all duration-200 hover:ring-primary/30 hover:bg-background/70"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
            </div>

            <div class="group">
              <label for="subject" class="block text-sm font-semibold text-text/90 mb-2.5">Asunto</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="h-5 w-5 text-text/40 group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  required
                  class="block w-full rounded-2xl border-0 bg-background/60 py-3.5 pl-11 pr-4 text-text shadow-sm ring-1 ring-inset ring-primary/20 placeholder:text-text/40 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all duration-200 hover:ring-primary/30 hover:bg-background/70"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
            </div>

            <div class="group">
              <label for="message" class="block text-sm font-semibold text-text/90 mb-2.5">Mensaje</label>
              <div class="relative">
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="6"
                  required
                  class="block w-full rounded-2xl border-0 bg-background/60 py-3.5 px-4 text-text shadow-sm ring-1 ring-inset ring-primary/20 placeholder:text-text/40 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all duration-200 resize-none hover:ring-primary/30 hover:bg-background/70"
                  placeholder="Cuéntanos más sobre tu proyecto o consulta..."
                ></textarea>
              </div>
            </div>

            <div class="pt-4">
              <button
                type="submit"
                :disabled="loading"
                class="cursor-pointer relative w-full group"
              >
                <div class="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/90 to-primary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
                <div class="relative flex w-full justify-center items-center rounded-2xl bg-primary px-6 py-4 text-base font-bold leading-6 text-white shadow-xl hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group-hover:shadow-2xl">
                  <span v-if="loading" class="flex items-center gap-2.5">
                    <UIcon name="i-heroicons-arrow-path" class="animate-spin h-5 w-5" />
                    Enviando mensaje...
                  </span>
                  <span v-else class="flex items-center gap-2.5">
                    Enviar mensaje
                    <UIcon name="i-heroicons-paper-airplane" class="h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                  </span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>

      <p class="text-center mt-8 text-text/50 text-sm">
        Típicamente respondemos en menos de 24 horas
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 20s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-6000 {
  animation-delay: 6s;
}
</style>