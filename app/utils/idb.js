const DB_NAME = 'publistand-db'
const DB_VERSION = 1
const STORE_NAME = 'products-store'

const getDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return resolve(null)
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error('IDB error:', event.target.error)
      reject(event.target.error)
    }

    request.onsuccess = (event) => {
      resolve(event.target.result)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

export const getFromIDB = async (key) => {
  try {
    const db = await getDB()
    if (!db) return null
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(key)

      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (e) {
    console.error('Error getting from IDB:', e)
    return null
  }
}

export const saveToIDB = async (key, val) => {
  try {
    const db = await getDB()
    if (!db) return
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const valToStore = JSON.parse(JSON.stringify(val))
      const request = store.put(valToStore, key)

      request.onsuccess = () => {
        resolve()
      }
      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (e) {
    console.error('Error saving to IDB:', e)
  }
}

export const clearIDB = async () => {
  try {
    const db = await getDB()
    if (!db) return
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => {
        resolve()
      }
      request.onerror = () => {
        reject(request.error)
      }
    })
  } catch (e) {
    console.error('Error clearing IDB:', e)
  }
}
