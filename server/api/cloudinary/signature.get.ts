
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  getQuery(event);
  const timestamp = Math.round((new Date).getTime() / 1000)
  const uploadPreset = config.public.cloudinaryUploadPreset

  const paramsToSign = {
    timestamp: timestamp,
    upload_preset: uploadPreset
  }

  const stringToSign = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&')

  const signature = crypto
    .createHash('sha1')
    .update(stringToSign + config.cloudinaryApiSecret)
    .digest('hex')

  return {
    signature,
    timestamp,
    apiKey: config.public.cloudinaryApiKey,
    uploadPreset
  }
})
