import { useFirebaseAdmin } from './firebaseAdmin'

export const fetchProductRoutes = async () => {
  try {
    const { adminDb } = useFirebaseAdmin()
    const snapshot = await adminDb.collection('products').select('id').get()
    return snapshot.docs.map(doc => `/products/${doc.id}`)
  } catch (error) {
    console.error('Error fetching product routes:', error)
    return []
  }
}
