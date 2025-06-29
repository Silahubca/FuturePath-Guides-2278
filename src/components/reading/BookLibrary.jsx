import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import { BOOK_CONTENT } from '../../data/bookContent'
import ChapterReader from './ChapterReader'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiBook, FiDownload, FiPlay, FiFileText, FiHeadphones, FiClock, FiCheckCircle, FiTrendingUp } = FiIcons

const BookLibrary = () => {
  const { user } = useAuth()
  const [purchasedBooks, setPurchasedBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [readingProgress, setReadingProgress] = useState({})
  const [loading, setLoading] = useState(true)

  // Check URL parameters for book selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const bookParam = urlParams.get('book')
    if (bookParam && BOOK_CONTENT[bookParam]) {
      setSelectedBook(bookParam)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchPurchasedBooks()
      fetchReadingProgress()
    }
  }, [user])

  const fetchPurchasedBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setPurchasedBooks(data || [])
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReadingProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      const progressMap = {}
      data?.forEach(progress => {
        progressMap[progress.product_id] = progress
      })
      setReadingProgress(progressMap)
    } catch (error) {
      console.error('Error fetching reading progress:', error)
    }
  }

  const handleDownloadBundle = (productId) => {
    // Create a simple text file with all chapters
    const bookContent = BOOK_CONTENT[productId]
    if (!bookContent) return

    let fullContent = `${bookContent.title}\n\n`
    bookContent.chapters.forEach((chapter, index) => {
      fullContent += `${chapter.title}\n\n${chapter.content}\n\n---\n\n`
    })

    const blob = new Blob([fullContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${bookContent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const startReading = (productId) => {
    // Update URL with hash router format and set selected book
    const newUrl = `${window.location.pathname}#/library?book=${productId}`
    window.history.pushState({}, '', newUrl)
    setSelectedBook(productId)
  }

  const goBackToLibrary = () => {
    // Clear the book parameter and go back to library view
    const newUrl = `${window.location.pathname}#/library`
    window.history.pushState({}, '', newUrl)
    setSelectedBook(null)
  }

  if (selectedBook) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <button
            onClick={goBackToLibrary}
            className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>← Back to Library</span>
          </button>
          <ChapterReader 
            productId={selectedBook} 
            bookContent={BOOK_CONTENT[selectedBook]} 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Digital Library</h1>
          <p className="text-gray-600">Read your purchased guides online or download them for offline access</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600">Loading your library...</p>
          </div>
        ) : purchasedBooks.length === 0 ? (
          <div className="text-center py-16">
            <SafeIcon icon={FiBook} className="text-6xl text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your library is empty</h3>
            <p className="text-gray-600 mb-8">
              Purchase one of our blueprints to start building your success library!
            </p>
            <a 
              href="/#/" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedBooks.map((purchase) => {
              const bookContent = BOOK_CONTENT[purchase.product_id]
              const progress = readingProgress[purchase.product_id]
              const totalSections = bookContent?.chapters?.length || bookContent?.totalSections || 7
              const completionPercentage = progress ? 
                Math.round((progress.completed_sections / totalSections) * 100) : 0

              if (!bookContent) return null

              return (
                <motion.div
                  key={purchase.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={`h-48 bg-gradient-to-br ${
                    purchase.product_id === 'ai-job-search' ? 'from-blue-500 to-cyan-500' :
                    purchase.product_id === 'ai-entrepreneur' ? 'from-purple-500 to-pink-500' :
                    'from-green-500 to-emerald-500'
                  } relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <SafeIcon icon={FiBook} className="text-6xl text-white/80" />
                    </div>

                    {/* Progress indicator */}
                    {completionPercentage > 0 && (
                      <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                        <div className="relative w-8 h-8">
                          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                            <circle 
                              cx="16" cy="16" r="12" 
                              stroke="currentColor" strokeWidth="3" 
                              fill="transparent" className="text-gray-200" 
                            />
                            <circle 
                              cx="16" cy="16" r="12" 
                              stroke="currentColor" strokeWidth="3" 
                              fill="transparent" 
                              strokeDasharray={`${completionPercentage * 0.75} 75`}
                              className="text-green-500" 
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-700">{completionPercentage}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {bookContent.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {bookContent.description}
                    </p>

                    {/* Reading stats */}
                    <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                      <span className="flex items-center space-x-1">
                        <SafeIcon icon={FiFileText} />
                        <span>{bookContent.chapters?.length || 0} chapters</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <SafeIcon icon={FiClock} />
                        <span>{bookContent.estimatedReadTime}</span>
                      </span>
                    </div>

                    {/* Progress bar */}
                    {progress && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progress.completed_sections}/{totalSections} chapters</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <button
                        onClick={() => startReading(purchase.product_id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <SafeIcon icon={progress && progress.completed_sections > 0 ? FiTrendingUp : FiPlay} />
                        <span>{progress && progress.completed_sections > 0 ? 'Continue Reading' : 'Start Reading'}</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleDownloadBundle(purchase.product_id)}
                          className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <SafeIcon icon={FiDownload} className="text-sm" />
                          <span className="text-sm">Download</span>
                        </button>
                        <button 
                          className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Audio version coming soon"
                        >
                          <SafeIcon icon={FiHeadphones} className="text-sm" />
                          <span className="text-sm">Audio</span>
                        </button>
                      </div>
                    </div>

                    {/* Last accessed */}
                    {progress?.last_accessed && (
                      <p className="text-xs text-gray-500 mt-3">
                        Last read: {new Date(progress.last_accessed).toLocaleDateString()}
                      </p>
                    )}
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

export default BookLibrary