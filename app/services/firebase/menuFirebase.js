import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { getFirebaseDb } from './config'

const COLLECTION_NAME = 'menu'

export const getMenu = async () => {
  const querySnapshot = await getDocs(collection(getFirebaseDb(), COLLECTION_NAME))
  // Assuming we store the entire menu structure in a single document for easier ordering
  // or we can store items individually. Storing as a single doc 'main' is easier for ordering.
  // Let's check if we want individual items or a single config doc.
  // Given "CRUD", maybe individual items is better for scalability, but for a header menu, a single JSON structure is often easier to manage order.
  // However, "CRUD" implies creating/updating items.
  // Let's go with a single document 'main' that contains the items array, 
  // OR a collection of items with an 'order' field.
  // Let's go with a collection of items for true CRUD.

  const items = []
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() })
  })
  return items.sort((a, b) => a.order - b.order)
}

export const createMenuItem = async (item) => {
  const docRef = await addDoc(collection(getFirebaseDb(), COLLECTION_NAME), item)
  return docRef.id
}

export const updateMenuItem = async (id, item) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await updateDoc(docRef, item)
}

export const deleteMenuItem = async (id) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

// Helper to seed the initial menu
export const seedMenu = async (items) => {
  const batch = []
  // We can't use batch with addDoc easily without generating ids first, 
  // but we can just loop.
  for (const item of items) {
    await addDoc(collection(getFirebaseDb(), COLLECTION_NAME), item)
  }
}
