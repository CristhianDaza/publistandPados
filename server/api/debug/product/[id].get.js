import { useFirebaseAdmin } from '../../../utils/firebaseAdmin'
import { useFirebase2Admin } from '../../../utils/firebase2Admin'

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

const normalizeId = (value) => {
  if (value === null || value === undefined) return ''
  return String(value)
    .normalize('NFKC')
    .replace(/\s+/g, '')
    .toUpperCase()
    .trim()
}

const inspectCollectionForProductId = async (adminDb, collectionName, productId) => {
  const snapshot = await adminDb.collection(collectionName).get()
  const matches = []
  const nearMatches = []
  const normalizedTarget = normalizeId(productId)
  let docsWithProductsArray = 0
  let docsWithRootId = 0
  let totalProductsEntries = 0
  const sampleDocShapes = []

  snapshot.forEach((docSnap) => {
    const data = docSnap.data()
    const products = Array.isArray(data?.products) ? data.products : null
    const keys = Object.keys(data || {})

    if (sampleDocShapes.length < 8) {
      sampleDocShapes.push({
        docId: docSnap.id,
        topLevelKeys: keys.slice(0, 20),
        hasProductsArray: Boolean(products),
        hasRootId: typeof data?.id === 'string'
      })
    }

    if (products) {
      docsWithProductsArray++
      totalProductsEntries += products.length
      products.forEach((product, index) => {
        const productIdRaw = product?.id
        const normalizedProductId = normalizeId(productIdRaw)

        if (productIdRaw === productId) {
          matches.push({
            docId: docSnap.id,
            location: `products[${index}]`,
            api: product?.api ?? null,
            name: product?.name ?? null,
            id: productIdRaw
          })
          return
        }

        if (normalizedProductId && normalizedProductId === normalizedTarget) {
          nearMatches.push({
            docId: docSnap.id,
            location: `products[${index}]`,
            api: product?.api ?? null,
            name: product?.name ?? null,
            id: productIdRaw,
            reason: 'normalized-id-match'
          })
          return
        }

        if (normalizedTarget && normalizedProductId.includes(normalizedTarget)) {
          nearMatches.push({
            docId: docSnap.id,
            location: `products[${index}]`,
            api: product?.api ?? null,
            name: product?.name ?? null,
            id: productIdRaw,
            reason: 'contains-target'
          })
        }
      })
      return
    }

    const rootId = data?.id
    const normalizedRootId = normalizeId(rootId)
    if (typeof rootId === 'string' && rootId.length > 0) {
      docsWithRootId++
    }

    if (rootId === productId) {
      matches.push({
        docId: docSnap.id,
        location: 'document-root',
        api: data?.api ?? null,
        name: data?.name ?? null,
        id: rootId
      })
      return
    }

    if (normalizedRootId && normalizedRootId === normalizedTarget) {
      nearMatches.push({
        docId: docSnap.id,
        location: 'document-root',
        api: data?.api ?? null,
        name: data?.name ?? null,
        id: rootId,
        reason: 'normalized-id-match'
      })
      return
    }

    if (normalizedTarget && normalizedRootId.includes(normalizedTarget)) {
      nearMatches.push({
        docId: docSnap.id,
        location: 'document-root',
        api: data?.api ?? null,
        name: data?.name ?? null,
        id: rootId,
        reason: 'contains-target'
      })
    }
  })

  return {
    docsScanned: snapshot.size,
    docsWithProductsArray,
    docsWithRootId,
    totalProductsEntries,
    sampleDocShapes,
    matches,
    nearMatches: nearMatches.slice(0, 25),
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
    const { adminDb } = useFirebaseAdmin()
    const { adminDb2 } = useFirebase2Admin()
    const config = useRuntimeConfig()
    const sourceCollectionName = config.firebase2.sourceCollection

    const [sourceInspection, destInspection, sourceStatusSnap, destStatusSnap, directDestDocSnap] = await Promise.all([
      inspectCollectionForProductId(adminDb2, sourceCollectionName, id),
      inspectCollectionForProductId(adminDb, 'products', id),
      adminDb2.collection('lastedUpdatedProducts').doc('status').get(),
      adminDb.collection('lastedUpdatedProducts').doc('status').get(),
      adminDb.collection('products').doc(id).get()
    ])

    const sourceStatus = sourceStatusSnap.exists ? sourceStatusSnap.data() : null
    const destStatus = destStatusSnap.exists ? destStatusSnap.data() : null

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
        directDocByIdExists: directDestDocSnap.exists
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
