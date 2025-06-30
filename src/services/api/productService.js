import mockProducts from '@/services/mockData/products.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getAllProducts = async () => {
  await delay(300)
  return [...mockProducts]
}

export const getProductById = async (id) => {
  await delay(200)
  const product = mockProducts.find(p => p.Id === id)
  if (!product) {
    throw new Error('Product not found')
  }
  return { ...product }
}

export const getProductsByCategory = async (category) => {
  await delay(400)
  if (category === 'all') {
    return [...mockProducts]
  }
  
  const normalizedCategory = category.toLowerCase().replace(/-/g, ' ')
  return mockProducts.filter(p => 
    p.category.toLowerCase() === normalizedCategory
  )
}

export const getFeaturedProducts = async () => {
  await delay(350)
  return mockProducts
    .filter(p => p.featured || p.rating >= 4.5)
    .slice(0, 8)
}

export const getRelatedProducts = async (category, excludeId) => {
  await delay(250)
  return mockProducts
    .filter(p => p.category.toLowerCase() === category.toLowerCase() && p.Id !== excludeId)
    .slice(0, 4)
}

export const searchProducts = async (query) => {
  await delay(300)
  const searchTerm = query.toLowerCase()
  return mockProducts.filter(p =>
    p.title.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm)
  )
}

export const getCategories = async () => {
  await delay(200)
  const categories = [...new Set(mockProducts.map(p => p.category))]
  return categories.sort()
}