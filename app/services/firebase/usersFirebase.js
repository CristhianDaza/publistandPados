import { collection, getDocs } from 'firebase/firestore'
import { getFirebaseDb } from './config'

export const getUsers = async () => {
  const db = getFirebaseDb()
  const querySnapshot = await getDocs(collection(db, 'users'))
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
