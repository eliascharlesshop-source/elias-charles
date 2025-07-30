#!/usr/bin/env node

/**
 * Test Shopify Connection Script
 * Run this to verify your Shopify credentials are working
 */

require('dotenv').config({ path: '.env.local' });

async function testShopifyConnection() {
  console.log('🔍 Testing Shopify Configuration...\n');

  // Check environment variables
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const useShopify = process.env.NEXT_PUBLIC_USE_SHOPIFY;

  console.log('Environment Variables:');
  console.log(`SHOPIFY_STORE_DOMAIN: ${domain ? '✅ Set' : '❌ Missing'}`);
  console.log(`SHOPIFY_STOREFRONT_ACCESS_TOKEN: ${token ? '✅ Set' : '❌ Missing'}`);
  console.log(`NEXT_PUBLIC_USE_SHOPIFY: ${useShopify || '❌ Missing'}\n`);

  if (!domain || !token) {
    console.log('❌ Missing required Shopify credentials');
    return;
  }

  // Test GraphQL connection
  try {
    console.log('🌐 Testing Shopify GraphQL API...');
    
    const query = `
      query shopInfo {
        shop {
          name
          description
          url
          currencyCode
        }
      }
    `;

    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.log('❌ GraphQL Errors:', data.errors);
      return;
    }

    if (data.data?.shop) {
      console.log('✅ Shopify Connection Successful!');
      console.log(`Shop Name: ${data.data.shop.name}`);
      console.log(`Shop URL: ${data.data.shop.url}`);
      console.log(`Currency: ${data.data.shop.currencyCode}`);
    } else {
      console.log('⚠️  Connected but no shop data returned');
    }

  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('💡 Check your SHOPIFY_STOREFRONT_ACCESS_TOKEN');
    } else if (error.message.includes('404')) {
      console.log('💡 Check your SHOPIFY_STORE_DOMAIN');
    }
  }
}

testShopifyConnection();
