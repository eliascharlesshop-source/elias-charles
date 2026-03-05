import { SHOPIFY_FRAGMENTS } from './fragments';

// Enhanced GraphQL queries using fragments for better performance and maintainability
export const SHOPIFY_QUERIES = {
  // Shop information
  GET_SHOP: `
    ${SHOPIFY_FRAGMENTS.SHOP_DETAILS}
    query getShop {
      shop {
        ...ShopDetails
      }
    }
  `,

  // Get all products with pagination and filtering (Storefront API compatible)
  GET_PRODUCTS: `
    ${SHOPIFY_FRAGMENTS.PRODUCT_CORE}
    ${SHOPIFY_FRAGMENTS.PRODUCT_IMAGES}
    query getProducts(
      $first: Int = 20
      $after: String
      $query: String
      $sortKey: ProductSortKeys = CREATED_AT
      $reverse: Boolean = true
    ) {
      products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
        edges {
          cursor
          node {
            ...ProductCore
            ...ProductImages
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  availableForSale
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
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `,

  // Get single product by handle
  GET_PRODUCT_BY_HANDLE: `
    ${SHOPIFY_FRAGMENTS.PRODUCT_CORE}
    ${SHOPIFY_FRAGMENTS.PRODUCT_IMAGES}
    ${SHOPIFY_FRAGMENTS.PRODUCT_VARIANTS}
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        ...ProductCore
        ...ProductImages
        ...ProductVariants
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        metafields(identifiers: [
          {namespace: "custom", key: "featured"}
          {namespace: "custom", key: "sustainability_info"}
          {namespace: "custom", key: "care_instructions"}
        ]) {
          namespace
          key
          value
          type
        }
        collections(first: 10) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    }
  `,

  // Get product by ID
  GET_PRODUCT_BY_ID: `
    ${SHOPIFY_FRAGMENTS.PRODUCT_CORE}
    ${SHOPIFY_FRAGMENTS.PRODUCT_IMAGES}
    ${SHOPIFY_FRAGMENTS.PRODUCT_VARIANTS}
    query getProductById($id: ID!) {
      product(id: $id) {
        ...ProductCore
        ...ProductImages
        ...ProductVariants
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `,

  // Get product recommendations
  GET_PRODUCT_RECOMMENDATIONS: `
    ${SHOPIFY_FRAGMENTS.PRODUCT_CORE}
    query getProductRecommendations($productId: ID!, $intent: ProductRecommendationIntent = RELATED) {
      productRecommendations(productId: $productId, intent: $intent) {
        ...ProductCore
        featuredImage {
          id
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              availableForSale
            }
          }
        }
      }
    }
  `,

  // Get all collections (Storefront API compatible)
  GET_COLLECTIONS: `
    ${SHOPIFY_FRAGMENTS.COLLECTION_CORE}
    query getCollections(
      $first: Int = 20
      $after: String
      $sortKey: CollectionSortKeys = UPDATED_AT
      $reverse: Boolean = true
    ) {
      collections(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        edges {
          cursor
          node {
            ...CollectionCore
            products(first: 4) {
              edges {
                node {
                  id
                  title
                  handle
                  featuredImage {
                    id
                    url
                    altText
                  }
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `,

  // Get collection by handle with products
  GET_COLLECTION_BY_HANDLE: `
    ${SHOPIFY_FRAGMENTS.COLLECTION_CORE}
    ${SHOPIFY_FRAGMENTS.COLLECTION_PRODUCTS}
    query getCollectionByHandle(
      $handle: String!
      $first: Int = 20
      $after: String
      $sortKey: ProductCollectionSortKeys = CREATED
      $reverse: Boolean = true
      $filters: [ProductFilter!]
    ) {
      collectionByHandle(handle: $handle) {
        ...CollectionCore
        ...CollectionProducts
        products(
          first: $first
          after: $after
          sortKey: $sortKey
          reverse: $reverse
          filters: $filters
        ) {
          edges {
            cursor
            node {
              id
              title
              handle
              availableForSale
              featuredImage {
                id
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
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
              variants(first: 1) {
                edges {
                  node {
                    id
                    availableForSale
                    quantityAvailable
                  }
                }
              }
              tags
              productType
              vendor
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          filters {
            id
            label
            type
            values {
              id
              label
              count
              input
            }
          }
        }
      }
    }
  `,

  // Search products
  SEARCH_PRODUCTS: `
    ${SHOPIFY_FRAGMENTS.PRODUCT_CORE}
    query searchProducts(
      $query: String!
      $first: Int = 20
      $after: String
      $sortKey: SearchSortKeys = RELEVANCE
      $reverse: Boolean = false
      $productFilters: [ProductFilter!]
    ) {
      search(query: $query, first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, productFilters: $productFilters, types: PRODUCT) {
        edges {
          cursor
          node {
            ... on Product {
              ...ProductCore
              featuredImage {
                id
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    availableForSale
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
        productFilters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
    }
  `,

  // Get product variant by ID
  GET_PRODUCT_VARIANT: `
    query getProductVariant($id: ID!) {
      productVariant(id: $id) {
        id
        title
        availableForSale
        quantityAvailable
        sku
        weight
        weightUnit
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
        }
        product {
          id
          title
          handle
          vendor
          productType
          tags
        }
      }
    }
  `
};

// Cart mutations using the new Cart API
export const CART_MUTATIONS = {
  // Create cart
  CREATE_CART: `
    ${SHOPIFY_FRAGMENTS.CART_DETAILS}
    ${SHOPIFY_FRAGMENTS.CART_LINE_ITEM}
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `,

  // Add items to cart
  ADD_TO_CART: `
    ${SHOPIFY_FRAGMENTS.CART_DETAILS}
    ${SHOPIFY_FRAGMENTS.CART_LINE_ITEM}
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `,

  // Update cart items
  UPDATE_CART: `
    ${SHOPIFY_FRAGMENTS.CART_DETAILS}
    ${SHOPIFY_FRAGMENTS.CART_LINE_ITEM}
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `,

  // Remove items from cart
  REMOVE_FROM_CART: `
    ${SHOPIFY_FRAGMENTS.CART_DETAILS}
    ${SHOPIFY_FRAGMENTS.CART_LINE_ITEM}
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `,

  // Get cart by ID
  GET_CART: `
    ${SHOPIFY_FRAGMENTS.CART_DETAILS}
    ${SHOPIFY_FRAGMENTS.CART_LINE_ITEM}
    query getCart($id: ID!) {
      cart(id: $id) {
        ...CartDetails
      }
    }
  `,

  // Update cart attributes
  UPDATE_CART_ATTRIBUTES: `
    ${SHOPIFY_FRAGMENTS.CART_DETAILS}
    mutation cartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
      cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
        cart {
          ...CartDetails
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `,

  // Apply discount code
  APPLY_DISCOUNT: `
    ${SHOPIFY_FRAGMENTS.CART_DETAILS}
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          ...CartDetails
          discountCodes {
            applicable
            code
          }
          discountAllocations {
            discountedAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `
};
