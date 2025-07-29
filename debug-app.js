#!/usr/bin/env node

/**
 * EC Store Debug Script
 * Tests all major functionality and identifies issues
 */

const https = require('https')
const http = require('http')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

console.log('🔍 EC Store Debug Report')
console.log('========================')
console.log('')

// Configuration check
console.log('📋 Configuration Check:')
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`   Base URL: ${process.env.NEXT_PUBLIC_BASE_URL}`)
console.log(`   API URL: ${process.env.API_BASE_URL}`)
console.log(`   Shopify Enabled: ${process.env.NEXT_PUBLIC_USE_SHOPIFY}`)
console.log(`   Store Domain: ${process.env.SHOPIFY_STORE_DOMAIN}`)
console.log(`   Has Shopify Token: ${process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'Yes' : 'No'}`)
console.log('')

// Test server connectivity
async function testEndpoint(url, description) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.get(url, (res) => {
      console.log(`✅ ${description}: ${res.statusCode}`)
      resolve({ success: true, status: res.statusCode })
    })
    
    req.on('error', (err) => {
      console.log(`❌ ${description}: ${err.message}`)
      resolve({ success: false, error: err.message })
    })
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${description}: Timeout`)
      req.destroy()
      resolve({ success: false, error: 'Timeout' })
    })
  })
}

async function testAPI(endpoint, description) {
  const url = `http://localhost:3000${endpoint}`
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          console.log(`✅ ${description}: ${res.statusCode} - ${json.success ? 'Success' : 'Failed'}`)
          resolve({ success: true, status: res.statusCode, data: json })
        } catch (e) {
          console.log(`⚠️  ${description}: ${res.statusCode} - Invalid JSON`)
          resolve({ success: true, status: res.statusCode, data: null })
        }
      })
    })
    
    req.on('error', (err) => {
      console.log(`❌ ${description}: ${err.message}`)
      resolve({ success: false, error: err.message })
    })
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${description}: Timeout`)
      req.destroy()
      resolve({ success: false, error: 'Timeout' })
    })
  })
}

async function runDebugTests() {
  console.log('🌐 Testing Server Connectivity:')
  
  // Test main endpoints
  await testEndpoint('http://localhost:3000', 'Homepage')
  await testAPI('/api/products', 'Products API')
  await testAPI('/api/collections', 'Collections API')
  await testAPI('/api/cart', 'Cart API')
  
  console.log('')
  console.log('🛒 Testing Shopify Integration:')
  
  if (process.env.NEXT_PUBLIC_USE_SHOPIFY === 'true') {
    // Test Shopify connection
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
    
    if (storeDomain && accessToken) {
      await testEndpoint(`https://${storeDomain}`, 'Shopify Store Access')
      
      // Test GraphQL API
      const testShopifyAPI = () => {
        return new Promise((resolve) => {
          const postData = JSON.stringify({
            query: `{ shop { name } }`
          })
          
          const options = {
            hostname: storeDomain,
            port: 443,
            path: '/api/2023-10/graphql.json',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': accessToken,
              'Content-Length': Buffer.byteLength(postData)
            }
          }
          
          const req = https.request(options, (res) => {
            let data = ''
            res.on('data', chunk => data += chunk)
            res.on('end', () => {
              console.log(`${res.statusCode === 200 ? '✅' : '❌'} Shopify GraphQL API: ${res.statusCode}`)
              resolve({ success: res.statusCode === 200, status: res.statusCode })
            })
          })
          
          req.on('error', (err) => {
            console.log(`❌ Shopify GraphQL API: ${err.message}`)
            resolve({ success: false, error: err.message })
          })
          
          req.write(postData)
          req.end()
        })
      }
      
      await testShopifyAPI()
    } else {
      console.log('❌ Shopify: Missing configuration')
    }
  } else {
    console.log('ℹ️  Shopify: Disabled (using mock data)')
    await testAPI('/api/shopify/products', 'Shopify Products API (Mock)')
  }
  
  console.log('')
  console.log('📁 Testing File System:')
  
  const fs = require('fs')
  const path = require('path')
  
  const checkFile = (filePath, description) => {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${description}: Found`)
    } else {
      console.log(`❌ ${description}: Missing`)
    }
  }
  
  checkFile('data/products.json', 'Products Database')
  checkFile('data/collections.json', 'Collections Database')
  checkFile('public/images/ocean-wave-1.jpeg', 'Sample Images')
  checkFile('src/components/layout/header.tsx', 'Header Component')
  checkFile('app/layout.tsx', 'App Layout')
  
  console.log('')
  console.log('🔧 Common Issues & Solutions:')
  console.log('')
  
  if (process.env.NEXT_PUBLIC_USE_SHOPIFY === 'true') {
    console.log('🛒 Shopify Issues:')
    console.log('   • 402 Error: Store billing/access issue')
    console.log('   • 401 Error: Invalid access token')
    console.log('   • 403 Error: Insufficient permissions')
    console.log('   • Solution: Check Shopify Admin → Apps → Your App')
    console.log('')
  }
  
  console.log('🐛 TypeScript Issues:')
  console.log('   • Run: npx tsc --noEmit')
  console.log('   • Check: Missing type definitions')
  console.log('   • Solution: Add proper type annotations')
  console.log('')
  
  console.log('🌐 Server Issues:')
  console.log('   • Port conflicts: Check lsof -ti:3000')
  console.log('   • Environment: Verify .env.local settings')
  console.log('   • Dependencies: Run npm install')
  console.log('')
  
  console.log('📊 Performance Tips:')
  console.log('   • Enable Shopify only when needed')
  console.log('   • Use mock data for development')
  console.log('   • Check browser console for client errors')
  console.log('')
  
  console.log('🎯 Debug Complete!')
  console.log('   • Open: http://localhost:3000')
  console.log('   • Debug: Use VS Code Debug → Next.js: Debug Full Stack')
  console.log('   • Logs: Check browser console and terminal output')
}

// Run the debug tests
runDebugTests().catch(console.error)
