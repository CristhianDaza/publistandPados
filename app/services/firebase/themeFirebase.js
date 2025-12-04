import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore'
import { getFirebaseDb } from './config'

const COLLECTION_NAME = 'themes'

export const getThemes = async () => {
  const querySnapshot = await getDocs(collection(getFirebaseDb(), COLLECTION_NAME))
  const items = []
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() })
  })
  return items
}

export const getActiveTheme = async () => {
  const q = query(collection(getFirebaseDb(), COLLECTION_NAME), where('isActive', '==', true))
  const querySnapshot = await getDocs(q)
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() }
  }
  return null
}

export const createTheme = async (theme) => {
  const docRef = await addDoc(collection(getFirebaseDb(), COLLECTION_NAME), theme)
  return docRef.id
}

export const updateTheme = async (id, theme) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await updateDoc(docRef, theme)
}

export const deleteTheme = async (id) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

export const setActiveTheme = async (id) => {
  const db = getFirebaseDb()
  const batch = writeBatch(db)

  const allThemesSnapshot = await getDocs(collection(db, COLLECTION_NAME))

  allThemesSnapshot.forEach((docSnapshot) => {
    const docRef = doc(db, COLLECTION_NAME, docSnapshot.id)
    if (docSnapshot.id === id) {
      batch.update(docRef, { isActive: true })
    } else {
      if (docSnapshot.data().isActive) {
        batch.update(docRef, { isActive: false })
      }
    }
  })

  await batch.commit()
}

export const seedTheme = async () => {
  const initialTheme = {
    name: 'Default Theme',
    colors: {
      primary: '#3b82f6', // blue-500
      secondary: '#64748b', // slate-500
      background: '#ffffff',
      text: '#0f172a'
    },
    isActive: true
  }

  const themes = await getThemes()
  if (themes.length === 0) {
    await createTheme(initialTheme)
  }
}
