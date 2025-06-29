import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { PRODUCTS } from '../../lib/stripe'
import CheckoutButton from './CheckoutButton'
import CouponInput from '../coupons/CouponInput'
import AuthModal from '../auth/AuthModal'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiShield, FiCreditCard, FiLock, FiCheck } = FiIcons

const PaymentForm = ({ productId, className = '' }) => {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [couponData, setCouponData] = useState(null)
  const [authMode, setAuthMode] = useState('signin')
  
  const product = PRODUCTS[productId]
  
  if (!product) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Product not found</p>
      </div>
    )
  }

  const originalPrice = product.price
  const finalPrice = couponData ? couponData.finalPrice : originalPrice
  const savings = couponData ? couponData.discountAmount : 0

  const handleAuthRequired = () => {
    setShowAuthModal(true)
  }

  const securityFeatures = [
    'Secure 256-bit SSL encryption',
    'Powered by Stripe',
    'No stored payment data',
    'Instant digital delivery'
  ]

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 ${className}`}>
      {/* Product Summary */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        
        {/* Price Display */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700">Price:</span>
            <div className="text-right">
              {savings > 0 && (
                <div className="text-lg text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </div>
              )}
              <div className="text-3xl font-bold text-green-600">
                ${finalPrice.toFixed(2)}
              </div>
              {savings > 0 && (
                <div className="text-sm text-green-600 font-medium">
                  Save ${savings.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coupon Input */}
        <CouponInput 
          onCouponApplied={setCouponData}
          productPrice={originalPrice}
        />
      </div>

      {/* What's Included */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">What's Included:</h4>
        <div className="space-y-2">
          {product.downloadFiles.map((file, index) => (
            <div key={index} className="flex items-center space-x-3">
              <SafeIcon icon={FiCheck} className="text-green-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{file}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Button */}
      <div className="mb-6">
        {user ? (
          <CheckoutButton
            productId={productId}
            couponData={couponData}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg"
            size="large"
          >
            Complete Purchase - ${finalPrice.toFixed(2)}
          </CheckoutButton>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => {
                setAuthMode('signin')
                setShowAuthModal(true)
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiCreditCard} />
              <span>Sign In to Purchase</span>
            </button>
            
            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                onClick={() => {
                  setAuthMode('signup')
                  setShowAuthModal(true)
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up here
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security Features */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <SafeIcon icon={FiShield} className="text-green-500" />
          <span className="font-semibold text-gray-900">Secure Checkout</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <SafeIcon icon={FiLock} className="text-green-500 text-xs" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Money Back Guarantee */}
      <motion.div 
        className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <SafeIcon icon={FiShield} className="text-green-600" />
          <span className="font-semibold text-green-900">Digital Product Guarantee</span>
        </div>
        <p className="text-sm text-green-700">
          Instant access to all digital files upon successful payment. 
          All sales are final due to the digital nature of our products.
        </p>
      </motion.div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  )
}

export default PaymentForm