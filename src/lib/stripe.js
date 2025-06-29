import { loadStripe } from '@stripe/stripe-js'

// Live Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_live_51ResbBGIxGZYIT6Q3GlewIFtE5A1DzV7iL3fw3gZsaIpKtQ3knxDsTiqo3qFWxD3mfNYOfEn2LVe4hm6CNiZ3Ojl00DtNDNw6e'

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

// Product configurations with Stripe Price IDs and Payment Links
export const PRODUCTS = {
  'ai-job-search': {
    id: 'ai-job-search',
    name: 'AI-Powered Job Search Blueprint',
    price: 9.99,
    stripePriceId: 'price_1RfEk9GIxGZYIT6Qb7MRCwI8',
    paymentLink: 'https://buy.stripe.com/14A4gzaj20g2f2bbEE',
    description: 'Master the AI-driven job market and land your dream job faster',
    downloadFiles: [
      'ai-job-search-blueprint.pdf',
      'ats-resume-template.docx',
      'cover-letter-template.docx',
      'ai-prompts-library.pdf',
      'interview-checklist.pdf'
    ]
  },
  'ai-entrepreneur': {
    id: 'ai-entrepreneur',
    name: 'The AI Entrepreneur Blueprint',
    price: 9.99,
    stripePriceId: 'price_1RfEk9GIxGZYIT6QMJiAOHBI',
    paymentLink: 'https://buy.stripe.com/eVq8wP1Mw2oa1blcII',
    description: 'Launch your lean digital business with AI-powered strategies',
    downloadFiles: [
      'ai-entrepreneur-blueprint.pdf',
      'business-plan-template.xlsx',
      'uvp-canvas-worksheet.pdf',
      'ai-tools-toolkit.pdf',
      'marketing-launch-plan.pdf'
    ]
  },
  'financial-freedom': {
    id: 'financial-freedom',
    name: 'Financial Freedom Blueprint',
    price: 9.99,
    stripePriceId: 'price_1RfEk9GIxGZYIT6QjAEFZqBy',
    paymentLink: 'https://buy.stripe.com/5kQfZh0Is3se1bleQQ',
    description: 'Master your money and build lasting wealth through strategic planning',
    downloadFiles: [
      'financial-freedom-blueprint.pdf',
      'money-map-tracker.xlsx',
      'debt-demolisher-worksheet.pdf',
      'investment-portfolio-guide.pdf',
      'financial-goal-setter.pdf'
    ]
  },
  'complete-collection': {
    id: 'complete-collection',
    name: 'Complete Life Mastery Collection',
    price: 26.97,
    stripePriceId: 'price_1RfEk9GIxGZYIT6QCUsdtmSE',
    paymentLink: 'https://buy.stripe.com/fZu3cv8aUe6S8DN244',
    description: 'All 3 blueprints + 12 bonus resources - Transform every area of your life',
    downloadFiles: [
      'ai-job-search-blueprint.pdf',
      'ats-resume-template.docx',
      'cover-letter-template.docx',
      'ai-prompts-library.pdf',
      'interview-checklist.pdf',
      'ai-entrepreneur-blueprint.pdf',
      'business-plan-template.xlsx',
      'uvp-canvas-worksheet.pdf',
      'ai-tools-toolkit.pdf',
      'marketing-launch-plan.pdf',
      'financial-freedom-blueprint.pdf',
      'money-map-tracker.xlsx',
      'debt-demolisher-worksheet.pdf',
      'investment-portfolio-guide.pdf',
      'financial-goal-setter.pdf'
    ]
  }
}

export const createCheckoutSession = async (productId, userEmail, couponData = null) => {
  const product = PRODUCTS[productId]
  if (!product) {
    throw new Error('Product not found')
  }

  try {
    const requestBody = {
      priceId: product.stripePriceId,
      productId: product.id,
      productName: product.name,
      customerEmail: userEmail,
      successUrl: `${window.location.origin}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/#/cancel`
    }

    // Add coupon data if available
    if (couponData) {
      requestBody.couponId = couponData.couponId
      requestBody.discountAmount = couponData.discountAmount
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Network response was not ok')
    }

    const { sessionId } = await response.json()
    return sessionId
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export const validateStripeConfiguration = () => {
  if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY === 'pk_test_your_key_here') {
    throw new Error('Stripe publishable key not configured. Please add REACT_APP_STRIPE_PUBLISHABLE_KEY to your environment variables.')
  }

  // Check if all products have valid price IDs
  const invalidProducts = Object.entries(PRODUCTS).filter(([key, product]) => 
    !product.stripePriceId || product.stripePriceId.includes('REPLACE_WITH_YOUR_ACTUAL')
  )

  if (invalidProducts.length > 0) {
    const productNames = invalidProducts.map(([key]) => key).join(', ')
    throw new Error(`Products with invalid Stripe Price IDs: ${productNames}. Please update the stripePriceId values in src/lib/stripe.js with your actual Stripe Price IDs.`)
  }

  // Check if API endpoint exists (basic check)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.warn('Running in development mode. Make sure your API endpoints are running.')
  }
}