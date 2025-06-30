import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const StarRating = ({ rating = 0, maxRating = 5, size = 16, showNumber = true, className = '' }) => {
  const stars = []
  
  for (let i = 1; i <= maxRating; i++) {
    if (i <= rating) {
      stars.push(
        <ApperIcon
          key={i}
          name="Star"
          size={size}
          className="text-accent-500 fill-current"
        />
      )
    } else if (i - 0.5 <= rating) {
      stars.push(
        <div key={i} className="relative inline-block">
          <ApperIcon
            name="Star"
            size={size}
            className="text-gray-300"
          />
          <div className="absolute inset-0 w-1/2 overflow-hidden">
            <ApperIcon
              name="Star"
              size={size}
              className="text-accent-500 fill-current"
            />
          </div>
        </div>
      )
    } else {
      stars.push(
        <ApperIcon
          key={i}
          name="Star"
          size={size}
          className="text-gray-300"
        />
      )
    }
  }
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {stars}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default StarRating