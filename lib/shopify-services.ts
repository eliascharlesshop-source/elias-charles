// Extended Shopify services for webapp
import { ShopifyStorefront, transformShopifyProduct } from '@/src/lib/shopify'

export class ShopifyProductService {
  private static storefront = new ShopifyStorefront()

  static async getAllProducts(limit = 50) {
    try {
      const data = await this.storefront.getProducts(limit)
      return data.products.edges.map((edge: any) => edge.node)
    } catch (error) {
      console.error('ShopifyProductService.getAllProducts error:', error)
      throw error
    }
  }

  static async getProductByHandle(handle: string) {
    try {
      const data = await this.storefront.getProduct(handle)
      return data.productByHandle
    } catch (error) {
      console.error('ShopifyProductService.getProductByHandle error:', error)
      throw error
    }
  }

  static async searchProducts(query: string, limit = 20) {
    try {
      const data = await this.storefront.searchProducts(query, limit)
      return data.products.edges.map((edge: any) => edge.node)
    } catch (error) {
      console.error('ShopifyProductService.searchProducts error:', error)
      throw error
    }
  }
}

export class ShopifyCollectionService {
  private static storefront = new ShopifyStorefront()

  static async getAllCollections(limit = 20) {
    try {
      const data = await this.storefront.getCollections(limit)
      return data.collections.edges.map((edge: any) => edge.node)
    } catch (error) {
      console.error('ShopifyCollectionService.getAllCollections error:', error)
      throw error
    }
  }

  static async getCollectionByHandle(handle: string) {
    try {
      // This would need to be implemented in the main Shopify class
      // For now, get all collections and filter
      const collections = await this.getAllCollections()
      return collections.find((collection: any) => collection.handle === handle)
    } catch (error) {
      console.error('ShopifyCollectionService.getCollectionByHandle error:', error)
      throw error
    }
  }
}

export class ShopifyCartService {
  private static storefront = new ShopifyStorefront()

  static async createCheckout() {
    try {
      // Create an empty cart first
      const data = await this.storefront.createCart([])
      return {
        id: data.cartCreate.cart.id,
        webUrl: data.cartCreate.cart.checkoutUrl,
        lineItems: [],
        subtotalPrice: { amount: '0.00', currencyCode: 'USD' },
        totalTax: { amount: '0.00', currencyCode: 'USD' },
        totalPrice: { amount: '0.00', currencyCode: 'USD' }
      }
    } catch (error) {
      console.error('ShopifyCartService.createCheckout error:', error)
      throw error
    }
  }

  static async addLineItems(checkoutId: string, lineItems: any[]) {
    try {
      const data = await this.storefront.addToCart(checkoutId, lineItems)
      return this.transformCheckout(data.cartLinesAdd.cart)
    } catch (error) {
      console.error('ShopifyCartService.addLineItems error:', error)
      throw error
    }
  }

  static async updateLineItems(checkoutId: string, lineItems: any[]) {
    try {
      // For now, this would need to be implemented as remove + add
      // This is a simplified version
      const data = await this.storefront.addToCart(checkoutId, lineItems)
      return this.transformCheckout(data.cartLinesAdd.cart)
    } catch (error) {
      console.error('ShopifyCartService.updateLineItems error:', error)
      throw error
    }
  }

  static async removeLineItems(checkoutId: string, lineItemIds: string[]) {
    try {
      // This would need to be implemented in the main Shopify class
      // For now, return a basic structure
      return {
        id: checkoutId,
        webUrl: '',
        lineItems: [],
        subtotalPrice: { amount: '0.00', currencyCode: 'USD' },
        totalTax: { amount: '0.00', currencyCode: 'USD' },
        totalPrice: { amount: '0.00', currencyCode: 'USD' }
      }
    } catch (error) {
      console.error('ShopifyCartService.removeLineItems error:', error)
      throw error
    }
  }

  private static transformCheckout(cart: any) {
    return {
      id: cart.id,
      webUrl: cart.checkoutUrl,
      lineItems: cart.lines.edges.map((edge: any) => edge.node),
      subtotalPrice: cart.cost.subtotalAmount,
      totalTax: cart.cost.totalTaxAmount || { amount: '0.00', currencyCode: 'USD' },
      totalPrice: cart.cost.totalAmount
    }
  }
}

export class ShopifyDataTransformer {
  static productToAppFormat(shopifyProduct: any) {
    return transformShopifyProduct(shopifyProduct)
  }

  static collectionToAppFormat(shopifyCollection: any) {
    return {
      id: shopifyCollection.id.replace('gid://shopify/Collection/', ''),
      title: shopifyCollection.title,
      description: shopifyCollection.description,
      handle: shopifyCollection.handle,
      image: shopifyCollection.image?.url,
      productCount: shopifyCollection.products?.edges?.length || 0,
      updatedAt: shopifyCollection.updatedAt
    }
  }

  static cartToAppFormat(shopifyCart: any) {
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