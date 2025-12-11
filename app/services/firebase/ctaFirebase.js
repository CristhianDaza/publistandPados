import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { getFirebaseDb } from './config'

const COLLECTION_NAME = 'home_cta'
const DOC_ID = 'main'

export const getCTAConfig = async () => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, DOC_ID)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return null
  }
}

export const updateCTAConfig = async (config) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, DOC_ID)
  await updateDoc(docRef, config, { merge: true })
}

export const createCTAConfig = async (config) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, DOC_ID)
  await setDoc(docRef, config)
}
