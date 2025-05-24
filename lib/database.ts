// Simple file-based database for development
// In production, this would be replaced with a proper database like PostgreSQL

import fs from 'fs/promises'
import path from 'path'
import { Product, User, Order, Cart, Collection } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Generic database operations
class Database<T extends { id: string }> {
  private filename: string

  constructor(filename: string) {
    this.filename = path.join(DATA_DIR, `${filename}.json`)
  }

  async read(): Promise<T[]> {
    await ensureDataDir()
    try {
      const data = await fs.readFile(this.filename, 'utf-8')
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  async write(data: T[]): Promise<void> {
    await ensureDataDir()
    await fs.writeFile(this.filename, JSON.stringify(data, null, 2))
  }

  async findAll(): Promise<T[]> {
    return this.read()
  }

  async findById(id: string): Promise<T | null> {
    const data = await this.read()
    return data.find(item => item.id === id) || null
  }

  async findBy(predicate: (item: T) => boolean): Promise<T[]> {
    const data = await this.read()
    return data.filter(predicate)
  }

  async findOne(predicate: (item: T) => boolean): Promise<T | null> {
    const data = await this.read()
    return data.find(predicate) || null
  }

  async create(item: T): Promise<T> {
    const data = await this.read()
    const newItem = {
      ...item,
      id: item.id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    data.push(newItem as T)
    await this.write(data)
    return newItem as T
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const data = await this.read()
    const index = data.findIndex(item => item.id === id)
    
    if (index === -1) return null
    
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await this.write(data)
    return data[index]
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.read()
    const index = data.findIndex(item => item.id === id)
    
    if (index === -1) return false
    
    data.splice(index, 1)
    await this.write(data)
    return true
  }

  async count(): Promise<number> {
    const data = await this.read()
    return data.length
  }

  async paginate(page: number = 1, limit: number = 10): Promise<{
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    const allData = await this.read()
    const total = allData.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const data = allData.slice(offset, offset + limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  }
}

// Database instances
export const productsDb = new Database<Product>('products')
export const usersDb = new Database<User>('users')
export const ordersDb = new Database<Order>('orders')
export const cartsDb = new Database<Cart>('carts')
export const collectionsDb = new Database<Collection>('collections')

// Utility functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `EC${timestamp}${random}`
}

export function generateHandle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Initialize database with sample data
export async function initializeDatabase() {
  const products = await productsDb.findAll()
  
  if (products.length === 0) {
    // Create sample products
    const sampleProducts: Product[] = [
      {
        id: '1',
        title: 'Classic Surf T-Shirt',
        handle: 'classic-surf-t-shirt',
        description: 'Our classic surf t-shirt is made from 100% organic cotton for a soft, comfortable feel. Perfect for beach days or casual wear.',
        story: 'Inspired by the golden era of California surf culture, this t-shirt embodies the spirit of endless summers and perfect waves. Each piece is crafted with attention to detail, honoring the traditions of surf heritage while embracing modern, sustainable practices.',
        price: 45.00,
        images: [
          '/placeholder.svg?height=800&width=600&text=Product+Front',
          '/placeholder.svg?height=800&width=600&text=Product+Back',
          '/placeholder.svg?height=800&width=600&text=Product+Detail',
          '/placeholder.svg?height=800&width=600&text=Product+Lifestyle'
        ],
        category: 'Apparel',
        subcategory: 'T-Shirts',
        tags: ['surf', 't-shirt', 'organic', 'cotton'],
        sku: 'TS-CLS-001',
        inStock: true,
        inventory: 50,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
          { name: 'White', value: '#FFFFFF', border: true },
          { name: 'Black', value: '#000000' },
          { name: 'Navy', value: '#0A192F' },
          { name: 'Sand', value: '#E2D2B4', border: true }
        ],
        features: [
          '100% organic cotton',
          'Regular fit',
          'Crew neck',
          'Short sleeves',
          'Screen-printed graphic',
          'Machine washable'
        ],
        designer: 'Emma Rodriguez',
        designerQuote: 'I wanted to create something that feels as good as it looks. This piece represents the perfect balance between style, comfort, and sustainability.',
        sustainabilityInfo: 'This product is made with 100% organic cotton, reducing water usage by 91% compared to conventional cotton. We use eco-friendly dyes and ethical manufacturing processes.',
        editorial: {
          title: 'The Art of Simplicity',
          content: 'In a world of excess, there\'s beauty in simplicity. Our Classic Surf T-Shirt represents a return to the essentials – quality materials, thoughtful design, and timeless style.',
          image: '/images/palm-trees-sky.jpeg'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Relaxed Fit Hoodie',
        handle: 'relaxed-fit-hoodie',
        description: 'A comfortable hoodie perfect for cool beach evenings and casual wear.',
        story: 'Designed for those moments when the sun sets and the ocean breeze picks up. This hoodie combines comfort with style.',
        price: 85.00,
        images: [
          '/placeholder.svg?height=800&width=600&text=Hoodie+Front',
          '/placeholder.svg?height=800&width=600&text=Hoodie+Back'
        ],
        category: 'Apparel',
        subcategory: 'Hoodies',
        tags: ['hoodie', 'casual', 'comfort'],
        sku: 'HD-RLX-001',
        inStock: true,
        inventory: 30,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Grey', value: '#808080' },
          { name: 'Navy', value: '#0A192F' }
        ],
        features: [
          'Relaxed fit',
          'Kangaroo pocket',
          'Drawstring hood',
          'Ribbed cuffs and hem'
        ],
        designer: 'Marcus Chen',
        designerQuote: 'Comfort meets style in this essential piece.',
        sustainabilityInfo: 'Made with sustainable materials and ethical manufacturing.',
        editorial: {
          title: 'Comfort Redefined',
          content: 'The perfect hoodie for any occasion.',
          image: '/images/ocean-wave-1.jpeg'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Board Shorts',
        handle: 'board-shorts',
        description: 'High-performance board shorts designed for surfing and beach activities.',
        story: 'Built for performance in the water and style on the beach.',
        price: 65.00,
        images: [
          '/placeholder.svg?height=800&width=600&text=Shorts+Front',
          '/placeholder.svg?height=800&width=600&text=Shorts+Back'
        ],
        category: 'Apparel',
        subcategory: 'Shorts',
        tags: ['shorts', 'surf', 'performance'],
        sku: 'BS-PRF-001',
        inStock: true,
        inventory: 25,
        sizes: ['28', '30', '32', '34', '36'],
        colors: [
          { name: 'Blue', value: '#0066CC' },
          { name: 'Black', value: '#000000' }
        ],
        features: [
          'Quick-dry fabric',
          'Velcro closure',
          'Side pockets',
          'Stretch material'
        ],
        designer: 'Sarah Johnson',
        designerQuote: 'Performance and style in perfect harmony.',
        sustainabilityInfo: 'Made from recycled ocean plastic.',
        editorial: {
          title: 'Ocean Performance',
          content: 'Designed for the waves.',
          image: '/images/ocean-wave-2.jpeg'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    for (const product of sampleProducts) {
      await productsDb.create(product)
    }

    // Create sample collections
    const sampleCollections: Collection[] = [
      {
        id: '1',
        title: 'Surf Collection',
        handle: 'surf',
        description: 'Performance gear designed for those who live for the waves.',
        image: '/images/ocean-wave-1.jpeg',
        products: ['1', '3'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Apparel',
        handle: 'apparel',
        description: 'Comfortable and stylish clothing for everyday wear.',
        image: '/images/ocean-wave-2.jpeg',
        products: ['1', '2'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    for (const collection of sampleCollections) {
      await collectionsDb.create(collection)
    }

    console.log('Database initialized with sample data')
  }
}