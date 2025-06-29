import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { 
  FiUsers, FiDollarSign, FiTrendingUp, FiPackage, 
  FiDownload, FiCalendar, FiBarChart3, FiMail 
} = FiIcons

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalPurchases: 0,
    totalDownloads: 0
  })
  const [recentPurchases, setRecentPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  // Check if user is admin (you can implement this logic based on your needs)
  const isAdmin = user?.email === 'admin@futurepathguides.com' || user?.user_metadata?.role === 'admin'

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats()
      fetchRecentPurchases()
    }
  }, [isAdmin])

  const fetchAdminStats = async () => {
    try {
      // Total users
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // Total revenue and purchases
      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount')

      const totalRevenue = purchases?.reduce((sum, purchase) => sum + parseFloat(purchase.amount), 0) || 0
      const totalPurchases = purchases?.length || 0

      // Total downloads
      const { count: downloadCount } = await supabase
        .from('download_logs')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalUsers: userCount || 0,
        totalRevenue,
        totalPurchases,
        totalDownloads: downloadCount || 0
      })
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    }
  }

  const fetchRecentPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          user_profiles!inner(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setRecentPurchases(data || [])
    } catch (error) {
      console.error('Error fetching recent purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor your business performance and manage operations</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <SafeIcon icon={FiUsers} className="text-2xl text-blue-600" />
                  <span className="text-sm text-gray-500">Total Users</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <SafeIcon icon={FiDollarSign} className="text-2xl text-green-600" />
                  <span className="text-sm text-gray-500">Total Revenue</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <SafeIcon icon={FiPackage} className="text-2xl text-purple-600" />
                  <span className="text-sm text-gray-500">Total Sales</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalPurchases}</div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <SafeIcon icon={FiDownload} className="text-2xl text-orange-600" />
                  <span className="text-sm text-gray-500">Downloads</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalDownloads}</div>
              </motion.div>
            </div>

            {/* Recent Purchases */}
            <motion.div
              className="bg-white rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recent Purchases</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentPurchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {purchase.user_profiles?.first_name} {purchase.user_profiles?.last_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{purchase.product_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${purchase.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(purchase.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {purchase.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard