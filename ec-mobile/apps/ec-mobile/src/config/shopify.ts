// Shopify configuration for mobile app
export const shopifyConfig = {
  storefrontAccessToken: 'e022fd0dfd98235d169b9e7ecb2517a2',
  shopDomain: 'eliascharles-shop.myshopify.com',
  apiVersion: '2024-01'
};

// Validate configuration
export const validateShopifyConfig = () => {
  if (!shopifyConfig.storefrontAccessToken || !shopifyConfig.shopDomain) {
    throw new Error('Missing Shopify configuration. Please check your environment variables.');
  }
  return true;
};