import React from 'react'
import {Helmet} from 'react-helmet-async'

const FAQSchema = ({ faqs }) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  )
}

export default FAQSchema