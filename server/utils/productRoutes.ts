import { fetchAllProducts } from './productsService'

export const fetchProductRoutes = async () => {
  try {
    const products = await fetchAllProducts()
    return products.map(p => `/products/${p.id}`)
  } catch (error) {
    console.error('Error fetching product routes:', error)
    return []
  }
}
