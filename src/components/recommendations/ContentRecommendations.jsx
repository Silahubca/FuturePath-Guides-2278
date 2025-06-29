import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import { PRODUCTS } from '../../lib/stripe'
import { BOOK_CONTENT } from '../../data/bookContent'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiBookmark, FiTrendingUp, FiUsers, FiStar, FiArrowRight, FiClock, FiTarget, FiZap } = FiIcons

const ContentRecommendations = ({ 
  currentProductId = null, 
  maxRecommendations = 6,
  showPersonalized = true,
  className = '' 
}) => {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    if (user) {
      fetchUserProfile()
      generateRecommendations()
    } else {
      generateGuestRecommendations()
    }
  }, [user, currentProductId])

  const fetchUserProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setUserProfile(profile)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const generateRecommendations = async () => {
    try {
      const [purchases, progress, goals] = await Promise.all([
        fetchUserPurchases(),
        fetchReadingProgress(),
        fetchUserGoals()
      ])

      const recs = await calculatePersonalizedRecommendations({
        purchases,
        progress,
        goals,
        currentProductId
      })

      setRecommendations(recs.slice(0, maxRecommendations))
    } catch (error) {
      console.error('Error generating recommendations:', error)
      generateGuestRecommendations()
    } finally {
      setLoading(false)
    }
  }

  const generateGuestRecommendations = () => {
    const allProducts = Object.values(PRODUCTS)
    const guestRecs = allProducts
      .filter(product => product.id !== currentProductId)
      .map(product => ({
        type: 'product',
        product,
        reason: 'Popular choice',
        confidence: 0.7,
        icon: FiTrendingUp
      }))
      .slice(0, maxRecommendations)

    setRecommendations(guestRecs)
    setLoading(false)
  }

  const fetchUserPurchases = async () => {
    const { data } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
    return data || []
  }

  const fetchReadingProgress = async () => {
    const { data } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', user.id)
    return data || []
  }

  const fetchUserGoals = async () => {
    const { data } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id)
    return data || []
  }

  const calculatePersonalizedRecommendations = async ({ purchases, progress, goals, currentProductId }) => {
    const recommendations = []
    const purchasedProductIds = purchases.map(p => p.product_id)
    const availableProducts = Object.values(PRODUCTS).filter(p => 
      !purchasedProductIds.includes(p.id) && p.id !== currentProductId
    )

    // 1. Goal-based recommendations
    const goalCategories = goals.map(g => g.category)
    if (goalCategories.includes('career') && !purchasedProductIds.includes('ai-job-search')) {
      recommendations.push({
        type: 'product',
        product: PRODUCTS['ai-job-search'],
        reason: 'Matches your career goals',
        confidence: 0.9,
        icon: FiTarget
      })
    }

    if (goalCategories.includes('business') && !purchasedProductIds.includes('ai-entrepreneur')) {
      recommendations.push({
        type: 'product',
        product: PRODUCTS['ai-entrepreneur'],
        reason: 'Perfect for your business aspirations',
        confidence: 0.9,
        icon: FiTarget
      })
    }

    if (goalCategories.includes('financial') && !purchasedProductIds.includes('financial-freedom')) {
      recommendations.push({
        type: 'product',
        product: PRODUCTS['financial-freedom'],
        reason: 'Aligns with your financial goals',
        confidence: 0.9,
        icon: FiTarget
      })
    }

    // 2. Completion-based recommendations
    const highProgressItems = progress.filter(p => p.completion_percentage >= 75)
    if (highProgressItems.length > 0) {
      availableProducts.forEach(product => {
        if (product.id === 'complete-collection' && purchasedProductIds.length >= 2) {
          recommendations.push({
            type: 'product',
            product,
            reason: 'Complete your collection',
            confidence: 0.85,
            icon: FiStar
          })
        }
      })
    }

    // 3. Related content recommendations
    if (currentProductId) {
      const relatedProducts = getRelatedProducts(currentProductId)
      relatedProducts.forEach(productId => {
        const product = PRODUCTS[productId]
        if (product && !purchasedProductIds.includes(productId)) {
          recommendations.push({
            type: 'product',
            product,
            reason: 'Complements your current reading',
            confidence: 0.8,
            icon: FiBookmark
          })
        }
      })
    }

    // 4. Chapter-based recommendations for purchased products
    purchases.forEach(purchase => {
      const bookContent = BOOK_CONTENT[purchase.product_id]
      if (bookContent) {
        const userProgress = progress.find(p => p.product_id === purchase.product_id)
        const currentChapter = userProgress?.current_chapter || 0
        
        if (currentChapter < bookContent.chapters.length - 1) {
          recommendations.push({
            type: 'chapter',
            product: PRODUCTS[purchase.product_id],
            chapter: bookContent.chapters[currentChapter + 1],
            chapterIndex: currentChapter + 1,
            reason: 'Continue your learning journey',
            confidence: 0.95,
            icon: FiArrowRight
          })
        }
      }
    })

    // 5. Popular/trending recommendations
    if (recommendations.length < maxRecommendations) {
      availableProducts.forEach(product => {
        if (!recommendations.find(r => r.product.id === product.id)) {
          recommendations.push({
            type: 'product',
            product,
            reason: 'Popular among users like you',
            confidence: 0.6,
            icon: FiUsers
          })
        }
      })
    }

    // Sort by confidence and return
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxRecommendations)
  }

  const getRelatedProducts = (productId) => {
    const relationships = {
      'ai-job-search': ['ai-entrepreneur', 'complete-collection'],
      'ai-entrepreneur': ['ai-job-search', 'financial-freedom', 'complete-collection'],
      'financial-freedom': ['ai-entrepreneur', 'complete-collection'],
      'complete-collection': []
    }
    return relationships[productId] || []
  }

  const handleRecommendationClick = (rec) => {
    if (rec.type === 'chapter') {
      // Navigate to library with specific chapter
      window.location.hash = `/library?book=${rec.product.id}&chapter=${rec.chapterIndex}`
    } else {
      // Navigate to product page
      const routes = {
        'ai-job-search': '/ai-job-search',
        'ai-entrepreneur': '/ai-entrepreneur',
        'financial-freedom': '/financial-freedom',
        'complete-collection': '/complete-collection'
      }
      window.location.hash = routes[rec.product.id] || '/'
    }

    // Track recommendation click
    if (window.trackEvent) {
      window.trackEvent('recommendation_clicked', {
        type: rec.type,
        product_id: rec.product.id,
        reason: rec.reason,
        confidence: rec.confidence
      })
    }
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <motion.div 
      className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <SafeIcon icon={FiZap} className="mr-2 text-purple-600" />
          {showPersonalized && user ? 'Recommended for You' : 'You Might Also Like'}
        </h3>
        {user && (
          <span className="text-sm text-gray-500">
            Based on your activity
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={`${rec.type}-${rec.product.id}-${rec.chapterIndex || 0}`}
            recommendation={rec}
            index={index}
            onClick={() => handleRecommendationClick(rec)}
          />
        ))}
      </div>
    </motion.div>
  )
}

const RecommendationCard = ({ recommendation, index, onClick }) => {
  const { type, product, chapter, reason, confidence, icon } = recommendation

  const getGradientClass = (productId) => {
    const gradients = {
      'ai-job-search': 'from-blue-500 to-cyan-500',
      'ai-entrepreneur': 'from-purple-500 to-pink-500',
      'financial-freedom': 'from-green-500 to-emerald-500',
      'complete-collection': 'from-indigo-500 to-purple-500'
    }
    return gradients[productId] || 'from-gray-500 to-gray-600'
  }

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      {/* Header with icon and confidence */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={icon} className="text-purple-600" />
          <span className="text-xs font-medium text-purple-600">
            {Math.round(confidence * 100)}% match
          </span>
        </div>
        {type === 'chapter' && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Continue Reading
          </span>
        )}
      </div>

      {/* Content */}
      <div className={`w-full h-20 bg-gradient-to-r ${getGradientClass(product.id)} rounded-lg mb-3 flex items-center justify-center`}>
        <h4 className="text-white font-semibold text-sm text-center px-2">
          {type === 'chapter' ? chapter?.title : product.name}
        </h4>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">
          {reason}
        </p>
        
        {type === 'chapter' ? (
          <div className="flex items-center text-xs text-gray-500">
            <SafeIcon icon={FiClock} className="mr-1" />
            <span>{chapter?.duration}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            <SafeIcon 
              icon={FiArrowRight} 
              className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-200" 
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ContentRecommendations