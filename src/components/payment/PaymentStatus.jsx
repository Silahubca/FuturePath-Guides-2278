import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth.jsx'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCheck, FiX, FiClock, FiAlertTriangle } = FiIcons

const PaymentStatus = () => {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [status, setStatus] = useState('loading') // loading, success, failed, not_found
  const [purchase, setPurchase] = useState(null)
  const [error, setError] = useState('')

  const paymentIntentId = searchParams.get('payment_intent')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (paymentIntentId || sessionId) {
      checkPaymentStatus()
    } else {
      setStatus('not_found')
    }
  }, [paymentIntentId, sessionId, user])

  const checkPaymentStatus = async () => {
    try {
      let query = supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)

      if (paymentIntentId) {
        query = query.eq('stripe_payment_intent_id', paymentIntentId)
      } else if (sessionId) {
        query = query.eq('stripe_session_id', sessionId)
      }

      const { data, error } = await query.single()

      if (error) {
        console.error('Error fetching purchase:', error)
        setStatus('not_found')
        return
      }

      setPurchase(data)
      setStatus(data.status === 'completed' ? 'success' : 'failed')

    } catch (error) {
      console.error('Error checking payment status:', error)
      setError(error.message)
      setStatus('failed')
    }
  }

  const StatusIcon = () => {
    switch (status) {
      case 'loading':
        return <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent" />
      case 'success':
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiCheck} className="text-3xl text-green-600" />
          </div>
        )
      case 'failed':
        return (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiX} className="text-3xl text-red-600" />
          </div>
        )
      case 'not_found':
        return (
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiAlertTriangle} className="text-3xl text-yellow-600" />
          </div>
        )
      default:
        return null
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return {
          title: 'Checking Payment Status...',
          message: 'Please wait while we verify your payment.',
          color: 'text-blue-600'
        }
      case 'success':
        return {
          title: 'Payment Successful!',
          message: 'Your purchase has been completed successfully. You now have access to your digital content.',
          color: 'text-green-600'
        }
      case 'failed':
        return {
          title: 'Payment Failed',
          message: error || 'Your payment could not be processed. Please try again or contact support.',
          color: 'text-red-600'
        }
      case 'not_found':
        return {
          title: 'Payment Not Found',
          message: 'We could not find a payment record. Please check your email for confirmation or contact support.',
          color: 'text-yellow-600'
        }
      default:
        return { title: '', message: '', color: '' }
    }
  }

  const statusMessage = getStatusMessage()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6 flex justify-center">
          <StatusIcon />
        </div>

        <h1 className={`text-2xl font-bold mb-4 ${statusMessage.color}`}>
          {statusMessage.title}
        </h1>

        <p className="text-gray-600 mb-6">
          {statusMessage.message}
        </p>

        {purchase && status === 'success' && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Purchase Details:</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{purchase.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">${purchase.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(purchase.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {status === 'success' && (
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Go to Dashboard
            </button>
          )}

          {status === 'failed' && (
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}

          <button
            onClick={() => window.location.href = '/contact'}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Your payment information is secured with 256-bit SSL encryption</p>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentStatus