import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

let db = null
let analytics = null

const getFirebaseApp = () => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

export const getFirebaseDb = () => {
  if (db) return db

  const app = getFirebaseApp()
  db = getFirestore(app)
  return db
}

export const getFirebaseAuth = () => {
  const app = getFirebaseApp()
  return getAuth(app)
}

export const getFirebaseAnalytics = async () => {
  if (!import.meta.client) return null
  if (analytics) return analytics

  try {
    const supported = await isSupported()
    if (supported) {
      const app = getFirebaseApp()
      analytics = getAnalytics(app)
      return analytics
    }
  } catch (e) {
    console.warn('Firebase Analytics not supported:', e)
  }
  return null
}

