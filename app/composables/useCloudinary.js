
export const useCloudinary = () => {
  const config = useRuntimeConfig()
  const uploading = ref(false)

  const uploadImage = async (file) => {
    if (!file) return null

    uploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', config.public.cloudinaryUploadPreset)
    formData.append('cloud_name', config.public.cloudinaryCloudName)

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw error
    } finally {
      uploading.value = false
    }
  }

  const deleteImage = async (publicId) => {
    if (!publicId) return

    try {
      await $fetch('/api/cloudinary/delete', {
        method: 'POST',
        body: { public_id: publicId }
      })
      return true
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return false
    }
  }

  const getPublicIdFromUrl = (url) => {
    if (!url) return null
    try {
      const parts = url.split('/')
      const filename = parts.pop()
      const nameWithoutExt = filename.split('.')[0]
      const uploadIndex = url.indexOf('/upload/')
      if (uploadIndex === -1) return null

      let relativePath = url.substring(uploadIndex + 8)
      if (relativePath.startsWith('v')) {
        const slashIndex = relativePath.indexOf('/')
        if (slashIndex !== -1) {
          relativePath = relativePath.substring(slashIndex + 1)
        }
      }

      const lastDotIndex = relativePath.lastIndexOf('.')
      if (lastDotIndex !== -1) {
        relativePath = relativePath.substring(0, lastDotIndex)
      }

      return relativePath
    } catch (e) {
      console.error('Error extracting public_id:', e)
      return null
    }
  }

  return {
    uploadImage,
    deleteImage,
    getPublicIdFromUrl,
    uploading
  }
}
