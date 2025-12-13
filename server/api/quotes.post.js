
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { items, customer, summary } = body || {}

    if (!Array.isArray(items) || !items.length) {
      throw createError({ statusCode: 400, statusMessage: 'No hay items para cotizar' })
    }

    if (!customer) {
      throw createError({ statusCode: 400, statusMessage: 'Datos de contacto incompletos' })
    }

    if (customer.userId) {
      if (!customer.email) {
        throw createError({ statusCode: 400, statusMessage: 'Email es requerido' })
      }
    } else {
      if (!customer.name || !customer.email || !customer.phone) {
        throw createError({ statusCode: 400, statusMessage: 'Datos de contacto incompletos (nombre, email y teléfono requeridos)' })
      }
    }

    const payload = {
      items,
      customer,
      summary: {
        totalUnits: summary?.totalUnits || items.reduce((sum, item) => sum + (item.entries?.reduce((acc, entry) => acc + Number(entry.quantity || 0), 0) || 0), 0),
        itemCount: summary?.itemCount || items.length
      },
      status: 'pendiente',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const { adminDb } = useFirebaseAdmin()
    const docRef = await adminDb.collection('quotes').add(payload)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('❌ Error creando cotización:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error creando cotización',
      message: error.message || 'Error'
    })
  }
})

