#!/usr/bin/env node

/**
 * EC Store - Comprehensive Shopify Integration Test
 * Consolidated test script for all Shopify functionality
 * 
 * Tests:
 * - Environment configuration
 * - Shopify Storefront API connection
 * - Products API
 * - Collections API  
 * - File structure validation
 * - Performance metrics
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

console.log('🧪 EC Store - Shopify Integration Test');
console.log('=====================================\n');

// Utility function for making GraphQL requests
function makeGraphQLRequest(query, testName) {
  return new Promise((resolve) => {
    const startTime = Date.now();
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
        const responseTime = Date.now() - startTime;
        
        try {
          const response = JSON.parse(data);
          
          if (response.errors) {
            console.log(`❌ ${testName} - GraphQL Errors:`, response.errors.map(e => e.message));
            resolve({ success: false, responseTime, errors: response.errors });
            return;
          }
          
          resolve({ 
            success: true, 
            responseTime, 
            data: response.data,
            statusCode: res.statusCode 
          });
        } catch (error) {
          console.log(`❌ ${testName} - Parse Error:`, error.message);
          resolve({ success: false, responseTime, error: error.message });
        }
      });
    });
    
    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${testName} - Request Error:`, error.message);
      resolve({ success: false, responseTime, error: error.message });
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 1: Environment Configuration
function testEnvironmentConfig() {
  console.log('1️⃣ Environment Configuration Test');
  console.log('--------------------------------');
  
  const requiredVars = [
    'SHOPIFY_STORE_DOMAIN',
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.log('❌ Missing environment variables:', missing.join(', '));
    console.log('\n🔧 To fix this:');
    console.log('   1. Create/update .env.local file');
    console.log('   2. Add missing variables');
    console.log('   3. Get credentials from Shopify Admin > Apps > Private Apps');
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  console.log(`   Store Domain: ${SHOPIFY_CONFIG.storeDomain}`);
  console.log(`   API Version: ${SHOPIFY_CONFIG.apiVersion}`);
  console.log(`   Token: ${SHOPIFY_CONFIG.storefrontToken.substring(0, 8)}...`);
  console.log(`   Use Shopify: ${process.env.NEXT_PUBLIC_USE_SHOPIFY || 'not set'}`);
  return true;
}

// Test 2: Shop Information
async function testShopInfo() {
  console.log('\n2️⃣ Shop Information Test');
  console.log('------------------------');
  
  const query = `
    query {
      shop {
        name
        description
        primaryDomain {
          url
        }
        paymentSettings {
          currencyCode
        }
      }
    }
  `;
  
  const result = await makeGraphQLRequest(query, 'Shop Info');
  
  if (result.success && result.data?.shop) {
    console.log('✅ Successfully connected to Shopify Storefront API');
    console.log(`   Shop Name: ${result.data.shop.name}`);
    console.log(`   Domain: ${result.data.shop.primaryDomain?.url}`);
    console.log(`   Currency: ${result.data.shop.paymentSettings?.currencyCode}`);
    console.log(`   Response Time: ${result.responseTime}ms`);
    return true;
  } else {
    console.log('❌ Failed to fetch shop information');
    return false;
  }
}

// Test 3: Products API
async function testProductsAPI() {
  console.log('\n3️⃣ Products API Test');
  console.log('--------------------');
  
  const query = `
    query {
      products(first: 5) {
        edges {
          node {
            id
            title
            handle
            availableForSale
            description
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
                  availableForSale
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
  
  const result = await makeGraphQLRequest(query, 'Products');
  
  if (result.success && result.data?.products) {
    const products = result.data.products.edges;
    console.log(`✅ Successfully fetched ${products.length} products`);
    console.log(`   Response Time: ${result.responseTime}ms`);
    
    if (products.length > 0) {
      console.log('\n📦 Product Preview:');
      products.slice(0, 3).forEach((product, index) => {
        const p = product.node;
        const variant = p.variants.edges[0]?.node;
        const image = p.images.edges[0]?.node;
        
        console.log(`   ${index + 1}. ${p.title}`);
        console.log(`      Handle: ${p.handle}`);
        console.log(`      Available: ${p.availableForSale}`);
        console.log(`      Price: ${variant?.price?.amount} ${variant?.price?.currencyCode}`);
        console.log(`      Image: ${image ? '✅' : '❌'}`);
      });
    }
    
    return true;
  } else {
    console.log('❌ Failed to fetch products');
    return false;
  }
}

// Test 4: Collections API  
async function testCollectionsAPI() {
  console.log('\n4️⃣ Collections API Test');
  console.log('-----------------------');
  
  const query = `
    query {
      collections(first: 5) {
        edges {
          node {
            id
            title
            handle
            description
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
  
  const result = await makeGraphQLRequest(query, 'Collections');
  
  if (result.success && result.data?.collections) {
    const collections = result.data.collections.edges;
    console.log(`✅ Successfully fetched ${collections.length} collections`);
    console.log(`   Response Time: ${result.responseTime}ms`);
    
    if (collections.length > 0) {
      console.log('\n📂 Collections Preview:');
      collections.slice(0, 3).forEach((collection, index) => {
        const c = collection.node;
        console.log(`   ${index + 1}. ${c.title}`);
        console.log(`      Handle: ${c.handle}`);
        console.log(`      Products: ${c.products.edges.length}`);
        console.log(`      Image: ${c.image ? '✅' : '❌'}`);
      });
    }
    
    return true;
  } else {
    console.log('❌ Failed to fetch collections');
    return false;
  }
}

// Test 5: File Structure Validation
function testFileStructure() {
  console.log('\n5️⃣ File Structure Test');
  console.log('----------------------');
  
  const criticalFiles = [
    'src/lib/shopify.ts',
    'lib/shopify-service.ts', 
    'app/api/shopify/products/route.ts',
    'app/api/shopify/collections/route.ts'
  ];
  
  const optionalFiles = [
    'lib/shopify-storefront.ts',
    'app/api/shopify/cart/route.ts',
    'app/api/shopify/checkout/route.ts',
    'ec-mobile/shopify-sdk/src/lib/shopify-sdk.ts'
  ];
  
  let criticalPassed = 0;
  let optionalPassed = 0;
  
  console.log('Critical Files:');
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}`);
      criticalPassed++;
    } else {
      console.log(`   ❌ ${file} - Missing`);
    }
  });
  
  console.log('\nOptional Files:');
  optionalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}`);
      optionalPassed++;
    } else {
      console.log(`   ⚠️  ${file} - Missing (optional)`);
    }
  });
  
  console.log(`\nFile Check: ${criticalPassed}/${criticalFiles.length} critical, ${optionalPassed}/${optionalFiles.length} optional`);
  
  return criticalPassed === criticalFiles.length;
}

// Test 6: Specific Product Test (TEST_EC)
async function testSpecificProduct() {
  console.log('\n6️⃣ Specific Product Test (TEST_EC)');
  console.log('----------------------------------');
  
  const query = `
    query {
      products(first: 10, query: "TEST_EC") {
        edges {
          node {
            id
            title
            handle
            availableForSale
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
  `;
  
  const result = await makeGraphQLRequest(query, 'TEST_EC Product');
  
  if (result.success && result.data?.products) {
    const products = result.data.products.edges;
    console.log(`✅ Found ${products.length} products matching 'TEST_EC'`);
    
    if (products.length > 0) {
      const testProduct = products[0].node;
      console.log(`   Product: ${testProduct.title}`);
      console.log(`   Handle: ${testProduct.handle}`);
      console.log(`   Available: ${testProduct.availableForSale}`);
      console.log(`   This confirms live Shopify connection!`);
    }
    
    return products.length > 0;
  } else {
    console.log('❌ Failed to search for TEST_EC product');
    return false;
  }
}

// Main test runner
async function runAllTests() {
  const startTime = Date.now();
  const results = [];
  
  try {
    console.log('Starting comprehensive Shopify integration test...\n');
    
    // Run all tests sequentially
    results.push({ name: 'Environment Config', result: testEnvironmentConfig() });
    results.push({ name: 'Shop Information', result: await testShopInfo() });
    results.push({ name: 'Products API', result: await testProductsAPI() });
    results.push({ name: 'Collections API', result: await testCollectionsAPI() });
    results.push({ name: 'File Structure', result: testFileStructure() });
    results.push({ name: 'TEST_EC Product', result: await testSpecificProduct() });
    
    const totalTime = Date.now() - startTime;
    
    // Generate summary
    console.log('\n📊 Test Results Summary');
    console.log('=======================');
    
    const passed = results.filter(r => r.result).length;
    const total = results.length;
    
    results.forEach(test => {
      console.log(`${test.result ? '✅' : '❌'} ${test.name}`);
    });
    
    console.log(`\n📈 Overall: ${passed}/${total} tests passed`);
    console.log(`⏱️  Total Time: ${totalTime}ms`);
    
    if (passed === total) {
      console.log('\n🎉 All tests passed! Your Shopify integration is working perfectly.');
      console.log('\n🚀 Next Steps:');
      console.log('   1. Start your web store: npm run dev');
      console.log('   2. Test mobile app: cd ec-mobile && npm run start');
      console.log('   3. Visit http://localhost:3000 to see your live store');
      console.log('   4. Products are loading from your live Shopify store!');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the errors above.');
      console.log('\n🔧 Common fixes:');
      console.log('   - Verify .env.local has correct Shopify credentials');
      console.log('   - Check Shopify store is accessible');
      console.log('   - Ensure Storefront API permissions are enabled');
    }
    
    return passed === total;
    
  } catch (error) {
    console.error('\n❌ Test runner failed:', error);
    return false;
  }
}

// CLI execution
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests, testEnvironmentConfig, testShopInfo, testProductsAPI, testCollectionsAPI };
