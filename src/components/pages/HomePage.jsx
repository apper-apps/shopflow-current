import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGrid from '@/components/organisms/ProductGrid'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { getFeaturedProducts, getCategories } from '@/services/api/productService'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [productsData, categoriesData] = await Promise.all([
        getFeaturedProducts(),
        getCategories()
      ])
      
      setFeaturedProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      setError('Failed to load homepage data')
      console.error('Homepage data error:', err)
    } finally {
      setLoading(false)
    }
  }

  const categoryIcons = {
    'electronics': 'Smartphone',
    'clothing': 'Shirt',
    'home-garden': 'Home',
    'sports': 'Dumbbell',
    'books': 'Book',
    'beauty': 'Sparkles'
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-bold mb-6"
            >
              Shop Everything You Love
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
            >
              Discover millions of products at unbeatable prices. Fast, secure shipping and hassle-free returns.
            </motion.p>
<motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/category/all">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-50 shadow-lg"
                  icon="ArrowRight"
                  iconPosition="right"
                >
                  Start Shopping
                </Button>
              </Link>
              <Link to="/category/deals">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-600"
                  icon="Gift"
                >
                  View Deals
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're looking for
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300">
                    <ApperIcon 
                      name={categoryIcons[category.toLowerCase().replace(/\s+/g, '-')] || 'Package'} 
                      size={24} 
                      className="text-primary-600 group-hover:text-white transition-colors duration-300" 
                    />
                  </div>
                  <h3 className="font-display font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {category}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Hand-picked products that are trending right now
            </p>
          </div>
          <Link to="/category/all">
            <Button variant="outline" icon="ArrowRight" iconPosition="right">
              View All
            </Button>
          </Link>
        </motion.div>

        <ProductGrid
          products={featuredProducts}
          loading={loading}
          error={error}
          onRetry={loadData}
        />
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'Truck',
                title: 'Free Shipping',
                description: 'Free delivery on orders over $50. Fast and reliable shipping worldwide.'
              },
              {
                icon: 'Shield',
                title: 'Secure Payment',
                description: 'Your payment information is safe with our advanced security measures.'
              },
              {
                icon: 'RotateCcw',
                title: 'Easy Returns',
                description: 'Not satisfied? Return your items within 30 days for a full refund.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name={feature.icon} size={24} className="text-primary-600" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage