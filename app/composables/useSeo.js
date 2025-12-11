export const useSeo = () => {
  const route = useRoute()

  const SITE_NAME = 'Publistandpados'
  const DEFAULT_DESCRIPTION = 'Artículos promocionales y publicitarios personalizados. Amplio catálogo de productos para tu marca.'
  const DEFAULT_IMAGE = 'https://res.cloudinary.com/djcbrawhb/image/upload/v1765342632/publistandPAdos_hrykep.png'

  const setPageSeo = ({ title, description, image, noIndex = false }) => {
    const pageTitle = title || SITE_NAME
    const pageDescription = description || DEFAULT_DESCRIPTION
    const pageImage = image || DEFAULT_IMAGE
    const canonicalUrl = `https://publistandpados.com/${route.fullPath}`

    useHead({
      title: pageTitle,
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ]
    })

    useSeoMeta({
      description: pageDescription,
      ogTitle: pageTitle,
      ogDescription: pageDescription,
      ogImage: pageImage,
      ogUrl: canonicalUrl,
      twitterTitle: pageTitle,
      twitterDescription: pageDescription,
      twitterImage: pageImage,
      ...(noIndex && { robots: 'noindex, nofollow' })
    })
  }

  const setProductSeo = (product) => {
    if (!product) return

    const title = product.name
    const description = product.description || `${product.name} - Artículo promocional disponible en Publistand Pados`
    const image = product.mainImage || DEFAULT_IMAGE
    const canonicalUrl = `https://publistandpados.com/products/${product.id}`

    let minPrice = 0
    let maxPrice = 0
    if (product.tableQuantity?.length) {
      const prices = product.tableQuantity
        .map(v => parseFloat(v.price))
        .filter(p => !isNaN(p) && p > 0)
      if (prices.length) {
        minPrice = Math.min(...prices)
        maxPrice = Math.max(...prices)
      }
    }

    const totalStock = product.tableQuantity?.reduce((acc, item) => {
      const qty = Number(item.quantity)
      return acc + (qty > 0 ? qty : 0)
    }, 0) || 0

    useHead({
      title,
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: description,
            image: image,
            sku: product.id,
            category: product.category?.join(', '),
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'COP',
              lowPrice: minPrice,
              highPrice: maxPrice,
              availability: totalStock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              offerCount: product.tableQuantity?.length || 1
            }
          })
        }
      ]
    })

    useSeoMeta({
      description,
      ogTitle: title,
      ogDescription: description,
      ogImage: image,
      ogUrl: canonicalUrl,
      ogType: 'product',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: image
    })
  }

  return {
    setPageSeo,
    setProductSeo,
    SITE_NAME,
    DEFAULT_DESCRIPTION
  }
}
