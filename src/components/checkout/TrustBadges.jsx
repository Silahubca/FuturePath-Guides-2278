import React from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiShield, FiLock, FiCheck, FiZap, FiUsers, FiCreditCard } = FiIcons

const TrustBadges = ({ className = '' }) => {
  const badges = [
    {
      icon: FiShield,
      title: 'SSL Secured',
      description: '256-bit encryption',
      color: 'text-green-600'
    },
    {
      icon: FiCreditCard,
      title: 'Stripe Powered',
      description: 'Secure payments',
      color: 'text-blue-600'
    },
    {
      icon: FiZap,
      title: 'Instant Access',
      description: 'Download immediately',
      color: 'text-orange-600'
    },
    {
      icon: FiUsers,
      title: '10,000+ Customers',
      description: 'Trusted worldwide',
      color: 'text-purple-600'
    }
  ]

  return (
    <div className={`bg-gray-50 rounded-xl p-4 ${className}`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <SafeIcon 
              icon={badge.icon} 
              className={`text-2xl mx-auto mb-2 ${badge.color}`} 
            />
            <div className="text-sm font-medium text-gray-900">{badge.title}</div>
            <div className="text-xs text-gray-600">{badge.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default TrustBadges