import { useFirebaseAdmin } from '../../utils/firebaseAdmin'
import { useFirebase2Admin } from '../../utils/firebase2Admin'

const normalizeText = (value) => {
  if (value === null || value === undefined) return ''
  return String(value)
    .normalize('NFKC')
    .toUpperCase()
    .trim()
}

const includesNormalized = (value, query) => {
  const normalizedValue = normalizeText(value)
  if (!normalizedValue || !query) return false
  return normalizedValue.includes(query)
}

const scanCollection = async (adminDb, collectionName, query, maxResults) => {
  const snapshot = await adminDb.collection(collectionName).get()
  const results = []
  let scannedProducts = 0

  snapshot.forEach((docSnap) => {
    if (results.length >= maxResults) return

    const data = docSnap.data()
    const products = Array.isArray(data?.products) ? data.products : []

    products.forEach((product, index) => {
      if (results.length >= maxResults) return
      scannedProducts++

      const fields = {
        id: product?.id ?? '',
        reference: product?.reference ?? '',
        sku: product?.sku ?? '',
        code: product?.code ?? '',
        name: product?.name ?? ''
      }

      const matchedFields = Object.entries(fields)
        .filter(([, value]) => includesNormalized(value, query))
        .map(([key]) => key)

      if (matchedFields.length > 0) {
        results.push({
          docId: docSnap.id,
          index,
          matchedFields,
          id: fields.id || null,
          reference: fields.reference || null,
          sku: fields.sku || null,
          code: fields.code || null,
          name: fields.name || null,
          api: product?.api ?? null
        })
      }
    })
  })

  return {
    docsScanned: snapshot.size,
    productsScanned: scannedProducts,
    results
  }
}

export default defineEventHandler(async (event) => {
  const queryRaw = getQuery(event)?.q
  const limitRaw = getQuery(event)?.limit
  const query = normalizeText(queryRaw)
  const maxResults = Math.min(Math.max(Number(limitRaw) || 20, 1), 100)

  if (!query) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing query param q'
    })
  }

  try {
    const { adminDb } = useFirebaseAdmin()
    const { adminDb2 } = useFirebase2Admin()
    const config = useRuntimeConfig()
    const sourceCollectionName = config.firebase2.sourceCollection

    const [source, destination] = await Promise.all([
      scanCollection(adminDb2, sourceCollectionName, query, maxResults),
      scanCollection(adminDb, 'products', query, maxResults)
    ])

    return {
      success: true,
      query: queryRaw,
      sourceCollectionName,
      source,
      destination
    }
  } catch (error) {
    console.error('[debug-product-search] failed', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search products in debug endpoint',
      data: error?.message ?? String(error)
    })
  }
})
