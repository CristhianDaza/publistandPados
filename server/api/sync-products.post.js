import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    const db1 = useFirebase1()
    const db2 = useFirebase2()
    const config = useRuntimeConfig()

    const sourceCollectionName = config.firebase2.sourceCollection
    const sourceCollection = collection(db2, sourceCollectionName)
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
