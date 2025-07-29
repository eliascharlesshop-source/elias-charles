import { ShopifyGraphQLClient } from './client';
import { 
  ShopifyProduct, 
  ShopifyCollection, 
  ShopifyCart, 
  ShopifyShop,
  CartLineInput,
  CartInput,
  GetProductsQueryResponse,
  GetProductByHandleQueryResponse,
  GetCollectionsQueryResponse,
  GetCollectionByHandleQueryResponse,
  SearchQueryResponse,
  GetProductRecommendationsQueryResponse,
  CartCreateMutationResponse,
  CartLinesAddMutationResponse,
  CartLinesUpdateMutationResponse,
  CartLinesRemoveMutationResponse,
  GetCartQueryResponse
} from './types';

// Enhanced Shopify service with optimized GraphQL integration
export class ShopifyService {
  private client: ShopifyGraphQLClient;

  constructor(domain: string, storefrontAccessToken: string, apiVersion: string = '2024-01') {
    this.client = new ShopifyGraphQLClient(domain, storefrontAccessToken, apiVersion);
  }

  // Shop Operations
  async getShop(): Promise<ShopifyShop> {
    const response: any = await this.client.getShop();
    return response.shop;
  }

  // Product Operations
  async getProducts(options: {
    first?: number;
    after?: string;
    query?: string;
    sortKey?: 'TITLE' | 'PRICE' | 'BEST_SELLING' | 'CREATED_AT' | 'ID' | 'PRODUCT_TYPE' | 'RELEVANCE' | 'UPDATED_AT' | 'VENDOR';
    reverse?: boolean;
    cache?: boolean;
  } = {}): Promise<ShopifyProduct[]> {
    const response: any = await this.client.getProducts(options);
    return response.products.edges.map((edge: any) => edge.node);
  }

  async getProductByHandle(handle: string, cache = true): Promise<ShopifyProduct | null> {
    const response: any = await this.client.getProductByHandle(handle, cache);
    return response.productByHandle || null;
  }

  async getProductById(id: string, cache = true): Promise<ShopifyProduct | null> {
    const response: any = await this.client.getProductById(id, cache);
    return response.product || null;
  }

  async getProductRecommendations(
    productId: string, 
    intent: 'RELATED' | 'COMPLEMENTARY' = 'RELATED'
  ): Promise<ShopifyProduct[]> {
    const response: any = await this.client.getProductRecommendations(productId, intent);
    return response.productRecommendations || [];
  }

  async searchProducts(
    query: string,
    options: {
      first?: number;
      after?: string;
      sortKey?: 'RELEVANCE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING';
      reverse?: boolean;
      productFilters?: any[];
    } = {}
  ): Promise<{ products: ShopifyProduct[]; hasNextPage: boolean; endCursor?: string }> {
    const response: any = await this.client.searchProducts(query, options);
    return {
      products: response.search.products.edges.map((edge: any) => edge.node),
      hasNextPage: response.search.products.pageInfo.hasNextPage,
      endCursor: response.search.products.pageInfo.endCursor
    };
  }

  // Collection Operations
  async getCollections(options: {
    first?: number;
    after?: string;
    sortKey?: 'TITLE' | 'UPDATED_AT' | 'ID';
    reverse?: boolean;
    cache?: boolean;
  } = {}): Promise<ShopifyCollection[]> {
    const response: any = await this.client.getCollections(options);
    return response.collections.edges.map((edge: any) => edge.node);
  }

  async getCollectionByHandle(
    handle: string,
    options: {
      first?: number;
      after?: string;
      sortKey?: 'MANUAL' | 'BEST_SELLING' | 'ALPHA_ASC' | 'ALPHA_DESC' | 'PRICE_DESC' | 'PRICE_ASC' | 'CREATED_DESC' | 'CREATED';
      reverse?: boolean;
      filters?: any[];
      cache?: boolean;
    } = {}
  ): Promise<ShopifyCollection | null> {
    const response: any = await this.client.getCollectionByHandle(handle, options);
    return response.collectionByHandle || null;
  }

  // Cart Operations
  async createCart(input: CartInput = {}): Promise<{ cart: ShopifyCart | null; errors: any[] }> {
    const response: any = await this.client.createCart(input);
    return {
      cart: response.cartCreate.cart || null,
      errors: response.cartCreate.userErrors
    };
  }

  async addToCart(cartId: string, lines: CartLineInput[]): Promise<{ cart: ShopifyCart | null; errors: any[] }> {
    const response: any = await this.client.addToCart(cartId, lines);
    return {
      cart: response.cartLinesAdd.cart || null,
      errors: response.cartLinesAdd.userErrors
    };
  }

  async updateCartLines(cartId: string, lines: any[]): Promise<{ cart: ShopifyCart | null; errors: any[] }> {
    const response: any = await this.client.updateCart(cartId, lines);
    return {
      cart: response.cartLinesUpdate.cart || null,
      errors: response.cartLinesUpdate.userErrors
    };
  }

  async removeFromCart(cartId: string, lineIds: string[]): Promise<{ cart: ShopifyCart | null; errors: any[] }> {
    const response: any = await this.client.removeFromCart(cartId, lineIds);
    return {
      cart: response.cartLinesRemove.cart || null,
      errors: response.cartLinesRemove.userErrors
    };
  }

  async getCart(id: string): Promise<ShopifyCart | null> {
    const response: any = await this.client.getCart(id);
    return response.cart || null;
  }

  async updateCartAttributes(cartId: string, attributes: Array<{ key: string; value: string }>): Promise<{ cart: ShopifyCart | null; errors: any[] }> {
    const response: any = await this.client.updateCartAttributes(cartId, attributes);
    return {
      cart: response.cartAttributesUpdate.cart || null,
      errors: response.cartAttributesUpdate.userErrors
    };
  }

  async applyDiscountCode(cartId: string, discountCodes: string[]): Promise<{ cart: ShopifyCart | null; errors: any[] }> {
    const response: any = await this.client.applyDiscount(cartId, discountCodes);
    return {
      cart: response.cartDiscountCodesUpdate.cart || null,
      errors: response.cartDiscountCodesUpdate.userErrors
    };
  }

  // Utility Methods
  async getProductsByCollection(
    collectionHandle: string,
    options: {
      first?: number;
      after?: string;
      sortKey?: 'MANUAL' | 'BEST_SELLING' | 'ALPHA_ASC' | 'ALPHA_DESC' | 'PRICE_DESC' | 'PRICE_ASC' | 'CREATED_DESC' | 'CREATED';
      reverse?: boolean;
      filters?: any[];
    } = {}
  ): Promise<{ products: ShopifyProduct[]; hasNextPage: boolean; endCursor?: string }> {
    const collection = await this.getCollectionByHandle(collectionHandle, options);
    if (!collection) {
      return { products: [], hasNextPage: false };
    }

    return {
      products: collection.products.edges.map((edge: any) => edge.node),
      hasNextPage: collection.products.pageInfo.hasNextPage,
      endCursor: collection.products.pageInfo.endCursor
    };
  }

  async getFeaturedProducts(limit = 8): Promise<ShopifyProduct[]> {
    // Get products sorted by best selling or featured logic
    const products = await this.getProducts({
      first: limit,
      sortKey: 'BEST_SELLING',
      cache: true
    });
    
    return products;
  }

  async getNewArrivals(limit = 12): Promise<ShopifyProduct[]> {
    const products = await this.getProducts({
      first: limit,
      sortKey: 'CREATED_AT',
      reverse: true,
      cache: true
    });
    
    return products;
  }

  async getProductsByTag(tag: string, limit = 20): Promise<ShopifyProduct[]> {
    const products = await this.getProducts({
      first: limit,
      query: `tag:${tag}`,
      cache: true
    });
    
    return products;
  }

  async getProductsByType(productType: string, limit = 20): Promise<ShopifyProduct[]> {
    const products = await this.getProducts({
      first: limit,
      query: `product_type:${productType}`,
      cache: true
    });
    
    return products;
  }

  async getProductsByVendor(vendor: string, limit = 20): Promise<ShopifyProduct[]> {
    const products = await this.getProducts({
      first: limit,
      query: `vendor:${vendor}`,
      cache: true
    });
    
    return products;
  }

  // Price formatting utilities
  formatPrice(money: { amount: string; currencyCode: string }): string {
    const amount = parseFloat(money.amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: money.currencyCode,
    }).format(amount);
  }

  // Check if product has multiple variants
  hasMultipleVariants(product: ShopifyProduct): boolean {
    return product.variants.edges.length > 1;
  }

  // Get available variants for a product
  getAvailableVariants(product: ShopifyProduct) {
    return product.variants.edges
      .map(edge => edge.node)
      .filter(variant => variant.availableForSale);
  }

  // Get product images
  getProductImages(product: ShopifyProduct) {
    return product.images.edges.map(edge => edge.node);
  }

  // Get variant by selected options
  getVariantBySelectedOptions(product: ShopifyProduct, selectedOptions: { [key: string]: string }) {
    return product.variants.edges
      .map(edge => edge.node)
      .find(variant => {
        return variant.selectedOptions.every(option => 
          selectedOptions[option.name] === option.value
        );
      });
  }

  // Cart item count
  getCartItemCount(cart: ShopifyCart): number {
    return cart.totalQuantity;
  }

  // Cart total
  getCartTotal(cart: ShopifyCart): string {
    return this.formatPrice(cart.estimatedCost.totalAmount);
  }

  // Cache management
  clearCache(): void {
    this.client.clearCache();
  }

  getCacheStats() {
    return this.client.getCacheStats();
  }

  // Batch operations for performance
  async batchGetProducts(handles: string[]): Promise<(ShopifyProduct | null)[]> {
    const requests = handles.map(handle => ({
      query: 'getProductByHandle',
      variables: { handle },
      options: { cache: true }
    }));

    const results = await this.client.batchRequest(requests);
    return results.map((result: any) => 
      result.status === 'fulfilled' && result.value?.productByHandle 
        ? result.value.productByHandle 
        : null
    );
  }

  // Advanced search with filters
  async advancedSearch(options: {
    query?: string;
    productType?: string;
    vendor?: string;
    tags?: string[];
    priceMin?: number;
    priceMax?: number;
    available?: boolean;
    sortKey?: string;
    reverse?: boolean;
    first?: number;
  }): Promise<ShopifyProduct[]> {
    let searchQuery = options.query || '';
    
    if (options.productType) {
      searchQuery += ` product_type:${options.productType}`;
    }
    
    if (options.vendor) {
      searchQuery += ` vendor:${options.vendor}`;
    }
    
    if (options.tags && options.tags.length > 0) {
      searchQuery += ` tag:${options.tags.join(' OR tag:')}`;
    }
    
    if (options.available !== undefined) {
      searchQuery += ` available:${options.available}`;
    }

    const { products } = await this.searchProducts(searchQuery.trim(), {
      first: options.first || 20,
      sortKey: options.sortKey as any || 'RELEVANCE',
      reverse: options.reverse || false
    });

    // Apply price filtering on the client side if needed
    let filteredProducts = products;
    if (options.priceMin !== undefined || options.priceMax !== undefined) {
      filteredProducts = products.filter(product => {
        const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
        const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
        
        if (options.priceMin !== undefined && maxPrice < options.priceMin) return false;
        if (options.priceMax !== undefined && minPrice > options.priceMax) return false;
        
        return true;
      });
    }

    return filteredProducts;
  }
}
