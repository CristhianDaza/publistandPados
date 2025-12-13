export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, password, role, priceIncrease, active } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email y contraseña son requeridos'
      })
    }

    const { adminAuth, adminDb } = useFirebaseAdmin()

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name || '',
      disabled: active === false
    })

    const uid = userRecord.uid

    await adminDb.collection('users').doc(uid).set({
      id: uid,
      name: name || '',
      email,
      role: role || 'cliente',
      priceIncrease: typeof priceIncrease === 'number' ? priceIncrease : Number(priceIncrease) || 0,
      active: active !== false
    })

    return {
      success: true,
      uid
    }
  } catch (error) {
    console.error('Error creating user:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error creating user'
    })
  }
})

