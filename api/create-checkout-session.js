// Enhanced Stripe checkout session creation with comprehensive error handling
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client with service key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Product configurations with live Stripe Price IDs
const PRODUCTS = {
  'ai-job-search': {
    id: 'ai-job-search',
    name: 'AI-Powered Job Search Blueprint',
    price: 9.99,
    stripePriceId: 'price_1RfEk9GIxGZYIT6Qb7MRCwI8',
    description: 'Master the AI-driven job market and land your dream job faster'
  },
  'ai-entrepreneur': {
    id: 'ai-entrepreneur',
    name: 'The AI Entrepreneur Blueprint',
    price: 9.99,
    stripePriceId: 'price_1RfEk9GIxGZYIT6QMJiAOHBI',
    description: 'Launch your lean digital business with AI-powered strategies'
  },
  'financial-freedom': {
    id: 'financial-freedom',
    name: 'Financial Freedom Blueprint',
    price: 9.99,
    stripePriceId: 'price_1RfEk9GIxGZYIT6QjAEFZqBy',
    description: 'Master your money and build lasting wealth through strategic planning'
  },
  'complete-collection': {
    id: 'complete-collection',
    name: 'Complete Life Mastery Collection',
    price: 26.97,
    stripePriceId: 'price_1RfEk9GIxGZYIT6QCUsdtmSE',
    description: 'All 3 blueprints + 12 bonus resources - Transform every area of your life'
  }
}

export default async function handler(req, res) {
  // Enhanced CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      priceId,
      productId,
      productName,
      customerEmail,
      successUrl,
      cancelUrl,
      couponId,
      discountAmount,
      metadata = {}
    } = req.body

    // Validate required fields
    if (!priceId || !productId || !customerEmail) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['priceId', 'productId', 'customerEmail']
      })
    }

    // Validate product exists
    const product = PRODUCTS[productId]
    if (!product) {
      return res.status(400).json({ error: 'Invalid product ID' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Create or retrieve customer
    let customer
    try {
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1
      })

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          metadata: {
            source: 'futurepathguides',
            created_via: 'checkout_api'
          }
        })
      }
    } catch (customerError) {
      console.error('Customer creation error:', customerError)
      return res.status(500).json({ error: 'Failed to create customer account' })
    }

    // Validate coupon if provided
    let validatedCoupon = null
    if (couponId) {
      try {
        const { data: coupon, error: couponError } = await supabase
          .from('coupons')
          .select('*')
          .eq('id', couponId)
          .eq('active', true)
          .single()

        if (couponError || !coupon) {
          return res.status(400).json({ error: 'Invalid or expired coupon' })
        }

        // Check usage limits
        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
          return res.status(400).json({ error: 'Coupon usage limit exceeded' })
        }

        // Check expiration
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
          return res.status(400).json({ error: 'Coupon has expired' })
        }

        validatedCoupon = coupon
      } catch (error) {
        console.error('Coupon validation error:', error)
        return res.status(500).json({ error: 'Failed to validate coupon' })
      }
    }

    // Create checkout session configuration
    const sessionConfig = {
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        productId,
        productName: productName || product.name,
        customerEmail,
        ...metadata,
        ...(couponId && { couponId }),
        ...(discountAmount && { discountAmount: discountAmount.toString() })
      },
      payment_intent_data: {
        metadata: {
          productId,
          productName: productName || product.name,
          customerEmail
        }
      },
      customer_update: {
        address: 'auto'
      },
      tax_id_collection: {
        enabled: false
      },
      billing_address_collection: 'auto',
      shipping_address_collection: null, // Digital products don't need shipping
      allow_promotion_codes: true, // Allow Stripe's built-in promotion codes
      automatic_tax: {
        enabled: false // You can enable this if you want automatic tax calculation
      }
    }

    // Apply discount if coupon is validated
    if (validatedCoupon && discountAmount) {
      const originalPrice = product.price
      const discountedPrice = Math.max(0, originalPrice - parseFloat(discountAmount))

      // Create a custom price with discount
      sessionConfig.line_items[0] = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${product.name} - ${validatedCoupon.code} Applied`,
            description: `${product.description} (${validatedCoupon.discount_type === 'percentage' ? validatedCoupon.discount_value + '%' : '$' + validatedCoupon.discount_value} discount applied)`,
            metadata: {
              original_product_id: productId,
              coupon_applied: validatedCoupon.code
            }
          },
          unit_amount: Math.round(discountedPrice * 100) // Convert to cents
        },
        quantity: 1
      }
    }

    // Create the checkout session
    let session
    try {
      session = await stripe.checkout.sessions.create(sessionConfig)
    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError)
      return res.status(500).json({
        error: 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? stripeError.message : 'Payment system error'
      })
    }

    // Log the session creation in Supabase for analytics
    try {
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'checkout_session_created',
          event_data: {
            session_id: session.id,
            product_id: productId,
            customer_email: customerEmail,
            amount: session.amount_total / 100,
            coupon_id: couponId || null,
            discount_amount: discountAmount || 0
          },
          user_agent: req.headers['user-agent'],
          session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
    } catch (logError) {
      console.warn('Failed to log analytics event:', logError)
      // Don't fail the request if analytics logging fails
    }

    // Return session ID for redirect
    res.status(200).json({
      sessionId: session.id,
      url: session.url // Stripe Checkout URL
    })

  } catch (error) {
    console.error('Unexpected error in checkout session creation:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    })
  }
}