import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { getFirebaseAuth, getFirebaseDb } from '~/services/firebase/config'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'

export const useAuth = () => {
  const user = useState('auth_user', () => null)
  const loading = useState('auth_loading', () => true)
  const error = useState('auth_error', () => null)

  const initAuth = () => {
    if (process.server) return

    const auth = getFirebaseAuth()
    loading.value = true

    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const db = getFirebaseDb()
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            user.value = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              ...userData
            }
          } else {
            const q = query(collection(db, 'users'), where('email', '==', currentUser.email))
            const querySnapshot = await getDocs(q)
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data()
              user.value = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                ...userData
              }
            } else {
              user.value = currentUser
            }
          }
        } catch (e) {
          console.error('Error fetching user role:', e)
          user.value = currentUser
        }
      } else {
        user.value = null
      }
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

      const db = getFirebaseDb()
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      let userData = {}
      if (userDoc.exists()) {
        userData = userDoc.data()
      }

      user.value = { ...userCredential.user, ...userData }
      return user.value
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
