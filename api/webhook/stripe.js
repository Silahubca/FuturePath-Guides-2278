// Enhanced Stripe webhook handler with comprehensive event processing
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
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  try {
    // Process different event types
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

      case 'invoice.payment_succeeded':
        // Handle subscription payments if you add subscriptions later
        await handleInvoicePaymentSucceeded(event.data.object)
        break

      case 'customer.subscription.created':
        // Handle subscription creation if you add subscriptions later
        console.log('Subscription created:', event.data.object.id)
        break

      case 'charge.dispute.created':
        // Handle chargebacks
        await handleChargeDispute(event.data.object)
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
      payment_intent,
      customer
    } = session

    // Find user by email
    const { data: authUser } = await supabase.auth.admin.listUsers()
    const user = authUser.users.find(u => u.email === customer_email)

    if (!user) {
      console.error('User not found for email:', customer_email)
      // Create a pending purchase record for manual processing
      await supabase
        .from('pending_purchases')
        .insert({
          customer_email,
          product_id: metadata.productId,
          product_name: metadata.productName,
          amount: amount_total / 100,
          stripe_session_id: session.id,
          stripe_payment_intent_id: payment_intent,
          status: 'pending_user_creation',
          metadata: metadata
        })
      return
    }

    // Check for duplicate purchase
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('stripe_session_id', session.id)
      .single()

    if (existingPurchase) {
      console.log('Purchase already processed:', session.id)
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
      stripe_customer_id: customer,
      status: 'completed',
      coupon_id: metadata.couponId || null,
      discount_amount: metadata.discountAmount ? parseFloat(metadata.discountAmount) : 0,
      purchase_metadata: {
        stripe_session: session.id,
        payment_method_types: session.payment_method_types,
        currency: session.currency,
        customer_details: session.customer_details
      }
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
        message: `Thank you for purchasing ${metadata.productName}! You can now access your digital content from your dashboard. Check your email for download links.`,
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
          session_id: session.id,
          payment_intent_id: payment_intent,
          coupon_used: metadata.couponId || null,
          discount_amount: metadata.discountAmount || 0
        }
      })

    // Update coupon usage if applicable
    if (metadata.couponId) {
      await supabase
        .from('coupons')
        .update({
          usage_count: supabase.raw('usage_count + 1'),
          last_used_at: new Date().toISOString()
        })
        .eq('id', metadata.couponId)
    }

    // Initialize reading progress for the purchased product
    await supabase
      .from('reading_progress')
      .insert({
        user_id: user.id,
        product_id: metadata.productId,
        total_sections: getProductSectionCount(metadata.productId),
        completed_sections: 0,
        completion_percentage: 0
      })
      .onConflict('user_id,product_id')
      .merge()

    // Award first purchase achievement if this is their first purchase
    const { count: purchaseCount } = await supabase
      .from('purchases')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (purchaseCount === 1) {
      await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          title: 'First Purchase',
          description: 'Made your first purchase! Welcome to the community.',
          badge_type: 'milestone'
        })
    }

    // Send purchase confirmation email (you can implement this)
    await sendPurchaseConfirmationEmail(user.email, purchase)

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
        stripe_payment_intent_id: paymentIntent.id,
        payment_completed_at: new Date().toISOString()
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
        status: 'failed',
        failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed'
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
          message: `Your payment for ${purchase.product_name} could not be processed. Please try again or contact support if you need assistance.`,
          type: 'error'
        })
    }

    console.log('Payment intent failed:', paymentIntent.id)
  } catch (error) {
    console.error('Error processing payment intent failed:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  try {
    // Handle subscription invoice payments
    console.log('Invoice payment succeeded:', invoice.id)
    
    // You can add logic here for subscription-based products
    // For now, just log the event
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'invoice_payment_succeeded',
        event_data: {
          invoice_id: invoice.id,
          amount: invoice.amount_paid / 100,
          customer_id: invoice.customer,
          subscription_id: invoice.subscription
        }
      })
  } catch (error) {
    console.error('Error processing invoice payment:', error)
  }
}

async function handleChargeDispute(dispute) {
  try {
    // Handle chargeback/dispute
    console.log('Charge dispute created:', dispute.id)
    
    // Log the dispute for admin attention
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'charge_dispute_created',
        event_data: {
          dispute_id: dispute.id,
          charge_id: dispute.charge,
          amount: dispute.amount / 100,
          reason: dispute.reason,
          status: dispute.status
        }
      })

    // You might want to send an admin notification here
  } catch (error) {
    console.error('Error processing charge dispute:', error)
  }
}

// Helper functions
function getProductSectionCount(productId) {
  const sectionCounts = {
    'ai-job-search': 7,
    'ai-entrepreneur': 7,
    'financial-freedom': 7,
    'complete-collection': 21 // All three products combined
  }
  return sectionCounts[productId] || 7
}

async function sendPurchaseConfirmationEmail(email, purchase) {
  // Implement email sending logic here
  // You can use services like SendGrid, Mailgun, or AWS SES
  console.log(`Would send confirmation email to ${email} for purchase ${purchase.id}`)
}

// Disable body parsing to handle raw webhook data
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}