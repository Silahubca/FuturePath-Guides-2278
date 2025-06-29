import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiTag, FiCheck, FiX } = FiIcons

const CouponInput = ({ onCouponApplied, productPrice }) => {
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('active', true)
        .single()

      if (error || !data) {
        setError('Invalid coupon code')
        setLoading(false)
        return
      }

      // Check if coupon is expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setError('This coupon has expired')
        setLoading(false)
        return
      }

      // Check usage limit
      if (data.usage_limit && data.usage_count >= data.usage_limit) {
        setError('This coupon has reached its usage limit')
        setLoading(false)
        return
      }

      // Calculate discount
      let discountAmount = 0
      if (data.discount_type === 'percentage') {
        discountAmount = (productPrice * data.discount_value) / 100
      } else {
        discountAmount = data.discount_value
      }

      // Apply maximum discount limit if set
      if (data.max_discount && discountAmount > data.max_discount) {
        discountAmount = data.max_discount
      }

      const finalPrice = Math.max(0, productPrice - discountAmount)

      setAppliedCoupon({
        ...data,
        discountAmount,
        finalPrice
      })

      onCouponApplied({
        couponId: data.id,
        discountAmount,
        finalPrice
      })

    } catch (error) {
      console.error('Coupon error:', error)
      setError('Failed to apply coupon')
    } finally {
      setLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setError('')
    onCouponApplied(null)
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <SafeIcon icon={FiTag} className="text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Have a coupon code?</h3>
      </div>

      {!appliedCoupon ? (
        <div className="flex space-x-3">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
          />
          <button
            onClick={applyCoupon}
            disabled={loading || !couponCode.trim()}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </div>
      ) : (
        <motion.div
          className="bg-green-50 border border-green-200 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="text-green-600" />
              <div>
                <span className="font-semibold text-green-900">
                  {appliedCoupon.code} Applied!
                </span>
                <p className="text-sm text-green-700">
                  {appliedCoupon.discount_type === 'percentage' 
                    ? `${appliedCoupon.discount_value}% off` 
                    : `$${appliedCoupon.discount_value} off`
                  } - You save ${appliedCoupon.discountAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="text-green-600 hover:text-green-700"
            >
              <SafeIcon icon={FiX} />
            </button>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiX} className="text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CouponInput