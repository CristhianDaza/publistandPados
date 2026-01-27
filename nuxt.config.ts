import { fetchProductRoutes } from './server/utils/productRoutes'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (nitroConfig.dev) return // Don't pre-render in dev

      try {
        const routes = await fetchProductRoutes()
        if (routes && routes.length) {
          nitroConfig.prerender = nitroConfig.prerender || {}
          nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
          nitroConfig.prerender.routes.push(...routes)
          console.log(`[SEO] Added ${routes.length} product routes to pre-render`)
        }
      } catch (e) {
        console.error('[SEO] Failed to fetch product routes:', e)
      }
    }
  },
  routeRules: {
    '/products/**': { isr: 3600 }
  },
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1024,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) {
                return 'firebase';
              }
              if (id.includes('vue') || id.includes('nuxt') || id.includes('pinia')) {
                return 'framework';
              }
            }
          }
        }
      }
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxtjs/seo'],
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
      cloudinaryUploadPreset: process.env.NUXT_CLOUDINARY_UPLOAD_PRESET,
      emailjsServiceId: process.env.NUXT_EMAILJS_SERVICE_ID,
      emailjsTemplateId: process.env.NUXT_EMAILJS_TEMPLATE_ID,
      emailjsPublicKey: process.env.NUXT_EMAILJS_PUBLIC_KEY,
      emailjsToEmail: process.env.NUXT_EMAILJS_TO_EMAIL,
      emailjsTemplateQuoteId: process.env.NUXT_EMAILJS_TEMPLATE_QUOTE_ID
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
    description: 'Artículos promocionales y publicitarios personalizados. Amplio catálogo de productos para tu marca.',
    defaultLocale: 'es',
  },
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Publistandpados',
      url: process.env.NUXT_PUBLIC_SITE_URL,
      logo: '/icon.png',
    },
  },
  robots: {
    disallow: ['/admin', '/admin/**'],
  },
  sitemap: {
    exclude: ['/admin/**'],
  },
  ogImage: {
    enabled: true,
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
        // description is handled by site config or component
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileImage', content: '/favicon.ico' },
        { name: 'apple-mobile-web-app-title', content: 'Publistandpados' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=AW-17902465784',
          async: true
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17902465784');
          `
        }
      ]
    }
  }
})
