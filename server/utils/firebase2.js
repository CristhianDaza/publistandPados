import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

let db2

export const useFirebase2 = () => {
  if (db2) return db2

  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.firebase2.apiKey,
    authDomain: config.firebase2.authDomain,
    projectId: config.firebase2.projectId,
    storageBucket: config.firebase2.storageBucket,
    messagingSenderId: config.firebase2.messagingSenderId,
    appId: config.firebase2.appId
  }

  const app = initializeApp(firebaseConfig, 'firebase2')
  db2 = getFirestore(app)

  return db2
}
