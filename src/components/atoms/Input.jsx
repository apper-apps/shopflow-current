import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label, 
  error, 
  icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'}
    ${icon && iconPosition === 'left' ? 'pl-11' : ''}
    ${icon && iconPosition === 'right' ? 'pr-11' : ''}
    ${className}
  `
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <ApperIcon 
            name={icon} 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        )}
        <input className={inputClasses} {...props} />
        {icon && iconPosition === 'right' && (
          <ApperIcon 
            name={icon} 
            size={20} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        )}
      </div>
      {error && (
        <p className="text-red-600 text-sm flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={16} />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input