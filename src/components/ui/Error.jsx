import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true,
  icon = "AlertTriangle"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-full mb-6">
        <ApperIcon 
          name={icon} 
          size={48} 
          className="text-red-500"
        />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2 text-center">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="btn-primary text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2 shadow-lg"
        >
          <ApperIcon name="RefreshCw" size={18} />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error