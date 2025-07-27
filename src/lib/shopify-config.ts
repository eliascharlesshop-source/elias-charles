// Shopify Store Configuration (Storefront API only)
export const shopifyConfig = {
  domain: process.env.SHOPIFY_STORE_DOMAIN!,
  storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  apiVersion: '2024-01',
}

// Validate configuration
export function validateShopifyConfig() {
  const required = [
    'SHOPIFY_STORE_DOMAIN',
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN',
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required Shopify environment variables: ${missing.join(', ')}`)
  }
}
