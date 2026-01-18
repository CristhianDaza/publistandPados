
export default defineEventHandler(async (event) => {
  let id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    })
  }

  // Ensure ID is decoded (e.g. "ANF%20076" -> "ANF 076")
  try {
    id = decodeURIComponent(id)
  } catch (e) {
    // ignore
  }

  console.log(`[API] Fetching product: "${id}"`)

  try {
    const product = await findProductById(id)

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      })
    }

    return product

  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    // If it's already a H3 error, rethrow it
    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }
})
