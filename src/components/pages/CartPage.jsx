import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import CartItem from '@/components/molecules/CartItem'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { getCartItems, clearCart } from '@/services/api/cartService'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setLoading(true)
      setError('')
      const items = await getCartItems()
      setCartItems(items)
    } catch (err) {
      setError('Failed to load cart items')
      console.error('Cart error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart()
        setCartItems([])
      } catch (error) {
        setError('Failed to clear cart')
      }
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateTax = (subtotal) => {
    return subtotal * 0.08 // 8% tax
  }

  const calculateShipping = (subtotal) => {
    return subtotal >= 50 ? 0 : 9.99
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading type="cart" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadCart} />
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Empty type="cart" />
        </div>
      </div>
    )
  }

  const subtotal = calculateSubtotal()
  const tax = calculateTax(subtotal)
  const shipping = calculateShipping(subtotal)
  const total = subtotal + tax + shipping

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Items
              </h2>
              {cartItems.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={handleClearCart}
                  icon="Trash2"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-8"
            >
              <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                    <ApperIcon name="Info" size={16} className="inline mr-1" />
                    Add {formatPrice(50 - subtotal)} more for free shipping
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full"
                  size="lg"
                  icon="CreditCard"
                >
                  Proceed to Checkout
                </Button>
                
                <Link to="/">
                  <Button
                    variant="outline"
                    className="w-full"
                    icon="ArrowLeft"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Icons */}
              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Shield" size={16} />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Lock" size={16} />
                  <span>Encrypted</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage