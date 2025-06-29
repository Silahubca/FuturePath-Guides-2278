import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth.jsx'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCheck, FiDownload, FiMail, FiArrowRight, FiBook, FiGift, FiStar } = FiIcons

const SuccessPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [purchase, setPurchase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId && user) {
      verifyPurchase()
    }
  }, [sessionId, user])

  const verifyPurchase = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching purchase:', error)
      } else {
        setPurchase(data)
        setShowWelcomeMessage(true)
      }
    } catch (error) {
      console.error('Error verifying purchase:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSteps = [
    {
      icon: FiMail,
      title: 'Check Your Email',
      description: `We've sent your download links and receipt to ${user?.email}`,
      action: 'Check Email'
    },
    {
      icon: FiDownload,
      title: 'Access Your Dashboard',
      description: 'All your purchases are available in your user dashboard',
      action: 'Go to Dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      icon: FiBook,
      title: 'Start Reading',
      description: 'Begin your learning journey with our interactive reading platform',
      action: 'Open Library',
      onClick: () => navigate('/library')
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Verifying your purchase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Success Icon */}
          <motion.div
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SafeIcon icon={FiCheck} className="text-3xl text-white" />
          </motion.div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          
          {showWelcomeMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <p className="text-xl text-gray-600 mb-4">
                Welcome to FuturePath Guides! Your journey to success starts now.
              </p>
              <div className="flex items-center justify-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <SafeIcon key={i} icon={FiStar} className="text-yellow-400 fill-current text-lg" />
                ))}
              </div>
            </motion.div>
          )}

          {/* Purchase Details */}
          {purchase && (
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
                <SafeIcon icon={FiGift} className="mr-2 text-green-600" />
                Your Purchase Details
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{purchase.id.substring(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-medium">{purchase.product_name}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-green-600">${purchase.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              What's Next?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  onClick={step.onClick}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={step.icon} className="text-xl text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                  {step.onClick && (
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      {step.action} →
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiDownload} />
              <span>Access Dashboard</span>
              <SafeIcon icon={FiArrowRight} />
            </button>
            <button
              onClick={() => navigate('/library')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiBook} />
              <span>Start Reading</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              Continue Shopping
            </button>
          </motion.div>

          {/* Welcome Tips */}
          <motion.div
            className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              🚀 Quick Start Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>📚 Interactive Reading:</strong> Use our online reading platform with progress tracking and bookmarks
                </p>
                <p className="text-gray-700">
                  <strong>📱 Mobile Friendly:</strong> Access your content on any device, anywhere
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>💾 Download Options:</strong> Save PDFs and templates for offline use
                </p>
                <p className="text-gray-700">
                  <strong>🎯 Track Progress:</strong> Set goals and monitor your learning journey
                </p>
              </div>
            </div>
          </motion.div>

          {/* Support */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <p className="text-gray-600 text-sm">
              Need help? Contact our support team at{' '}
              <a
                href="mailto:support@futurepathguides.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
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

export default SuccessPage