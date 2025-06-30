import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ placeholder = "Search products...", className = '' }) => {
  const [query, setQuery] = useState('')
  const [isActive, setIsActive] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <motion.div
        animate={{ 
          scale: isActive ? 1.02 : 1,
          boxShadow: isActive ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
        className="relative"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-all duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <ApperIcon name="Search" size={20} className="text-gray-400" />
        </div>
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        )}
      </motion.div>
    </form>
  )
}

export default SearchBar