import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import { PRODUCTS } from '../../lib/stripe'
import { downloadAIJobSearchPDF } from '../../utils/pdfGenerator'
import { downloadBonusTemplate } from '../../utils/bonusTemplateGenerator'
import WelcomeFlow from '../onboarding/WelcomeFlow'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiUser, FiDownload, FiShoppingBag, FiCalendar, FiLogOut, FiPackage, FiCheck, FiFileText, FiFolder, FiBook, FiTrendingUp, FiAward, FiPlay, FiEye } = FiIcons

const DashboardPage = () => {
  const { user, signOut } = useAuth()
  const [purchases, setPurchases] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    completionRate: 0,
    achievements: 0
  })

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError)
      }

      setUserProfile(profile)

      // Check if onboarding is needed
      if (!profile?.onboarding_completed) {
        console.log('Onboarding not completed, showing welcome flow')
        setShowOnboarding(true)
        setLoading(false)
        return
      }

      // Fetch purchases
      const { data: purchasesData, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPurchases(purchasesData || [])

      // Calculate stats
      const totalSpent = purchasesData?.reduce((sum, purchase) => sum + parseFloat(purchase.amount), 0) || 0

      // Fetch achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)

      // Fetch reading progress
      const { data: progress } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', user.id)

      const avgCompletion = progress?.length > 0 
        ? progress.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / progress.length 
        : 0

      setStats({
        totalPurchases: purchasesData?.length || 0,
        totalSpent,
        completionRate: Math.round(avgCompletion),
        achievements: achievements?.length || 0
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMainDownload = (productId) => {
    if (productId === 'ai-job-search') {
      downloadAIJobSearchPDF()
    }
    // Add other product downloads here
  }

  const handleBonusDownload = (templateType) => {
    downloadBonusTemplate(templateType)
  }

  const handleViewProduct = (productId) => {
    window.open(`/#/${productId}`, '_blank')
  }

  const handleStartReading = (productId) => {
    // Navigate to library with specific book
    window.location.hash = `/library?book=${productId}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getBonusFiles = (productId) => {
    switch (productId) {
      case 'ai-job-search':
        return [
          { name: 'ATS-Optimized Resume Template', type: 'resume', format: 'Excel' },
          { name: 'Winning Cover Letter Template', type: 'cover-letter', format: 'Word Doc' },
          { name: 'AI Job Search Prompts Library', type: 'ai-prompts', format: 'PDF' },
          { name: 'Interview Mastery Checklist', type: 'interview-checklist', format: 'PDF' }
        ]
      case 'ai-entrepreneur':
        return [
          { name: 'Lean Startup Business Plan Template', type: 'business-plan', format: 'Excel' },
          { name: 'UVP Canvas Worksheet', type: 'uvp-canvas', format: 'PDF' },
          { name: 'AI Tools Toolkit (50+ Tools)', type: 'ai-tools', format: 'PDF' },
          { name: '5-Day Marketing Launch Plan', type: 'marketing-plan', format: 'PDF' }
        ]
      case 'financial-freedom':
        return [
          { name: 'Money Map Budgeting Tracker', type: 'money-map', format: 'Excel' },
          { name: 'Debt Demolisher Worksheet', type: 'debt-demolisher', format: 'PDF' },
          { name: 'Inflation-Proof Portfolio Guide', type: 'portfolio-guide', format: 'PDF' },
          { name: 'Personal Financial Goal Setter', type: 'goal-setter', format: 'PDF' }
        ]
      default:
        return []
    }
  }

  const completeOnboarding = () => {
    console.log('Onboarding completed, hiding welcome flow')
    setShowOnboarding(false)
    // Refresh user data after onboarding
    fetchUserData()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    return <WelcomeFlow onComplete={completeOnboarding} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="text-white text-lg sm:text-2xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Welcome back, {userProfile?.first_name || user.user_metadata?.first_name || 'User'}! 👋
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {formatDate(user.created_at)}
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 text-sm sm:text-base"
            >
              <SafeIcon icon={FiLogOut} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div 
            className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SafeIcon icon={FiShoppingBag} className="text-2xl sm:text-3xl text-blue-600 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalPurchases}</div>
            <div className="text-sm text-gray-600">Total Purchases</div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <SafeIcon icon={FiTrendingUp} className="text-2xl sm:text-3xl text-green-600 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Investment</div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <SafeIcon icon={FiBook} className="text-2xl sm:text-3xl text-purple-600 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.completionRate}%</div>
            <div className="text-sm text-gray-600">Avg Completion</div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <SafeIcon icon={FiAward} className="text-2xl sm:text-3xl text-orange-600 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.achievements}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <SafeIcon icon={FiPackage} className="mr-2 text-blue-600" />
                  Your Digital Products
                </h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Download and access your purchased content</p>
              </div>
              
              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
                    <p className="text-gray-600">Loading your purchases...</p>
                  </div>
                ) : purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <SafeIcon icon={FiPackage} className="text-4xl text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No purchases yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start building your success library with our expert blueprints.
                    </p>
                    <a 
                      href="/#/" 
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      <SafeIcon icon={FiShoppingBag} />
                      <span>Browse Products</span>
                    </a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {purchases.map((purchase, index) => {
                      const product = PRODUCTS[purchase.product_id]
                      if (!product) return null

                      const bonusFiles = getBonusFiles(purchase.product_id)

                      return (
                        <motion.div
                          key={purchase.id}
                          className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {product.name}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
                                <span>Purchased: {formatDate(purchase.created_at)}</span>
                                <span>•</span>
                                <span className="flex items-center space-x-1">
                                  <SafeIcon icon={FiCheck} className="text-green-500" />
                                  <span>Payment Confirmed</span>
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-lg font-bold text-gray-900">
                                ${product.price}
                              </span>
                              <button
                                onClick={() => handleViewProduct(purchase.product_id)}
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                <SafeIcon icon={FiEye} />
                                <span>View Product</span>
                              </button>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <button
                              onClick={() => handleStartReading(purchase.product_id)}
                              className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                            >
                              <SafeIcon icon={FiPlay} />
                              <span>Start Reading</span>
                            </button>
                            <button
                              onClick={() => handleMainDownload(purchase.product_id)}
                              className="flex items-center justify-center space-x-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                            >
                              <SafeIcon icon={FiDownload} />
                              <span>Download PDF</span>
                            </button>
                          </div>

                          {/* Bonus Downloads */}
                          {bonusFiles.length > 0 && (
                            <div className="bg-yellow-50 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                <SafeIcon icon={FiFolder} className="mr-2 text-yellow-600" />
                                Bonus Resources:
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {bonusFiles.map((file, fileIndex) => (
                                  <button
                                    key={fileIndex}
                                    onClick={() => handleBonusDownload(file.type)}
                                    className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group text-left"
                                  >
                                    <SafeIcon icon={FiDownload} className="text-yellow-600 group-hover:text-yellow-700 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-800 block truncate">
                                        {file.name}
                                      </span>
                                      <span className="text-xs text-gray-500">{file.format}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a 
                  href="/#/library" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiBook} className="text-blue-600" />
                  <span className="text-gray-700">Reading Library</span>
                </a>
                <a 
                  href="/#/personal-dashboard" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiTrendingUp} className="text-green-600" />
                  <span className="text-gray-700">Progress Tracking</span>
                </a>
                <a 
                  href="/#/profile" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiUser} className="text-purple-600" />
                  <span className="text-gray-700">Profile Settings</span>
                </a>
                <a 
                  href="/#/" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiShoppingBag} className="text-orange-600" />
                  <span className="text-gray-700">Browse Products</span>
                </a>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {purchases.slice(0, 3).map((purchase) => (
                  <div key={purchase.id} className="flex items-center space-x-3 p-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        Purchased {purchase.product_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(purchase.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
                {purchases.length === 0 && (
                  <p className="text-gray-500 text-sm">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage