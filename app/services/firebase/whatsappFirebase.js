import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore'
import { getFirebaseDb } from './config'

const COLLECTION_NAME = 'whatsapp_contacts'

export const getWhatsAppContacts = async () => {
  const db = getFirebaseDb()

  if (!db) {
    console.error('Database instance is missing in getWhatsAppContacts')
    return []
  }
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'))
    const querySnapshot = await getDocs(q)
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return results
  } catch (e) {
    console.error('Error getting whatsapp contacts:', e)
    return []
  }
}

export const addWhatsAppContact = async (contact) => {
  const db = getFirebaseDb()
  if (!db) throw new Error('Database not initialized')
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...contact,
      createdAt: new Date().toISOString(),
      active: true,
      order: contact.order || 0
    })
    return docRef.id
  } catch (e) {
    console.error('Error adding whatsapp contact:', e)
    throw e
  }
}

export const updateWhatsAppContact = async (id, updates) => {
  const db = getFirebaseDb()
  if (!db) throw new Error('Database not initialized')
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  } catch (e) {
    console.error('Error updating whatsapp contact:', e)
    throw e
  }
}

export const deleteWhatsAppContact = async (id) => {
  const db = getFirebaseDb()
  if (!db) throw new Error('Database not initialized')
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  } catch (e) {
    console.error('Error deleting whatsapp contact:', e)
    throw e
  }
}
