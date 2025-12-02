import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore'
import { db as db1 } from '~/services/firebase/config'

export default defineEventHandler(async (event) => {
  try {
    const db2 = useFirebase2()

    const sourceCollection = collection(db2, 'products')
    const snapshot = await getDocs(sourceCollection)

    if (snapshot.empty) {
      return { success: true, message: 'No products to sync', count: 0 }
    }

    const batch = writeBatch(db1)
    let count = 0

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data()
      const docRef = doc(db1, 'products', docSnap.id)
      batch.set(docRef, data, { merge: true })
      count++
    })

    await batch.commit()

    return { success: true, message: 'Products synced successfully', count }
  } catch (error) {
    console.error('Sync error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to sync products',
      data: error.message
    })
  }
})
