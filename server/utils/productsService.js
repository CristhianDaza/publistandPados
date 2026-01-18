import { useFirebaseAdmin } from './firebaseAdmin'

let cachedProducts = null
let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 5 // 5 minutes

export const fetchAllProducts = async () => {
  const now = Date.now()
  if (cachedProducts && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedProducts
  }

  const { adminDb } = useFirebaseAdmin()
  const snapshot = await adminDb.collection('products').get()

  const map = new Map()

  snapshot.forEach(docSnap => {
    const data = docSnap.data()
    // Replicate client-side logic: array of products or single product doc
    const arr = Array.isArray(data?.products) ? data.products : [data]

    for (const p of arr) {
      if (p && p.id && p.api !== 'cataProm') {
        // Ensure we preserve the structure expected by the frontend
        map.set(p.id, p)
      }
    }
  })

  cachedProducts = Array.from(map.values())
  lastFetchTime = now
  return cachedProducts
}

export const findProductById = async (id) => {
  const products = await fetchAllProducts()
  return products.find(p => p.id === id)
}
