import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { PRODUCTS } from '../../lib/stripe'
import OptimizedCheckoutButton from './OptimizedCheckoutButton'
import CouponInput from '../coupons/CouponInput'
import TrustBadges from './TrustBadges'
import CheckoutProgress from './CheckoutProgress'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiShield, FiCreditCard, FiLock, FiCheck, FiGift, FiUsers, FiClock, FiStar } = FiIcons

const CheckoutFlow = ({ productId, className = '' }) => {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [couponData, setCouponData] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card')
  const [showTestimonials, setShowTestimonials] = useState(false)

  const product = PRODUCTS[productId]

  useEffect(() => {
    // Auto-advance steps based on user state
    if (user) {
      setCurrentStep(2)
    }
  }, [user])

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

  const steps = [
    { id: 1, title: 'Product Review', icon: FiCheck },
    { id: 2, title: 'Payment', icon: FiCreditCard },
    { id: 3, title: 'Access', icon: FiGift }
  ]

  const testimonials = [
    {
      text: "This changed my entire approach to job searching. Worth every penny!",
      author: "Sarah M.",
      rating: 5
    },
    {
      text: "The strategies in this guide actually work. I got 3 interviews in one week!",
      author: "David K.",
      rating: 5
    },
    {
      text: "Clear, actionable advice that you can implement immediately.",
      author: "Emily R.",
      rating: 5
    }
  ]

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Progress Bar */}
      <CheckoutProgress steps={steps} currentStep={currentStep} />

      <div className="p-6 lg:p-8">
        {/* Product Summary */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
            </div>
            <div className="ml-4 text-right">
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

          {/* What's Included Preview */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <SafeIcon icon={FiGift} className="mr-2" />
              What You Get Instantly:
            </h4>
            <div className="grid md:grid-cols-2 gap-2">
              {product.downloadFiles.slice(0, 4).map((file, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="text-green-500 flex-shrink-0" />
                  <span className="text-blue-800 text-sm">{file}</span>
                </div>
              ))}
              {product.downloadFiles.length > 4 && (
                <div className="text-blue-700 text-sm font-medium">
                  + {product.downloadFiles.length - 4} more resources
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coupon Input */}
        <CouponInput onCouponApplied={setCouponData} productPrice={originalPrice} />

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h4>
          <div className="grid grid-cols-1 gap-3">
            <label className="flex items-center p-4 border-2 border-blue-200 rounded-lg cursor-pointer bg-blue-50">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={selectedPaymentMethod === 'card'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center space-x-3 flex-1">
                <SafeIcon icon={FiCreditCard} className="text-blue-600 text-xl" />
                <div>
                  <div className="font-medium text-gray-900">Credit/Debit Card</div>
                  <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                </div>
              </div>
              <div className="w-4 h-4 border-2 border-blue-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Main Checkout Button */}
        <div className="mb-6">
          <OptimizedCheckoutButton
            productId={productId}
            couponData={couponData}
            className="w-full"
            size="large"
            variant="primary"
          >
            Complete Purchase - ${finalPrice.toFixed(2)}
          </OptimizedCheckoutButton>
        </div>

        {/* Trust Badges */}
        <TrustBadges />

        {/* Social Proof Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowTestimonials(!showTestimonials)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 mx-auto"
          >
            <SafeIcon icon={FiUsers} />
            <span>See what our customers say</span>
          </button>
        </div>

        {/* Testimonials */}
        <AnimatePresence>
          {showTestimonials && (
            <motion.div
              className="mt-4 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <SafeIcon key={i} icon={FiStar} className="text-yellow-400 fill-current text-sm" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm italic mb-2">"{testimonial.text}"</p>
                  <p className="text-gray-600 text-xs">- {testimonial.author}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

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
            Instant access to all digital files upon successful payment. All sales are final due to the digital nature of our products.
          </p>
        </motion.div>

        {/* Urgency/Scarcity Elements */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            <SafeIcon icon={FiClock} />
            <span>Limited time bonus materials included</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutFlow