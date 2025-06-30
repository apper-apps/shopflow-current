import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  type = "products",
  title,
  message,
  actionText,
  actionLink,
  onAction,
  icon
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'cart':
        return {
          icon: 'ShoppingCart',
          title: 'Your cart is empty',
          message: 'Looks like you haven\'t added anything to your cart yet. Start shopping to find great deals!',
          actionText: 'Start Shopping',
          actionLink: '/'
        }
      case 'search':
        return {
          icon: 'Search',
          title: 'No results found',
          message: 'We couldn\'t find any products matching your search. Try different keywords or browse our categories.',
          actionText: 'Browse Categories',
          actionLink: '/'
        }
      case 'products':
      default:
        return {
          icon: 'Package',
          title: 'No products available',
          message: 'There are no products in this category right now. Check back later for new arrivals!',
          actionText: 'Browse All Products',
          actionLink: '/'
        }
    }
  }

  const defaultContent = getDefaultContent()
  const finalIcon = icon || defaultContent.icon
  const finalTitle = title || defaultContent.title
  const finalMessage = message || defaultContent.message
  const finalActionText = actionText || defaultContent.actionText
  const finalActionLink = actionLink || defaultContent.actionLink

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-full mb-8">
        <ApperIcon 
          name={finalIcon} 
          size={64} 
          className="text-gray-400"
        />
      </div>
      
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
        {finalTitle}
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {finalMessage}
      </p>
      
      {onAction ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="btn-primary text-white px-8 py-3 rounded-lg font-medium inline-flex items-center space-x-2 shadow-lg"
        >
          <span>{finalActionText}</span>
          <ApperIcon name="ArrowRight" size={18} />
        </motion.button>
      ) : (
        <Link to={finalActionLink}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-white px-8 py-3 rounded-lg font-medium inline-flex items-center space-x-2 shadow-lg"
          >
            <span>{finalActionText}</span>
            <ApperIcon name="ArrowRight" size={18} />
          </motion.button>
        </Link>
      )}
    </motion.div>
  )
}

export default Empty