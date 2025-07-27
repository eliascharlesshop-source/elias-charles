import { shopifyFetch, SHOPIFY_QUERIES } from './shopify-storefront'
import { shopifyConfig } from './shopify-config'

// Types for Shopify data
export interface ShopifyProduct {
  id: string
  title: string
  description: string
  handle: string
  images: {
    src: string
    altText?: string
  }[]
  variants: {
    id: string
    title: string
    price: {
      amount: string
      currencyCode: string
    }
    compareAtPrice?: {
      amount: string
      currencyCode: string
    }
    availableForSale: boolean
    quantityAvailable?: number
    selectedOptions: {
      name: string
      value: string
    }[]
  }[]
  productType: string
  tags: string[]
  vendor: string
  createdAt: string
  updatedAt: string
}

export interface ShopifyCollection {
  id: string
  title: string
  description: string
  handle: string
  image?: {
    src: string
    altText?: string
  }
  products: ShopifyProduct[]
}

export interface ShopifyCheckout {
  id: string
  webUrl: string
  lineItems: {
    id: string
    title: string
    quantity: number
    variant: {
      id: string
      title: string
      price: {
        amount: string
        currencyCode: string
      }
      product: {
        title: string
        handle: string
      }
    }
  }[]
  subtotalPrice: {
    amount: string
    currencyCode: string
  }
  totalTax: {
    amount: string
    currencyCode: string
  }
  totalPrice: {
    amount: string
    currencyCode: string
  }
}

// Product operations
export class ShopifyProductService {
  static async getAllProducts(first = 20, after?: string): Promise<{
    products: ShopifyProduct[]
    hasNextPage: boolean
    endCursor?: string
  }> {
    const data = await shopifyFetch<{
      products: {
        edges: { node: ShopifyProduct }[]
        pageInfo: { hasNextPage: boolean; endCursor?: string }
      }
    }>(SHOPIFY_QUERIES.GET_PRODUCTS, { first, after })

    return {
      products: data.products.edges.map(edge => edge.node),
      hasNextPage: data.products.pageInfo.hasNextPage,
      endCursor: data.products.pageInfo.endCursor
    }
  }

  static async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const data = await shopifyFetch<{
      productByHandle: ShopifyProduct | null
    }>(SHOPIFY_QUERIES.GET_PRODUCT, { handle })

    return data.productByHandle
  }

  static async getProductsByCollection(collectionHandle: string): Promise<ShopifyProduct[]> {
    // This would require a separate query for products in a collection
    // For now, we'll filter all products by tags or implement later
    const { products } = await this.getAllProducts(100)
    return products.filter(product => 
      product.tags.some(tag => 
        tag.toLowerCase().includes(collectionHandle.toLowerCase())
      )
    )
  }

  static async searchProducts(query: string): Promise<ShopifyProduct[]> {
    // Shopify search query - would need to implement search API
    const { products } = await this.getAllProducts(100)
    return products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }
}

// Collection operations
export class ShopifyCollectionService {
  static async getAllCollections(first = 20): Promise<ShopifyCollection[]> {
    const data = await shopifyFetch<{
      collections: {
        edges: { node: ShopifyCollection }[]
      }
    }>(SHOPIFY_QUERIES.GET_COLLECTIONS, { first })

    return data.collections.edges.map(edge => edge.node)
  }

  static async getCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
    const collections = await this.getAllCollections(100)
    return collections.find(collection => collection.handle === handle) || null
  }
}

// Cart/Checkout operations
export class ShopifyCartService {
  static async createCheckout(): Promise<ShopifyCheckout> {
    const data = await shopifyFetch<{
      checkoutCreate: {
        checkout: ShopifyCheckout
        checkoutUserErrors: { field: string; message: string }[]
      }
    }>(SHOPIFY_QUERIES.CREATE_CHECKOUT, {
      input: {}
    })

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(`Checkout creation failed: ${data.checkoutCreate.checkoutUserErrors[0].message}`)
    }

    return data.checkoutCreate.checkout
  }

  static async addLineItems(checkoutId: string, lineItems: {
    variantId: string
    quantity: number
  }[]): Promise<ShopifyCheckout> {
    const data = await shopifyFetch<{
      checkoutLineItemsAdd: {
        checkout: ShopifyCheckout
        checkoutUserErrors: { field: string; message: string }[]
      }
    }>(SHOPIFY_QUERIES.ADD_LINE_ITEMS, {
      checkoutId,
      lineItems
    })

    if (data.checkoutLineItemsAdd.checkoutUserErrors.length > 0) {
      throw new Error(`Add line items failed: ${data.checkoutLineItemsAdd.checkoutUserErrors[0].message}`)
    }

    return data.checkoutLineItemsAdd.checkout
  }

  static async removeLineItems(checkoutId: string, lineItemIds: string[]): Promise<ShopifyCheckout> {
    const data = await shopifyFetch<{
      checkoutLineItemsRemove: {
        checkout: ShopifyCheckout
        checkoutUserErrors: { field: string; message: string }[]
      }
    }>(SHOPIFY_QUERIES.REMOVE_LINE_ITEMS, {
      checkoutId,
      lineItemIds
    })

    if (data.checkoutLineItemsRemove.checkoutUserErrors.length > 0) {
      throw new Error(`Remove line items failed: ${data.checkoutLineItemsRemove.checkoutUserErrors[0].message}`)
    }

    return data.checkoutLineItemsRemove.checkout
  }

  static async updateLineItems(checkoutId: string, lineItems: {
    id: string
    quantity: number
  }[]): Promise<ShopifyCheckout> {
    const data = await shopifyFetch<{
      checkoutLineItemsUpdate: {
        checkout: ShopifyCheckout
        checkoutUserErrors: { field: string; message: string }[]
      }
    }>(SHOPIFY_QUERIES.UPDATE_LINE_ITEMS, {
      checkoutId,
      lineItems
    })

    if (data.checkoutLineItemsUpdate.checkoutUserErrors.length > 0) {
      throw new Error(`Update line items failed: ${data.checkoutLineItemsUpdate.checkoutUserErrors[0].message}`)
    }

    return data.checkoutLineItemsUpdate.checkout
  }
}

// Utility functions to convert Shopify data to our app format
export class ShopifyDataTransformer {
  static productToAppFormat(shopifyProduct: ShopifyProduct) {
    const mainVariant = shopifyProduct.variants[0]
    const price = parseFloat(mainVariant.price.amount)
    const compareAtPrice = mainVariant.compareAtPrice ? parseFloat(mainVariant.compareAtPrice.amount) : null

    return {
      id: shopifyProduct.id.split('/').pop(), // Extract numeric ID
      title: shopifyProduct.title,
      description: shopifyProduct.description,
      handle: shopifyProduct.handle,
      price: price,
      salePrice: compareAtPrice && compareAtPrice > price ? price : undefined,
      originalPrice: compareAtPrice || price,
      category: shopifyProduct.productType.toLowerCase(),
      sku: mainVariant.id.split('/').pop(),
      inventory: mainVariant.quantityAvailable || 0,
      inStock: mainVariant.availableForSale,
      images: shopifyProduct.images.map(img => img.src),
      tags: shopifyProduct.tags,
      featured: shopifyProduct.tags.includes('featured'),
      variants: shopifyProduct.variants.map(variant => ({
        id: variant.id,
        title: variant.title,
        price: parseFloat(variant.price.amount),
        available: variant.availableForSale,
        options: variant.selectedOptions
      })),
      vendor: shopifyProduct.vendor,
      createdAt: shopifyProduct.createdAt,
      updatedAt: shopifyProduct.updatedAt
    }
  }

  static collectionToAppFormat(shopifyCollection: ShopifyCollection) {
    return {
      id: shopifyCollection.id.split('/').pop(),
      handle: shopifyCollection.handle,
      title: shopifyCollection.title,
      description: shopifyCollection.description,
      image: shopifyCollection.image?.src,
      products: shopifyCollection.products.map(product => 
        this.productToAppFormat(product)
      ),
      featured: shopifyCollection.title.toLowerCase().includes('featured')
    }
  }
}
