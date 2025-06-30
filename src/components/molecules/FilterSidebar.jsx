import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  categories = [],
  priceRange = { min: 0, max: 1000 },
  className = ''
}) => {
  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    onFilterChange({ ...filters, categories: newCategories })
  }

  const handlePriceChange = (type, value) => {
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: Number(value)
      }
    })
  }

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating
    })
  }

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      priceRange: { min: 0, max: 1000 },
      minRating: 0,
      inStock: false
    })
  }

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 1000 ||
    filters.minRating > 0 ||
    filters.inStock

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg text-gray-900">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Price Range</h4>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Min</label>
              <input
                type="number"
                value={filters.priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                min="0"
                max={filters.priceRange.max}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Max</label>
              <input
                type="number"
                value={filters.priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                min={filters.priceRange.min}
                max="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            ${filters.priceRange.min} - ${filters.priceRange.max}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <ApperIcon
                    key={i}
                    name="Star"
                    size={14}
                    className={i < rating ? 'text-accent-500 fill-current' : 'text-gray-300'}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            In Stock Only
          </span>
        </label>
      </div>
    </motion.div>
  )
}

export default FilterSidebar