// API utility functions for making requests to the backend

import { ApiResponse, PaginatedResponse, Product, Cart, Order, Collection, User } from './types'

const API_BASE = '/api'

// Generic API request function
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const response = await fetch(url, { ...defaultOptions, ...options })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(errorData.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Product API
export const productApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    category?: string
    tag?: string
    search?: string
  }): Promise<PaginatedResponse<Product>> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.category) searchParams.set('category', params.category)
    if (params?.tag) searchParams.set('tag', params.tag)
    if (params?.search) searchParams.set('search', params.search)

    const query = searchParams.toString()
    const response = await apiRequest<Product[]>(`/products${query ? `?${query}` : ''}`)
    
    // Convert ApiResponse to PaginatedResponse format
    return {
      ...response,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: response.data?.length || 0,
        totalPages: Math.ceil((response.data?.length || 0) / (params?.limit || 10))
      }
    }
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return apiRequest(`/products/${id}`)
  },

  create: async (product: any): Promise<ApiResponse<Product>> => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
  },

  update: async (id: string, updates: any): Promise<ApiResponse<Product>> => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    })
  },
}

// Cart API
export const cartApi = {
  get: async (cartId?: string): Promise<ApiResponse<Cart>> => {
    const query = cartId ? `?cartId=${cartId}` : ''
    return apiRequest(`/cart${query}`)
  },

  addItem: async (params: {
    cartId?: string
    productId: string
    quantity: number
    size: string
    color: string
  }): Promise<ApiResponse<Cart>> => {
    return apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  updateItem: async (params: {
    cartId: string
    itemId: string
    quantity: number
  }): Promise<ApiResponse<Cart>> => {
    return apiRequest('/cart', {
      method: 'PUT',
      body: JSON.stringify(params),
    })
  },
}

// Order API
export const orderApi = {
  getAll: async (params?: {
    email?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Order>> => {
    const searchParams = new URLSearchParams()
    if (params?.email) searchParams.set('email', params.email)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const query = searchParams.toString()
    const response = await apiRequest<Order[]>(`/orders${query ? `?${query}` : ''}`)
    
    // Convert ApiResponse to PaginatedResponse format
    return {
      ...response,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: response.data?.length || 0,
        totalPages: Math.ceil((response.data?.length || 0) / (params?.limit || 10))
      }
    }
  },

  getById: async (id: string): Promise<ApiResponse<Order>> => {
    return apiRequest(`/orders/${id}`)
  },

  create: async (order: any): Promise<ApiResponse<Order>> => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    })
  },

  update: async (id: string, updates: any): Promise<ApiResponse<Order>> => {
    return apiRequest(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },
}

// Collection API
export const collectionApi = {
  getAll: async (includeProducts = false): Promise<ApiResponse<Collection[]>> => {
    const query = includeProducts ? '?includeProducts=true' : ''
    return apiRequest(`/collections${query}`)
  },

  getByHandle: async (handle: string, includeProducts = false): Promise<ApiResponse<Collection>> => {
    const query = includeProducts ? '?includeProducts=true' : ''
    return apiRequest(`/collections/${handle}${query}`)
  },

  create: async (collection: any): Promise<ApiResponse<Collection>> => {
    return apiRequest('/collections', {
      method: 'POST',
      body: JSON.stringify(collection),
    })
  },

  update: async (handle: string, updates: any): Promise<ApiResponse<Collection>> => {
    return apiRequest(`/collections/${handle}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },

  delete: async (handle: string): Promise<ApiResponse> => {
    return apiRequest(`/collections/${handle}`, {
      method: 'DELETE',
    })
  },
}

// Auth API
export const authApi = {
  register: async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<ApiResponse<User>> => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  login: async (credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<User>> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },
}

// Error handling utility
export function handleApiError(error: any): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}