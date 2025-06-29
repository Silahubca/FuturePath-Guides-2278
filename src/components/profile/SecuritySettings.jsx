import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiShield, FiLock, FiEye, FiEyeOff, FiMail, FiTrash2, FiAlertTriangle } = FiIcons

const SecuritySettings = () => {
  const { user, signOut } = useAuth()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match')
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      setMessage('Password updated successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowChangePassword(false)
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      setMessage('Password reset email sent! Check your inbox.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      // First delete user data
      await supabase.from('user_profiles').delete().eq('id', user.id)
      await supabase.from('purchases').delete().eq('user_id', user.id)
      await supabase.from('wishlist').delete().eq('user_id', user.id)
      
      // Then delete auth user (this will cascade delete related data)
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      
      if (error) throw error

      alert('Account deleted successfully')
      signOut()
    } catch (error) {
      setMessage('Failed to delete account. Please contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Password Management */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiLock} className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Password & Security</h2>
        </div>

        <div className="space-y-6">
          {/* Current Security Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiShield} className="text-green-600" />
              <span className="font-medium text-green-900">Account Secured</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Your account is protected with secure authentication
            </p>
          </div>

          {/* Password Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <SafeIcon icon={FiLock} className="text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Change Password</h3>
              <p className="text-gray-600 text-sm">Update your account password</p>
            </button>

            <button
              onClick={handlePasswordReset}
              disabled={loading}
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left disabled:opacity-50"
            >
              <SafeIcon icon={FiMail} className="text-orange-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Reset Password</h3>
              <p className="text-gray-600 text-sm">Send reset email to {user.email}</p>
            </button>
          </div>

          {/* Change Password Form */}
          {showChangePassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border border-gray-200 rounded-lg p-6 bg-gray-50"
            >
              <h4 className="font-semibold text-gray-900 mb-4">Change Password</h4>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      <SafeIcon icon={showPasswords.current ? FiEyeOff : FiEye} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      <SafeIcon icon={showPasswords.new ? FiEyeOff : FiEye} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      <SafeIcon icon={showPasswords.confirm ? FiEyeOff : FiEye} />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <SafeIcon icon={FiTrash2} className="text-2xl text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Account Management</h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiAlertTriangle} className="text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
              <p className="text-red-700 text-sm mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteAccount(!showDeleteAccount)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete Account
              </button>
            </div>
          </div>

          {showDeleteAccount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-red-100 rounded-lg"
            >
              <p className="text-red-800 text-sm mb-4">
                Are you absolutely sure? This will permanently delete your account, all purchases, and cannot be recovered.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors text-sm disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button
                  onClick={() => setShowDeleteAccount(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
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
    </div>
  )
}

export default SecuritySettings