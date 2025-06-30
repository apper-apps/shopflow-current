import React from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/molecules/ProductCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  error = null, 
  onRetry,
  className = '' 
}) => {
  if (loading) {
    return <Loading type="products" count={8} />
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry}
        showRetry={!!onRetry}
      />
    )
  }

  if (!products.length) {
    return <Empty type="products" />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {products.map((product, index) => (
        <ProductCard 
          key={product.Id} 
          product={product} 
          index={index}
        />
      ))}
    </motion.div>
  )
}

export default ProductGrid