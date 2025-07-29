// Simplified Shopify service for frontend operations
import { ShopifyStorefront, transformShopifyProduct } from '@/src/lib/shopify'

export class ShopifyService {
  private storefront: ShopifyStorefront

  constructor() {
    this.storefront = new ShopifyStorefront()
  }

  // Get products with filtering and pagination
  async getProducts(options: {
    limit?: number
    page?: number
    category?: string
    featured?: boolean
    search?: string
    sort?: 'title' | 'price' | 'createdAt'
    order?: 'asc' | 'desc'
  } = {}) {
    const {
      limit = 12,
      page = 1,
      category,
      featured,
      search,
      sort,
      order = 'asc'
    } = options

    try {
      let data
      if (search) {
        data = await this.storefront.searchProducts(search, limit * 2)
      } else {
        data = await this.storefront.getProducts(limit * 2)
      }

      let products = data.products.edges.map((edge: any) => 
        transformShopifyProduct(edge.node)
      )

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

      // Apply sorting
      if (sort) {
        products.sort((a, b) => {
          let aValue: any, bValue: any
          
          switch (sort) {
            case 'title':
              aValue = a.title.toLowerCase()
              bValue = b.title.toLowerCase()
              break
            case 'price':
              aValue = a.price
              bValue = b.price
              break
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime()
              bValue = new Date(b.createdAt).getTime()
              break
            default:
              return 0
          }

          if (order === 'desc') {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
          } else {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
          }
        })
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

  // Get single product by handle
  async getProduct(handle: string) {
    try {
      const data = await this.storefront.getProduct(handle)
      
      if (!data.productByHandle) {
        throw new Error(`Product not found: ${handle}`)
      }

      return transformShopifyProduct(data.productByHandle)
    } catch (error) {
      console.error('ShopifyService.getProduct error:', error)
      throw error
    }
  }

  // Get collections
  async getCollections(limit = 20) {
    try {
      const data = await this.storefront.getCollections(limit)
      
      return data.collections.edges.map((edge: any) => ({
        id: edge.node.id.replace('gid://shopify/Collection/', ''),
        title: edge.node.title,
        description: edge.node.description,
        handle: edge.node.handle,
        image: edge.node.image?.url,
        productCount: edge.node.products.edges.length,
        updatedAt: edge.node.updatedAt
      }))
    } catch (error) {
      console.error('ShopifyService.getCollections error:', error)
      throw error
    }
  }

  // Cart operations
  async createCart(lines: Array<{ merchandiseId: string; quantity: number }>) {
    try {
      const cartLines = lines.map(line => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity
      }))

      const data = await this.storefront.createCart(cartLines)
      
      if (data.cartCreate.userErrors.length > 0) {
        throw new Error(data.cartCreate.userErrors[0].message)
      }

      return this.transformCart(data.cartCreate.cart)
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

      const data = await this.storefront.addToCart(cartId, cartLines)
      
      if (data.cartLinesAdd.userErrors.length > 0) {
        throw new Error(data.cartLinesAdd.userErrors[0].message)
      }

      return this.transformCart(data.cartLinesAdd.cart)
    } catch (error) {
      console.error('ShopifyService.addToCart error:', error)
      throw error
    }
  }

  private transformCart(shopifyCart: any) {
    return {
      id: shopifyCart.id,
      checkoutUrl: shopifyCart.checkoutUrl,
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
          amount: parseFloat(shopifyCart.cost.totalAmount.amount),
          currencyCode: shopifyCart.cost.totalAmount.currencyCode
        },
        subtotalAmount: {
          amount: parseFloat(shopifyCart.cost.subtotalAmount.amount),
          currencyCode: shopifyCart.cost.subtotalAmount.currencyCode
        },
        totalTaxAmount: shopifyCart.cost.totalTaxAmount ? {
          amount: parseFloat(shopifyCart.cost.totalTaxAmount.amount),
          currencyCode: shopifyCart.cost.totalTaxAmount.currencyCode
        } : null
      }
    }
  }
}

// Singleton instance
export const shopifyService = new ShopifyService()