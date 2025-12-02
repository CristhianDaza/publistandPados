import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

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
const db = getFirestore(app)

export { db }
