import React, {useState, useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {motion, AnimatePresence} from 'framer-motion'
import {useAuth} from '../../hooks/useAuth.jsx'
import AuthModal from '../auth/AuthModal'
import NotificationCenter from '../notifications/NotificationCenter'
import SearchBar from '../search/SearchBar'
import ThemeToggle from '../theme/ThemeToggle'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const {FiUser, FiMenu, FiX, FiLogOut, FiSettings, FiHeart, FiShield, FiBarChart3, FiBook, FiShoppingBag, FiHome, FiPlay, FiBell} = FiIcons

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {user, signOut} = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Auto-redirect authenticated users who land on auth-related pages
  useEffect(() => {
    if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/dashboard')
    }
  }, [user, location.pathname, navigate])

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false)
    setShowUserMenu(false)
  }, [location.pathname])

  const handleAuthClick = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
    setShowMobileMenu(false)
  }

  const handleAuthModalClose = () => {
    setShowAuthModal(false)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setShowMobileMenu(false)
    setShowUserMenu(false)
  }

  const isAdmin = user?.email === 'admin@futurepathguides.com' || user?.user_metadata?.role === 'admin'

  const navigation = [
    {name: 'Home', href: '/', icon: FiHome},
    {name: 'AI Job Search', href: '/ai-job-search', icon: FiBarChart3},
    {name: 'AI Entrepreneur', href: '/ai-entrepreneur', icon: FiBarChart3},
    {name: 'Financial Freedom', href: '/financial-freedom', icon: FiBarChart3},
    {name: 'Complete Collection', href: '/complete-collection', icon: FiShoppingBag},
  ]

  const userMenuItems = [
    {name: 'Dashboard', href: '/dashboard', icon: FiSettings},
    {name: 'Learning Dashboard', href: '/personal-dashboard', icon: FiBarChart3},
    {name: 'My Library', href: '/library', icon: FiBook},
    {name: 'Get Started Guide', href: '/get-started', icon: FiPlay},
    {name: 'Wishlist', href: '/wishlist', icon: FiHeart},
    ...(isAdmin ? [{name: 'Admin', href: '/admin', icon: FiShield}] : [])
  ]

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={() => handleNavigation('/')}
                className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 whitespace-nowrap"
              >
                FuturePath Guides
              </button>
            </div>

            {/* Desktop Navigation - Hidden on mobile/tablet */}
            <nav className="hidden xl:flex items-center space-x-4 mx-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium whitespace-nowrap text-sm px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Desktop Search - Hidden on mobile */}
            <div className="hidden lg:block flex-1 max-w-sm mx-4">
              <SearchBar />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Theme Toggle */}
              <ThemeToggle className="hidden sm:block" />

              {user ? (
                <>
                  {/* Notifications - Hidden on mobile */}
                  <div className="hidden md:block">
                    <NotificationCenter />
                  </div>

                  {/* Wishlist - Hidden on mobile */}
                  <button
                    onClick={() => handleNavigation('/wishlist')}
                    className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="My Wishlist"
                  >
                    <SafeIcon icon={FiHeart} className="text-xl text-gray-600 dark:text-gray-400" />
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiUser} className="text-white text-sm" />
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-20 truncate">
                        {user.user_metadata?.first_name || 'User'}
                      </span>
                    </button>

                    {/* Desktop User Dropdown */}
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                          initial={{opacity: 0, scale: 0.95, y: -10}}
                          animate={{opacity: 1, scale: 1, y: 0}}
                          exit={{opacity: 0, scale: 0.95, y: -10}}
                          transition={{duration: 0.1}}
                        >
                          {userMenuItems.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => handleNavigation(item.href)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                            >
                              <SafeIcon icon={item.icon} />
                              <span>{item.name}</span>
                            </button>
                          ))}

                          {/* Mobile-only items in dropdown */}
                          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                            <button
                              onClick={() => handleNavigation('/wishlist')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                            >
                              <SafeIcon icon={FiHeart} />
                              <span>Wishlist</span>
                            </button>
                            <div className="px-4 py-2">
                              <NotificationCenter />
                            </div>
                          </div>

                          <hr className="my-2 border-gray-200 dark:border-gray-700" />
                          <button
                            onClick={() => {
                              signOut()
                              setShowUserMenu(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                          >
                            <SafeIcon icon={FiLogOut} />
                            <span>Sign Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                /* Auth Buttons for Desktop */
                <div className="hidden sm:flex items-center space-x-2">
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors px-3 py-2 text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="xl:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <SafeIcon icon={showMobileMenu ? FiX : FiMenu} className="text-xl dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Mobile Search - Show on all screens smaller than lg */}
          <div className="lg:hidden pb-3 pt-2">
            <SearchBar />
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              className="xl:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              initial={{opacity: 0, height: 0}}
              animate={{opacity: 1, height: 'auto'}}
              exit={{opacity: 0, height: 0}}
              transition={{duration: 0.2}}
            >
              <div className="container mx-auto px-4 py-4 max-h-96 overflow-y-auto">
                <nav className="space-y-1">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className="flex items-center space-x-3 w-full text-left p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={item.icon} />
                      <span>{item.name}</span>
                    </button>
                  ))}

                  {/* Theme Toggle for Mobile */}
                  <div className="sm:hidden p-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700 dark:text-gray-300">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>

                  {/* Mobile Auth Buttons */}
                  {!user && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <button
                        onClick={() => handleAuthClick('signin')}
                        className="flex items-center space-x-3 w-full text-left p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiUser} />
                        <span>Sign In</span>
                      </button>
                      <button
                        onClick={() => handleAuthClick('signup')}
                        className="w-full text-left p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}

                  {/* Mobile User Menu Items */}
                  {user && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                      {userMenuItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className="flex items-center space-x-3 w-full text-left p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <SafeIcon icon={item.icon} />
                          <span>{item.name}</span>
                        </button>
                      ))}

                      <button
                        onClick={() => handleNavigation('/wishlist')}
                        className="flex items-center space-x-3 w-full text-left p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiHeart} />
                        <span>Wishlist</span>
                      </button>

                      {/* Mobile Notifications */}
                      <div className="p-3">
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiBell} className="text-gray-700 dark:text-gray-300" />
                          <span className="text-gray-700 dark:text-gray-300">Notifications</span>
                          <NotificationCenter />
                        </div>
                      </div>

                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          signOut()
                          setShowMobileMenu(false)
                        }}
                        className="flex items-center space-x-3 w-full text-left p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiLogOut} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        initialMode={authMode}
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  )
}

export default Header