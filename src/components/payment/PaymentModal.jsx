import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PaymentProcessor from './PaymentProcessor'
import { PRODUCTS } from '../../lib/stripe'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiX, FiCheck, FiAlertCircle } = FiIcons

const PaymentModal = ({ isOpen, onClose, productId, couponData = null }) => {
  const navigate = useNavigate()
  const [paymentStatus, setPaymentStatus] = useState('idle') // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState('')

  const product = PRODUCTS[productId]
  if (!product) return null

  const originalAmount = product.price
  const finalAmount = couponData ? couponData.finalPrice : originalAmount
  const savings = couponData ? couponData.discountAmount : 0

  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentStatus('success')
    
    // Redirect to success page after a brief delay
    setTimeout(() => {
      navigate(`/success?payment_intent=${paymentIntent.id}`)
      onClose()
    }, 2000)
  }

  const handlePaymentError = (error) => {
    setPaymentStatus('error')
    setErrorMessage(error)
  }

  const resetModal = () => {
    setPaymentStatus('idle')
    setErrorMessage('')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
              <p className="text-gray-600">{product.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <SafeIcon icon={FiX} className="text-2xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {paymentStatus === 'success' ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiCheck} className="text-3xl text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for your purchase. You'll be redirected to your dashboard shortly.
                </p>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto" />
              </motion.div>
            ) : paymentStatus === 'error' ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiAlertCircle} className="text-3xl text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                <p className="text-red-600 mb-6">{errorMessage}</p>
                <button
                  onClick={resetModal}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              <>
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">{product.name}</span>
                      <span className="font-medium">${originalAmount.toFixed(2)}</span>
                    </div>
                    
                    {savings > 0 && (
                      <>
                        <div className="flex justify-between text-green-600">
                          <span>Discount Applied</span>
                          <span>-${savings.toFixed(2)}</span>
                        </div>
                        <hr className="border-gray-200" />
                      </>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${finalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                    <div className="space-y-2">
                      {product.downloadFiles.slice(0, 3).map((file, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <SafeIcon icon={FiCheck} className="text-green-500 text-sm" />
                          <span className="text-sm text-gray-700">{file}</span>
                        </div>
                      ))}
                      {product.downloadFiles.length > 3 && (
                        <div className="text-sm text-gray-600">
                          + {product.downloadFiles.length - 3} more files
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <PaymentProcessor
                  productId={productId}
                  amount={finalAmount}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PaymentModal