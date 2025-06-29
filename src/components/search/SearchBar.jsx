import React,{useState,useEffect} from 'react'
import {motion,AnimatePresence} from 'framer-motion'
import {useNavigate} from 'react-router-dom'
import {PRODUCTS} from '../../lib/stripe'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const {FiSearch,FiX}=FiIcons

const SearchBar=({className=''})=> {
  const [query,setQuery]=useState('')
  const [results,setResults]=useState([])
  const [showResults,setShowResults]=useState(false)
  const [isFocused,setIsFocused]=useState(false)
  const navigate=useNavigate()

  useEffect(()=> {
    if (query.trim().length > 0) {
      const filtered=Object.values(PRODUCTS).filter(product=>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  },[query])

  const handleProductClick=(productId)=> {
    const routes={
      'ai-job-search': '/ai-job-search',
      'ai-entrepreneur': '/ai-entrepreneur',
      'financial-freedom': '/financial-freedom',
      'complete-collection': '/complete-collection'
    }
    navigate(routes[productId] || '/')
    setQuery('')
    setShowResults(false)
    setIsFocused(false)
  }

  const clearSearch=()=> {
    setQuery('')
    setShowResults(false)
    setIsFocused(false)
  }

  const handleBlur = (e) => {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      if (!e.currentTarget.contains(document.activeElement)) {
        setIsFocused(false)
        setShowResults(false)
      }
    }, 150)
  }

  return (
    <div className={`relative ${className}`} onBlur={handleBlur}>
      <div className="relative">
        <SafeIcon 
          icon={FiSearch} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
          >
            <SafeIcon icon={FiX} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && isFocused && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                        <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                      </div>
                      <span className="text-lg font-bold text-blue-600 ml-4 flex-shrink-0">${product.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.trim().length > 0 ? (
              <div className="p-4 text-center text-gray-500">
                No products found for "{query}"
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar