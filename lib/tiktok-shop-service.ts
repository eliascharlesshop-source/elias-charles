import { getAllProducts, getProductBySku } from '@/data/tiktok-products'

export interface SyncResult {
  success: boolean
  synced: number
  failed: number
  errors: string[]
}

export interface CheckoutSession {
  id: string
  sku: string
  quantity: number
  price: number
  createdAt: Date
  expiresAt: Date
}

class TikTokShopService {
  private apiKey: string
  private shopId: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.TIKTOK_SHOP_API_KEY || ''
    this.shopId = process.env.TIKTOK_SHOP_ID || ''
    this.baseUrl = process.env.TIKTOK_SHOP_API_URL || 'https://open-api.tiktokshop.com'
  }

  /**
   * Fetch all products from TikTok Shop
   */
  async fetchAllProducts(limit?: number) {
    try {
      if (!this.isConfigured()) {
        const products = getAllProducts()
        return limit ? products.slice(0, limit) : products
      }

      const response = await fetch(`${this.baseUrl}/products?limit=${limit || 100}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'x-tiktok-shop-id': this.shopId
        }
      })

      if (!response.ok) throw new Error(`TikTok API error: ${response.status}`)
      const data = await response.json()
      return data.products || []
    } catch (error) {
      console.error('Error fetching products from TikTok Shop:', error)
      return getAllProducts()
    }
  }

  /**
   * Fetch products by category
   */
  async fetchProductsByCategory(category: string) {
    try {
      if (!this.isConfigured()) {
        const products = getAllProducts().filter(p => p.category === category)
        return products
      }

      const response = await fetch(`${this.baseUrl}/products?category=${category}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'x-tiktok-shop-id': this.shopId
        }
      })

      if (!response.ok) throw new Error(`TikTok API error: ${response.status}`)
      const data = await response.json()
      return data.products || []
    } catch (error) {
      console.error('Error fetching category products:', error)
      return getAllProducts().filter(p => p.category === category)
    }
  }

  /**
   * Fetch a single product by SKU with full details
   */
  async fetchProductBySku(sku: string) {
    try {
      if (!this.isConfigured()) {
        const product = getProductBySku(sku)
        return product || null
      }

      const response = await fetch(`${this.baseUrl}/products/${sku}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'x-tiktok-shop-id': this.shopId
        }
      })

      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`TikTok API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      const product = getProductBySku(sku)
      return product || null
    }
  }

  /**
   * Fetch related products for recommendations
   */
  async fetchRelatedProducts(sku: string, limit: number = 4) {
    try {
      const product = await this.fetchProductBySku(sku)
      if (!product) return []

      const allProducts = getAllProducts()
      return allProducts
        .filter(p => p.sku !== sku && p.category === product.category)
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching related products:', error)
      return []
    }
  }

  /**
   * Create a TikTok Shop checkout session
   */
  async createCheckoutSession(sku: string, quantity: number = 1) {
    try {
      const product = await this.fetchProductBySku(sku)
      if (!product) {
        throw new Error(`Product ${sku} not found`)
      }

      if (!this.isConfigured()) {
        // Return mock checkout for development
        const sessionId = `session_${Date.now()}`
        return {
          id: sessionId,
          checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout?session=${sessionId}`,
          total: product.price * quantity
        }
      }

      // Call TikTok Shop checkout API
      const response = await fetch(`${this.baseUrl}/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'x-tiktok-shop-id': this.shopId
        },
        body: JSON.stringify({
          items: [{ sku, quantity, price: product.price }],
          successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`,
          cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel`
        })
      })

      if (!response.ok) throw new Error(`Checkout creation failed: ${response.status}`)
      const data = await response.json()
      return {
        id: data.sessionId,
        checkoutUrl: data.checkoutUrl,
        total: product.price * quantity
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      const sessionId = `session_${Date.now()}`
      return {
        id: sessionId,
        checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout?session=${sessionId}`,
        total: 0
      }
    }
  }

  /**
   * Sync product to TikTok Shop
   */
  async syncProduct(sku: string): Promise<SyncResult> {
    try {
      if (!this.isConfigured()) {
        return { success: false, synced: 0, failed: 1, errors: ['TikTok Shop not configured'] }
      }

      const product = getProductBySku(sku)
      if (!product) {
        return { success: false, synced: 0, failed: 1, errors: [`Product ${sku} not found`] }
      }

      const payload = this.prepareProductPayload(product)
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'x-tiktok-shop-id': this.shopId
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`TikTok API error: ${error}`)
      }

      return { success: true, synced: 1, failed: 0, errors: [] }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, synced: 0, failed: 1, errors: [errorMsg] }
    }
  }

  /**
   * Sync all products to TikTok Shop
   */
  async syncAllProducts(): Promise<SyncResult> {
    const products = getAllProducts()
    const results: SyncResult = { success: true, synced: 0, failed: 0, errors: [] }

    for (const product of products) {
      const result = await this.syncProduct(product.sku)
      results.synced += result.synced
      results.failed += result.failed
      results.errors.push(...result.errors)
    }

    return results
  }

  /**
   * Check if TikTok Shop is properly configured
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.shopId)
  }

  /**
   * Prepare product data for TikTok Shop API
   */
  private prepareProductPayload(product: any) {
    return {
      title: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price,
      originalPrice: product.compareAtPrice,
      quantity: product.inventory,
      category: product.category,
      tags: product.tags,
      images: product.image ? [product.image] : [],
      collections: product.collections,
      status: product.status
    }
  }
}

export const tiktokShopService = new TikTokShopService()
