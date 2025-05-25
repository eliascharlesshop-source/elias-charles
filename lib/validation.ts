import { z } from 'zod'

// Product validation schemas
export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  inventory: z.number().int().min(0, 'Inventory must be non-negative'),
  inStock: z.boolean().optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  salePrice: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive()
  }).optional()
})

export const updateProductSchema = createProductSchema.partial()

// User validation schemas
export const registerUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long')
})

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  role: z.enum(['customer', 'admin']).optional()
})

// Cart validation schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  size: z.string().optional(),
  color: z.string().optional()
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity must be non-negative')
})

// Order validation schemas
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive('Quantity must be positive'),
    size: z.string().optional(),
    color: z.string().optional()
  })).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    address1: z.string().min(1, 'Address is required'),
    address2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().optional()
  }),
  billingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    address1: z.string().min(1, 'Address is required'),
    address2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().optional()
  }).optional(),
  paymentMethod: z.object({
    type: z.enum(['card', 'paypal', 'stripe']),
    token: z.string().min(1, 'Payment token is required')
  })
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string().optional(),
  notes: z.string().optional()
})

// Collection validation schemas
export const createCollectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().optional(),
  handle: z.string().min(1, 'Handle is required').regex(/^[a-z0-9-]+$/, 'Handle must contain only lowercase letters, numbers, and hyphens'),
  image: z.string().url('Invalid image URL').optional(),
  featured: z.boolean().optional(),
  productIds: z.array(z.string()).optional()
})

export const updateCollectionSchema = createCollectionSchema.partial()

// Inventory validation schemas
export const updateInventorySchema = z.object({
  updates: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    inventory: z.number().int().min(0, 'Inventory must be non-negative'),
    inStock: z.boolean().optional()
  })).min(1, 'At least one update is required')
})

// Validation helper function
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return { success: false, errors }
    }
    return { success: false, errors: ['Validation failed'] }
  }
}

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  sku: /^[A-Z0-9\-_]+$/i,
  handle: /^[a-z0-9-]+$/
}

// Sanitization helpers
export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '')
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function sanitizeHandle(handle: string): string {
  return handle.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}