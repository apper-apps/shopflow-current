import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import ApperIcon from '@/components/ApperIcon'
import { getCartItems } from '@/services/api/cartService'

const Header = () => {
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const items = await getCartItems()
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
        setCartItemCount(totalCount)
      } catch (error) {
        console.error('Failed to load cart count:', error)
      }
    }

    loadCartCount()
    
    // Listen for cart updates
    const handleStorageChange = () => {
      loadCartCount()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty'
  ]

  return (
    <motion.header
      animate={{
        boxShadow: isScrolled 
          ? '0 4px 20px -2px rgba(0, 0, 0, 0.1)' 
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}
      className="sticky top-0 z-50 bg-white border-b border-gray-100"
    >
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-secondary-800 to-secondary-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span>24/7 Customer Support</span>
              <span>•</span>
              <span>Track Your Order</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
              <ApperIcon name="ShoppingBag" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-700 bg-clip-text text-transparent">
              ShopFlow
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <SearchBar placeholder="Search thousands of products..." />
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Home
              </Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1">
                  <span>Categories</span>
                  <ApperIcon name="ChevronDown" size={16} />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
              <Link 
                to="/deals" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Deals
              </Link>
            </nav>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ApperIcon name="ShoppingCart" size={24} />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center cart-badge"
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </motion.span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 mr-2"
            >
              <ApperIcon name="ShoppingCart" size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700"
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <SearchBar placeholder="Search products..." />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
              <Link 
                to="/" 
                className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <div className="space-y-2">
                <div className="text-gray-700 font-medium py-2">Categories</div>
                <div className="pl-4 space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block text-sm text-gray-600 hover:text-primary-600 py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
              <Link 
                to="/deals" 
                className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header