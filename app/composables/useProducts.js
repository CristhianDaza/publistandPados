import {
  getProducts as fetchProducts,
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
      if (import.meta.client && !force) {
        const cached = await getFromIDB('products')
        if (cached && Array.isArray(cached) && cached.length > 0) {
          products.value = markRaw(cached)
          loading.value = false
          return
        }
      }

      const data = await fetchProducts()

      if (import.meta.client) {
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
      if (products.value.length === 0) {
        await getProducts()
      }

      const product = products.value.find(p => p.id === id)

      if (!product) {
        throw new Error('Product not found')
      }

      return product
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
      if (import.meta.client) await saveToIDB('products', products.value)
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
      if (import.meta.client) await saveToIDB('products', products.value)
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
      if (import.meta.client) await saveToIDB('products', products.value)
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
