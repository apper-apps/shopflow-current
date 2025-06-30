import React from 'react'
import { motion } from 'framer-motion'

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
    <div className="shimmer-effect h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="shimmer-effect h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"></div>
      <div className="shimmer-effect h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4"></div>
      <div className="flex justify-between items-center">
        <div className="shimmer-effect h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20"></div>
        <div className="shimmer-effect h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-16"></div>
      </div>
      <div className="shimmer-effect h-9 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"></div>
    </div>
  </div>
)

const Loading = ({ type = 'products', count = 8 }) => {
  const renderProductGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <ProductCardSkeleton />
        </motion.div>
      ))}
    </div>
  )

  const renderProductDetail = () => (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="shimmer-effect aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shimmer-effect aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="shimmer-effect h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"></div>
          <div className="shimmer-effect h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4"></div>
          <div className="shimmer-effect h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2"></div>
        </div>
        <div className="shimmer-effect h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"></div>
        <div className="shimmer-effect h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"></div>
      </div>
    </div>
  )

  const renderCart = () => (
    <div className="max-w-4xl mx-auto space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-4">
            <div className="shimmer-effect w-20 h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="shimmer-effect h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"></div>
              <div className="shimmer-effect h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2"></div>
            </div>
            <div className="shimmer-effect h-8 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="animate-pulse">
      {type === 'products' && renderProductGrid()}
      {type === 'product-detail' && renderProductDetail()}
      {type === 'cart' && renderCart()}
    </div>
  )
}

export default Loading