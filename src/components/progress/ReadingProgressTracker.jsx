import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import { BOOK_CONTENT } from '../../data/bookContent'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiBook, FiCheckCircle, FiClock, FiTrendingUp, FiPlay } = FiIcons

const ReadingProgressTracker = ({ productId }) => {
  const { user } = useAuth()
  const [progress, setProgress] = useState({
    completedSections: 0,
    timeSpent: 0,
    lastAccessed: null,
    completionPercentage: 0,
    currentChapter: 0
  })
  const [loading, setLoading] = useState(true)

  const bookContent = BOOK_CONTENT[productId]
  const totalSections = bookContent?.totalSections || bookContent?.chapters?.length || 0

  useEffect(() => {
    if (user && productId) {
      fetchProgress()
    }
  }, [user, productId])

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

      if (data) {
        const completionPercentage = Math.round((data.completed_sections / totalSections) * 100)
        setProgress({
          completedSections: data.completed_sections,
          timeSpent: data.time_spent || 0,
          lastAccessed: data.last_accessed,
          completionPercentage,
          currentChapter: data.current_chapter || 0
        })
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const startReading = () => {
    // Use window.location.hash for proper HashRouter navigation
    window.location.hash = `/library?book=${productId}`
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <SafeIcon icon={FiBook} className="mr-2 text-blue-600" />
          {bookContent?.title || 'Reading Progress'}
        </h3>
        <span className="text-2xl font-bold text-blue-600">
          {progress.completionPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress.completedSections} of {totalSections} chapters completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress.completionPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <SafeIcon icon={FiCheckCircle} className="text-2xl text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-blue-900">{progress.completedSections}</div>
          <div className="text-sm text-blue-700">Completed</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <SafeIcon icon={FiClock} className="text-2xl text-green-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-green-900">{formatTime(progress.timeSpent)}</div>
          <div className="text-sm text-green-700">Time Spent</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <SafeIcon icon={FiTrendingUp} className="text-2xl text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-900">{totalSections - progress.completedSections}</div>
          <div className="text-sm text-purple-700">Remaining</div>
        </div>
      </div>

      {/* Action Button */}
      {progress.completionPercentage < 100 ? (
        <button
          onClick={startReading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <SafeIcon icon={progress.completedSections > 0 ? FiTrendingUp : FiPlay} />
          <span>{progress.completedSections > 0 ? 'Continue Reading' : 'Start Reading'}</span>
        </button>
      ) : (
        <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <SafeIcon icon={FiCheckCircle} className="text-3xl text-green-600 mx-auto mb-2" />
          <div className="text-green-900 font-semibold">Congratulations! Guide Complete!</div>
          <button
            onClick={startReading}
            className="mt-2 text-green-600 hover:text-green-700 font-medium"
          >
            Review chapters →
          </button>
        </div>
      )}

      {/* Last accessed info */}
      {progress.lastAccessed && (
        <p className="text-sm text-gray-500 mt-3 text-center">
          Last accessed: {new Date(progress.lastAccessed).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  )
}

export default ReadingProgressTracker