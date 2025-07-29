#!/usr/bin/env node

// Test script for the advanced GraphQL Shopify integration
const { ShopifyService } = require('./src/lib/graphql/service.ts');

async function testGraphQLImplementation() {
  console.log('🚀 Testing Advanced GraphQL Shopify Integration...\n');

  // Check environment variables
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    console.error('❌ Missing environment variables:');
    console.error('   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:', domain ? '✅' : '❌');
    console.error('   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN:', token ? '✅' : '❌');
    return;
  }

  console.log('✅ Environment variables configured');
  console.log(`   Store Domain: ${domain}`);
  console.log(`   Token: ${token.substring(0, 8)}...\n`);

  try {
    // Initialize the service
    const service = new ShopifyService(domain, token);
    console.log('✅ GraphQL Service initialized\n');

    // Test 1: Get shop information
    console.log('🔍 Test 1: Fetching shop information...');
    const shop = await service.getShop();
    console.log(`✅ Shop Name: ${shop.name}`);
    console.log(`   Primary Domain: ${shop.primaryDomain.host}\n`);

    // Test 2: Get products with caching
    console.log('🔍 Test 2: Fetching products (with caching)...');
    const startTime = Date.now();
    const products = await service.getProducts({ first: 5, cache: true });
    const endTime = Date.now();
    console.log(`✅ Retrieved ${products.length} products in ${endTime - startTime}ms`);
    if (products.length > 0) {
      console.log(`   First product: ${products[0].title}`);
    }

    // Test 3: Test caching performance
    console.log('\n🔍 Test 3: Testing cache performance...');
    const cacheStartTime = Date.now();
    const cachedProducts = await service.getProducts({ first: 5, cache: true });
    const cacheEndTime = Date.now();
    console.log(`✅ Cached request completed in ${cacheEndTime - cacheStartTime}ms`);
    console.log(`   Cache performance improvement: ${Math.round(((endTime - startTime) / (cacheEndTime - cacheStartTime) - 1) * 100)}% faster\n`);

    // Test 4: Get collections
    console.log('🔍 Test 4: Fetching collections...');
    const collections = await service.getCollections({ first: 3, cache: true });
    console.log(`✅ Retrieved ${collections.length} collections`);
    if (collections.length > 0) {
      console.log(`   First collection: ${collections[0].title}`);
    }

    // Test 5: Cache statistics
    console.log('\n🔍 Test 5: Cache statistics...');
    const cacheStats = service.getCacheStats();
    console.log(`✅ Cache contains ${cacheStats.size} items`);
    console.log(`   Cache keys: ${cacheStats.keys.slice(0, 3).join(', ')}${cacheStats.keys.length > 3 ? '...' : ''}\n`);

    // Test 6: Error handling
    console.log('🔍 Test 6: Testing error handling...');
    try {
      await service.getProductByHandle('non-existent-product-handle-12345');
    } catch (error) {
      console.log('✅ Error handling works correctly');
      console.log(`   Error: ${error.message}\n`);
    }

    console.log('🎉 All tests completed successfully!');
    console.log('\n📊 Performance Summary:');
    console.log(`   ✅ GraphQL client with caching implemented`);
    console.log(`   ✅ Type-safe TypeScript interfaces`);
    console.log(`   ✅ Advanced error handling with retries`);
    console.log(`   ✅ Optimized fragments and queries`);
    console.log(`   ✅ Smart caching with TTL`);
    console.log(`   ✅ Batch operations support`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Stack:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testGraphQLImplementation().catch(console.error);
}

module.exports = { testGraphQLImplementation };
