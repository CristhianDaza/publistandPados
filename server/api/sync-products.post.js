import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

const normalizeDateMs = (value) => {
  if (value === null || value === undefined) return null

  if (typeof value?.toMillis === 'function') {
    const ms = value.toMillis()
    return Number.isFinite(ms) ? ms : null
  }

  if (value instanceof Date) {
    const ms = value.getTime()
    return Number.isFinite(ms) ? ms : null
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null
    return value < 1e12 ? Math.trunc(value * 1000) : Math.trunc(value)
  }

  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  if (typeof value === 'object') {
    const seconds = value.seconds ?? value._seconds
    const nanoseconds = value.nanoseconds ?? value._nanoseconds ?? 0

    if (typeof seconds === 'number' && Number.isFinite(seconds)) {
      return Math.trunc(seconds * 1000 + nanoseconds / 1e6)
    }
  }

  return null
}

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

    const docsToSync = snapshot.docs

    const CHUNK_SIZE = 50
    let chunkCount = 0
    let totalSynced = 0
    let totalProductsBeforeFilter = 0
    let totalProductsAfterFilter = 0
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
        totalProductsBeforeFilter += rawData.products.length
        totalProductsAfterFilter += rawData.products.length
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

    const sourceStatusRef = doc(db2, 'lastedUpdatedProducts', 'status')
    const sourceStatusSnap = await getDoc(sourceStatusRef)
    const sourceStatus = sourceStatusSnap.exists() ? sourceStatusSnap.data() : {}

    const lastUpdateMs = normalizeDateMs(sourceStatus?.lastUpdateMs ?? sourceStatus?.lastUpdate ?? sourceStatus?.lastUpdateIso) ?? Date.now()
    const lastUpdateIso = new Date(lastUpdateMs).toISOString()

    const destDocRef = adminDb.collection('lastedUpdatedProducts').doc('status')
    await destDocRef.set({
      ...sourceStatus,
      lastUpdate: lastUpdateIso,
      lastUpdateIso,
      lastUpdateMs,
      syncedAt: new Date().toISOString(),
      syncVersion: 2,
      syncRecoveryV2Done: true
    }, { merge: true })

    console.info('[sync-products] completed', {
      sourceDocsCount: snapshot.size,
      totalSynced,
      totalProductsBeforeFilter,
      totalProductsAfterFilter,
      lastUpdateMs,
      sourceCollectionName
    })

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
