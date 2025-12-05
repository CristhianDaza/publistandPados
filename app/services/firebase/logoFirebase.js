import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore'
import { getFirebaseDb } from './config'

const COLLECTION_NAME = 'logos'

export const getLogos = async () => {
  const querySnapshot = await getDocs(collection(getFirebaseDb(), COLLECTION_NAME))
  const items = []
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() })
  })
  return items
}

export const getActiveLogo = async () => {
  const q = query(collection(getFirebaseDb(), COLLECTION_NAME), where('isActive', '==', true))
  const querySnapshot = await getDocs(q)
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() }
  }
  return null
}

export const createLogo = async (logo) => {
  const docRef = await addDoc(collection(getFirebaseDb(), COLLECTION_NAME), logo)
  return docRef.id
}

export const updateLogo = async (id, logo) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await updateDoc(docRef, logo)
}

export const deleteLogo = async (id) => {
  const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

export const setActiveLogo = async (id) => {
  const db = getFirebaseDb()
  const batch = writeBatch(db)

  const allLogosSnapshot = await getDocs(collection(db, COLLECTION_NAME))

  allLogosSnapshot.forEach((docSnapshot) => {
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

export const seedLogo = async () => {
  const initialLogo = {
    name: 'Default Logo',
    url: 'https://res.cloudinary.com/dcdfhi8qz/image/upload/v1764904665/vvz2obeairutfbpiszdo.png',
    urlDark: 'https://res.cloudinary.com/dcdfhi8qz/image/upload/v1764904108/a2w9wriie5tvoxbhz67h.png',
    isActive: true
  }

  const logos = await getLogos()
  if (logos.length === 0) {
    await createLogo(initialLogo)
  } else {
    const activeLogo = logos.find(l => l.isActive)
    if (activeLogo && !activeLogo.urlDark) {
      await updateLogo(activeLogo.id, { urlDark: initialLogo.urlDark })
    }
  }
}
