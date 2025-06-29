import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiSettings, FiBell, FiMail, FiMoon, FiSun, FiGlobe, FiSave } = FiIcons

const PreferencesSettings = ({ userProfile, onUpdate }) => {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState({
    email_notifications: userProfile?.preferences?.email_notifications ?? true,
    marketing_emails: userProfile?.preferences?.marketing_emails ?? true,
    progress_emails: userProfile?.preferences?.progress_emails ?? true,
    theme: userProfile?.preferences?.theme ?? 'light',
    language: userProfile?.preferences?.language ?? 'en',
    timezone: userProfile?.preferences?.timezone ?? 'UTC',
    weekly_digest: userProfile?.preferences?.weekly_digest ?? true,
    achievement_notifications: userProfile?.preferences?.achievement_notifications ?? true
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          preferences: preferences,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      onUpdate({
        ...userProfile,
        preferences: preferences
      })

      setMessage('Preferences updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating preferences:', error)
      setMessage('Failed to update preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const notificationOptions = [
    {
      key: 'email_notifications',
      title: 'Email Notifications',
      description: 'Receive important updates via email',
      icon: FiMail
    },
    {
      key: 'marketing_emails',
      title: 'Marketing Emails',
      description: 'Receive newsletters and promotional content',
      icon: FiBell
    },
    {
      key: 'progress_emails',
      title: 'Progress Updates',
      description: 'Get notified about your learning progress',
      icon: FiSettings
    },
    {
      key: 'weekly_digest',
      title: 'Weekly Digest',
      description: 'Receive a weekly summary of your activity',
      icon: FiMail
    },
    {
      key: 'achievement_notifications',
      title: 'Achievement Notifications',
      description: 'Get notified when you unlock achievements',
      icon: FiBell
    }
  ]

  const themes = [
    { value: 'light', label: 'Light', icon: FiSun },
    { value: 'dark', label: 'Dark', icon: FiMoon },
    { value: 'auto', label: 'Auto', icon: FiSettings }
  ]

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' }
  ]

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiBell} className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
        </div>

        <div className="space-y-4">
          {notificationOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={option.icon} className="text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences[option.key]}
                  onChange={(e) => handlePreferenceChange(option.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiSettings} className="text-2xl text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Appearance & Language</h2>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Theme Preference
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handlePreferenceChange('theme', theme.value)}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    preferences.theme === theme.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <SafeIcon icon={theme.icon} className="text-2xl mx-auto mb-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Language
            </label>
            <div className="relative">
              <SafeIcon icon={FiGlobe} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timezone Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Timezone
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-sm ${
            message.includes('success')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </motion.div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <SafeIcon icon={FiSave} />
          <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </div>
    </div>
  )
}

export default PreferencesSettings