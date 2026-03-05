// Shared Shopify SDK for both web and mobile apps
export interface ShopifyConfig {
  storefrontAccessToken: string
  shopDomain: string
  apiVersion?: string
}

export interface Product {
  id: string
  title: string
  handle: string
  description: string
  price: number
  salePrice?: number
  compareAtPrice?: number
  images: string[]
  category: string
  subcategory?: string
  productType: string
  vendor: string
  tags: string[]
  availableForSale: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
  variants: ProductVariant[]
  sku: string
  inventory: number
  inStock: boolean
  weight?: number
  seo?: {
    title: string
    description: string
  }
}

export interface ProductVariant {
  id: string
  title: string
  price: number
  compareAtPrice?: number
  availableForSale: boolean
  quantityAvailable: number
  selectedOptions?: { name: string; value: string }[]
  image?: string
  sku: string
  weight?: number
  weightUnit?: string
}

export interface Collection {
  id: string
  title: string
  description: string
  handle: string
  image?: string
  productCount: number
  updatedAt: string
}

export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      title: string
      handle: string
    }
    price: {
      amount: number
      currencyCode: string
    }
    image?: string
  }
}

export interface Cart {
  id: string
  checkoutUrl: string
  lines: CartLine[]
  cost: {
    totalAmount: {
      amount: number
      currencyCode: string
    }
    subtotalAmount: {
      amount: number
      currencyCode: string
    }
    totalTaxAmount?: {
      amount: number
      currencyCode: string
    }
  }
}

export class ShopifyStorefront {
  private config: ShopifyConfig
  private endpoint: string

  constructor(config: ShopifyConfig) {
    this.config = {
      apiVersion: '2023-10',
      ...config
    }
    this.endpoint = `https://${this.config.shopDomain}/api/${this.config.apiVersion}/graphql.json`
  }

  private async query(query: string, variables?: any) {
    try {
      // Use global fetch if available, otherwise assume it's polyfilled
      const fetchFn = typeof fetch !== 'undefined' ? fetch : globalThis.fetch;
      
      const response = await fetchFn(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.config.storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const { data, errors } = await response.json() as { data: any; errors?: any[] }
      
      if (errors) {
        throw new Error(errors[0].message)
      }

      return data
    } catch (error) {
      console.error('Shopify GraphQL error:', error)
      throw error
    }
  }

  async getProducts(limit = 20, cursor?: string): Promise<{ products: { edges: Array<{ node: any }>, pageInfo: any } }> {
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
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
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

    return this.query(query, { first: limit, after: cursor })
  }

  async getProduct(handle: string): Promise<{ productByHandle: any }> {
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
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
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

    return this.query(query, { handle })
  }

  async searchProducts(searchQuery: string, limit = 20): Promise<{ products: { edges: Array<{ node: any }> } }> {
    const query = `
      query SearchProducts($query: String!, $first: Int!) {
        products(first: $first, query: $query) {
          edges {
            node {
              id
              title
              description
              handle
              availableForSale
              productType
              vendor
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 3) {
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
            }
          }
        }
      }
    `

    return this.query(query, { query: searchQuery, first: limit })
  }

  async getCollections(limit = 20): Promise<{ collections: { edges: Array<{ node: any }> } }> {
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

    return this.query(query, { first: limit })
  }

  async createCart(lines: Array<{ merchandiseId: string; quantity: number }>): Promise<{ cartCreate: any }> {
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

    return this.query(mutation, { input: { lines } })
  }

  async addToCart(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>): Promise<{ cartLinesAdd: any }> {
    const mutation = `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
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

    return this.query(mutation, { cartId, lines })
  }
}

// Transform Shopify product data to our standardized format
export function transformShopifyProduct(shopifyProduct: any): Product {
  const variant = shopifyProduct.variants.edges[0]?.node
  const images = shopifyProduct.images.edges.map((edge: any) => edge.node.url)
  
  // Extract custom metafields
  const metafields = shopifyProduct.metafields || []
  const featured = metafields.find((m: any) => m.key === 'featured')?.value === 'true'
  const category = metafields.find((m: any) => m.key === 'category')?.value || shopifyProduct.productType
  const subcategory = metafields.find((m: any) => m.key === 'subcategory')?.value

  return {
    id: shopifyProduct.id.replace('gid://shopify/Product/', ''),
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description,
    price: variant ? parseFloat(variant.price.amount) : parseFloat(shopifyProduct.priceRange?.minVariantPrice?.amount || '0'),
    salePrice: variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined,
    compareAtPrice: shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount 
      ? parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount) 
      : undefined,
    images,
    category: category || 'General',
    subcategory,
    productType: shopifyProduct.productType,
    vendor: shopifyProduct.vendor,
    tags: shopifyProduct.tags,
    availableForSale: shopifyProduct.availableForSale,
    featured: featured || shopifyProduct.tags.includes('featured'),
    createdAt: shopifyProduct.createdAt,
    updatedAt: shopifyProduct.updatedAt,
    sku: variant?.sku || '',
    inventory: variant?.quantityAvailable || 0,
    inStock: shopifyProduct.availableForSale,
    weight: variant?.weight,
    seo: shopifyProduct.seo,
    variants: shopifyProduct.variants.edges.map((edge: any) => ({
      id: edge.node.id.replace('gid://shopify/ProductVariant/', ''),
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      compareAtPrice: edge.node.compareAtPrice?.amount 
        ? parseFloat(edge.node.compareAtPrice.amount) 
        : undefined,
      availableForSale: edge.node.availableForSale,
      quantityAvailable: edge.node.quantityAvailable,
      selectedOptions: edge.node.selectedOptions,
      image: edge.node.image?.url,
      sku: edge.node.sku,
      weight: edge.node.weight,
      weightUnit: edge.node.weightUnit
    }))
  }
}

// Shopify Service class for easier API usage
export class ShopifyService {
  private storefront: ShopifyStorefront

  constructor(config: ShopifyConfig) {
    this.storefront = new ShopifyStorefront(config)
  }

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

  async getProduct(handle: string): Promise<Product> {
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

  async getCollections(limit = 20): Promise<Collection[]> {
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

  async createCart(lines: Array<{ merchandiseId: string; quantity: number }>): Promise<Cart> {
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

  async addToCart(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>): Promise<Cart> {
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

  private transformCart(shopifyCart: any): Cart {
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
        } : undefined
      }
    }
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
