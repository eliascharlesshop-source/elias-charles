// GraphQL Fragments for reusable query components
export const SHOPIFY_FRAGMENTS = {
  // Product core fields
  PRODUCT_CORE: `
    fragment ProductCore on Product {
      id
      title
      description
      handle
      productType
      vendor
      tags
      createdAt
      updatedAt
      onlineStoreUrl
      availableForSale
      totalInventory
      seo {
        title
        description
      }
    }
  `,

  // Product images
  PRODUCT_IMAGES: `
    fragment ProductImages on Product {
      images(first: 20) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      featuredImage {
        id
        url
        altText
        width
        height
      }
    }
  `,

  // Product variants
  PRODUCT_VARIANTS: `
    fragment ProductVariants on Product {
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            sku
            weight
            weightUnit
            requiresShipping
            taxable
            barcode
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
              handle
            }
          }
        }
      }
      options {
        id
        name
        values
      }
    }
  `,

  // Collection core
  COLLECTION_CORE: `
    fragment CollectionCore on Collection {
      id
      title
      description
      handle
      updatedAt
      seo {
        title
        description
      }
      image {
        id
        url
        altText
        width
        height
      }
    }
  `,

  // Collection products
  COLLECTION_PRODUCTS: `
    fragment CollectionProducts on Collection {
      products(first: 20, sortKey: CREATED_AT, reverse: true) {
        edges {
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
              maxVariantPrice {
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

  // Cart line item
  CART_LINE_ITEM: `
    fragment CartLineItem on CartLine {
      id
      quantity
      estimatedCost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
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
          }
          selectedOptions {
            name
            value
          }
        }
      }
      attributes {
        key
        value
      }
    }
  `,

  // Cart details
  CART_DETAILS: `
    fragment CartDetails on Cart {
      id
      checkoutUrl
      totalQuantity
      estimatedCost {
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
        totalDutyAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        edges {
          node {
            ...CartLineItem
          }
        }
      }
      attributes {
        key
        value
      }
    }
  `,

  // Shop details
  SHOP_DETAILS: `
    fragment ShopDetails on Shop {
      id
      name
      description
      primaryDomain {
        url
        host
      }
      brand {
        logo {
          image {
            url
            altText
          }
        }
        shortDescription
        slogan
      }
      currencyCode
      enabledPresentmentCurrencies
    }
  `,

  // SEO fields
  SEO_FIELDS: `
    fragment SEOFields on SEO {
      title
      description
    }
  `,

  // Money fields
  MONEY_FIELDS: `
    fragment MoneyFields on MoneyV2 {
      amount
      currencyCode
    }
  `,

  // Image fields
  IMAGE_FIELDS: `
    fragment ImageFields on Image {
      id
      url
      altText
      width
      height
    }
  `
};
