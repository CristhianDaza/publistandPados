import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore'
import { getFirebaseDb } from './config'

const SOCIAL_COLLECTION = 'footer_social'
const CONFIG_COLLECTION = 'footer_config'
const CONFIG_DOC_ID = 'main'

export const getSocialLinks = async () => {
  const querySnapshot = await getDocs(collection(getFirebaseDb(), SOCIAL_COLLECTION))
  const items = []
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() })
  })
  return items
}

export const addSocialLink = async (link) => {
  const docRef = await addDoc(collection(getFirebaseDb(), SOCIAL_COLLECTION), link)
  return docRef.id
}

export const updateSocialLink = async (id, link) => {
  const docRef = doc(getFirebaseDb(), SOCIAL_COLLECTION, id)
  await updateDoc(docRef, link)
}

export const deleteSocialLink = async (id) => {
  const docRef = doc(getFirebaseDb(), SOCIAL_COLLECTION, id)
  await deleteDoc(docRef)
}

export const getFooterConfig = async () => {
  const docRef = doc(getFirebaseDb(), CONFIG_COLLECTION, CONFIG_DOC_ID)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return null
  }
}

export const updateFooterConfig = async (config) => {
  const docRef = doc(getFirebaseDb(), CONFIG_COLLECTION, CONFIG_DOC_ID)
  await setDoc(docRef, config, { merge: true })
}

export const seedFooter = async () => {
  const socialLinks = [
    { name: 'Instagram', to: 'https://instagram.com', icon: 'i-simple-icons-instagram' },
    { name: 'LinkedIn', to: 'https://linkedin.com', icon: 'i-simple-icons-linkedin' },
    { name: 'Facebook', to: 'https://facebook.com', icon: 'i-simple-icons-facebook' },
    { name: 'WhatsApp', to: 'https://wa.me/573001234567', icon: 'i-simple-icons-whatsapp' }
  ]

  const currentLinks = await getSocialLinks()
  if (currentLinks.length === 0) {
    for (const link of socialLinks) {
      await addSocialLink(link)
    }
  }

  const currentConfig = await getFooterConfig()
  if (!currentConfig) {
    await updateFooterConfig({
      contact: {
        address: 'Calle 123 # 45-67\nBogotá, Colombia',
        phone: '+57 300 123 4567',
        email: 'info@publistandpados.com'
      },
      cta: {
        title: 'Inicia tu Proyecto',
        text: '¿Listo para destacar en tu próximo evento? Hablemos hoy mismo.',
        buttonText: 'Cotizar Ahora',
        buttonLink: '/contacto'
      }
    })
  }
}
