// Database and API types for the store

export interface Product {
  id: string
  title: string
  handle: string
  description: string
  story: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  subcategory?: string
  tags: string[]
  sku: string
  inStock: boolean
  inventory: number
  sizes: string[]
  colors: ProductColor[]
  features: string[]
  designer: string
  designerQuote: string
  sustainabilityInfo: string
  editorial: {
    title: string
    content: string
    image: string
  }
  createdAt: string
  updatedAt: string
}

export interface ProductColor {
  name: string
  value: string
  border?: boolean
}

export interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  image: string
  quantity: number
  size: string
  color: string
  sku: string
}

export interface Cart {
  id: string
  lines: CartItem[]
  totalQuantity: number
  subtotal: number
  tax: number
  shipping: number
  total: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role?: string
  addresses: Address[]
  orders: string[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  zip: string
  phone?: string
  isDefault: boolean
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  email: string
  items: CartItem[]
  shippingAddress: Address
  billingAddress: Address
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingMethod: string
  trackingNumber?: string
  transactionId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Collection {
  id: string
  title: string
  handle: string
  description: string
  image: string
  products: string[]
  createdAt: string
  updatedAt: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: string | string[]
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Request types
export interface CreateProductRequest {
  title: string
  description: string
  story: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  subcategory?: string
  tags: string[]
  inventory: number
  sizes: string[]
  colors: ProductColor[]
  features: string[]
  designer: string
  designerQuote: string
  sustainabilityInfo: string
  editorial: {
    title: string
    content: string
    image: string
  }
}

export interface UpdateCartRequest {
  productId: string
  quantity: number
  size: string
  color: string
}

export interface CreateOrderRequest {
  items: CartItem[]
  shippingAddress: Address
  billingAddress: Address
  shippingMethod: string
  email: string
  notes?: string
}

export interface AuthRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
}