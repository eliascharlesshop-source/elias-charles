// Enhanced Shopify service using advanced GraphQL implementation
import { ShopifyService as AdvancedShopifyService } from '@/src/lib/graphql'
import { transformShopifyProduct } from '@/src/lib/shopify'

export class ShopifyService {
  private advancedService: AdvancedShopifyService

  constructor() {
    this.advancedService = new AdvancedShopifyService(
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
    )
  }

  // Get products with filtering and pagination (enhanced with GraphQL caching)
  async getProducts(options: {
    limit?: number
    page?: number
    category?: string
    featured?: boolean
    search?: string
    sort?: 'title' | 'price' | 'createdAt' | 'bestSelling'
    order?: 'asc' | 'desc'
  } = {}) {
    const {
      limit = 12,
      page = 1,
      category,
      featured,
      search,
      sort = 'createdAt',
      order = 'desc'
    } = options

    try {
      let products

      if (search) {
        // Use advanced search with GraphQL
        const searchResult = await this.advancedService.searchProducts(search, {
          first: limit * 2,
          sortKey: this.mapSortKey(sort),
          reverse: order === 'desc'
        })
        products = searchResult.products.map(transformShopifyProduct)
      } else {
        // Use optimized product fetching with caching
        const rawProducts = await this.advancedService.getProducts({
          first: limit * 2,
          sortKey: this.mapProductSortKey(sort),
          reverse: order === 'desc',
          cache: true
        })
        products = rawProducts.map(transformShopifyProduct)
      }

      // Apply filters
      if (category) {
        products = products.filter(product => 
          product.category.toLowerCase().includes(category.toLowerCase()) ||
          product.productType.toLowerCase().includes(category.toLowerCase())
        )
      }

      if (featured) {
        products = products.filter(product => product.featured)
      }

      // Paginate
      const totalCount = products.length
      const totalPages = Math.ceil(totalCount / limit)
      const startIndex = (page - 1) * limit
      const paginatedProducts = products.slice(startIndex, startIndex + limit)

      return {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
          hasNextPage: page < totalPages
        }
      }
    } catch (error) {
      console.error('ShopifyService.getProducts error:', error)
      throw error
    }
  }

  // Get single product by handle (with caching)
  async getProduct(handle: string) {
    try {
      const product = await this.advancedService.getProductByHandle(handle, true)
      
      if (!product) {
        throw new Error(`Product not found: ${handle}`)
      }

      return transformShopifyProduct(product)
    } catch (error) {
      console.error('ShopifyService.getProduct error:', error)
      throw error
    }
  }

  // Get product recommendations
  async getProductRecommendations(productId: string, intent: 'RELATED' | 'COMPLEMENTARY' = 'RELATED') {
    try {
      const recommendations = await this.advancedService.getProductRecommendations(productId, intent)
      return recommendations.map(transformShopifyProduct)
    } catch (error) {
      console.error('ShopifyService.getProductRecommendations error:', error)
      return []
    }
  }

  // Get collections (with caching)
  async getCollections(limit = 20) {
    try {
      const collections = await this.advancedService.getCollections({
        first: limit,
        cache: true
      })
      
      return collections.map(collection => ({
        id: collection.id.replace('gid://shopify/Collection/', ''),
        title: collection.title,
        description: collection.description,
        handle: collection.handle,
        image: collection.image?.url,
        productCount: collection.products.edges.length,
        updatedAt: collection.updatedAt
      }))
    } catch (error) {
      console.error('ShopifyService.getCollections error:', error)
      throw error
    }
  }

  // Get collection by handle with products
  async getCollectionByHandle(handle: string, options: {
    limit?: number
    sortKey?: 'MANUAL' | 'BEST_SELLING' | 'ALPHA_ASC' | 'ALPHA_DESC' | 'PRICE_DESC' | 'PRICE_ASC' | 'CREATED_DESC' | 'CREATED'
    reverse?: boolean
  } = {}) {
    try {
      const { limit = 20, sortKey = 'MANUAL', reverse = false } = options
      
      const collection = await this.advancedService.getCollectionByHandle(handle, {
        first: limit,
        sortKey,
        reverse,
        cache: true
      })

      if (!collection) {
        throw new Error(`Collection not found: ${handle}`)
      }

      return {
        id: collection.id.replace('gid://shopify/Collection/', ''),
        title: collection.title,
        description: collection.description,
        handle: collection.handle,
        image: collection.image?.url,
        products: collection.products.edges.map(edge => transformShopifyProduct(edge.node)),
        hasNextPage: collection.products.pageInfo.hasNextPage,
        endCursor: collection.products.pageInfo.endCursor
      }
    } catch (error) {
      console.error('ShopifyService.getCollectionByHandle error:', error)
      throw error
    }
  }

  // Featured products (cached)
  async getFeaturedProducts(limit = 8) {
    try {
      const products = await this.advancedService.getFeaturedProducts(limit)
      return products.map(transformShopifyProduct)
    } catch (error) {
      console.error('ShopifyService.getFeaturedProducts error:', error)
      return []
    }
  }

  // New arrivals (cached)
  async getNewArrivals(limit = 12) {
    try {
      const products = await this.advancedService.getNewArrivals(limit)
      return products.map(transformShopifyProduct)
    } catch (error) {
      console.error('ShopifyService.getNewArrivals error:', error)
      return []
    }
  }

  // Get products by tag
  async getProductsByTag(tag: string, limit = 20) {
    try {
      const products = await this.advancedService.getProductsByTag(tag, limit)
      return products.map(transformShopifyProduct)
    } catch (error) {
      console.error('ShopifyService.getProductsByTag error:', error)
      return []
    }
  }

  // Cart operations (enhanced with better error handling)
  async createCart(lines: Array<{ merchandiseId: string; quantity: number }>) {
    try {
      const cartLines = lines.map(line => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity
      }))

      const { cart, errors } = await this.advancedService.createCart({
        lines: cartLines
      })
      
      if (errors.length > 0) {
        throw new Error(errors[0].message)
      }

      return cart ? this.transformCart(cart) : null
    } catch (error) {
      console.error('ShopifyService.createCart error:', error)
      throw error
    }
  }

  async addToCart(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
    try {
      const cartLines = lines.map(line => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity
      }))

      const { cart, errors } = await this.advancedService.addToCart(cartId, cartLines)
      
      if (errors.length > 0) {
        throw new Error(errors[0].message)
      }

      return cart ? this.transformCart(cart) : null
    } catch (error) {
      console.error('ShopifyService.addToCart error:', error)
      throw error
    }
  }

  async updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>) {
    try {
      const { cart, errors } = await this.advancedService.updateCartLines(cartId, lines)
      
      if (errors.length > 0) {
        throw new Error(errors[0].message)
      }

      return cart ? this.transformCart(cart) : null
    } catch (error) {
      console.error('ShopifyService.updateCartLines error:', error)
      throw error
    }
  }

  async removeFromCart(cartId: string, lineIds: string[]) {
    try {
      const { cart, errors } = await this.advancedService.removeFromCart(cartId, lineIds)
      
      if (errors.length > 0) {
        throw new Error(errors[0].message)
      }

      return cart ? this.transformCart(cart) : null
    } catch (error) {
      console.error('ShopifyService.removeFromCart error:', error)
      throw error
    }
  }

  async getCart(cartId: string) {
    try {
      const cart = await this.advancedService.getCart(cartId)
      return cart ? this.transformCart(cart) : null
    } catch (error) {
      console.error('ShopifyService.getCart error:', error)
      throw error
    }
  }

  // Advanced search
  async advancedSearch(options: {
    query?: string
    productType?: string
    vendor?: string
    tags?: string[]
    priceMin?: number
    priceMax?: number
    available?: boolean
    sortKey?: string
    reverse?: boolean
    first?: number
  }) {
    try {
      const products = await this.advancedService.advancedSearch(options)
      return products.map(transformShopifyProduct)
    } catch (error) {
      console.error('ShopifyService.advancedSearch error:', error)
      return []
    }
  }

  // Utility methods
  clearCache() {
    this.advancedService.clearCache()
  }

  getCacheStats() {
    return this.advancedService.getCacheStats()
  }

  // Batch operations
  async batchGetProducts(handles: string[]) {
    try {
      const products = await this.advancedService.batchGetProducts(handles)
      return products
        .filter(product => product !== null)
        .map(product => transformShopifyProduct(product!))
    } catch (error) {
      console.error('ShopifyService.batchGetProducts error:', error)
      return []
    }
  }

  private transformCart(shopifyCart: any) {
    return {
      id: shopifyCart.id,
      checkoutUrl: shopifyCart.checkoutUrl,
      totalQuantity: shopifyCart.totalQuantity,
      lines: shopifyCart.lines.edges.map((edge: any) => ({
        id: edge.node.id,
        quantity: edge.node.quantity,
        merchandise: {
          id: edge.node.merchandise.id,
          title: edge.node.merchandise.title,
          product: {
            title: edge.node.merchandise.product.title,
            handle: edge.node.merchandise.product.handle
          },
          price: {
            amount: parseFloat(edge.node.merchandise.price.amount),
            currencyCode: edge.node.merchandise.price.currencyCode
          },
          image: edge.node.merchandise.image?.url
        }
      })),
      cost: {
        totalAmount: {
          amount: parseFloat(shopifyCart.estimatedCost.totalAmount.amount),
          currencyCode: shopifyCart.estimatedCost.totalAmount.currencyCode
        },
        subtotalAmount: {
          amount: parseFloat(shopifyCart.estimatedCost.subtotalAmount.amount),
          currencyCode: shopifyCart.estimatedCost.subtotalAmount.currencyCode
        }
      }
    }
  }

  private mapSortKey(sort: string): 'RELEVANCE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING' {
    switch (sort) {
      case 'title':
        return 'RELEVANCE' // Use relevance for title sorting
      case 'price':
        return 'PRICE'
      case 'bestSelling':
        return 'BEST_SELLING'
      case 'createdAt':
      default:
        return 'CREATED_AT'
    }
  }

  private mapProductSortKey(sort: string): 'TITLE' | 'PRICE' | 'BEST_SELLING' | 'CREATED_AT' | 'ID' | 'PRODUCT_TYPE' | 'RELEVANCE' | 'UPDATED_AT' | 'VENDOR' {
    switch (sort) {
      case 'title':
        return 'TITLE'
      case 'price':
        return 'PRICE'
      case 'bestSelling':
        return 'BEST_SELLING'
      case 'createdAt':
      default:
        return 'CREATED_AT'
    }
  }
}

// Singleton instance
export const shopifyService = new ShopifyService()