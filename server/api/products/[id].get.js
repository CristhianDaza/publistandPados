
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    })
  }

  try {
    const { adminDb } = useFirebaseAdmin()
    const docRef = adminDb.collection('products').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      })
    }

    const data = docSnap.data()

    return {
      id: docSnap.id,
      ...data
    }

  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
