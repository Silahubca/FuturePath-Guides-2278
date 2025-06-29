import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { createCheckoutSession, PRODUCTS, validateStripeConfiguration } from '../../lib/stripe'
import { stripePromise } from '../../lib/stripe'
import AuthModal from '../auth/AuthModal'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiShoppingCart, FiLock, FiCreditCard, FiUser, FiAlertCircle, FiCheck, FiGift, FiZap, FiShield } = FiIcons

const OptimizedCheckoutButton = ({
  productId,
  className = '',
  children,
  couponData = null,
  size = 'default',
  showAuthFirst = true,
  variant = 'primary' // primary, secondary, urgent
}) => {
  const [loading, setLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [error, setError] = useState('')
  const [urgencyTimer, setUrgencyTimer] = useState(null)
  const [showTrustSignals, setShowTrustSignals] = useState(false)
  const { user } = useAuth()

  const product = PRODUCTS[productId]

  // Urgency timer for limited-time offers
  useEffect(() => {
    if (variant === 'urgent') {
      const endTime = new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const distance = endTime - now
        
        if (distance > 0) {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)
          setUrgencyTimer(`${hours}h ${minutes}m ${seconds}s`)
        } else {
          setUrgencyTimer('Expired')
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [variant])

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
    large: 'px-8 sm:px-12 py-4 text-lg xl:text-xl'
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    urgent: 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl animate-pulse'
  }

  return (
    <>
      <div className="w-full space-y-3">
        {error && (
          <motion.div
            className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2"
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

        {/* Urgency Timer */}
        {variant === 'urgent' && urgencyTimer && (
          <motion.div
            className="bg-gradient-to-r from-red-100 to-orange-100 border border-red-300 rounded-lg p-3 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiZap} className="text-red-600" />
              <span className="text-red-800 font-semibold">Limited Time: {urgencyTimer}</span>
            </div>
          </motion.div>
        )}

        {/* Main Checkout Button */}
        <motion.button
          onClick={handleCheckout}
          disabled={loading}
          className={`
            relative overflow-hidden font-semibold transition-all duration-300 transform hover:scale-105 
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
            flex items-center justify-center space-x-2 rounded-lg w-full
            ${sizeClasses[size]} ${variantClasses[variant]} ${className}
          `}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          onMouseEnter={() => setShowTrustSignals(true)}
          onMouseLeave={() => setShowTrustSignals(false)}
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

          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </motion.button>

        {/* Trust Signals */}
        <AnimatePresence>
          {showTrustSignals && (
            <motion.div
              className="bg-gray-50 border border-gray-200 rounded-lg p-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiShield} className="text-green-500" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiZap} className="text-blue-500" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiCheck} className="text-green-500" />
                  <span>Stripe Powered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiGift} className="text-purple-500" />
                  <span>Bonus Included</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Proof */}
        <div className="text-center text-xs text-gray-500">
          <span>Join 10,000+ satisfied customers</span>
        </div>
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

export default OptimizedCheckoutButton