import { useFirebase2Admin } from '../utils/firebase2Admin'

const normalizeDateMs = (value) => {
  if (value === null || value === undefined) return null

  if (typeof value?.toMillis === 'function') {
    const ms = value.toMillis()
    return Number.isFinite(ms) ? ms : null
  }

  if (value instanceof Date) {
    const ms = value.getTime()
    return Number.isFinite(ms) ? ms : null
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null
    return value < 1e12 ? Math.trunc(value * 1000) : Math.trunc(value)
  }

  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  if (typeof value === 'object') {
    const seconds = value.seconds ?? value._seconds
    const nanoseconds = value.nanoseconds ?? value._nanoseconds ?? 0

    if (typeof seconds === 'number' && Number.isFinite(seconds)) {
      return Math.trunc(seconds * 1000 + nanoseconds / 1e6)
    }
  }

  return null
}

export default defineEventHandler(async (event) => {
  try {
    const { adminDb } = useFirebaseAdmin()
    const { adminDb2 } = useFirebase2Admin()

    const sourceStatusRef = adminDb2.collection('lastedUpdatedProducts').doc('status')
    const sourceStatusSnap = await sourceStatusRef.get()
    const sourceStatus = sourceStatusSnap.exists() ? sourceStatusSnap.data() : null

    const destStatusRef = adminDb.collection('lastedUpdatedProducts').doc('status')
    const destStatusSnap = await destStatusRef.get()
    const destStatus = destStatusSnap.exists() ? destStatusSnap.data() : null

    const api2DateMs = normalizeDateMs(sourceStatus?.lastUpdateMs ?? sourceStatus?.lastUpdate ?? sourceStatus?.lastUpdateIso)
    const api1DateMs = normalizeDateMs(destStatus?.lastUpdateMs ?? destStatus?.lastUpdate ?? destStatus?.lastUpdateIso)

    const api2DateIso = api2DateMs ? new Date(api2DateMs).toISOString() : null
    const api1DateIso = api1DateMs ? new Date(api1DateMs).toISOString() : null

    console.info('[sync-status] dates', {
      api1DateMs,
      api2DateMs,
      syncRecoveryV2Done: Boolean(destStatus?.syncRecoveryV2Done)
    })

    return {
      success: true,
      api1DateIso,
      api2DateIso,
      api1DateMs,
      api2DateMs,
      syncRecoveryV2Done: Boolean(destStatus?.syncRecoveryV2Done)
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
