// Simple Shopify Storefront API client - no admin API needed for frontend
import { createFallbackResponse, isShopifyUnavailable } from './shopify-fallback'

// Shopify Storefront API client for public data
export class ShopifyStorefront {
  private endpoint: string
  private accessToken: string

  constructor() {
    const shopDomain = process.env.SHOPIFY_STORE_DOMAIN
    this.accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''
    
    if (!shopDomain || !this.accessToken) {
      throw new Error('Missing Shopify configuration. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN')
    }
    
    this.endpoint = `https://${shopDomain}/api/2023-10/graphql.json`
  }

  async query(query: string, variables?: any) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.accessToken,
        },
        body: JSON.stringify({ query, variables }),
      })

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
      }

      return data.data
    } catch (error) {
      console.error('Shopify Storefront API error:', error)
      throw error
    }
  }

  // Get all products
  async getProducts(limit = 20, cursor?: string) {
    const query = `
      query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node {
              id
              title
              description
              handle
              availableForSale
              createdAt
              updatedAt
              tags
              productType
              vendor
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                    quantityAvailable
                    sku
                    weight
                    weightUnit
                    image {
                      url
                      altText
                    }
                  }
                }
              }
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              featuredImage {
                url
                altText
              }
              seo {
                title
                description
              }
              metafields(identifiers: [
                {namespace: "custom", key: "featured"}
                {namespace: "custom", key: "category"}
                {namespace: "custom", key: "subcategory"}
              ]) {
                key
                value
                namespace
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `

    const variables = {
      first: limit,
      after: cursor,
    }

    try {
      return await this.query(query, variables)
    } catch (error) {
      if (isShopifyUnavailable(error)) {
        console.warn('Shopify store unavailable, using fallback data')
        return createFallbackResponse('products', limit)
      }
      throw error
    }
  }

  // Get a single product by handle
  async getProduct(handle: string) {
    const query = `
      query GetProduct($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          description
          handle
          availableForSale
          createdAt
          updatedAt
          tags
          productType
          vendor
          variants(first: 50) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
                sku
                weight
                weightUnit
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                }
              }
            }
          }
          images(first: 20) {
            edges {
              node {
                url
                altText
              }
            }
          }
          featuredImage {
            url
            altText
          }
          seo {
            title
            description
          }
          metafields(identifiers: [
            {namespace: "custom", key: "featured"}
            {namespace: "custom", key: "category"}
            {namespace: "custom", key: "subcategory"}
            {namespace: "custom", key: "size_chart"}
            {namespace: "custom", key: "care_instructions"}
          ]) {
            key
            value
            namespace
          }
        }
      }
    `

    const variables = { handle }
    return await this.query(query, variables)
  }

  // Get collections
  async getCollections(limit = 20) {
    const query = `
      query GetCollections($first: Int!) {
        collections(first: $first) {
          edges {
            node {
              id
              title
              description
              handle
              updatedAt
              image {
                url
                altText
              }
              products(first: 10) {
                edges {
                  node {
                    id
                    handle
                  }
                }
              }
            }
          }
        }
      }
    `

    const variables = { first: limit }
    
    try {
      return await this.query(query, variables)
    } catch (error) {
      if (isShopifyUnavailable(error)) {
        console.warn('Shopify store unavailable, using fallback collections data')
        return createFallbackResponse('collections', limit)
      }
      throw error
    }
  }

  // Search products
  async searchProducts(query: string, limit = 20) {
    const searchQuery = `
      query SearchProducts($query: String!, $first: Int!) {
        products(first: $first, query: $query) {
          edges {
            node {
              id
              title
              description
              handle
              availableForSale
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    `

    const variables = {
      query,
      first: limit,
    }

    return await this.query(searchQuery, variables)
  }

  // Create cart
  async createCart(lines: any[]) {
    const mutation = `
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      price {
                        amount
                        currencyCode
                      }
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
              totalTaxAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const variables = {
      input: { lines }
    }

    return await this.query(mutation, variables)
  }

  // Add lines to cart
  async addToCart(cartId: string, lines: any[]) {
    const mutation = `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const variables = { cartId, lines }
    return await this.query(mutation, variables)
  }
}

// Transform Shopify product to our format
export function transformShopifyProduct(shopifyProduct: any) {
  const variant = shopifyProduct.variants.edges[0]?.node
  const images = shopifyProduct.images.edges.map((edge: any) => edge.node.url)
  
  // Extract custom metafields - handle cases where metafields might be null or have null entries
  const metafields = shopifyProduct.metafields || []
  const featured = metafields.find((m: any) => m && m.key === 'featured')?.value === 'true'
  const category = metafields.find((m: any) => m && m.key === 'category')?.value || shopifyProduct.productType
  const subcategory = metafields.find((m: any) => m && m.key === 'subcategory')?.value

  return {
    id: shopifyProduct.id.replace('gid://shopify/Product/', ''),
    title: shopifyProduct.title,
    description: shopifyProduct.description,
    handle: shopifyProduct.handle,
    price: variant ? parseFloat(variant.price.amount) : 0,
    salePrice: variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined,
    category: category || 'uncategorized',
    subcategory,
    sku: variant?.sku || '',
    inventory: variant?.quantityAvailable || 0,
    inStock: shopifyProduct.availableForSale,
    images,
    tags: shopifyProduct.tags,
    featured,
    weight: variant?.weight,
    vendor: shopifyProduct.vendor,
    productType: shopifyProduct.productType,
    createdAt: shopifyProduct.createdAt,
    updatedAt: shopifyProduct.updatedAt,
    variants: shopifyProduct.variants.edges.map((edge: any) => ({
      id: edge.node.id.replace('gid://shopify/ProductVariant/', ''),
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      compareAtPrice: edge.node.compareAtPrice ? parseFloat(edge.node.compareAtPrice.amount) : null,
      sku: edge.node.sku,
      availableForSale: edge.node.availableForSale,
      quantityAvailable: edge.node.quantityAvailable,
      weight: edge.node.weight,
      weightUnit: edge.node.weightUnit,
      image: edge.node.image?.url,
    })),
    seo: shopifyProduct.seo,
  }
}

// Error handling wrapper
export async function withShopifyErrorHandling<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error('Shopify operation failed:', error)
    
    // Return fallback data or throw formatted error
    if (error instanceof Error) {
      throw new Error(`Shopify Error: ${error.message}`)
    }
    
    throw new Error('Unknown Shopify error occurred')
  }
}
