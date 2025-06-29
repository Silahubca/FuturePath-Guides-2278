import React from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'

const CheckoutProgress = ({ steps, currentStep }) => {
  return (
    <div className="bg-gray-50 px-6 py-4 border-b">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex items-center">
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                  }
                `}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: currentStep === step.id ? 1.1 : 1,
                  backgroundColor: currentStep >= step.id ? '#2563eb' : '#e5e7eb'
                }}
                transition={{ duration: 0.3 }}
              >
                <SafeIcon icon={step.icon} className="text-lg" />
              </motion.div>
              
              {/* Step Label */}
              <div className="ml-3 hidden sm:block">
                <p className={`
                  text-sm font-medium transition-colors duration-300
                  ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}
                `}>
                  {step.title}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <motion.div
                className="flex-1 h-0.5 mx-4 bg-gray-200"
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: currentStep > step.id ? 1 : 0,
                  backgroundColor: currentStep > step.id ? '#2563eb' : '#e5e7eb'
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ originX: 0 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CheckoutProgress