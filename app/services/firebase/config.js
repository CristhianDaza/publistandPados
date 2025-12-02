import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

let db = null

export const getFirebaseDb = () => {
  if (db) return db

  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  }

  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  return db
}
