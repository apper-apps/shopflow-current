import mockOrders from '@/services/mockData/orders.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Storage key for orders data
const ORDERS_STORAGE_KEY = 'shopflow_orders'

// Get orders from localStorage
const getOrdersFromStorage = () => {
  try {
    const orders = localStorage.getItem(ORDERS_STORAGE_KEY)
    return orders ? JSON.parse(orders) : [...mockOrders]
  } catch (error) {
    console.error('Error reading orders from storage:', error)
    return [...mockOrders]
  }
}

// Save orders to localStorage
const saveOrdersToStorage = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  } catch (error) {
    console.error('Error saving orders to storage:', error)
  }
}

export const createOrder = async (orderData) => {
  await delay(500) // Longer delay to simulate payment processing
  
  const orders = getOrdersFromStorage()
  const newOrder = {
    Id: Math.max(...orders.map(o => o.Id), 0) + 1,
    ...orderData,
    status: 'Processing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  orders.push(newOrder)
  saveOrdersToStorage(orders)
  
  // Clear cart after successful order
  localStorage.removeItem('shopflow_cart')
  window.dispatchEvent(new Event('storage'))
  
  return { ...newOrder }
}

export const getOrderById = async (id) => {
  await delay(200)
  
  const orders = getOrdersFromStorage()
  const order = orders.find(o => o.Id === id)
  
  if (!order) {
    throw new Error('Order not found')
  }
  
  return { ...order }
}

export const getAllOrders = async () => {
  await delay(300)
  
  const orders = getOrdersFromStorage()
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export const updateOrderStatus = async (id, status) => {
  await delay(200)
  
  const orders = getOrdersFromStorage()
  const orderIndex = orders.findIndex(o => o.Id === id)
  
  if (orderIndex >= 0) {
    orders[orderIndex].status = status
    orders[orderIndex].updatedAt = new Date().toISOString()
    saveOrdersToStorage(orders)
    return { ...orders[orderIndex] }
  }
  
  throw new Error('Order not found')
}