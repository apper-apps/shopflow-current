import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import StarRating from '@/components/atoms/StarRating'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getProductById, getRelatedProducts } from '@/services/api/productService'
import { addToCart } from '@/services/api/cartService'
import ProductGrid from '@/components/organisms/ProductGrid'

const ProductDetailPage = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError('')
      
      const productData = await getProductById(parseInt(productId))
      setProduct(productData)
      setSelectedImage(0)
      
      // Load related products
      if (productData.category) {
        const related = await getRelatedProducts(productData.category, productData.Id)
        setRelatedProducts(related.slice(0, 4))
      }
    } catch (err) {
      setError('Failed to load product details')
      console.error('Product detail error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      await addToCart(product.Id, quantity)
      toast.success(`${product.title} added to cart!`, {
        icon: '🛒'
      })
    } catch (error) {
      toast.error('Failed to add item to cart')
    } finally {
      setAddingToCart(false)
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading type="product-detail" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadProduct} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-600">
              Home
            </Link>
            <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            <Link 
              to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-gray-500 hover:text-primary-600 capitalize"
            >
              {product.category}
            </Link>
            <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            <span className="text-gray-900 truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImage === index 
                        ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-gray-600 capitalize">
                {product.category}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <StarRating rating={product.rating} size={20} />
              <span className="text-sm text-gray-600">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.specifications && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Specifications</h3>
                <dl className="grid grid-cols-1 gap-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <dt className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                      <dd className="font-medium text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ApperIcon name="Minus" size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || addingToCart}
                loading={addingToCart}
                className="flex-1"
                size="lg"
                icon="ShoppingCart"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon="Heart"
                className="px-4"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="flex flex-col items-center space-y-2">
                <ApperIcon name="Truck" size={20} className="text-primary-600" />
                <span className="text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <ApperIcon name="RotateCcw" size={20} className="text-primary-600" />
                <span className="text-gray-600">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <ApperIcon name="Shield" size={20} className="text-primary-600" />
                <span className="text-gray-600">Secure Payment</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-gray-900">
                You might also like
              </h2>
              <Link 
                to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
              >
                <span>View all in {product.category}</span>
                <ApperIcon name="ArrowRight" size={16} />
              </Link>
            </div>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage