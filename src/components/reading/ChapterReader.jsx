import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiBook, FiChevronLeft, FiChevronRight, FiBookmark, FiDownload, FiCheck, FiClock, FiTarget, FiEdit3, FiSave } = FiIcons

const ChapterReader = ({ productId, bookContent }) => {
  const { user } = useAuth()
  const [currentChapter, setCurrentChapter] = useState(0)
  const [bookmarks, setBookmarks] = useState([])
  const [readingProgress, setReadingProgress] = useState({})
  const [userNotes, setUserNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [completedChapters, setCompletedChapters] = useState(new Set())

  const chapters = bookContent?.chapters || []

  useEffect(() => {
    if (user && productId) {
      loadUserProgress()
      loadBookmarks()
    }
  }, [user, productId])

  const loadUserProgress = async () => {
    try {
      const { data } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

      if (data) {
        setReadingProgress(data)
        setCurrentChapter(data.current_chapter || 0)
        setCompletedChapters(new Set(data.completed_chapters_array || []))
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const updateProgress = async (chapterIndex, completed = false) => {
    try {
      const newCompletedChapters = new Set(completedChapters)
      if (completed) {
        newCompletedChapters.add(chapterIndex)
      }

      const progressData = {
        user_id: user.id,
        product_id: productId,
        current_chapter: chapterIndex,
        completed_sections: newCompletedChapters.size,
        total_sections: chapters.length,
        last_accessed: new Date().toISOString(),
        completed_chapters_array: Array.from(newCompletedChapters)
      }

      await supabase
        .from('reading_progress')
        .upsert(progressData)

      setReadingProgress(prev => ({ ...prev, ...progressData }))
      setCompletedChapters(newCompletedChapters)

      // Track reading activity
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          action: completed ? 'Chapter Completed' : 'Chapter Read',
          details: {
            product_id: productId,
            chapter: chapterIndex,
            chapter_title: chapters[chapterIndex]?.title
          }
        })
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const addBookmark = async (chapterIndex) => {
    try {
      const bookmark = {
        user_id: user.id,
        product_id: productId,
        chapter_index: chapterIndex,
        chapter_title: chapters[chapterIndex]?.title,
        note: userNotes
      }

      const { data } = await supabase
        .from('bookmarks')
        .insert(bookmark)
        .select()
        .single()

      setBookmarks(prev => [...prev, data])
      setUserNotes('')
      setShowNotes(false)
    } catch (error) {
      console.error('Error adding bookmark:', error)
    }
  }

  const loadBookmarks = async () => {
    try {
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)

      setBookmarks(data || [])
    } catch (error) {
      console.error('Error loading bookmarks:', error)
    }
  }

  const markChapterComplete = () => {
    updateProgress(currentChapter, true)
  }

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      const next = currentChapter + 1
      setCurrentChapter(next)
      updateProgress(next)
    }
  }

  const prevChapter = () => {
    if (currentChapter > 0) {
      const prev = currentChapter - 1
      setCurrentChapter(prev)
      updateProgress(prev)
    }
  }

  const downloadChapter = (chapterIndex) => {
    const chapter = chapters[chapterIndex]
    const blob = new Blob([chapter.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${chapter.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderInteractiveElement = (element, index) => {
    switch (element.type) {
      case 'checklist':
        return (
          <div key={index} className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
            <h4 className="font-semibold text-blue-900 mb-4">{element.title}</h4>
            <div className="space-y-2">
              {element.items.map((item, itemIndex) => (
                <label key={itemIndex} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                  <span className="text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'worksheet':
        return (
          <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-6 my-6">
            <h4 className="font-semibold text-green-900 mb-4">{element.title}</h4>
            <p className="text-gray-700 mb-4">{element.description}</p>
            {element.fields ? (
              <div className="space-y-3">
                {element.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field}
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={4}
                placeholder={element.placeholder}
              />
            )}
          </div>
        )

      case 'action_items':
        return (
          <div key={index} className="bg-purple-50 border border-purple-200 rounded-xl p-6 my-6">
            <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
              <SafeIcon icon={FiTarget} className="mr-2" />
              {element.title}
            </h4>
            <div className="space-y-2">
              {element.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'reflection':
        return (
          <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
            <h4 className="font-semibold text-yellow-900 mb-4">{element.title}</h4>
            <p className="text-gray-700 mb-4">{element.prompt}</p>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              rows={4}
              placeholder="Write your thoughts here..."
            />
          </div>
        )

      default:
        return null
    }
  }

  const currentChapterData = chapters[currentChapter]

  if (!currentChapterData) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiBook} className="text-4xl text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Content not available</p>
      </div>
    )
  }

  const completionPercentage = Math.round((completedChapters.size / chapters.length) * 100)

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{bookContent.title}</h1>
            <p className="text-blue-100">
              {currentChapterData.title}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="flex items-center space-x-1">
                <SafeIcon icon={FiClock} />
                <span>{currentChapterData.duration}</span>
              </span>
              <span>•</span>
              <span>Chapter {currentChapter + 1} of {chapters.length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => downloadChapter(currentChapter)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Download chapter"
            >
              <SafeIcon icon={FiDownload} />
            </button>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Add bookmark"
            >
              <SafeIcon icon={FiBookmark} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-blue-100 mb-2">
            <span>Overall Progress</span>
            <span>{completionPercentage}% Complete</span>
          </div>
          <div className="w-full bg-blue-800 rounded-full h-2">
            <motion.div
              className="bg-white h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Reading Area */}
      <div className="grid lg:grid-cols-4 gap-6 p-6">
        {/* Table of Contents */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentChapter(index)
                  updateProgress(index)
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  index === currentChapter
                    ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-500'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium line-clamp-2">{chapter.title}</span>
                  {completedChapters.has(index) && (
                    <SafeIcon icon={FiCheck} className="text-green-500 flex-shrink-0 ml-2" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{chapter.duration}</p>
              </button>
            ))}
          </div>

          {/* Bookmarks */}
          {bookmarks.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Your Bookmarks</h4>
              <div className="space-y-2">
                {bookmarks.slice(0, 3).map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm cursor-pointer hover:bg-yellow-100"
                    onClick={() => setCurrentChapter(bookmark.chapter_index)}
                  >
                    <p className="font-medium text-yellow-900">{bookmark.chapter_title}</p>
                    {bookmark.note && (
                      <p className="text-yellow-700 text-xs mt-1 line-clamp-2">{bookmark.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chapter Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg max-w-none"
          >
            <div className="text-gray-700 leading-relaxed">
              {/* Render content with proper formatting */}
              {currentChapterData.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>
                } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{paragraph.replace(/\*\*/g, '')}</h3>
                } else if (paragraph.trim()) {
                  return <p key={index} className="mb-4">{paragraph}</p>
                }
                return null
              })}
            </div>

            {/* Interactive Elements */}
            {currentChapterData.interactiveElements && (
              <div className="mt-8 space-y-6">
                {currentChapterData.interactiveElements.map((element, index) =>
                  renderInteractiveElement(element, index)
                )}
              </div>
            )}
          </motion.div>

          {/* Chapter Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevChapter}
              disabled={currentChapter === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <SafeIcon icon={FiChevronLeft} />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-3">
              {!completedChapters.has(currentChapter) && (
                <button
                  onClick={markChapterComplete}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <SafeIcon icon={FiCheck} />
                  <span>Mark Complete</span>
                </button>
              )}
              {completedChapters.has(currentChapter) && (
                <div className="flex items-center space-x-2 text-green-600">
                  <SafeIcon icon={FiCheck} />
                  <span className="font-medium">Completed</span>
                </div>
              )}
            </div>

            <button
              onClick={nextChapter}
              disabled={currentChapter === chapters.length - 1}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <SafeIcon icon={FiChevronRight} />
            </button>
          </div>
        </div>
      </div>

      {/* Notes Panel */}
      {showNotes && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="border-t border-gray-200 p-6 bg-gray-50"
        >
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <SafeIcon icon={FiEdit3} className="mr-2" />
            Add a Note for This Chapter
          </h4>
          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add your notes, thoughts, or key takeaways from this chapter..."
          />
          <div className="flex justify-end mt-3 space-x-2">
            <button
              onClick={() => setShowNotes(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => addBookmark(currentChapter)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiSave} />
              <span>Save Bookmark</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ChapterReader