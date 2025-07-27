import Client from 'shopify-buy'
import { shopifyConfig } from './shopify-config'

// Storefront API Client for customer-facing operations
export const storefrontClient = Client.buildClient({
  domain: shopifyConfig.domain,
  storefrontAccessToken: shopifyConfig.storefrontAccessToken,
  apiVersion: shopifyConfig.apiVersion
})

// GraphQL queries for Shopify Storefront API
export const SHOPIFY_QUERIES = {
  // Get all products
  GET_PRODUCTS: `
    query getProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            description
            handle
            images(first: 10) {
              edges {
                node {
                  id
                  src
                  altText
                }
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
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            productType
            tags
            vendor
            createdAt
            updatedAt
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,

  // Get single product
  GET_PRODUCT: `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        handle
        images(first: 20) {
          edges {
            node {
              id
              src
              altText
            }
          }
        }
        variants(first: 20) {
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
              selectedOptions {
                name
                value
              }
            }
          }
        }
        productType
        tags
        vendor
        seo {
          title
          description
        }
      }
    }
  `,

  // Get collections
  GET_COLLECTIONS: `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            image {
              src
              altText
            }
            products(first: 20) {
              edges {
                node {
                  id
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        src
                        altText
                      }
                    }
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        price {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  // Create checkout
  CREATE_CHECKOUT: `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          lineItems(first: 250) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
          subtotalPrice {
            amount
            currencyCode
          }
          totalTax {
            amount
            currencyCode
          }
          totalPrice {
            amount
            currencyCode
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `,

  // Add line items to checkout
  ADD_LINE_ITEMS: `
    mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
      checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout {
          id
          webUrl
          lineItems(first: 250) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          subtotalPrice {
            amount
            currencyCode
          }
          totalPrice {
            amount
            currencyCode
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `,

  // Remove line items
  REMOVE_LINE_ITEMS: `
    mutation checkoutLineItemsRemove($checkoutId: ID!, $lineItemIds: [ID!]!) {
      checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
        checkout {
          id
          lineItems(first: 250) {
            edges {
              node {
                id
                title
                quantity
              }
            }
          }
          subtotalPrice {
            amount
            currencyCode
          }
          totalPrice {
            amount
            currencyCode
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `,

  // Update line items
  UPDATE_LINE_ITEMS: `
    mutation checkoutLineItemsUpdate($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
      checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout {
          id
          lineItems(first: 250) {
            edges {
              node {
                id
                title
                quantity
              }
            }
          }
          subtotalPrice {
            amount
            currencyCode
          }
          totalPrice {
            amount
            currencyCode
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `
}

// Helper function to make GraphQL requests
export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const response = await fetch(`https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`)
  }

  const result = await response.json()
  
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
  }

  return result.data
}
