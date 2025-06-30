import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { updateCartItem, removeFromCart } from '@/services/api/cartService'

const CartItem = ({ item }) => {
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return
    
    try {
      await updateCartItem(item.productId, newQuantity)
      toast.success('Cart updated')
    } catch (error) {
      toast.error('Failed to update cart')
    }
  }

  const handleRemove = async () => {
    try {
      await removeFromCart(item.productId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <Link to={`/product/${item.productId}`} className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-lg hover:scale-105 transition-transform"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link 
            to={`/product/${item.productId}`}
            className="block hover:text-primary-600 transition-colors"
          >
            <h3 className="font-display font-semibold text-gray-900 truncate">
              {item.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 capitalize mt-1">
            {item.category}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ApperIcon name="Minus" size={16} className="text-gray-600" />
              </button>
              <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="Plus" size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </div>
              <div className="text-sm text-gray-500">
                {formatPrice(item.price)} each
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            icon="Trash2"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default CartItem