import { collection, getDocs, limit, query } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    const db1 = useFirebase1()
    const db2 = useFirebase2()

    const col2 = collection(db2, 'lastedUpdatedProducts')
    const q2 = query(col2, limit(1))
    const snap2 = await getDocs(q2)
    let api2Date = null
    if (!snap2.empty) {
      api2Date = snap2.docs[0].data().lastUpdate
    }

    const col1 = collection(db1, 'lastedUpdatedProducts')
    const q1 = query(col1, limit(1))
    const snap1 = await getDocs(q1)
    let api1Date = null
    if (!snap1.empty) {
      api1Date = snap1.docs[0].data().lastUpdate
    }

    return {
      success: true,
      api1Date,
      api2Date
    }
  } catch (error) {
    console.error('Error getting sync status:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get sync status',
      data: error.message
    })
  }
})
