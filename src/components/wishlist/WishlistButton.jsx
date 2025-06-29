import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiHeart } = FiIcons

const WishlistButton = ({ productId, className = '' }) => {
  const { user } = useAuth()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && productId) {
      checkWishlistStatus()
    }
  }, [user, productId])

  const checkWishlistStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

      if (data) {
        setIsInWishlist(true)
      }
    } catch (error) {
      // Item not in wishlist
      setIsInWishlist(false)
    }
  }

  const toggleWishlist = async () => {
    if (!user) {
      alert('Please sign in to add items to your wishlist')
      return
    }

    setLoading(true)

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)

        if (error) throw error
        setIsInWishlist(false)
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: productId
          })

        if (error) throw error
        setIsInWishlist(true)
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      alert('Failed to update wishlist')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      onClick={toggleWishlist}
      disabled={loading}
      className={`
        p-2 rounded-full transition-all duration-300 hover:scale-110
        ${isInWishlist 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <SafeIcon 
        icon={FiHeart} 
        className={`text-lg ${isInWishlist ? 'fill-current' : ''}`} 
      />
    </motion.button>
  )
}

export default WishlistButton