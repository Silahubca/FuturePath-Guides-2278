import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiBarChart3, FiUsers, FiDollarSign, FiTrendingUp, FiEye, FiShoppingCart, FiTarget, FiClock, FiGlobe, FiSmartphone } = FiIcons

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    conversionRate: 0,
    pageViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    bounceRate: 0
  })
  
  const [timeRange, setTimeRange] = useState('7d')
  const [topPages, setTopPages] = useState([])
  const [conversionFunnel, setConversionFunnel] = useState([])
  const [revenueChart, setRevenueChart] = useState([])
  const [userFlow, setUserFlow] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const endDate = new Date()
      const startDate = new Date()
      
      switch (timeRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24)
          break
        case '7d':
          startDate.setDate(startDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(startDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(startDate.getDate() - 90)
          break
      }

      // Fetch basic stats
      await Promise.all([
        fetchOverviewStats(startDate, endDate),
        fetchTopPages(startDate, endDate),
        fetchConversionFunnel(startDate, endDate),
        fetchRevenueData(startDate, endDate),
        fetchUserFlow(startDate, endDate)
      ])
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOverviewStats = async (startDate, endDate) => {
    try {
      // Total users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // Active users in time range
      const { count: activeUsers } = await supabase
        .from('analytics_events')
        .select('user_id', { count: 'exact', head: true })
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .not('user_id', 'is', null)

      // Page views
      const { count: pageViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())

      // Unique visitors (by session)
      const { data: sessions } = await supabase
        .from('analytics_events')
        .select('session_id')
        .eq('event_type', 'page_view')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())

      const uniqueVisitors = new Set(sessions?.map(s => s.session_id)).size

      // Revenue data
      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      const totalRevenue = purchases?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0

      // Conversion rate (purchases / unique visitors)
      const conversionRate = uniqueVisitors > 0 ? (purchases?.length || 0) / uniqueVisitors * 100 : 0

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalRevenue,
        conversionRate,
        pageViews: pageViews || 0,
        uniqueVisitors,
        avgSessionDuration: 0, // Calculate separately
        bounceRate: 0 // Calculate separately
      })
    } catch (error) {
      console.error('Error fetching overview stats:', error)
    }
  }

  const fetchTopPages = async (startDate, endDate) => {
    try {
      const { data } = await supabase
        .from('analytics_events')
        .select('page_path')
        .eq('event_type', 'page_view')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())

      const pageCount = {}
      data?.forEach(event => {
        pageCount[event.page_path] = (pageCount[event.page_path] || 0) + 1
      })

      const topPages = Object.entries(pageCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([path, views]) => ({ path, views }))

      setTopPages(topPages)
    } catch (error) {
      console.error('Error fetching top pages:', error)
    }
  }

  const fetchConversionFunnel = async (startDate, endDate) => {
    try {
      // Landing page visits
      const { count: landingViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view')
        .eq('page_path', '/')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())

      // Product page visits
      const { count: productViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view')
        .in('page_path', ['/ai-job-search', '/ai-entrepreneur', '/financial-freedom', '/complete-collection'])
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())

      // Checkout initiated
      const { count: checkoutInitiated } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'checkout_initiated')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())

      // Purchases completed
      const { count: purchases } = await supabase
        .from('purchases')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      setConversionFunnel([
        { stage: 'Landing Page', count: landingViews || 0 },
        { stage: 'Product View', count: productViews || 0 },
        { stage: 'Checkout', count: checkoutInitiated || 0 },
        { stage: 'Purchase', count: purchases || 0 }
      ])
    } catch (error) {
      console.error('Error fetching conversion funnel:', error)
    }
  }

  const fetchRevenueData = async (startDate, endDate) => {
    try {
      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount, created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at')

      // Group by day
      const dailyRevenue = {}
      purchases?.forEach(purchase => {
        const date = new Date(purchase.created_at).toISOString().split('T')[0]
        dailyRevenue[date] = (dailyRevenue[date] || 0) + parseFloat(purchase.amount)
      })

      const chartData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date,
        revenue
      }))

      setRevenueChart(chartData)
    } catch (error) {
      console.error('Error fetching revenue data:', error)
    }
  }

  const fetchUserFlow = async (startDate, endDate) => {
    try {
      const { data: events } = await supabase
        .from('analytics_events')
        .select('session_id, page_path, timestamp')
        .eq('event_type', 'page_view')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp')

      // Analyze user flow patterns
      const sessionPaths = {}
      events?.forEach(event => {
        if (!sessionPaths[event.session_id]) {
          sessionPaths[event.session_id] = []
        }
        sessionPaths[event.session_id].push(event.page_path)
      })

      // Find common paths
      const pathCounts = {}
      Object.values(sessionPaths).forEach(path => {
        const pathString = path.slice(0, 3).join(' → ') // First 3 pages
        pathCounts[pathString] = (pathCounts[pathString] || 0) + 1
      })

      const commonPaths = Object.entries(pathCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }))

      setUserFlow(commonPaths)
    } catch (error) {
      console.error('Error fetching user flow:', error)
    }
  }

  const StatCard = ({ title, value, icon, change = null, format = 'number' }) => {
    const formatValue = (val) => {
      switch (format) {
        case 'currency':
          return `$${val.toFixed(2)}`
        case 'percentage':
          return `${val.toFixed(1)}%`
        case 'duration':
          return `${Math.floor(val / 60)}m ${val % 60}s`
        default:
          return val.toLocaleString()
      }
    }

    return (
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <SafeIcon icon={icon} className="text-2xl text-blue-600" />
          {change && (
            <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {formatValue(value)}
        </div>
        <div className="text-sm text-gray-600">{title}</div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Monitor your platform performance and user behavior</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex space-x-2">
            {[
              { value: '24h', label: '24h' },
              { value: '7d', label: '7d' },
              { value: '30d', label: '30d' },
              { value: '90d', label: '90d' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={FiUsers}
          />
          <StatCard
            title="Page Views"
            value={stats.pageViews}
            icon={FiEye}
          />
          <StatCard
            title="Revenue"
            value={stats.totalRevenue}
            icon={FiDollarSign}
            format="currency"
          />
          <StatCard
            title="Conversion Rate"
            value={stats.conversionRate}
            icon={FiTarget}
            format="percentage"
          />
        </div>

        {/* Charts and Data */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Conversion Funnel */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Conversion Funnel</h3>
            <div className="space-y-4">
              {conversionFunnel.map((stage, index) => {
                const maxCount = Math.max(...conversionFunnel.map(s => s.count))
                const percentage = maxCount > 0 ? (stage.count / maxCount) * 100 : 0
                
                return (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{stage.stage}</span>
                      <span className="text-sm text-gray-600">{stage.count.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Top Pages */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top Pages</h3>
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <span className="text-gray-700 truncate">{page.path || '/'}</span>
                  <span className="font-medium text-gray-900">{page.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Revenue Chart */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-64 flex items-end space-x-2">
            {revenueChart.map((day, index) => {
              const maxRevenue = Math.max(...revenueChart.map(d => d.revenue))
              const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0
              
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-600 rounded-t transition-all duration-500 hover:bg-blue-700"
                    style={{ height: `${height}%` }}
                    title={`${day.date}: $${day.revenue.toFixed(2)}`}
                  />
                  <span className="text-xs text-gray-500 mt-2 transform rotate-45">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* User Flow */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Common User Paths</h3>
          <div className="space-y-4">
            {userFlow.map((flow, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{flow.path}</span>
                <span className="font-medium text-gray-900">{flow.count} users</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard