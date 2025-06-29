import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiAward, FiTrophy, FiStar, FiTarget, FiZap, FiHeart } = FiIcons

const AchievementBadges = () => {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  const badgeTypes = {
    'First Purchase': { icon: FiStar, color: 'text-yellow-500 bg-yellow-100' },
    '25% Complete': { icon: FiTarget, color: 'text-blue-500 bg-blue-100' },
    '50% Complete': { icon: FiZap, color: 'text-purple-500 bg-purple-100' },
    '75% Complete': { icon: FiTrophy, color: 'text-green-500 bg-green-100' },
    '100% Complete': { icon: FiAward, color: 'text-red-500 bg-red-100' },
    'Bundle Master': { icon: FiHeart, color: 'text-pink-500 bg-pink-100' }
  }

  useEffect(() => {
    if (user) {
      fetchAchievements()
    }
  }, [user])

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })

      if (error) throw error
      setAchievements(data || [])
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <SafeIcon icon={FiTrophy} className="mr-2 text-yellow-600" />
        Your Achievements
      </h3>

      {achievements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <SafeIcon icon={FiAward} className="text-4xl mx-auto mb-4 text-gray-300" />
          <p>Start your journey to unlock achievements!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => {
            const badgeInfo = badgeTypes[achievement.title] || badgeTypes['First Purchase']
            
            return (
              <motion.div
                key={achievement.id}
                className="text-center p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-16 h-16 rounded-full ${badgeInfo.color} flex items-center justify-center mx-auto mb-3`}>
                  <SafeIcon icon={badgeInfo.icon} className="text-2xl" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {achievement.title}
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {achievement.description}
                </p>
                <span className="text-xs text-gray-400">
                  {new Date(achievement.earned_at).toLocaleDateString()}
                </span>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Achievement Progress */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-2">Next Achievement</h4>
        <div className="text-sm text-gray-600">
          Complete more sections to unlock new badges!
        </div>
      </div>
    </motion.div>
  )
}

export default AchievementBadges