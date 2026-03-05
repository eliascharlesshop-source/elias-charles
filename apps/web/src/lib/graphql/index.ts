// Main GraphQL exports for Shopify integration
export { ShopifyGraphQLClient, ShopifyGraphQLError } from './client';
export { ShopifyService } from './service';
export * from './fragments';
export * from './queries';

// Export types explicitly to avoid conflicts
export type {
  ShopifyMoney,
  ShopifyImage,
  ShopifyMetafield,
  ShopifyProductOption,
  ShopifySelectedOption,
  ShopifyProductVariant,
  ShopifyProductPriceRange,
  ShopifyProduct,
  ShopifyCollection,
  ShopifyFilter,
  ShopifyFilterValue,
  ShopifyPageInfo,
  ShopifyCartLine,
  ShopifyCartCost,
  ShopifyCart,
  ShopifyShop,
  ShopifySearchResult,
  CartLineInput,
  CartLineUpdateInput,
  CartInput,
  ShopifyGraphQLError as ShopifyGraphQLErrorType,
  ShopifyUserError,
  ShopifyGraphQLResponse,
  CartCreateMutationResponse,
  CartLinesAddMutationResponse,
  CartLinesUpdateMutationResponse,
  CartLinesRemoveMutationResponse,
  CartAttributesUpdateMutationResponse,
  CartDiscountCodesUpdateMutationResponse,
  GetProductsQueryResponse,
  GetProductByHandleQueryResponse,
  GetProductByIdQueryResponse,
  GetCollectionsQueryResponse,
  GetCollectionByHandleQueryResponse,
  GetShopQueryResponse,
  SearchQueryResponse,
  GetProductRecommendationsQueryResponse,
  GetCartQueryResponse
} from './types';

// Default export for easy initialization
export { ShopifyService as default } from './service';
