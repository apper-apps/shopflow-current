import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getCartItems } from '@/services/api/cartService'
import { createOrder } from '@/services/api/orderService'

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  })

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setLoading(true)
      setError('')
      const items = await getCartItems()
      
      if (items.length === 0) {
        navigate('/cart')
        return
      }
      
      setCartItems(items)
    } catch (err) {
      setError('Failed to load cart items')
      console.error('Checkout cart error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleShippingChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }))
  }

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode']
    return required.every(field => shippingInfo[field].trim() !== '')
  }

  const validatePayment = () => {
    const required = ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard']
    return required.every(field => paymentInfo[field].trim() !== '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateShipping() || !validatePayment()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      
      const orderData = {
        items: cartItems,
        shipping: shippingInfo,
        payment: {
          ...paymentInfo,
          // Mask card number for security
          cardNumber: paymentInfo.cardNumber.replace(/\d(?=\d{4})/g, '*')
        },
        total: calculateTotal()
      }
      
      const order = await createOrder(orderData)
      toast.success('Order placed successfully!')
      navigate(`/confirmation/${order.Id}`)
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
      console.error('Order submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateTax = (subtotal) => {
    return subtotal * 0.08
  }

  const calculateShipping = (subtotal) => {
    return subtotal >= 50 ? 0 : 9.99
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    return subtotal + calculateTax(subtotal) + calculateShipping(subtotal)
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadCart} />
        </div>
      </div>
    )
  }

  const steps = [
    { number: 1, title: 'Shipping', icon: 'Truck' },
    { number: 2, title: 'Payment', icon: 'CreditCard' },
    { number: 3, title: 'Review', icon: 'CheckCircle' }
  ]

  const subtotal = calculateSubtotal()
  const tax = calculateTax(subtotal)
  const shipping = calculateShipping(subtotal)
  const total = subtotal + tax + shipping

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">
            Complete your order in just a few steps
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? (
                    <ApperIcon name="Check" size={20} />
                  ) : (
                    <ApperIcon name={step.icon} size={20} />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-primary-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              {currentStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                >
                  <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
                    Shipping Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleShippingChange('firstName', e.target.value)}
                      required
                    />
                    <Input
                      label="Last Name"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleShippingChange('lastName', e.target.value)}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      required
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Address"
                        value={shippingInfo.address}
                        onChange={(e) => handleShippingChange('address', e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      label="City"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      required
                    />
                    <Input
                      label="State"
                      value={shippingInfo.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      required
                    />
                  </div>

                  {currentStep === 1 && (
                    <div className="mt-6">
                      <Button
                        type="button"
                        onClick={() => validateShipping() && setCurrentStep(2)}
                        disabled={!validateShipping()}
                        icon="ArrowRight"
                        iconPosition="right"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Payment Information */}
              {currentStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                >
                  <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
                    Payment Information
                  </h2>
                  
                  <div className="space-y-4">
                    <Input
                      label="Card Number"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                      <Input
                        label="CVV"
                        value={paymentInfo.cvv}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                    <Input
                      label="Name on Card"
                      value={paymentInfo.nameOnCard}
                      onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                      required
                    />
                  </div>

                  {currentStep === 2 && (
                    <div className="mt-6 flex space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        icon="ArrowLeft"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => validatePayment() && setCurrentStep(3)}
                        disabled={!validatePayment()}
                        icon="ArrowRight"
                        iconPosition="right"
                      >
                        Review Order
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Order Review */}
              {currentStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                >
                  <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
                    Review Your Order
                  </h2>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex items-center space-x-4 py-2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      icon="ArrowLeft"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      loading={submitting}
                      disabled={submitting}
                      icon="CreditCard"
                      className="flex-1"
                    >
                      Place Order
                    </Button>
                  </div>
                </motion.div>
              )}
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
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Shield" size={16} />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Lock" size={16} />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="RotateCcw" size={16} />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage