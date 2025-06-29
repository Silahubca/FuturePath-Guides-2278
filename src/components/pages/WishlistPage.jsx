import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import { PRODUCTS } from '../../lib/stripe'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiHeart, FiShoppingCart, FiTrash2, FiPackage } = FiIcons

const WishlistPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchWishlist()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWishlistItems(data || [])
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) throw error
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId))
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      alert('Failed to remove item from wishlist')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to view your wishlist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Save your favorite products for later</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <SafeIcon icon={FiHeart} className="text-6xl text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8">
              Start adding products you love to keep track of them here!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {wishlistItems.map((item, index) => {
              const product = PRODUCTS[item.product_id]
              if (!product) return null

              return (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className={`h-48 bg-gradient-to-br ${
                    product.id === 'ai-job-search' ? 'from-blue-500 to-cyan-500' :
                    product.id === 'ai-entrepreneur' ? 'from-purple-500 to-pink-500' :
                    product.id === 'financial-freedom' ? 'from-green-500 to-emerald-500' :
                    'from-indigo-500 to-purple-500'
                  } relative`}>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => removeFromWishlist(item.product_id)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <SafeIcon icon={FiPackage} className="text-6xl text-white/80" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/${product.id}`)}
                          className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => navigate(`/${product.id}`)}
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        >
                          <SafeIcon icon={FiShoppingCart} />
                          <span>Buy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage