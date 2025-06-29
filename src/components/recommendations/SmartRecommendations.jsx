import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiLightbulb, FiTrendingUp, FiClock, FiTarget, FiBookOpen } = FiIcons

const SmartRecommendations = ({ productId, className = '' }) => {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateSmartRecommendations()
  }, [productId, user])

  const generateSmartRecommendations = async () => {
    try {
      let recs = []

      if (user) {
        recs = await generatePersonalizedRecs()
      } else {
        recs = generateGeneralRecs()
      }

      setRecommendations(recs)
    } catch (error) {
      console.error('Error generating smart recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePersonalizedRecs = async () => {
    const recommendations = []

    // Fetch user data
    const [purchases, progress, goals, activity] = await Promise.all([
      fetchUserPurchases(),
      fetchReadingProgress(),
      fetchUserGoals(),
      fetchUserActivity()
    ])

    // Time-based recommendations
    const currentHour = new Date().getHours()
    if (currentHour >= 9 && currentHour <= 17) {
      recommendations.push({
        type: 'time_based',
        title: 'Perfect Lunch Break Read',
        description: 'Quick 15-minute sections ideal for your break',
        action: 'Start Reading',
        icon: FiClock,
        priority: 0.7
      })
    } else if (currentHour >= 18 && currentHour <= 22) {
      recommendations.push({
        type: 'time_based',
        title: 'Evening Learning Session',
        description: 'Wind down with some career development',
        action: 'Continue Learning',
        icon: FiBookOpen,
        priority: 0.8
      })
    }

    // Progress-based recommendations
    const currentProgress = progress.find(p => p.product_id === productId)
    if (currentProgress) {
      if (currentProgress.completion_percentage < 25) {
        recommendations.push({
          type: 'progress',
          title: 'Build Momentum',
          description: 'Complete just one more section to build your learning habit',
          action: 'Continue Reading',
          icon: FiTrendingUp,
          priority: 0.9
        })
      } else if (currentProgress.completion_percentage >= 75) {
        recommendations.push({
          type: 'progress',
          title: 'You\'re Almost There!',
          description: 'Just a few more sections to complete this guide',
          action: 'Finish Strong',
          icon: FiTarget,
          priority: 0.95
        })
      }
    }

    // Goal-based recommendations
    const activeGoals = goals.filter(g => g.status === 'active')
    if (activeGoals.length > 0) {
      recommendations.push({
        type: 'goal_based',
        title: 'Advance Your Goals',
        description: `This content will help with your ${activeGoals[0].category} goals`,
        action: 'Take Action',
        icon: FiTarget,
        priority: 0.85
      })
    }

    // Engagement-based recommendations
    const recentActivity = activity.filter(a => {
      const activityDate = new Date(a.created_at)
      const daysSince = (Date.now() - activityDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysSince <= 7
    })

    if (recentActivity.length === 0) {
      recommendations.push({
        type: 'engagement',
        title: 'Welcome Back!',
        description: 'Pick up where you left off and continue your success journey',
        action: 'Resume Learning',
        icon: FiBookOpen,
        priority: 0.8
      })
    }

    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 3)
  }

  const generateGeneralRecs = () => {
    const recommendations = [
      {
        type: 'general',
        title: 'Start Your Success Journey',
        description: 'Join thousands who have transformed their careers with our blueprints',
        action: 'Get Started',
        icon: FiLightbulb,
        priority: 0.7
      },
      {
        type: 'general',
        title: 'Quick Win Strategy',
        description: 'Learn one actionable strategy you can implement today',
        action: 'Learn Now',
        icon: FiTrendingUp,
        priority: 0.8
      }
    ]

    return recommendations
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

  const fetchUserActivity = async () => {
    const { data } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    return data || []
  }

  const handleRecommendationClick = (rec) => {
    if (rec.type === 'progress' || rec.type === 'time_based') {
      // Navigate to library
      window.location.hash = `/library?book=${productId}`
    } else if (rec.type === 'goal_based') {
      // Navigate to goal tracker
      window.location.hash = '/personal-dashboard'
    } else {
      // Navigate to product page or dashboard
      window.location.hash = user ? '/dashboard' : '/'
    }

    // Track recommendation interaction
    if (window.trackEvent) {
      window.trackEvent('smart_recommendation_clicked', {
        type: rec.type,
        title: rec.title,
        product_id: productId
      })
    }
  }

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {recommendations.map((rec, index) => (
        <motion.div
          key={`${rec.type}-${index}`}
          className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 cursor-pointer hover:shadow-md transition-all duration-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => handleRecommendationClick(rec)}
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <SafeIcon icon={rec.icon} className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-purple-900 mb-2">
                {rec.title}
              </h4>
              <p className="text-purple-700 mb-4">
                {rec.description}
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                {rec.action}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default SmartRecommendations