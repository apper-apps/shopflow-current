import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import StarRating from '@/components/atoms/StarRating'
import ApperIcon from '@/components/ApperIcon'
import { addToCart } from '@/services/api/cartService'

const ProductCard = ({ product, index = 0 }) => {
  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await addToCart(product.Id, 1)
      toast.success(`${product.title} added to cart!`, {
        icon: '🛒'
      })
    } catch (error) {
      toast.error('Failed to add item to cart')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="product-card bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group"
    >
      <Link to={`/product/${product.Id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
          {product.discount && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{product.discount}%
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500 capitalize mt-1">
              {product.category}
            </p>
          </div>
          
          <StarRating 
            rating={product.rating} 
            size={14}
            showNumber={false}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Star" size={14} className="text-accent-500 fill-current mr-1" />
              <span>{product.rating}</span>
              <span className="mx-1">•</span>
              <span>{product.reviewCount}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full"
          icon="ShoppingCart"
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </motion.div>
  )
}

export default ProductCard