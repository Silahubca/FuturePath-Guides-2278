import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiX, FiArrowLeft, FiShoppingCart } = FiIcons

const CancelPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SafeIcon icon={FiX} className="text-3xl text-orange-600" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What happened?
            </h2>
            <p className="text-gray-600 mb-6">
              You cancelled the payment process before it was completed. 
              This is completely normal - you can try again whenever you're ready.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Need help?</strong> If you experienced any issues during checkout, 
                please contact our support team at support@futurepathguides.com
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiArrowLeft} />
              <span>Go Back</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiShoppingCart} />
              <span>Continue Shopping</span>
            </button>
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-gray-500 text-sm">
              Have questions? Contact us at{' '}
              <a 
                href="mailto:support@futurepathguides.com" 
                className="text-blue-600 hover:text-blue-700"
              >
                support@futurepathguides.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default CancelPage