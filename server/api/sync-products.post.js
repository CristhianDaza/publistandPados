import { collection, getDocs, query, limit } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    const { adminDb } = useFirebaseAdmin()
    const db2 = useFirebase2()
    const config = useRuntimeConfig()

    const sourceCollectionName = config.firebase2.sourceCollection
    const sourceCollection = collection(db2, sourceCollectionName)
    const snapshot = await getDocs(sourceCollection)

    if (snapshot.empty) {
      return { success: true, message: 'No products to sync', count: 0 }
    }

    const docsToSync = snapshot.docs.filter((docSnap) => !docSnap.id.startsWith('api_cataprom'))

    if (docsToSync.length === 0) {
      return { success: true, message: 'No products to sync after filtering', count: 0 }
    }

    const CHUNK_SIZE = 50
    let chunkCount = 0
    let totalSynced = 0
    let batch = adminDb.batch()

    const sanitizeData = (data) => {
      if (data === null || typeof data !== 'object') return data
      if (data.constructor && (data.constructor.name === 'Timestamp' || data.constructor.name === 'GeoPoint')) {
        return data
      }
      if (Array.isArray(data)) {
        return data.map(sanitizeData)
      }
      const sanitized = {}
      for (const key in data) {
        if (data[key] !== undefined) {
          sanitized[key] = sanitizeData(data[key])
        }
      }
      return sanitized
    }

    for (const docSnap of docsToSync) {
      let rawData = docSnap.data()
      if (rawData.products && Array.isArray(rawData.products)) {
        rawData.products = rawData.products.filter(p => p.api !== 'cataProm')
      }

      const data = sanitizeData(rawData)
      const docRef = adminDb.collection('products').doc(docSnap.id)
      batch.set(docRef, data, { merge: true })
      chunkCount++
      totalSynced++

      if (chunkCount >= CHUNK_SIZE) {
        await batch.commit()
        batch = adminDb.batch()
        chunkCount = 0
      }
    }

    if (chunkCount > 0) {
      await batch.commit()
    }

    const sourceUpdateCol = collection(db2, 'lastedUpdatedProducts')
    const sourceUpdateSnap = await getDocs(query(sourceUpdateCol, limit(1)))

    if (!sourceUpdateSnap.empty) {
      const sourceData = sourceUpdateSnap.docs[0].data()
      const destDocRef = adminDb.collection('lastedUpdatedProducts').doc('status')
      await destDocRef.set(sourceData)
    }

    return { success: true, message: 'Products synced successfully', count: totalSynced }
  } catch (error) {
    console.error('Sync error:', error)
    if (error.code === 'app/invalid-credential') {
      throw createError({
        statusCode: 500,
        statusMessage: 'Server configuration error: Missing or invalid service-account.json',
        message: 'Missing or invalid service-account.json'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to sync products',
      data: error.message
    })
  }
})
