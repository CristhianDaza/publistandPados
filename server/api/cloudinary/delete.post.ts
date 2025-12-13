
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { public_id } = body

  if (!public_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing public_id',
    })
  }

  try {
    const cloudName = config.public.cloudinaryCloudName
    const apiKey = config.public.cloudinaryApiKey
    const apiSecret = config.cloudinaryApiSecret
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

    const response = await $fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: {
        public_id: public_id,
      }
    })

    return { success: true, response }
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete image',
      data: error
    })
  }
})
