#!/usr/bin/env node

/**
 * EC Store - Production Deployment Verification
 * Tests live production deployment and domain configuration
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const PRODUCTION_DOMAIN = process.env.PRODUCTION_DOMAIN || 'eliascharles.com';
const TEST_URLS = {
  primary: `https://${PRODUCTION_DOMAIN}`,
  www: `https://www.${PRODUCTION_DOMAIN}`,
  api: `https://${PRODUCTION_DOMAIN}/api`,
  products: `https://${PRODUCTION_DOMAIN}/api/shopify/products?limit=1`,
  collections: `https://${PRODUCTION_DOMAIN}/api/shopify/collections?limit=1`,
  test: `https://${PRODUCTION_DOMAIN}/api/test`
};

console.log('🌐 EC Store - Production Deployment Verification');
console.log('================================================');
console.log(`🎯 Testing domain: ${PRODUCTION_DOMAIN}`);
console.log('');

// Utility function for HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'EC-Store-Verification/1.0',
        'Accept': 'application/json, text/html, */*',
        ...options.headers
      },
      timeout: 10000
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        resolve({
          success: true,
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          responseTime: responseTime,
          url: url
        });
      });
    });
    
    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      resolve({
        success: false,
        error: error.message,
        responseTime: responseTime,
        url: url
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      const responseTime = Date.now() - startTime;
      resolve({
        success: false,
        error: 'Request timeout',
        responseTime: responseTime,
        url: url
      });
    });
    
    req.end();
  });
}

// Test functions
async function testDomainResolution() {
  console.log('1️⃣ Domain Resolution Test');
  console.log('-------------------------');
  
  const results = [];
  
  for (const [name, url] of Object.entries(TEST_URLS)) {
    const result = await makeRequest(url);
    
    if (result.success) {
      console.log(`✅ ${name.toUpperCase()}: ${result.statusCode} (${result.responseTime}ms)`);
      console.log(`   URL: ${url}`);
      
      if (result.statusCode >= 200 && result.statusCode < 400) {
        results.push({ name, success: true, responseTime: result.responseTime });
      } else {
        console.log(`   ⚠️  Status: ${result.statusCode}`);
        results.push({ name, success: false, statusCode: result.statusCode });
      }
    } else {
      console.log(`❌ ${name.toUpperCase()}: ${result.error}`);
      console.log(`   URL: ${url}`);
      results.push({ name, success: false, error: result.error });
    }
    console.log('');
  }
  
  return results;
}

async function testSSLCertificate() {
  console.log('2️⃣ SSL Certificate Test');
  console.log('-----------------------');
  
  const result = await makeRequest(TEST_URLS.primary);
  
  if (result.success && result.url.startsWith('https://')) {
    console.log('✅ SSL Certificate is working');
    console.log(`   Secure connection established`);
    console.log(`   Protocol: HTTPS`);
    
    // Check security headers
    const securityHeaders = {
      'strict-transport-security': 'HSTS',
      'x-frame-options': 'Frame Options',
      'x-content-type-options': 'Content Type Options',
      'content-security-policy': 'CSP'
    };
    
    console.log('\n🔒 Security Headers:');
    for (const [header, name] of Object.entries(securityHeaders)) {
      if (result.headers[header]) {
        console.log(`   ✅ ${name}: ${result.headers[header].substring(0, 50)}...`);
      } else {
        console.log(`   ⚠️  ${name}: Not set`);
      }
    }
    
    return true;
  } else {
    console.log('❌ SSL Certificate issue or HTTPS not available');
    return false;
  }
}

async function testAPIEndpoints() {
  console.log('\n3️⃣ API Endpoints Test');
  console.log('---------------------');
  
  const apiTests = [
    { name: 'Test API', url: TEST_URLS.test },
    { name: 'Products API', url: TEST_URLS.products },
    { name: 'Collections API', url: TEST_URLS.collections }
  ];
  
  const results = [];
  
  for (const test of apiTests) {
    const result = await makeRequest(test.url);
    
    if (result.success && result.statusCode === 200) {
      console.log(`✅ ${test.name}: Working (${result.responseTime}ms)`);
      
      // Try to parse JSON response
      try {
        const jsonData = JSON.parse(result.data);
        if (test.name === 'Products API' && jsonData.products) {
          console.log(`   📦 Products found: ${jsonData.products.length}`);
        } else if (test.name === 'Collections API' && jsonData.collections) {
          console.log(`   📂 Collections found: ${jsonData.collections.length}`);
        } else if (test.name === 'Test API') {
          console.log(`   🔧 API status: ${jsonData.status || 'OK'}`);
        }
      } catch (e) {
        console.log(`   📄 Response: ${result.data.substring(0, 50)}...`);
      }
      
      results.push({ name: test.name, success: true, responseTime: result.responseTime });
    } else {
      console.log(`❌ ${test.name}: Failed`);
      console.log(`   Status: ${result.statusCode || 'Connection Error'}`);
      console.log(`   Error: ${result.error || 'Unknown'}`);
      results.push({ name: test.name, success: false });
    }
  }
  
  return results;
}

async function testPageLoad() {
  console.log('\n4️⃣ Page Load Test');
  console.log('-----------------');
  
  const pages = [
    { name: 'Homepage', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];
  
  const results = [];
  
  for (const page of pages) {
    const url = `${TEST_URLS.primary}${page.path}`;
    const result = await makeRequest(url);
    
    if (result.success && result.statusCode === 200) {
      console.log(`✅ ${page.name}: Loading (${result.responseTime}ms)`);
      
      // Check if it's HTML content
      if (result.data.includes('<html') || result.data.includes('<!DOCTYPE')) {
        console.log(`   📄 Valid HTML page detected`);
      }
      
      results.push({ name: page.name, success: true, responseTime: result.responseTime });
    } else {
      console.log(`❌ ${page.name}: Failed to load`);
      console.log(`   Status: ${result.statusCode || 'Connection Error'}`);
      results.push({ name: page.name, success: false });
    }
  }
  
  return results;
}

async function testPerformance() {
  console.log('\n5️⃣ Performance Test');
  console.log('-------------------');
  
  const performanceTests = [];
  
  // Test multiple requests to homepage
  for (let i = 0; i < 3; i++) {
    const result = await makeRequest(TEST_URLS.primary);
    if (result.success) {
      performanceTests.push(result.responseTime);
    }
  }
  
  if (performanceTests.length > 0) {
    const avgTime = performanceTests.reduce((a, b) => a + b, 0) / performanceTests.length;
    const minTime = Math.min(...performanceTests);
    const maxTime = Math.max(...performanceTests);
    
    console.log(`📊 Homepage Performance:`);
    console.log(`   Average: ${avgTime.toFixed(0)}ms`);
    console.log(`   Fastest: ${minTime}ms`);
    console.log(`   Slowest: ${maxTime}ms`);
    
    if (avgTime < 1000) {
      console.log(`✅ Good performance (< 1s)`);
    } else if (avgTime < 3000) {
      console.log(`⚠️  Acceptable performance (1-3s)`);
    } else {
      console.log(`❌ Poor performance (> 3s)`);
    }
    
    return avgTime < 3000;
  } else {
    console.log(`❌ Could not measure performance`);
    return false;
  }
}

// Main test runner
async function runProductionTests() {
  const startTime = Date.now();
  
  try {
    console.log(`Starting production verification for ${PRODUCTION_DOMAIN}...\n`);
    
    // Run all tests
    const domainResults = await testDomainResolution();
    const sslResult = await testSSLCertificate();
    const apiResults = await testAPIEndpoints();
    const pageResults = await testPageLoad();
    const performanceResult = await testPerformance();
    
    const totalTime = Date.now() - startTime;
    
    // Calculate overall score
    const domainScore = domainResults.filter(r => r.success).length;
    const apiScore = apiResults.filter(r => r.success).length;
    const pageScore = pageResults.filter(r => r.success).length;
    const totalTests = domainResults.length + apiResults.length + pageResults.length + 2; // +2 for SSL and performance
    const passedTests = domainScore + apiScore + pageScore + (sslResult ? 1 : 0) + (performanceResult ? 1 : 0);
    
    // Generate summary
    console.log('\n📊 Production Verification Summary');
    console.log('==================================');
    console.log(`🌐 Domain Resolution: ${domainScore}/${domainResults.length}`);
    console.log(`🔒 SSL Certificate: ${sslResult ? '✅' : '❌'}`);
    console.log(`🔌 API Endpoints: ${apiScore}/${apiResults.length}`);
    console.log(`📄 Page Loading: ${pageScore}/${pageResults.length}`);
    console.log(`⚡ Performance: ${performanceResult ? '✅' : '❌'}`);
    console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests}`);
    console.log(`⏱️  Total Time: ${totalTime}ms`);
    
    if (passedTests === totalTests) {
      console.log('\n🎉 PRODUCTION READY! Your store is live and working perfectly.');
      console.log(`\n🚀 Your store is now available at: https://${PRODUCTION_DOMAIN}`);
      console.log(`🛍️  Customers can start shopping immediately!`);
    } else if (passedTests >= totalTests * 0.8) {
      console.log('\n✅ MOSTLY WORKING! Minor issues detected but store is functional.');
      console.log('\n🔧 Please review the failed tests above.');
    } else {
      console.log('\n⚠️  ISSUES DETECTED! Please fix the problems before going live.');
      console.log('\n🔧 Common fixes:');
      console.log('   - Verify domain DNS settings');
      console.log('   - Check deployment status');
      console.log('   - Confirm environment variables');
    }
    
    return passedTests === totalTests;
    
  } catch (error) {
    console.error('\n❌ Production verification failed:', error);
    return false;
  }
}

// CLI execution
if (require.main === module) {
  runProductionTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { runProductionTests };
