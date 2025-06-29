import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCreditCard, FiLock, FiCheck, FiAlertCircle, FiShield } = FiIcons

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

const PaymentProcessor = ({ productId, amount, onSuccess, onError, className = '' }) => {
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [billingDetails, setBillingDetails] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  })

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <SafeIcon icon={FiShield} className="text-green-500" />
          <span>Secured by Stripe • SSL Encrypted</span>
        </div>
      </div>

      <Elements stripe={stripePromise}>
        <PaymentForm
          productId={productId}
          amount={amount}
          billingDetails={billingDetails}
          setBillingDetails={setBillingDetails}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  )
}

const PaymentForm = ({ productId, amount, billingDetails, setBillingDetails, onSuccess, onError }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState({})
  const [cardComplete, setCardComplete] = useState(false)

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  }

  const handleCardChange = (event) => {
    setCardComplete(event.complete)
    if (event.error) {
      setErrors({ card: event.error.message })
    } else {
      setErrors({ ...errors, card: null })
    }
  }

  const handleBillingChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setBillingDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!billingDetails.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!billingDetails.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(billingDetails.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!billingDetails.address.line1.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!billingDetails.address.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!billingDetails.address.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!billingDetails.address.postal_code.trim()) {
      newErrors.postal_code = 'ZIP code is required'
    }

    if (!cardComplete) {
      newErrors.card = 'Please complete your card information'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (!validateForm()) {
      return
    }

    setProcessing(true)

    try {
      // Create payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          productId,
          userId: user.id,
          customerEmail: billingDetails.email,
          billingDetails
        }),
      })

      const { clientSecret, error: backendError } = await response.json()

      if (backendError) {
        throw new Error(backendError)
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            address: billingDetails.address,
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (paymentIntent.status === 'succeeded') {
        // Record purchase in database
        const { error: dbError } = await supabase
          .from('purchases')
          .insert({
            user_id: user.id,
            product_id: productId,
            amount: amount,
            stripe_payment_intent_id: paymentIntent.id,
            status: 'completed',
            billing_details: billingDetails
          })

        if (dbError) {
          console.error('Database error:', dbError)
          // Payment succeeded but database failed - handle gracefully
        }

        onSuccess(paymentIntent)
      }

    } catch (error) {
      console.error('Payment error:', error)
      onError(error.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Billing Information */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h4>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={billingDetails.name}
              onChange={(e) => handleBillingChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={billingDetails.email}
              onChange={(e) => handleBillingChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            value={billingDetails.address.line1}
            onChange={(e) => handleBillingChange('address.line1', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main Street"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={billingDetails.address.city}
              onChange={(e) => handleBillingChange('address.city', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              value={billingDetails.address.state}
              onChange={(e) => handleBillingChange('address.state', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="NY"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              value={billingDetails.address.postal_code}
              onChange={(e) => handleBillingChange('address.postal_code', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.postal_code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="10001"
            />
            {errors.postal_code && (
              <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
            )}
          </div>
        </div>
      </div>

      {/* Card Information */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <SafeIcon icon={FiCreditCard} className="mr-2" />
          Card Information
        </h4>
        
        <div className={`p-4 border rounded-lg ${errors.card ? 'border-red-500' : 'border-gray-300'}`}>
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>
        
        {errors.card && (
          <p className="text-red-500 text-sm mt-1">{errors.card}</p>
        )}

        <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600">
          <SafeIcon icon={FiLock} className="text-green-500" />
          <span>Your payment information is encrypted and secure</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <SafeIcon icon={FiCheck} />
            <span>Complete Payment - ${amount.toFixed(2)}</span>
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <SafeIcon icon={FiShield} className="text-green-500" />
          <span>Protected by 256-bit SSL encryption</span>
        </div>
      </div>
    </form>
  )
}

export default PaymentProcessor