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

const inspectCollectionForProductId = async (db, collectionName, productId) => {
  const snapshot = await getDocs(collection(db, collectionName))
  const matches = []

  snapshot.forEach((docSnap) => {
    const data = docSnap.data()
    const products = Array.isArray(data?.products) ? data.products : null

    if (products) {
      products.forEach((product, index) => {
        if (product?.id === productId) {
          matches.push({
            docId: docSnap.id,
            location: `products[${index}]`,
            api: product?.api ?? null,
            name: product?.name ?? null
          })
        }
      })
      return
    }

    if (data?.id === productId) {
      matches.push({
        docId: docSnap.id,
        location: 'document-root',
        api: data?.api ?? null,
        name: data?.name ?? null
      })
    }
  })

  return {
    docsScanned: snapshot.size,
    matches,
    found: matches.length > 0
  }
}

export default defineEventHandler(async (event) => {
  let id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required'
    })
  }

  try {
    id = decodeURIComponent(id)
  } catch {
    // Keep raw id if decode fails.
  }

  try {
    const db1 = useFirebase1()
    const db2 = useFirebase2()
    const config = useRuntimeConfig()
    const sourceCollectionName = config.firebase2.sourceCollection

    const [sourceInspection, destInspection, sourceStatusSnap, destStatusSnap, directDestDocSnap] = await Promise.all([
      inspectCollectionForProductId(db2, sourceCollectionName, id),
      inspectCollectionForProductId(db1, 'products', id),
      getDoc(doc(db2, 'lastedUpdatedProducts', 'status')),
      getDoc(doc(db1, 'lastedUpdatedProducts', 'status')),
      getDoc(doc(db1, 'products', id))
    ])

    const sourceStatus = sourceStatusSnap.exists() ? sourceStatusSnap.data() : null
    const destStatus = destStatusSnap.exists() ? destStatusSnap.data() : null

    const api2DateMs = normalizeDateMs(sourceStatus?.lastUpdateMs ?? sourceStatus?.lastUpdate ?? sourceStatus?.lastUpdateIso)
    const api1DateMs = normalizeDateMs(destStatus?.lastUpdateMs ?? destStatus?.lastUpdate ?? destStatus?.lastUpdateIso)
    const shouldSyncByStatusUpdate = api2DateMs !== null && (api1DateMs === null || api2DateMs > api1DateMs)

    const filteredAsCataPromInSource = sourceInspection.matches
      .filter((m) => m.api === 'cataProm')
      .map((m) => ({ docId: m.docId, location: m.location }))

    return {
      success: true,
      productId: id,
      sourceCollectionName,
      source: {
        ...sourceInspection,
        filteredAsCataPromInSource
      },
      destination: {
        ...destInspection,
        directDocByIdExists: directDestDocSnap.exists()
      },
      syncStatus: {
        api1DateMs,
        api2DateMs,
        api1DateIso: api1DateMs ? new Date(api1DateMs).toISOString() : null,
        api2DateIso: api2DateMs ? new Date(api2DateMs).toISOString() : null,
        shouldSyncByStatusUpdate
      }
    }
  } catch (error) {
    console.error(`[debug-product] failed for "${id}"`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to inspect product debug state',
      data: error?.message ?? String(error)
    })
  }
})
