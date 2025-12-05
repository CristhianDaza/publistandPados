import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'
import { getFirebaseDb } from './config'

const collectionName = 'products'

export const getProducts = async () => {
  console.log('Fetching aggregated products from Firebase (no cache)')
  const snapshot = await getDocs(collection(getFirebaseDb(), collectionName))

  const docs = snapshot.docs.slice().sort((a, b) => {
    const tsA = Number(a.id.split('_').pop() || 0)
    const tsB = Number(b.id.split('_').pop() || 0)
    return tsA - tsB
  })

  const map = new Map()

  for (const docSnap of docs) {
    const data = docSnap.data()
    const arr = Array.isArray(data?.products) ? data.products : [data]
    for (const p of arr) {
      if (p && p.id && p.api !== 'cataProm') {
        map.set(p.id, p)
      }
    }
  }

  const merged = Array.from(map.values()).sort((a, b) => {
    const nameA = a.name || ''
    const nameB = b.name || ''
    return nameA.localeCompare(nameB)
  })

  console.log(`Aggregated ${merged.length} unique products from ${docs.length} chunk docs`)
  return merged
}



export const createProduct = async (product) => {
  const docRef = await addDoc(collection(getFirebaseDb(), collectionName), product)
  return { id: docRef.id, ...product }
}

export const updateProduct = async (id, product) => {
  const docRef = doc(getFirebaseDb(), collectionName, id)
  await updateDoc(docRef, product)
  return { id, ...product }
}

export const deleteProduct = async (id) => {
  const docRef = doc(getFirebaseDb(), collectionName, id)
  await deleteDoc(docRef)
  return id
}
