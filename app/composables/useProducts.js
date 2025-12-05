import {
  getProducts as fetchProducts,
  getProductById as fetchProductById,
  createProduct as addProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService
} from '~/services/firebase/productsFirebase'
import { getFromIDB, saveToIDB } from '~/utils/idb'

export const useProducts = () => {
  const products = useState('products', () => [])
  const loading = useState('products-loading', () => false)
  const error = useState('products-error', () => null)

  const getProducts = async (force = false) => {
    if (!force && products.value.length > 0) return

    loading.value = true
    error.value = null

    try {
      if (process.client && !force) {
        const cached = await getFromIDB('products')
        if (cached && Array.isArray(cached) && cached.length > 0) {
          console.log('Loaded products from IDB cache')
          products.value = markRaw(cached)
          loading.value = false
          return
        }
      }

      const data = await fetchProducts()

      if (process.client) {
        await saveToIDB('products', data)
      }

      products.value = markRaw(data)
    } catch (e) {
      error.value = e.message
      console.error('Error fetching products:', e)
    } finally {
      loading.value = false
    }
  }

  const getProductById = async (id) => {
    loading.value = true
    error.value = null
    try {
      return await fetchProductById(id)
    } catch (e) {
      error.value = e.message
      console.error(`Error fetching product ${id}:`, e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (product) => {
    loading.value = true
    error.value = null
    try {
      const newProduct = await addProductService(product)
      products.value = markRaw([...products.value, newProduct])
      if (process.client) await saveToIDB('products', products.value)
      return newProduct
    } catch (e) {
      error.value = e.message
      console.error('Error creating product:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id, product) => {
    loading.value = true
    error.value = null
    try {
      const updated = await updateProductService(id, product)
      products.value = markRaw(products.value.map(p => p.id === id ? updated : p))
      if (process.client) await saveToIDB('products', products.value)
      return updated
    } catch (e) {
      error.value = e.message
      console.error(`Error updating product ${id}:`, e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id) => {
    loading.value = true
    error.value = null
    try {
      await deleteProductService(id)
      products.value = markRaw(products.value.filter(p => p.id !== id))
      if (process.client) await saveToIDB('products', products.value)
    } catch (e) {
      error.value = e.message
      console.error(`Error deleting product ${id}:`, e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
