import React from 'react'
import { motion } from 'framer-motion'
import { PRODUCTS } from '../../lib/stripe'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCheck, FiStar, FiArrowRight } = FiIcons

const PricingCards = ({ className = '' }) => {
  const handlePurchaseClick = (product) => {
    // Open Stripe payment link in new tab
    window.open(product.paymentLink, '_blank')
  }

  const products = Object.values(PRODUCTS)

  return (
    <div className={`grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto ${className}`}>
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ${
            product.id === 'complete-collection' ? 'lg:col-span-4 border-4 border-purple-500' : ''
          }`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          {/* Special Badge for Bundle */}
          {product.id === 'complete-collection' && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 font-bold">
              <SafeIcon icon={FiStar} className="inline mr-2" />
              BEST VALUE - SAVE $3.00!
            </div>
          )}

          {/* Header */}
          <div className={`p-6 text-center ${
            product.id === 'ai-job-search' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
            product.id === 'ai-entrepreneur' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
            product.id === 'financial-freedom' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
            'bg-gradient-to-br from-indigo-500 to-purple-500'
          } text-white`}>
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <div className="text-3xl font-bold mb-2">${product.price}</div>
            {product.id === 'complete-collection' && (
              <div className="text-sm opacity-90">
                <span className="line-through">$29.97</span> - Save $3.00
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {product.downloadFiles.slice(0, 4).map((file, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <SafeIcon icon={FiCheck} className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    {file.replace(/\.(pdf|xlsx|docx)$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              ))}
              {product.downloadFiles.length > 4 && (
                <div className="text-sm text-gray-500 font-medium">
                  + {product.downloadFiles.length - 4} more resources
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handlePurchaseClick(product)}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group ${
                product.id === 'complete-collection' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white'
              }`}
            >
              Get Instant Access
              <SafeIcon icon={FiArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Security Note */}
            <div className="mt-4 text-center">
              <div className="text-xs text-gray-500">
                🔒 Secure payment via Stripe • Instant digital delivery
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default PricingCards