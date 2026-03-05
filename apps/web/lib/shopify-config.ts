// Shopify Store Configuration (Storefront API only)
export const shopifyConfig = {
  domain: process.env.SHOPIFY_STORE_DOMAIN!,
  storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  apiVersion: process.env.SHOPIFY_API_VERSION || '2024-01',
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

// Check if Shopify is enabled and configured
export function isShopifyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_SHOPIFY === 'true' && 
         Boolean(process.env.SHOPIFY_STORE_DOMAIN) && 
         Boolean(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN)
}

// Get store URL for redirects
export function getShopifyStoreUrl(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  if (!domain) {
    throw new Error('SHOPIFY_STORE_DOMAIN is not configured')
  }
  return `https://${domain}`
}