import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PRODUCTS } from '../../lib/stripe'
import PaymentForm from '../checkout/PaymentForm'
import SEOHead from '../seo/SEOHead'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiArrowLeft, FiShield, FiDownload, FiClock } = FiIcons

const CheckoutPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS[productId]

  useEffect(() => {
    if (!product) {
      navigate('/')
    }
  }, [product, navigate])

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEOHead 
        title={`Checkout - ${product.name} | FuturePath Guides`}
        description={`Complete your purchase of ${product.name} - ${product.description}`}
      />
      
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SafeIcon icon={FiArrowLeft} />
          <span>Back</span>
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Details */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{product.description}</p>

              {/* Key Benefits */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll Get:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiDownload} className="text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Instant Access</h4>
                      <p className="text-sm text-gray-600">Download immediately after purchase</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiShield} className="text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Expert Content</h4>
                      <p className="text-sm text-gray-600">Professional-grade blueprints</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiClock} className="text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Lifetime Access</h4>
                      <p className="text-sm text-gray-600">Keep forever, re-download anytime</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiDownload} className="text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Multiple Formats</h4>
                      <p className="text-sm text-gray-600">PDF, Excel, and more</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Files Included */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Files Included:</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid gap-3">
                    {product.downloadFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                        <SafeIcon icon={FiDownload} className="text-blue-600" />
                        <span className="font-medium text-gray-900">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <PaymentForm productId={productId} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage