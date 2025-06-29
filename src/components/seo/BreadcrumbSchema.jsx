import React from 'react'
import {Helmet} from 'react-helmet-async'
import {useLocation} from 'react-router-dom'

const BreadcrumbSchema = ({ customBreadcrumbs = null }) => {
  const location = useLocation()
  
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment)
    const breadcrumbs = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://futurepathguides.com"
      }
    ]

    let currentPath = "https://futurepathguides.com"
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Convert segment to readable name
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": name,
        "item": currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": generateBreadcrumbs()
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  )
}

export default BreadcrumbSchema