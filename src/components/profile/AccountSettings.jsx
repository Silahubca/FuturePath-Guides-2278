import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiUser, FiCalendar, FiMail, FiShoppingBag, FiDownload, FiActivity, FiAward, FiBarChart3 } = FiIcons

const AccountSettings = () => {
  const { user } = useAuth()
  const [accountStats, setAccountStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    downloadsCount: 0,
    achievementsCount: 0,
    readingTime: 0,
    lastActive: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchAccountStats()
    }
  }, [user])

  const fetchAccountStats = async () => {
    try {
      // Fetch purchases
      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount')
        .eq('user_id', user.id)

      // Fetch achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('id')
        .eq('user_id', user.id)

      // Fetch reading progress
      const { data: progress } = await supabase
        .from('reading_progress')
        .select('time_spent')
        .eq('user_id', user.id)

      // Fetch download logs
      const { data: downloads } = await supabase
        .from('download_logs')
        .select('id')
        .eq('user_id', user.id)

      // Fetch recent activity
      const { data: activity } = await supabase
        .from('user_activity')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      const totalSpent = purchases?.reduce((sum, purchase) => sum + parseFloat(purchase.amount), 0) || 0
      const totalReadingTime = progress?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0

      setAccountStats({
        totalPurchases: purchases?.length || 0,
        totalSpent,
        downloadsCount: downloads?.length || 0,
        achievementsCount: achievements?.length || 0,
        readingTime: totalReadingTime,
        lastActive: activity?.length > 0 ? activity[0].created_at : null
      })
    } catch (error) {
      console.error('Error fetching account stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiUser} className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Account Overview</h2>
        </div>

        {/* Account Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMail} className="text-gray-600" />
                <div>
                  <span className="text-sm text-gray-600">Email Address</span>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiCalendar} className="text-gray-600" />
                <div>
                  <span className="text-sm text-gray-600">Member Since</span>
                  <p className="font-medium text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiActivity} className="text-gray-600" />
                <div>
                  <span className="text-sm text-gray-600">Account Status</span>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
              
              {accountStats.lastActive && (
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiCalendar} className="text-gray-600" />
                  <div>
                    <span className="text-sm text-gray-600">Last Active</span>
                    <p className="font-medium text-gray-900">
                      {formatDate(accountStats.lastActive)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              className="bg-blue-50 rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SafeIcon icon={FiShoppingBag} className="text-3xl text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{accountStats.totalPurchases}</div>
              <div className="text-sm text-blue-700">Total Purchases</div>
            </motion.div>

            <motion.div
              className="bg-green-50 rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <SafeIcon icon={FiBarChart3} className="text-3xl text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">${accountStats.totalSpent.toFixed(2)}</div>
              <div className="text-sm text-green-700">Total Spent</div>
            </motion.div>

            <motion.div
              className="bg-purple-50 rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <SafeIcon icon={FiDownload} className="text-3xl text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{accountStats.downloadsCount}</div>
              <div className="text-sm text-purple-700">Downloads</div>
            </motion.div>

            <motion.div
              className="bg-orange-50 rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <SafeIcon icon={FiAward} className="text-3xl text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">{accountStats.achievementsCount}</div>
              <div className="text-sm text-orange-700">Achievements</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiBarChart3} className="text-2xl text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Learning Progress</h2>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatTime(accountStats.readingTime)}
              </div>
              <div className="text-gray-700">Total Reading Time</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {accountStats.achievementsCount}
              </div>
              <div className="text-gray-700">Achievements Earned</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.ceil(accountStats.readingTime / 60) || 0}
              </div>
              <div className="text-gray-700">Learning Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiActivity} className="text-2xl text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">Account Actions</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => window.open('mailto:support@futurepathguides.com', '_blank')}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
          >
            <SafeIcon icon={FiMail} className="text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Contact Support</h3>
            <p className="text-gray-600 text-sm">Get help with your account or purchases</p>
          </button>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
          >
            <SafeIcon icon={FiDownload} className="text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Download Center</h3>
            <p className="text-gray-600 text-sm">Access all your purchased content</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings