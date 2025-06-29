import React from 'react'
import {Helmet} from 'react-helmet-async'

const SEOHead = ({
  title = 'FuturePath Guides - Your Blueprint for Success',
  description = 'Transform your career, launch your business, and achieve financial freedom with our expert-backed digital blueprints. AI-powered strategies for modern success.',
  keywords = 'career development, entrepreneurship, financial freedom, AI job search, digital business, personal finance, success blueprints, professional growth, business planning, wealth building',
  image = 'https://futurepathguides.com/og-image.jpg',
  url = 'https://futurepathguides.com',
  type = 'website',
  author = 'FuturePath Guides',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  price,
  currency = 'USD',
  availability = 'InStock'
}) => {
  // Generate structured data based on page type
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "FuturePath Guides",
      "url": "https://futurepathguides.com",
      "logo": "https://futurepathguides.com/logo.png",
      "description": description,
      "sameAs": [
        "https://facebook.com/futurepathguides",
        "https://twitter.com/futurepathguides",
        "https://linkedin.com/company/futurepathguides"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-0123",
        "contactType": "customer service",
        "email": "support@futurepathguides.com"
      }
    }

    // Add product schema for product pages
    if (type === 'product' && price) {
      const productData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": title.replace(' | FuturePath Guides', ''),
        "description": description,
        "image": image,
        "brand": {
          "@type": "Brand",
          "name": "FuturePath Guides"
        },
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": currency,
          "availability": `https://schema.org/${availability}`,
          "url": url,
          "seller": {
            "@type": "Organization",
            "name": "FuturePath Guides"
          }
        },
        "category": "Digital Products",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "127",
          "bestRating": "5",
          "worstRating": "1"
        }
      }
      return [baseData, productData]
    }

    // Add article schema for blog/guide pages
    if (type === 'article') {
      const articleData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title.replace(' | FuturePath Guides', ''),
        "description": description,
        "image": image,
        "author": {
          "@type": "Organization",
          "name": author
        },
        "publisher": {
          "@type": "Organization",
          "name": "FuturePath Guides",
          "logo": {
            "@type": "ImageObject",
            "url": "https://futurepathguides.com/logo.png"
          }
        },
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        }
      }
      return [baseData, articleData]
    }

    return baseData
  }

  const structuredData = generateStructuredData()

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="FuturePath Guides" />
      <meta property="og:locale" content="en_US" />

      {/* Article specific OG tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
          <meta property="article:author" content={author} />
        </>
      )}

      {/* Product specific OG tags */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={availability} />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@futurepathguides" />
      <meta name="twitter:creator" content="@futurepathguides" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//js.stripe.com" />
      <link rel="dns-prefetch" href="//supabase.co" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData])}
      </script>

      {/* Preload Critical Resources */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </Helmet>
  )
}

export default SEOHead