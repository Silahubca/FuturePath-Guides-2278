import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiStar, FiUser, FiEdit3, FiTrash2, FiFilter, FiChevronDown, FiThumbsUp, FiMessageCircle } = FiIcons

const UserReviewsSection = ({ productId, showAddReview = true, limit = null }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [ratingBreakdown, setRatingBreakdown] = useState({})
  const [userReview, setUserReview] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchReviews()
    if (user) {
      checkUserReview()
    }
  }, [productId, user, filterRating, sortBy])

  const fetchReviews = async () => {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          user_profiles!inner(first_name, last_name)
        `)
        .eq('product_id', productId)

      // Apply rating filter
      if (filterRating !== 'all') {
        query = query.eq('rating', parseInt(filterRating))
      }

      // Apply sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true })
      } else if (sortBy === 'highest') {
        query = query.order('rating', { ascending: false })
      } else if (sortBy === 'lowest') {
        query = query.order('rating', { ascending: true })
      }

      // Apply limit if specified
      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error

      setReviews(data || [])
      
      // Calculate average rating and breakdown
      if (data && data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length
        setAverageRating(Math.round(avg * 10) / 10)

        // Calculate rating breakdown
        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        data.forEach(review => {
          breakdown[review.rating]++
        })
        setRatingBreakdown(breakdown)
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
        setNewReview({ rating: data.rating, comment: data.comment })
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

  const deleteReview = async () => {
    if (!userReview) return

    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', userReview.id)

        if (error) throw error

        setUserReview(null)
        setNewReview({ rating: 5, comment: '' })
        fetchReviews()
      } catch (error) {
        console.error('Error deleting review:', error)
        alert('Failed to delete review')
      }
    }
  }

  const renderStars = (rating, interactive = false, onRatingChange = null, size = 'text-lg') => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          >
            <SafeIcon
              icon={FiStar}
              className={`${size} ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRatingPercentage = (rating) => {
    const total = reviews.length
    return total > 0 ? Math.round((ratingBreakdown[rating] / total) * 100) : 0
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {renderStars(averageRating, false, null, 'text-2xl')}
              <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
            </div>
            <span className="text-gray-500">({reviews.length} reviews)</span>
          </div>
        </div>
        
        {user && showAddReview && !userReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
          >
            <SafeIcon icon={FiEdit3} />
            <span>Write Review</span>
          </button>
        )}
      </div>

      {/* Rating Breakdown */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 w-8">{rating}</span>
                <SafeIcon icon={FiStar} className="text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getRatingPercentage(rating)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">
                  {getRatingPercentage(rating)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Sorting */}
      {reviews.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <SafeIcon icon={FiFilter} />
            <span>Filters & Sorting</span>
            <SafeIcon 
              icon={FiChevronDown} 
              className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} 
            />
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="mt-4 p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Rating
                    </label>
                    <select
                      value={filterRating}
                      onChange={(e) => setFilterRating(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-xl font-semibold text-gray-900 mb-6">
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </h4>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Rating
            </label>
            {renderStars(
              newReview.rating,
              true,
              (rating) => setNewReview(prev => ({ ...prev, rating })),
              'text-2xl'
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Review
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Share your experience with this product. What did you like? How did it help you?"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={submitReview}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
            >
              {userReview ? 'Update Review' : 'Submit Review'}
            </button>
            <button
              onClick={() => {
                setShowReviewForm(false)
                setNewReview({ rating: 5, comment: '' })
              }}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* User's existing review */}
      {userReview && !showReviewForm && (
        <motion.div
          className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-blue-900">Your Review</span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setNewReview({ rating: userReview.rating, comment: userReview.comment })
                  setShowReviewForm(true)
                }}
                className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                title="Edit review"
              >
                <SafeIcon icon={FiEdit3} />
              </button>
              <button
                onClick={deleteReview}
                className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors"
                title="Delete review"
              >
                <SafeIcon icon={FiTrash2} />
              </button>
            </div>
          </div>
          {renderStars(userReview.rating)}
          <p className="text-gray-700 mt-3 leading-relaxed">{userReview.comment}</p>
          <p className="text-sm text-gray-500 mt-2">
            Posted on {formatDate(userReview.created_at)}
          </p>
        </motion.div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiMessageCircle} className="text-6xl text-gray-400 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h4>
          <p className="text-gray-600 mb-6">
            Be the first to share your experience with this product!
          </p>
          {user && showAddReview && !userReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Write the First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <SafeIcon icon={FiUser} className="text-white text-lg" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-900 text-lg">
                        {review.user_profiles?.first_name} {review.user_profiles?.last_name}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed text-lg">{review.comment}</p>
              
              {/* Helpful button (placeholder for future feature) */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <SafeIcon icon={FiThumbsUp} className="text-sm" />
                  <span className="text-sm">Helpful</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More Button (if limit is set and there might be more reviews) */}
      {limit && reviews.length === limit && (
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.reload()} // Simple implementation
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  )
}

export default UserReviewsSection