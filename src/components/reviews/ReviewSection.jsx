import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiStar, FiUser, FiEdit3 } = FiIcons

const ReviewSection = ({ productId }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [userReview, setUserReview] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
    if (user) {
      checkUserReview()
    }
  }, [productId, user])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user_profiles!inner(first_name, last_name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setReviews(data || [])
      
      // Calculate average rating
      if (data && data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length
        setAverageRating(Math.round(avg * 10) / 10)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkUserReview = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .single()

      if (data) {
        setUserReview(data)
      }
    } catch (error) {
      // User hasn't reviewed yet
    }
  }

  const submitReview = async () => {
    if (!user) {
      alert('Please sign in to leave a review')
      return
    }

    try {
      const reviewData = {
        product_id: productId,
        user_id: user.id,
        rating: newReview.rating,
        comment: newReview.comment
      }

      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', userReview.id)

        if (error) throw error
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert(reviewData)

        if (error) throw error
      }

      setShowReviewForm(false)
      setNewReview({ rating: 5, comment: '' })
      fetchReviews()
      checkUserReview()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    }
  }

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <SafeIcon 
              icon={FiStar} 
              className={`text-lg ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
          <div className="flex items-center space-x-2 mt-2">
            {renderStars(averageRating)}
            <span className="text-lg font-semibold text-gray-900">{averageRating}</span>
            <span className="text-gray-500">({reviews.length} reviews)</span>
          </div>
        </div>
        
        {user && !userReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Write Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <motion.div
          className="bg-gray-50 rounded-xl p-6 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            {renderStars(newReview.rating, true, (rating) => 
              setNewReview(prev => ({ ...prev, rating }))
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your experience with this product..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={submitReview}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {userReview ? 'Update Review' : 'Submit Review'}
            </button>
            <button
              onClick={() => {
                setShowReviewForm(false)
                setNewReview({ rating: 5, comment: '' })
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* User's existing review */}
      {userReview && !showReviewForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Your Review</span>
            <button
              onClick={() => {
                setNewReview({ rating: userReview.rating, comment: userReview.comment })
                setShowReviewForm(true)
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              <SafeIcon icon={FiEdit3} />
            </button>
          </div>
          {renderStars(userReview.rating)}
          <p className="text-gray-700 mt-2">{userReview.comment}</p>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to share your experience!
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {review.user_profiles?.first_name} {review.user_profiles?.last_name}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {renderStars(review.rating)}
                  <p className="text-gray-700 mt-2 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewSection