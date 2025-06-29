// Vercel serverless function for creating Stripe checkout sessions
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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
      discountAmount 
    } = req.body

    if (!priceId || !productId || !customerEmail) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create or retrieve customer
    let customer
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
          source: 'futurepathguides'
        }
      })
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
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        productId,
        productName,
        customerEmail,
        ...(couponId && { couponId }),
        ...(discountAmount && { discountAmount: discountAmount.toString() })
      },
      payment_intent_data: {
        metadata: {
          productId,
          productName,
          customerEmail
        }
      },
      customer_update: {
        address: 'auto'
      },
      tax_id_collection: {
        enabled: false
      }
    }

    // Apply discount if coupon is provided
    if (couponId && discountAmount) {
      // For custom discounts, we'll modify the line item price
      // In production, you might want to create a Stripe coupon instead
      sessionConfig.line_items[0].price_data = {
        currency: 'usd',
        product_data: {
          name: productName,
          description: `${productName} - Special Discount Applied`
        },
        unit_amount: Math.round((sessionConfig.line_items[0].price - discountAmount) * 100)
      }
      delete sessionConfig.line_items[0].price
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig)

    // Log the session creation in Supabase
    try {
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'checkout_session_created',
          event_data: {
            session_id: session.id,
            product_id: productId,
            customer_email: customerEmail,
            amount: session.amount_total / 100
          }
        })
    } catch (logError) {
      console.warn('Failed to log analytics event:', logError)
    }

    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    })
  }
}