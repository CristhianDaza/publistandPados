export default defineEventHandler(async (event) => {
  try {
    const { email, isAdmin } = await readBody(event)

    if (!email) {
      throw createError({
        statusCode: 400,
        message: 'Email is required'
      })
    }

    const { adminAuth } = useFirebaseAdmin()

    const user = await adminAuth.getUserByEmail(email)

    await adminAuth.setCustomUserClaims(user.uid, {
      admin: isAdmin === true
    })

    return {
      success: true,
      message: `Successfully ${isAdmin ? 'granted' : 'removed'} admin role for user ${email}`,
      uid: user.uid
    }
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    console.error('Error setting custom claims:', error)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
