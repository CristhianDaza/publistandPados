import {
  getProducts as fetchProducts,
  getProductById as fetchProductById,
  createProduct as addProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService
} from '~/services/firebase/productsFirebase'

export const useProducts = () => {
  const products = useState('products', () => [])
  const loading = useState('products-loading', () => false)
  const error = useState('products-error', () => null)

  const getProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await fetchProducts()
      products.value = data
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
      products.value.push(newProduct)
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
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = updated
      }
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
      products.value = products.value.filter(p => p.id !== id)
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
