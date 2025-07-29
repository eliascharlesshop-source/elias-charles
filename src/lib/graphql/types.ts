// TypeScript interfaces for all Shopify GraphQL responses
// These provide complete type safety for the GraphQL API

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface ShopifyProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  sku?: string;
  barcode?: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  requiresShipping: boolean;
  weight?: number;
  weightUnit: string;
  selectedOptions: ShopifySelectedOption[];
  image?: ShopifyImage;
  product: {
    id: string;
    title: string;
    handle: string;
  };
  unitPrice?: ShopifyMoney;
  unitPriceMeasurement?: {
    measuredType: string;
    quantityUnit: string;
    quantityValue: number;
    referenceUnit: string;
    referenceValue: number;
  };
}

export interface ShopifyProductPriceRange {
  minVariantPrice: ShopifyMoney;
  maxVariantPrice: ShopifyMoney;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  productType: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  totalInventory?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  onlineStoreUrl?: string;
  
  // Images
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
    pageInfo: ShopifyPageInfo;
  };
  featuredImage?: ShopifyImage;
  
  // Variants
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
    pageInfo: ShopifyPageInfo;
  };
  
  // Options
  options: ShopifyProductOption[];
  
  // Pricing
  priceRange: ShopifyProductPriceRange;
  compareAtPriceRange: ShopifyProductPriceRange;
  
  // SEO
  seo: {
    title?: string;
    description?: string;
  };
  
  // Metafields
  metafields: {
    edges: Array<{
      node: ShopifyMetafield;
    }>;
  };
  
  // Collections this product belongs to
  collections: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
      };
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  updatedAt: string;
  
  // Image
  image?: ShopifyImage;
  
  // Products in this collection
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
    pageInfo: ShopifyPageInfo;
    filters: ShopifyFilter[];
  };
  
  // SEO
  seo: {
    title?: string;
    description?: string;
  };
  
  // Metafields
  metafields: {
    edges: Array<{
      node: ShopifyMetafield;
    }>;
  };
}

export interface ShopifyFilter {
  id: string;
  label: string;
  type: 'LIST' | 'PRICE_RANGE' | 'BOOLEAN';
  values: ShopifyFilterValue[];
}

export interface ShopifyFilterValue {
  id: string;
  label: string;
  count: number;
  input: any;
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

// Cart Types
export interface ShopifyCartLine {
  id: string;
  quantity: number;
  estimatedCost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
    compareAtAmountPerQuantity?: ShopifyMoney;
  };
  merchandise: ShopifyProductVariant;
  attributes: Array<{
    key: string;
    value: string;
  }>;
}

export interface ShopifyCartCost {
  totalAmount: ShopifyMoney;
  subtotalAmount: ShopifyMoney;
  totalTaxAmount?: ShopifyMoney;
  totalDutyAmount?: ShopifyMoney;
  checkoutChargeAmount?: ShopifyMoney;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  note?: string;
  
  // Cost breakdown
  estimatedCost: ShopifyCartCost;
  
  // Cart lines (items)
  lines: {
    edges: Array<{
      node: ShopifyCartLine;
    }>;
    pageInfo: ShopifyPageInfo;
  };
  
  // Cart attributes
  attributes: Array<{
    key: string;
    value: string;
  }>;
  
  // Discount codes
  discountCodes: Array<{
    code: string;
    applicable: boolean;
  }>;
  
  // Discount allocations
  discountAllocations: Array<{
    discountedAmount: ShopifyMoney;
    targetType: 'LINE_ITEM' | 'SHIPPING_LINE';
  }>;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Shop Information
export interface ShopifyShop {
  id: string;
  name: string;
  description?: string;
  primaryDomain: {
    url: string;
    host: string;
  };
  
  // Branding
  brand?: {
    logo?: {
      image?: ShopifyImage;
    };
    squareLogo?: {
      image?: ShopifyImage;
    };
    coverImage?: {
      image?: ShopifyImage;
    };
    colors: {
      primary: Array<{
        background: string;
        foreground: string;
      }>;
      secondary: Array<{
        background: string;
        foreground: string;
      }>;
    };
  };
  
  // Policies
  privacyPolicy?: {
    id: string;
    title: string;
    body: string;
    handle: string;
    url: string;
  };
  
  refundPolicy?: {
    id: string;
    title: string;
    body: string;
    handle: string;
    url: string;
  };
  
  shippingPolicy?: {
    id: string;
    title: string;
    body: string;
    handle: string;
    url: string;
  };
  
  termsOfService?: {
    id: string;
    title: string;
    body: string;
    handle: string;
    url: string;
  };
  
  // Payment settings
  paymentSettings: {
    acceptedCardBrands: string[];
    cardVaultUrl: string;
    countryCode: string;
    currencyCode: string;
    enabledPresentmentCurrencies: string[];
    shopifyPaymentsAccountId?: string;
  };
  
  // Metafields
  metafields: {
    edges: Array<{
      node: ShopifyMetafield;
    }>;
  };
}

// Search and Recommendations
export interface ShopifySearchResult {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
    pageInfo: ShopifyPageInfo;
    productFilters: ShopifyFilter[];
  };
  
  collections: {
    edges: Array<{
      node: ShopifyCollection;
    }>;
    pageInfo: ShopifyPageInfo;
  };
  
  pages: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        body: string;
        bodySummary: string;
        url: string;
      };
    }>;
    pageInfo: ShopifyPageInfo;
  };
  
  articles: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        content: string;
        contentHtml: string;
        excerpt?: string;
        publishedAt: string;
        url: string;
        author: {
          displayName: string;
        };
        blog: {
          id: string;
          title: string;
          handle: string;
        };
      };
    }>;
    pageInfo: ShopifyPageInfo;
  };
}

// Mutation Input Types
export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  attributes?: Array<{
    key: string;
    value: string;
  }>;
}

export interface CartLineUpdateInput {
  id: string;
  merchandiseId?: string;
  quantity?: number;
  attributes?: Array<{
    key: string;
    value: string;
  }>;
}

export interface CartInput {
  lines?: CartLineInput[];
  attributes?: Array<{
    key: string;
    value: string;
  }>;
  note?: string;
  discountCodes?: string[];
  buyerIdentity?: {
    countryCode?: string;
    customerAccessToken?: string;
    email?: string;
    phone?: string;
  };
}

// Error Types
export interface ShopifyGraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: (string | number)[];
  extensions?: {
    code?: string;
    exception?: any;
  };
}

export interface ShopifyUserError {
  field?: string[];
  message: string;
  code?: string;
}

// API Response Types
export interface ShopifyGraphQLResponse<T = any> {
  data: T;
  errors?: ShopifyGraphQLError[];
  extensions?: {
    cost?: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

// Mutation Response Types
export interface CartCreateMutationResponse {
  cartCreate: {
    cart?: ShopifyCart;
    userErrors: ShopifyUserError[];
  };
}

export interface CartLinesAddMutationResponse {
  cartLinesAdd: {
    cart?: ShopifyCart;
    userErrors: ShopifyUserError[];
  };
}

export interface CartLinesUpdateMutationResponse {
  cartLinesUpdate: {
    cart?: ShopifyCart;
    userErrors: ShopifyUserError[];
  };
}

export interface CartLinesRemoveMutationResponse {
  cartLinesRemove: {
    cart?: ShopifyCart;
    userErrors: ShopifyUserError[];
  };
}

export interface CartAttributesUpdateMutationResponse {
  cartAttributesUpdate: {
    cart?: ShopifyCart;
    userErrors: ShopifyUserError[];
  };
}

export interface CartDiscountCodesUpdateMutationResponse {
  cartDiscountCodesUpdate: {
    cart?: ShopifyCart;
    userErrors: ShopifyUserError[];
  };
}

// Query Response Types
export interface GetProductsQueryResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
    pageInfo: ShopifyPageInfo;
  };
}

export interface GetProductByHandleQueryResponse {
  productByHandle?: ShopifyProduct;
}

export interface GetProductByIdQueryResponse {
  product?: ShopifyProduct;
}

export interface GetCollectionsQueryResponse {
  collections: {
    edges: Array<{
      node: ShopifyCollection;
    }>;
    pageInfo: ShopifyPageInfo;
  };
}

export interface GetCollectionByHandleQueryResponse {
  collectionByHandle?: ShopifyCollection;
}

export interface GetShopQueryResponse {
  shop: ShopifyShop;
}

export interface SearchQueryResponse {
  search: ShopifySearchResult;
}

export interface GetProductRecommendationsQueryResponse {
  productRecommendations?: ShopifyProduct[];
}

export interface GetCartQueryResponse {
  cart?: ShopifyCart;
}
