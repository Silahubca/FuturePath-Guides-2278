import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import ProfileEditor from './ProfileEditor'
import SecuritySettings from './SecuritySettings'
import PreferencesSettings from './PreferencesSettings'
import AccountSettings from './AccountSettings'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiUser, FiSettings, FiShield, FiEdit3, FiMail, FiCalendar, FiMapPin, FiBell } = FiIcons

const UserProfile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setUserProfile(data || {
        id: user.id,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        email: user.email,
        phone: '',
        bio: '',
        location: '',
        website: '',
        linkedin: '',
        twitter: '',
        preferences: {
          email_notifications: true,
          marketing_emails: true,
          theme: 'light',
          language: 'en'
        }
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'preferences', label: 'Preferences', icon: FiSettings },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'account', label: 'Account', icon: FiBell }
  ]

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiUser} className="text-3xl text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {userProfile?.first_name} {userProfile?.last_name}
                </h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <div className="flex items-center justify-center space-x-2 mt-2 text-xs text-gray-500">
                  <SafeIcon icon={FiCalendar} />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'profile' && (
                <ProfileEditor 
                  userProfile={userProfile} 
                  onUpdate={setUserProfile}
                  onRefresh={fetchUserProfile}
                />
              )}
              {activeTab === 'preferences' && (
                <PreferencesSettings 
                  userProfile={userProfile} 
                  onUpdate={setUserProfile}
                />
              )}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'account' && <AccountSettings />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile