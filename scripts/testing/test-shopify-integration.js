#!/usr/bin/env node

/**
 * Comprehensive Shopify Integration Test
 * Tests both webapp and mobile app Shopify connections
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SHOPIFY_CONFIG = {
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
  storefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  apiVersion: process.env.SHOPIFY_API_VERSION || '2024-01'
};

console.log('🧪 Starting Shopify Integration Tests...\n');

// Test 1: Environment Configuration
function testEnvironmentConfig() {
  console.log('1️⃣ Testing Environment Configuration...');
  
  const requiredVars = ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.log('❌ Missing environment variables:', missing.join(', '));
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  console.log(`   Store Domain: ${SHOPIFY_CONFIG.storeDomain}`);
  console.log(`   API Version: ${SHOPIFY_CONFIG.apiVersion}`);
  console.log(`   Token: ${SHOPIFY_CONFIG.storefrontToken.substring(0, 8)}...`);
  return true;
}

// Test 2: Shopify Storefront API Connection
function testStorefrontAPI() {
  return new Promise((resolve) => {
    console.log('\n2️⃣ Testing Shopify Storefront API Connection...');
    
    const query = `
      query {
        shop {
          name
          description
          primaryDomain {
            url
          }
        }
      }
    `;
    
    const postData = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_CONFIG.storeDomain,
      port: 443,
      path: `/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontToken
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.errors) {
            console.log('❌ GraphQL Errors:', response.errors);
            resolve(false);
            return;
          }
          
          if (response.data && response.data.shop) {
            console.log('✅ Successfully connected to Shopify Storefront API');
            console.log(`   Shop Name: ${response.data.shop.name}`);
            console.log(`   Domain: ${response.data.shop.primaryDomain.url}`);
            resolve(true);
          } else {
            console.log('❌ Unexpected response structure:', response);
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Failed to parse response:', error.message);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request failed:', error.message);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 3: Products API
function testProductsAPI() {
  return new Promise((resolve) => {
    console.log('\n3️⃣ Testing Products API...');
    
    const query = `
      query {
        products(first: 3) {
          edges {
            node {
              id
              title
              description
              handle
              availableForSale
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
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
          }
        }
      }
    `;
    
    const postData = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_CONFIG.storeDomain,
      port: 443,
      path: `/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontToken
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.errors) {
            console.log('❌ GraphQL Errors:', response.errors);
            resolve(false);
            return;
          }
          
          if (response.data && response.data.products) {
            const products = response.data.products.edges;
            console.log(`✅ Successfully fetched ${products.length} products`);
            
            products.forEach((product, index) => {
              const p = product.node;
              const variant = p.variants.edges[0]?.node;
              const image = p.images.edges[0]?.node;
              
              console.log(`   Product ${index + 1}:`);
              console.log(`     Title: ${p.title}`);
              console.log(`     Handle: ${p.handle}`);
              console.log(`     Available: ${p.availableForSale}`);
              console.log(`     Price: ${variant?.price?.amount} ${variant?.price?.currencyCode}`);
              console.log(`     Image: ${image ? 'Yes' : 'No'}`);
            });
            
            resolve(true);
          } else {
            console.log('❌ No products found or unexpected response structure');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Failed to parse response:', error.message);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request failed:', error.message);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 4: Collections API
function testCollectionsAPI() {
  return new Promise((resolve) => {
    console.log('\n4️⃣ Testing Collections API...');
    
    const query = `
      query {
        collections(first: 5) {
          edges {
            node {
              id
              title
              description
              handle
              image {
                url
                altText
              }
              products(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    const postData = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_CONFIG.storeDomain,
      port: 443,
      path: `/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontToken
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.errors) {
            console.log('❌ GraphQL Errors:', response.errors);
            resolve(false);
            return;
          }
          
          if (response.data && response.data.collections) {
            const collections = response.data.collections.edges;
            console.log(`✅ Successfully fetched ${collections.length} collections`);
            
            collections.forEach((collection, index) => {
              const c = collection.node;
              console.log(`   Collection ${index + 1}:`);
              console.log(`     Title: ${c.title}`);
              console.log(`     Handle: ${c.handle}`);
              console.log(`     Products: ${c.products.edges.length}`);
              console.log(`     Image: ${c.image ? 'Yes' : 'No'}`);
            });
            
            resolve(true);
          } else {
            console.log('❌ No collections found or unexpected response structure');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Failed to parse response:', error.message);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Request failed:', error.message);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 5: File Structure
function testFileStructure() {
  console.log('\n5️⃣ Testing File Structure...');
  
  const requiredFiles = [
    'src/lib/shopify.ts',
    'lib/shopify-service.ts',
    'lib/shopify-services.ts',
    'app/api/shopify/products/route.ts',
    'app/api/shopify/collections/route.ts',
    'app/api/shopify/cart/route.ts',
    'app/api/shopify/checkout/route.ts',
    'ec-mobile/shopify-sdk/src/lib/shopify-sdk.ts',
    'ec-mobile/apps/ec-mobile/src/config/shopify.ts'
  ];
  
  let allExist = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - Missing`);
      allExist = false;
    }
  });
  
  return allExist;
}

// Main test runner
async function runTests() {
  const results = [];
  
  // Run all tests
  results.push(testEnvironmentConfig());
  results.push(await testStorefrontAPI());
  results.push(await testProductsAPI());
  results.push(await testCollectionsAPI());
  results.push(testFileStructure());
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Your Shopify integration is working correctly.');
    console.log('\n📱 Next Steps:');
    console.log('   1. Run your webapp: npm run dev');
    console.log('   2. Test mobile app: cd ec-mobile && npm run start');
    console.log('   3. Verify products load correctly in both apps');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above and fix them.');
  }
  
  process.exit(passed === total ? 0 : 1);
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});