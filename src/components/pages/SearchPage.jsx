import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGrid from '@/components/organisms/ProductGrid'
import FilterSidebar from '@/components/molecules/FilterSidebar'
import ApperIcon from '@/components/ApperIcon'
import { searchProducts, getCategories } from '@/services/api/productService'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    minRating: 0,
    inStock: false
  })

  useEffect(() => {
    if (query) {
      loadSearchResults()
    }
  }, [query])

  useEffect(() => {
    applyFiltersAndSort()
  }, [products, filters, sortBy])

  const loadSearchResults = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [productsData, categoriesData] = await Promise.all([
        searchProducts(query),
        getCategories()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      setError('Failed to search products')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...products]

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      )
    }

    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange.min && 
        product.price <= filters.priceRange.max
      )
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.minRating)
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      default:
        // Relevance - no sorting needed
        break
    }

    setFilteredProducts(filtered)
  }

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Search Results
            </h1>
            <p className="text-gray-600">
              {query && (
                <>
                  Showing results for "<span className="font-medium">{query}</span>" - 
                </>
              )}
              {loading ? ' Loading...' : ` ${filteredProducts.length} products found`}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              categories={categories}
              className="sticky top-24"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <ApperIcon name="Filter" size={20} />
                  <span>Filters</span>
                </button>

                <div className="hidden sm:block text-sm text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-6"
              >
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  categories={categories}
                />
              </motion.div>
            )}

            {/* Search Results */}
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={loadSearchResults}
            />

            {/* No Results for Search */}
            {!loading && !error && products.length === 0 && query && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name="Search" size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching "{query}". Try different keywords or browse our categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setFilters({
                      categories: [],
                      priceRange: { min: 0, max: 1000 },
                      minRating: 0,
                      inStock: false
                    })}
                    className="btn-outline text-primary-600 border-primary-600 hover:bg-primary-600 hover:text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage