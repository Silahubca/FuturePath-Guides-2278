import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { createCheckoutSession, PRODUCTS, validateStripeConfiguration } from '../../lib/stripe'
import { stripePromise } from '../../lib/stripe'
import AuthModal from '../auth/AuthModal'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiShoppingCart, FiLock, FiCreditCard, FiUser, FiAlertCircle } = FiIcons

const CheckoutButton = ({ 
  productId, 
  className = '', 
  children, 
  couponData = null, 
  size = 'default',
  showAuthFirst = true 
}) => {
  const [loading, setLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [error, setError] = useState('')
  const { user } = useAuth()

  const product = PRODUCTS[productId]

  const handleCheckout = async () => {
    setError('')

    // If user is not logged in, show auth modal first
    if (!user && showAuthFirst) {
      setAuthMode('signin')
      setShowAuthModal(true)
      return
    }

    if (!product) {
      setError('Product not found')
      return
    }

    // Validate Stripe configuration
    try {
      validateStripeConfiguration()
    } catch (error) {
      console.error('Stripe configuration error:', error)
      setError('Payment system setup required. Please check the setup guide in README_STRIPE_SETUP.md')
      return
    }

    setLoading(true)

    try {
      // Create checkout session
      const sessionId = await createCheckoutSession(
        productId,
        user.email,
        couponData
      )

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        console.error('Stripe error:', error)
        setError('Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      if (error.message.includes('not configured')) {
        setError('Payment system is not properly configured. Please contact support.')
      } else if (error.message.includes('Product not found')) {
        setError('The requested product is not available.')
      } else if (error.message.includes('fetch')) {
        setError('Unable to connect to payment service. Please ensure the backend API is running.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // After successful auth, proceed with checkout
    setTimeout(() => {
      handleCheckout()
    }, 500)
  }

  const finalPrice = couponData ? couponData.finalPrice : product?.price
  const hasDiscount = couponData && couponData.discountAmount > 0

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    default: 'px-6 sm:px-8 py-3 text-base',
    large: 'px-8 sm:px-12 py-4 text-lg'
  }

  return (
    <>
      <div className="w-full">
        {error && (
          <motion.div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SafeIcon icon={FiAlertCircle} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-red-700 text-sm">
              <p>{error}</p>
              {error.includes('setup required') && (
                <p className="mt-2 text-xs">
                  <strong>Setup needed:</strong>
                  <br />1. Add REACT_APP_STRIPE_PUBLISHABLE_KEY to .env
                  <br />2. Update stripePriceId values in src/lib/stripe.js
                  <br />3. Deploy API endpoints for payment processing
                </p>
              )}
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={handleCheckout}
          disabled={loading}
          className={`
            relative overflow-hidden font-semibold transition-all duration-300 
            transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed 
            disabled:transform-none flex items-center justify-center space-x-2 
            rounded-lg w-full ${sizeClasses[size]} ${className}
          `}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Processing...</span>
            </>
          ) : !user && showAuthFirst ? (
            <>
              <SafeIcon icon={FiUser} className="text-lg flex-shrink-0" />
              <span className="truncate">Sign In to Purchase</span>
              <SafeIcon icon={FiLock} className="text-sm opacity-75 flex-shrink-0" />
            </>
          ) : (
            <>
              <SafeIcon icon={FiCreditCard} className="text-lg flex-shrink-0" />
              <div className="flex flex-col items-center min-w-0">
                {hasDiscount && (
                  <span className="text-xs line-through opacity-75">${product?.price}</span>
                )}
                <span className="truncate">
                  {children || `Buy Now - $${finalPrice?.toFixed(2)}`}
                </span>
              </div>
              <SafeIcon icon={FiLock} className="text-sm opacity-75 flex-shrink-0" />
            </>
          )}
        </motion.button>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
        showSignUpOption={true}
        purchaseContext={{
          productName: product?.name,
          productPrice: finalPrice
        }}
      />
    </>
  )
}

export default CheckoutButton