// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    },
    firebase2: {
      apiKey: process.env.NUXT_FIREBASE2_API_KEY,
      authDomain: process.env.NUXT_FIREBASE2_AUTH_DOMAIN,
      projectId: process.env.NUXT_FIREBASE2_PROJECT_ID,
      storageBucket: process.env.NUXT_FIREBASE2_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_FIREBASE2_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_FIREBASE2_APP_ID,
      sourceCollection: process.env.NUXT_FIREBASE2_SOURCE_COLLECTION
    }
  }
})