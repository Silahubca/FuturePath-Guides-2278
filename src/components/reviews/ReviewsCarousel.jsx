import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiStar, FiUser, FiChevronLeft, FiChevronRight, FiQuote } = FiIcons

const ReviewsCarousel = ({ 
  productId = null, // If null, shows reviews from all products
  autoPlay = true,
  interval = 5000,
  showControls = true,
  className = ""
}) => {
  const [reviews, setReviews] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedReviews()
  }, [productId])

  useEffect(() => {
    if (autoPlay && reviews.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length)
      }, interval)

      return () => clearInterval(timer)
    }
  }, [autoPlay, interval, reviews.length])

  const fetchFeaturedReviews = async () => {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          user_profiles!inner(first_name, last_name)
        `)
        .gte('rating', 4) // Only show 4-5 star reviews
        .order('created_at', { ascending: false })
        .limit(10)

      if (productId) {
        query = query.eq('product_id', productId)
      }

      const { data, error } = await query

      if (error) throw error

      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching featured reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <SafeIcon
            key={star}
            icon={FiStar}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-8 text-center ${className}`}>
        <SafeIcon icon={FiQuote} className="text-4xl text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No reviews available yet.</p>
      </div>
    )
  }

  const currentReview = reviews[currentIndex]

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Quote Icon */}
            <div className="text-center mb-6">
              <SafeIcon icon={FiQuote} className="text-4xl text-blue-600 mx-auto" />
            </div>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              {renderStars(currentReview.rating)}
            </div>

            {/* Review Text */}
            <blockquote className="text-lg text-gray-700 text-center leading-relaxed mb-8 italic">
              "{currentReview.comment}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="text-white text-lg" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {currentReview.user_profiles?.first_name} {currentReview.user_profiles?.last_name}
                </div>
                <div className="text-sm text-gray-500">
                  Verified Customer
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {showControls && reviews.length > 1 && (
          <>
            <button
              onClick={prevReview}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <SafeIcon icon={FiChevronLeft} className="text-gray-600" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <SafeIcon icon={FiChevronRight} className="text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {reviews.length > 1 && (
        <div className="flex justify-center space-x-2 pb-6">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewsCarousel