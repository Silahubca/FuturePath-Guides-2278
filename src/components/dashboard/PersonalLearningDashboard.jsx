import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import ReadingProgressTracker from '../progress/ReadingProgressTracker'
import AchievementBadges from '../achievements/AchievementBadges'
import GoalTracker from '../goals/GoalTracker'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiTrendingUp, FiBook, FiTarget, FiClock, FiUser, FiActivity } = FiIcons

const PersonalLearningDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalTimeSpent: 0,
    averageSessionTime: 0,
    streak: 0,
    totalAchievements: 0,
    completedGuides: 0,
    totalPurchases: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const [progressData, achievementsData, purchasesData, activityData] = await Promise.all([
        supabase.from('reading_progress').select('*').eq('user_id', user.id),
        supabase.from('achievements').select('*').eq('user_id', user.id),
        supabase.from('purchases').select('*').eq('user_id', user.id),
        supabase.from('user_activity').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
      ])

      // Calculate stats
      const totalTimeSpent = progressData.data?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0
      const completedGuides = progressData.data?.filter(p => p.completion_percentage === 100).length || 0
      const totalAchievements = achievementsData.data?.length || 0
      const totalPurchases = purchasesData.data?.length || 0

      setStats({
        totalTimeSpent,
        averageSessionTime: totalTimeSpent > 0 ? Math.round(totalTimeSpent / (progressData.data?.length || 1)) : 0,
        streak: calculateStreak(activityData.data),
        totalAchievements,
        completedGuides,
        totalPurchases
      })

      setRecentActivity(activityData.data || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStreak = (activities) => {
    if (!activities || activities.length === 0) return 0
    
    let streak = 1
    let currentDate = new Date(activities[0].created_at).toDateString()
    
    for (let i = 1; i < activities.length; i++) {
      const activityDate = new Date(activities[i].created_at).toDateString()
      const prevDate = new Date(activities[i - 1].created_at)
      prevDate.setDate(prevDate.getDate() - 1)
      
      if (activityDate === prevDate.toDateString()) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (!user || loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiUser} className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user.user_metadata?.first_name || 'Learner'}!
            </h1>
            <p className="text-blue-100">
              Ready to continue your success journey?
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid md:grid-cols-3 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <SafeIcon icon={FiClock} className="text-2xl text-blue-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{formatTime(stats.totalTimeSpent)}</div>
          <div className="text-sm text-gray-600">Total Time</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <SafeIcon icon={FiBook} className="text-2xl text-green-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{stats.completedGuides}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <SafeIcon icon={FiTarget} className="text-2xl text-purple-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{stats.totalAchievements}</div>
          <div className="text-sm text-gray-600">Achievements</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <SafeIcon icon={FiActivity} className="text-2xl text-orange-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{stats.streak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <SafeIcon icon={FiTrendingUp} className="text-2xl text-red-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{formatTime(stats.averageSessionTime)}</div>
          <div className="text-sm text-gray-600">Avg Session</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <SafeIcon icon={FiBook} className="text-2xl text-indigo-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900">{stats.totalPurchases}</div>
          <div className="text-sm text-gray-600">Guides Owned</div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Progress */}
        <div className="lg:col-span-2 space-y-6">
          <ReadingProgressTracker productId="ai-job-search" totalSections={8} />
          <GoalTracker />
        </div>
        
        {/* Right Column - Achievements & Activity */}
        <div className="space-y-6">
          <AchievementBadges />
          
          {/* Recent Activity */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiActivity} className="mr-2 text-green-600" />
              Recent Activity
            </h3>
            
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No recent activity. Start reading to see your progress!
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.action || 'Completed section'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PersonalLearningDashboard