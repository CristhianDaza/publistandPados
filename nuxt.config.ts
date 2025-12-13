// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxtjs/robots', '@nuxtjs/sitemap'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      cloudinaryCloudName: process.env.NUXT_CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: process.env.NUXT_CLOUDINARY_API_KEY,
      cloudinaryUploadPreset: process.env.NUXT_CLOUDINARY_UPLOAD_PRESET
    },
    cloudinaryApiSecret: process.env.NUXT_CLOUDINARY_API_SECRET,
    cloudinaryApiEnvironment: process.env.NUXT_CLOUDINARY_API_ENVIRONMENT,
    firebase2: {
      apiKey: process.env.NUXT_FIREBASE2_API_KEY,
      authDomain: process.env.NUXT_FIREBASE2_AUTH_DOMAIN,
      projectId: process.env.NUXT_FIREBASE2_PROJECT_ID,
      storageBucket: process.env.NUXT_FIREBASE2_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_FIREBASE2_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_FIREBASE2_APP_ID,
      sourceCollection: process.env.NUXT_FIREBASE2_SOURCE_COLLECTION
    }
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
    name: 'Publistandpados',
  },
  robots: {
    disallow: ['/admin', '/admin/**'],
  },
  sitemap: {
    exclude: ['/admin/**'],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'es'
      },
      titleTemplate: '%s | Publistandpados',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Artículos promocionales y publicitarios personalizados. Amplio catálogo de productos para tu marca.' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Publistand Pados' },
        { property: 'og:locale', content: 'es_CO' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@publistandpados' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
