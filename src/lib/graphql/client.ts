import { SHOPIFY_QUERIES, CART_MUTATIONS } from './queries';

// Enhanced Shopify GraphQL client with caching, error handling, and optimization
export class ShopifyGraphQLClient {
  private domain: string;
  private storefrontAccessToken: string;
  private apiVersion: string;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private baseUrl: string;

  constructor(domain: string, storefrontAccessToken: string, apiVersion: string = '2024-01') {
    this.domain = domain;
    this.storefrontAccessToken = storefrontAccessToken;
    this.apiVersion = apiVersion;
    this.cache = new Map();
    this.baseUrl = `https://${domain}/api/${apiVersion}/graphql.json`;
  }

  // Main GraphQL request method with caching and error handling
  async request<T>(
    query: string,
    variables: Record<string, any> = {},
    options: {
      cache?: boolean;
      cacheTTL?: number; // Time to live in milliseconds
      retries?: number;
    } = {}
  ): Promise<T> {
    const { cache = false, cacheTTL = 300000, retries = 3 } = options; // Default 5 min cache

    // Generate cache key
    const cacheKey = cache ? this.generateCacheKey(query, variables) : null;
    
    // Check cache first
    if (cacheKey && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    // Make request with retries
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': this.storefrontAccessToken,
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.errors && result.errors.length > 0) {
          throw new ShopifyGraphQLError(result.errors, query, variables);
        }

        // Cache successful response
        if (cacheKey && result.data) {
          this.cache.set(cacheKey, {
            data: result.data,
            timestamp: Date.now(),
            ttl: cacheTTL
          });
        }

        return result.data;
      } catch (error) {
        lastError = error as Error;
        if (attempt < retries - 1) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError;
  }

  // Optimized method for getting shop information
  async getShop(cache = true) {
    return this.request<any>(SHOPIFY_QUERIES.GET_SHOP, {}, { cache, cacheTTL: 600000 }); // 10 min cache
  }

  // Get products with advanced filtering and pagination
  async getProducts(options: {
    first?: number;
    after?: string;
    query?: string;
    sortKey?: string;
    reverse?: boolean;
    cache?: boolean;
  } = {}) {
    const { first = 20, after, query, sortKey = 'CREATED_AT', reverse = true, cache = true } = options;
    
    return this.request<any>(
      SHOPIFY_QUERIES.GET_PRODUCTS,
      { first, after, query, sortKey, reverse },
      { cache, cacheTTL: 180000 } // 3 min cache
    );
  }

  // Get single product by handle with caching
  async getProductByHandle(handle: string, cache = true) {
    return this.request<any>(
      SHOPIFY_QUERIES.GET_PRODUCT_BY_HANDLE,
      { handle },
      { cache, cacheTTL: 300000 } // 5 min cache
    );
  }

  // Get product by ID
  async getProductById(id: string, cache = true) {
    return this.request<any>(
      SHOPIFY_QUERIES.GET_PRODUCT_BY_ID,
      { id },
      { cache, cacheTTL: 300000 }
    );
  }

  // Get product recommendations
  async getProductRecommendations(productId: string, intent = 'RELATED', cache = true) {
    return this.request<any>(
      SHOPIFY_QUERIES.GET_PRODUCT_RECOMMENDATIONS,
      { productId, intent },
      { cache, cacheTTL: 600000 } // 10 min cache
    );
  }

  // Get collections with products
  async getCollections(options: {
    first?: number;
    after?: string;
    sortKey?: string;
    reverse?: boolean;
    cache?: boolean;
  } = {}) {
    const { first = 20, after, sortKey = 'UPDATED_AT', reverse = true, cache = true } = options;
    
    return this.request<any>(
      SHOPIFY_QUERIES.GET_COLLECTIONS,
      { first, after, sortKey, reverse },
      { cache, cacheTTL: 300000 } // 5 min cache
    );
  }

  // Get collection by handle with products
  async getCollectionByHandle(
    handle: string,
    options: {
      first?: number;
      after?: string;
      sortKey?: string;
      reverse?: boolean;
      filters?: any[];
      cache?: boolean;
    } = {}
  ) {
    const { first = 20, after, sortKey = 'CREATED', reverse = true, filters, cache = true } = options;
    
    return this.request<any>(
      SHOPIFY_QUERIES.GET_COLLECTION_BY_HANDLE,
      { handle, first, after, sortKey, reverse, filters },
      { cache, cacheTTL: 180000 } // 3 min cache
    );
  }

  // Search products
  async searchProducts(
    query: string,
    options: {
      first?: number;
      after?: string;
      sortKey?: string;
      reverse?: boolean;
      productFilters?: any[];
      cache?: boolean;
    } = {}
  ) {
    const { first = 20, after, sortKey = 'RELEVANCE', reverse = false, productFilters, cache = false } = options;
    
    return this.request<any>(
      SHOPIFY_QUERIES.SEARCH_PRODUCTS,
      { query, first, after, sortKey, reverse, productFilters },
      { cache, cacheTTL: 60000 } // 1 min cache for search
    );
  }

  // Get product variant
  async getProductVariant(id: string, cache = true) {
    return this.request<any>(
      SHOPIFY_QUERIES.GET_PRODUCT_VARIANT,
      { id },
      { cache, cacheTTL: 300000 }
    );
  }

  // Cart operations (no caching for cart operations)
  async createCart(input: any) {
    return this.request<any>(CART_MUTATIONS.CREATE_CART, { input });
  }

  async addToCart(cartId: string, lines: any[]) {
    return this.request<any>(CART_MUTATIONS.ADD_TO_CART, { cartId, lines });
  }

  async updateCart(cartId: string, lines: any[]) {
    return this.request<any>(CART_MUTATIONS.UPDATE_CART, { cartId, lines });
  }

  async removeFromCart(cartId: string, lineIds: string[]) {
    return this.request<any>(CART_MUTATIONS.REMOVE_FROM_CART, { cartId, lineIds });
  }

  async getCart(id: string) {
    return this.request<any>(CART_MUTATIONS.GET_CART, { id });
  }

  async updateCartAttributes(cartId: string, attributes: any[]) {
    return this.request<any>(CART_MUTATIONS.UPDATE_CART_ATTRIBUTES, { cartId, attributes });
  }

  async applyDiscount(cartId: string, discountCodes: string[]) {
    return this.request<any>(CART_MUTATIONS.APPLY_DISCOUNT, { cartId, discountCodes });
  }

  // Utility methods
  private generateCacheKey(query: string, variables: Record<string, any>): string {
    return `${query.slice(0, 50)}_${JSON.stringify(variables)}`.replace(/\s/g, '');
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Batch requests (for performance optimization)
  async batchRequest(requests: Array<{ query: string; variables?: any; options?: any }>) {
    const promises = requests.map(({ query, variables, options }) => 
      this.request(query, variables, options)
    );
    return Promise.allSettled(promises);
  }
}

// Custom error class for GraphQL errors
export class ShopifyGraphQLError extends Error {
  public errors: any[];
  public query: string;
  public variables: Record<string, any>;

  constructor(errors: any[], query: string, variables: Record<string, any>) {
    const message = `GraphQL Error: ${errors.map(e => e.message).join(', ')}`;
    super(message);
    this.name = 'ShopifyGraphQLError';
    this.errors = errors;
    this.query = query;
    this.variables = variables;
  }
}
