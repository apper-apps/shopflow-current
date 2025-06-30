import mockProducts from '@/services/mockData/products.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Storage key for cart data
const CART_STORAGE_KEY = 'shopflow_cart'

// Get cart from localStorage
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY)
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error('Error reading cart from storage:', error)
    return []
  }
}

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'))
  } catch (error) {
    console.error('Error saving cart to storage:', error)
  }
}

export const getCartItems = async () => {
  await delay(200)
  const cart = getCartFromStorage()
  
  // Enrich cart items with product data
  const enrichedCart = cart.map(cartItem => {
    const product = mockProducts.find(p => p.Id === cartItem.productId)
    if (!product) return null
    
    return {
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: product.price,
      title: product.title,
      category: product.category,
      image: product.images[0]
    }
  }).filter(Boolean)
  
  return enrichedCart
}

export const addToCart = async (productId, quantity = 1) => {
  await delay(200)
  
  const product = mockProducts.find(p => p.Id === productId)
  if (!product) {
    throw new Error('Product not found')
  }
  
  const cart = getCartFromStorage()
  const existingItemIndex = cart.findIndex(item => item.productId === productId)
  
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }
  
  saveCartToStorage(cart)
  return { success: true }
}

export const updateCartItem = async (productId, quantity) => {
  await delay(200)
  
  const cart = getCartFromStorage()
  const itemIndex = cart.findIndex(item => item.productId === productId)
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1)
    } else {
      cart[itemIndex].quantity = quantity
    }
    saveCartToStorage(cart)
  }
  
  return { success: true }
}

export const removeFromCart = async (productId) => {
  await delay(200)
  
  const cart = getCartFromStorage()
  const filteredCart = cart.filter(item => item.productId !== productId)
  
  saveCartToStorage(filteredCart)
  return { success: true }
}

export const clearCart = async () => {
  await delay(200)
  
  saveCartToStorage([])
  return { success: true }
}

export const getCartCount = async () => {
  await delay(100)
  
  const cart = getCartFromStorage()
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}