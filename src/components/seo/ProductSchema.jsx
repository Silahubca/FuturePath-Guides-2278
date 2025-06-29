import React from 'react'
import {Helmet} from 'react-helmet-async'

const ProductSchema = ({
  name,
  description,
  price,
  currency = 'USD',
  availability = 'InStock',
  condition = 'NewCondition',
  category = 'Digital Products',
  brand = 'FuturePath Guides',
  image,
  url,
  sku,
  gtin,
  reviews = [],
  aggregateRating = null
}) => {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": category,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": `https://schema.org/${availability}`,
      "itemCondition": `https://schema.org/${condition}`,
      "url": url,
      "seller": {
        "@type": "Organization",
        "name": brand
      },
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
    }
  }

  // Add SKU if provided
  if (sku) {
    productSchema.sku = sku
  }

  // Add GTIN if provided
  if (gtin) {
    productSchema.gtin = gtin
  }

  // Add aggregate rating if available
  if (aggregateRating) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": aggregateRating.bestRating || 5,
      "worstRating": aggregateRating.worstRating || 1
    }
  }

  // Add individual reviews
  if (reviews.length > 0) {
    productSchema.review = reviews.map(review => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewBody": review.text,
      "datePublished": review.date
    }))
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  )
}

export default ProductSchema