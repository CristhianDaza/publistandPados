import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { getFirebaseDb } from './config'

const COLLECTION_NAME = 'carousel'

export const getCarousel = async () => {
  const querySnapshot = await getDocs(collection(getFirebaseDb(), COLLECTION_NAME))
  const items = []
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() })
  })
  return items.sort((a, b) => a.order - b.order)
}

export const getCarouselItemById = async (id) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  } else {
    throw new Error("No such document!")
  }
}

export const createCarouselItem = async (item) => {
  const docRef = await addDoc(collection(getFirebaseDb(), COLLECTION_NAME), item)
  return docRef.id
}

export const updateCarouselItem = async (id, item) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await updateDoc(docRef, item)
}

export const deleteCarouselItem = async (id) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

export const seedCarousel = async (items) => {
  for (const item of items) {
    await addDoc(collection(getFirebaseDb(), COLLECTION_NAME), item)
  }
}
