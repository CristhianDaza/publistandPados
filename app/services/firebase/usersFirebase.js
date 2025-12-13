import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { getFirebaseDb } from './config'

const COLLECTION_NAME = 'users'

export const getUsers = async () => {
  const db = getFirebaseDb()
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }))
}

export const getUserById = async (id) => {
  const db = getFirebaseDb()
  const docRef = doc(db, COLLECTION_NAME, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return {
    id: snapshot.id,
    ...snapshot.data()
  }
}

export const createUserDoc = async (id, data) => {
  const db = getFirebaseDb()
  const docRef = doc(db, COLLECTION_NAME, id)
  await setDoc(docRef, data)
}

export const updateUserDoc = async (id, data) => {
  const db = getFirebaseDb()
  const docRef = doc(db, COLLECTION_NAME, id)
  await updateDoc(docRef, data)
}

export const deleteUserDoc = async (id) => {
  const db = getFirebaseDb()
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
}
