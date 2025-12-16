import {
  getFirebaseDb
} from './config'
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore'

const COLLECTION = 'quotes'

export const quotesFirebase = {
  async getAll() {
    try {
      const db = getFirebaseDb()
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt)
      }))
    } catch (error) {
      console.error('Error getting quotes:', error)
      throw error
    }
  },

  async getByUserId(userId) {
    try {
      const db = getFirebaseDb()
      const q = query(
        collection(db, COLLECTION),
        where('customer.userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt)
      }))
    } catch (error) {
      console.error('Error getting user quotes:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const db = getFirebaseDb()
      const docRef = doc(db, COLLECTION, id)
      const snapshot = await getDoc(docRef)
      if (!snapshot.exists()) {
        throw new Error('Cotización no encontrada')
      }
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate?.() || new Date(snapshot.data().createdAt),
        updatedAt: snapshot.data().updatedAt?.toDate?.() || new Date(snapshot.data().updatedAt)
      }
    } catch (error) {
      console.error('Error getting quote:', error)
      throw error
    }
  },

  async create(data) {
    try {
      const db = getFirebaseDb()
      const payload = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      const docRef = await addDoc(collection(db, COLLECTION), payload)
      return { id: docRef.id }
    } catch (error) {
      console.error('Error creating quote:', error)
      throw error
    }
  },

  async update(id, data) {
    try {
      const db = getFirebaseDb()
      const docRef = doc(db, COLLECTION, id)
      const payload = {
        ...data,
        updatedAt: Timestamp.now()
      }
      await updateDoc(docRef, payload)
      return { id }
    } catch (error) {
      console.error('Error updating quote:', error)
      throw error
    }
  },

  async updateStatus(id, status, comments = null) {
    try {
      const db = getFirebaseDb()
      const docRef = doc(db, COLLECTION, id)
      const payload = {
        status,
        updatedAt: Timestamp.now()
      }
      if (comments !== null) {
        payload.adminComments = comments
      }
      await updateDoc(docRef, payload)
      return { id }
    } catch (error) {
      console.error('Error updating quote status:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const db = getFirebaseDb()
      await deleteDoc(doc(db, COLLECTION, id))
      return { id }
    } catch (error) {
      console.error('Error deleting quote:', error)
      throw error
    }
  },

  async addComment(id, comment) {
    try {
      const db = getFirebaseDb()
      const docRef = doc(db, COLLECTION, id)
      const quoteDoc = await getDoc(docRef)
      if (!quoteDoc.exists()) {
        throw new Error('Cotización no encontrada')
      }

      const currentComments = quoteDoc.data().comments || []
      const newComment = {
        id: crypto.randomUUID(),
        text: comment.text,
        author: comment.author || 'Admin',
        authorId: comment.authorId || null,
        isInternal: comment.isInternal || false,
        createdAt: Timestamp.now()
      }

      await updateDoc(docRef, {
        comments: [...currentComments, newComment],
        updatedAt: Timestamp.now()
      })

      return { id, comment: newComment }
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }
}

