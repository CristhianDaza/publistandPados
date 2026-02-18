import { findProductById } from '../../utils/productsService.js'

export default defineEventHandler(async (event) => {
  let id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    })
  }

  try {
    try {
      id = decodeURIComponent(id)
    } catch {
      // Ignore malformed URI sequences and use raw id.
    }

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

    if (error?.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
