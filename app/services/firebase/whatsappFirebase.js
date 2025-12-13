import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc} from 'firebase/firestore'
import {getFirebaseDb} from './config'

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
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (e) {
    console.error('Error getting whatsapp contacts:', e)
    return []
  }
}

export const addWhatsAppContact = async (contact) => {
  const db = getFirebaseDb()
  if (!db) throw new Error('Database not initialized')
  try {
    const payload = {
      name: contact.name || '',
      phone: contact.phone || '',
      role: contact.role || '',
      image: contact.image || '',
      order: Number(contact.order || 0),
      active: contact.active !== undefined ? !!contact.active : true,
      createdAt: new Date().toISOString()
    }
    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload)
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

    const safeUpdates = { ...updates }
    if (safeUpdates.order !== undefined) {
      safeUpdates.order = Number(safeUpdates.order)
    }
    if (safeUpdates.active !== undefined) {
      safeUpdates.active = !!safeUpdates.active
    }
    delete safeUpdates.createdAt

    await updateDoc(docRef, {
      ...safeUpdates,
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

export const getWhatsAppContactById = async (id) => {
  const db = getFirebaseDb()
  if (!db) throw new Error('Database not initialized')
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (e) {
    console.error('Error getting whatsapp contact by id:', e)
    throw e
  }
}
