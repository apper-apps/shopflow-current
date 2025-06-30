import { useState, useEffect } from 'react'
import { getCartItems, getCartCount } from '@/services/api/cartService'

export const useCart = () => {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCart()
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadCart()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const loadCart = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [items, count] = await Promise.all([
        getCartItems(),
        getCartCount()
      ])
      
      setCartItems(items)
      setCartCount(count)
    } catch (err) {
      setError('Failed to load cart')
      console.error('Cart hook error:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshCart = () => {
    loadCart()
  }

  return {
    cartItems,
    cartCount,
    loading,
    error,
    refreshCart
  }
}