import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

let db1

export const useFirebase1 = () => {
  if (db1) return db1

  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  }

  const app = initializeApp(firebaseConfig, 'firebase1')
  db1 = getFirestore(app)

  return db1
}
