import React,{useState} from 'react'
import {motion,AnimatePresence} from 'framer-motion'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../hooks/useAuth.jsx'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const {FiX,FiMail,FiLock,FiUser,FiEye,FiEyeOff,FiCheckCircle,FiAlertCircle,FiShoppingCart}=FiIcons

const AuthModal=({isOpen,onClose,initialMode='signin',onSuccess,showSignUpOption=true,purchaseContext=null})=> {
  const navigate=useNavigate()
  const [mode,setMode]=useState(initialMode)
  const [showPassword,setShowPassword]=useState(false)
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')
  const [messageType,setMessageType]=useState('info') // 'success', 'error', 'info'
  const [formData,setFormData]=useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })

  const {signIn,signUp,resetPassword}=useAuth()

  const handleInputChange=(e)=> {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setMessage('')
  }

  const validateForm=()=> {
    if (!formData.email) {
      setMessage('Email is required')
      setMessageType('error')
      return false
    }

    if (!formData.email.includes('@')) {
      setMessage('Please enter a valid email address')
      setMessageType('error')
      return false
    }

    if (mode !== 'reset' && !formData.password) {
      setMessage('Password is required')
      setMessageType('error')
      return false
    }

    if (mode === 'signup') {
      if (!formData.firstName || !formData.lastName) {
        setMessage('First and last name are required')
        setMessageType('error')
        return false
      }

      if (formData.password.length < 6) {
        setMessage('Password must be at least 6 characters long')
        setMessageType('error')
        return false
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage('Passwords do not match')
        setMessageType('error')
        return false
      }
    }

    return true
  }

  const handleSubmit=async (e)=> {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        console.log('Attempting to sign up with:', {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName
        })

        const {data,error}=await signUp(
          formData.email,
          formData.password,
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`
          }
        )

        if (error) {
          console.error('Signup error:', error)
          setMessage(error)
          setMessageType('error')
        } else {
          console.log('Signup successful:', data)
          
          // Check if user needs email confirmation
          if (data.user && !data.user.email_confirmed_at) {
            setMessage('Account created! Please check your email to confirm your account, then sign in.')
            setMessageType('success')
            // Auto switch to signin mode after 3 seconds
            setTimeout(() => {
              setMode('signin')
              setMessage('')
            }, 3000)
          } else {
            // User is automatically logged in
            setMessage('Account created and logged in successfully!')
            setMessageType('success')
            setTimeout(() => {
              if (onSuccess) {
                onSuccess()
              } else {
                onClose()
                navigate('/dashboard')
              }
            }, 1500)
          }
        }

      } else if (mode === 'signin') {
        console.log('Attempting to sign in with:', formData.email)

        const {data,error}=await signIn(formData.email,formData.password)

        if (error) {
          console.error('Signin error:', error)
          setMessage(error)
          setMessageType('error')
        } else {
          console.log('Signin successful:', data)
          setMessage('Signed in successfully!')
          setMessageType('success')
          setTimeout(() => {
            if (onSuccess) {
              onSuccess()
            } else {
              onClose()
              navigate('/dashboard')
            }
          }, 1000)
        }

      } else if (mode === 'reset') {
        const {data,error}=await resetPassword(formData.email)

        if (error) {
          setMessage(error)
          setMessageType('error')
        } else {
          setMessage('Password reset email sent! Check your inbox.')
          setMessageType('success')
        }
      }

    } catch (error) {
      console.error('Auth error:', error)
      setMessage('An unexpected error occurred. Please try again.')
      setMessageType('error')
    }

    setLoading(false)
  }

  const resetForm=()=> {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    })
    setMessage('')
    setMessageType('info')
  }

  const switchMode=(newMode)=> {
    setMode(newMode)
    resetForm()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Reset Password'}
                </h2>
                {purchaseContext && (
                  <div className="flex items-center space-x-2 mt-2 text-sm text-blue-600">
                    <SafeIcon icon={FiShoppingCart} />
                    <span>To purchase: {purchaseContext.productName}</span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <SafeIcon icon={FiX} className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Purchase Context Banner */}
              {purchaseContext && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiShoppingCart} className="text-blue-600" />
                    <span className="font-semibold text-blue-900">Ready to Purchase</span>
                  </div>
                  <p className="text-blue-800 text-sm">
                    {purchaseContext.productName} - ${purchaseContext.productPrice}
                  </p>
                  <p className="text-blue-700 text-xs mt-1">
                    {mode === 'signin' 
                      ? 'Sign in to complete your purchase' 
                      : 'Create an account to get instant access'
                    }
                  </p>
                </div>
              )}

              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <SafeIcon 
                        icon={FiUser} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                      />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <SafeIcon 
                        icon={FiUser} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <SafeIcon 
                    icon={FiMail} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {mode !== 'reset' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <SafeIcon 
                        icon={FiLock} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                      </button>
                    </div>
                    {mode === 'signup' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 6 characters long
                      </p>
                    )}
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <SafeIcon 
                          icon={FiLock} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg text-sm flex items-center space-x-2 ${
                    messageType === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : messageType === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  <SafeIcon 
                    icon={messageType === 'success' ? FiCheckCircle : FiAlertCircle} 
                    className="flex-shrink-0" 
                  />
                  <span>{message}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    {mode === 'signin' 
                      ? 'Sign In' 
                      : mode === 'signup' 
                      ? 'Create Account' 
                      : 'Send Reset Email'
                    }
                    {purchaseContext && mode === 'signin' && ' & Continue to Purchase'}
                    {purchaseContext && mode === 'signup' && ' & Get Instant Access'}
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="px-6 pb-6 text-center space-y-3">
              {mode === 'signin' && (
                <>
                  <button
                    onClick={() => switchMode('reset')}
                    className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                  >
                    Forgot your password?
                  </button>
                  {showSignUpOption && (
                    <div className="text-gray-600 text-sm">
                      Don't have an account?{' '}
                      <button
                        onClick={() => switchMode('signup')}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Sign up
                      </button>
                      {purchaseContext && (
                        <span className="text-green-600 font-medium"> for instant access</span>
                      )}
                    </div>
                  )}
                </>
              )}

              {mode === 'signup' && (
                <div className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => switchMode('signin')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {mode === 'reset' && (
                <div className="text-gray-600 text-sm">
                  Remember your password?{' '}
                  <button
                    onClick={() => switchMode('signin')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {/* Terms and Privacy */}
              <div className="text-xs text-gray-500 mt-4 space-x-2">
                <span>By continuing, you agree to our</span>
                <a href="/#/terms-of-service" className="text-blue-600 hover:text-blue-700" target="_blank">
                  Terms of Service
                </a>
                <span>and</span>
                <a href="/#/privacy-policy" className="text-blue-600 hover:text-blue-700" target="_blank">
                  Privacy Policy
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal