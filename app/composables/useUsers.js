import { getUsers, getUserById, updateUserDoc, deleteUserDoc } from '~/services/firebase/usersFirebase'
import { getFirebaseAuth } from '~/services/firebase/config'
import { sendPasswordResetEmail } from 'firebase/auth'

export const useUsers = () => {
  const users = useState('admin_users', () => [])
  const loading = useState('admin_users_loading', () => false)
  const error = useState('admin_users_error', () => null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await getUsers()
      users.value = data
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  const getUser = async (id) => {
    return getUserById(id)
  }

  const createUser = async (data) => {
    loading.value = true
    error.value = null
    try {
      await $fetch('/api/admin/create-user', {
        method: 'POST',
        body: data
      })
      await fetchUsers()
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, data) => {
    await updateUserDoc(id, data)
    await fetchUsers()
  }

  const deleteUser = async (id) => {
    await deleteUserDoc(id)
    await fetchUsers()
  }

  const sendPasswordReset = async (email) => {
    const auth = getFirebaseAuth()
    await sendPasswordResetEmail(auth, email)
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    sendPasswordReset
  }
}
