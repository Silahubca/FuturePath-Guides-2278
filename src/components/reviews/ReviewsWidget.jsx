import React from 'react'
import { motion } from 'framer-motion'
import UserReviewsSection from './UserReviewsSection'

const ReviewsWidget = ({ 
  productId, 
  title = "What Our Customers Say", 
  showAddReview = true,
  limit = 5,
  className = ""
}) => {
  return (
    <motion.section
      className={`py-16 bg-gray-50 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from people who have transformed their lives with our blueprints
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <UserReviewsSection 
            productId={productId}
            showAddReview={showAddReview}
            limit={limit}
          />
        </div>
      </div>
    </motion.section>
  )
}

export default ReviewsWidget