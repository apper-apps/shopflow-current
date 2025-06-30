import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { getOrderById } from '@/services/api/orderService'

const ConfirmationPage = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError('')
      const orderData = await getOrderById(parseInt(orderId))
      setOrder(orderData)
    } catch (err) {
      setError('Failed to load order details')
      console.error('Order confirmation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadOrder} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckCircle" size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. We've received your order and will process it shortly.
          </p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Order Header */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-display font-semibold text-gray-900">
                  Order #{order.Id}
                </h2>
                <p className="text-sm text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <ApperIcon name="Clock" size={14} className="mr-1" />
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{order.shipping.firstName} {order.shipping.lastName}</p>
                  <p>{order.shipping.address}</p>
                  <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
                  <p>{order.shipping.country}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Credit Card</p>
                  <p>**** **** **** {order.payment.cardNumber.slice(-4)}</p>
                  <p>{order.payment.nameOnCard}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total Paid</span>
              <span className="text-2xl font-bold text-gray-900">{formatPrice(order.total)}</span>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
            What's Next?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Mail" size={16} className="text-primary-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Order Confirmation Email</p>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email to {order.shipping.email}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ApperIcon name="Package" size={16} className="text-primary-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Processing</p>
                <p className="text-sm text-gray-600">
                  Your order will be processed within 1-2 business days
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ApperIcon name="Truck" size={16} className="text-primary-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Shipping</p>
                <p className="text-sm text-gray-600">
                  You'll receive tracking information once your order ships
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/">
            <Button icon="Home" iconPosition="left" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Button 
            variant="outline" 
            icon="Download" 
            className="w-full sm:w-auto"
            onClick={() => window.print()}
          >
            Print Receipt
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default ConfirmationPage