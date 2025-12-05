import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { getFirebaseAuth } from '~/services/firebase/config'

export const useAuth = () => {
  const user = useState('auth_user', () => null)
  const loading = useState('auth_loading', () => true)
  const error = useState('auth_error', () => null)

  const initAuth = () => {
    if (process.server) return

    const auth = getFirebaseAuth()
    loading.value = true

    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
      loading.value = false
    }, (err) => {
      console.error('Auth state change error:', err)
      error.value = err
      loading.value = false
    })
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const auth = getFirebaseAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return userCredential.user
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      const auth = getFirebaseAuth()
      await signOut(auth)
      user.value = null
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    initAuth,
    login,
    logout
  }
}
