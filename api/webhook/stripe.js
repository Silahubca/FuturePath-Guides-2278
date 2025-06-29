// Stripe webhook handler for processing payment events
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client with service key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break
      
      case 'customer.subscription.created':
        // Handle subscription creation if you add subscriptions later
        console.log('Subscription created:', event.data.object.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}

async function handleCheckoutSessionCompleted(session) {
  try {
    const { 
      customer_email, 
      metadata, 
      amount_total,
      payment_intent
    } = session

    // Find user by email
    const { data: authUser } = await supabase.auth.admin.listUsers()
    const user = authUser.users.find(u => u.email === customer_email)

    if (!user) {
      console.error('User not found for email:', customer_email)
      return
    }

    // Create purchase record
    const purchaseData = {
      user_id: user.id,
      product_id: metadata.productId,
      product_name: metadata.productName,
      amount: amount_total / 100, // Convert from cents
      stripe_session_id: session.id,
      stripe_payment_intent_id: payment_intent,
      status: 'completed',
      coupon_id: metadata.couponId || null,
      discount_amount: metadata.discountAmount ? parseFloat(metadata.discountAmount) : 0
    }

    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert(purchaseData)
      .select()
      .single()

    if (purchaseError) {
      throw purchaseError
    }

    // Send welcome notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        title: 'Purchase Successful! 🎉',
        message: `Thank you for purchasing ${metadata.productName}! You can now access your digital content from your dashboard.`,
        type: 'success'
      })

    // Log analytics event
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'purchase_completed',
        user_id: user.id,
        event_data: {
          product_id: metadata.productId,
          amount: amount_total / 100,
          session_id: session.id
        }
      })

    // Update coupon usage if applicable
    if (metadata.couponId) {
      await supabase
        .from('coupons')
        .update({ 
          usage_count: supabase.raw('usage_count + 1') 
        })
        .eq('id', metadata.couponId)
    }

    console.log('Purchase processed successfully:', purchase.id)
  } catch (error) {
    console.error('Error processing completed checkout session:', error)
    throw error
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    // Update purchase status if needed
    const { error } = await supabase
      .from('purchases')
      .update({ 
        status: 'completed',
        stripe_payment_intent_id: paymentIntent.id
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (error && error.code !== 'PGRST116') { // Ignore "no rows updated" error
      throw error
    }

    console.log('Payment intent succeeded:', paymentIntent.id)
  } catch (error) {
    console.error('Error processing payment intent succeeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  try {
    // Update purchase status to failed
    const { error } = await supabase
      .from('purchases')
      .update({ 
        status: 'failed'
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (error && error.code !== 'PGRST116') { // Ignore "no rows updated" error
      throw error
    }

    // Find user and send notification
    const { data: purchases } = await supabase
      .from('purchases')
      .select('user_id, product_name')
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (purchases && purchases.length > 0) {
      const purchase = purchases[0]
      
      await supabase
        .from('notifications')
        .insert({
          user_id: purchase.user_id,
          title: 'Payment Failed',
          message: `Your payment for ${purchase.product_name} could not be processed. Please try again or contact support.`,
          type: 'error'
        })
    }

    console.log('Payment intent failed:', paymentIntent.id)
  } catch (error) {
    console.error('Error processing payment intent failed:', error)
  }
}

// Disable body parsing to handle raw webhook data
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}