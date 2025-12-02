import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'
import { db } from './config'

const collectionName = 'products'

export const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, collectionName))
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getProductById = async (id) => {
  const docRef = doc(db, collectionName, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  } else {
    throw new Error('Product not found')
  }
}

export const createProduct = async (product) => {
  const docRef = await addDoc(collection(db, collectionName), product)
  return { id: docRef.id, ...product }
}

export const updateProduct = async (id, product) => {
  const docRef = doc(db, collectionName, id)
  await updateDoc(docRef, product)
  return { id, ...product }
}

export const deleteProduct = async (id) => {
  const docRef = doc(db, collectionName, id)
  await deleteDoc(docRef)
  return id
}
