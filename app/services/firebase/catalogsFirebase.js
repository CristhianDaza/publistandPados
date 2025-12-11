import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { getFirebaseDb } from './config'

const COLLECTION_NAME = 'catalogs'

export const getCatalogs = async () => {
  const querySnapshot = await getDocs(collection(getFirebaseDb(), COLLECTION_NAME))
  const items = []
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() })
  })
  return items.sort((a, b) => (a.order || 0) - (b.order || 0))
}

export const createCatalog = async (item) => {
  const docRef = await addDoc(collection(getFirebaseDb(), COLLECTION_NAME), item)
  return docRef.id
}

export const updateCatalog = async (id, item) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await updateDoc(docRef, item)
}

export const deleteCatalog = async (id) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await deleteDoc(docRef)
}
