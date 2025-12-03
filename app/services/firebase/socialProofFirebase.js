import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { getFirebaseDb } from './config'

const COLLECTION_NAME = 'social-proof'

export const getSocialProof = async () => {
  const querySnapshot = await getDocs(collection(getFirebaseDb(), COLLECTION_NAME))
  const items = []
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() })
  })
  return items.sort((a, b) => a.order - b.order)
}

export const createSocialProofItem = async (item) => {
  const docRef = await addDoc(collection(getFirebaseDb(), COLLECTION_NAME), item)
  return docRef.id
}

export const updateSocialProofItem = async (id, item) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await updateDoc(docRef, item)
}

export const deleteSocialProofItem = async (id) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

export const seedSocialProof = async (items) => {
  for (const item of items) {
    await addDoc(collection(getFirebaseDb(), COLLECTION_NAME), item)
  }
}
