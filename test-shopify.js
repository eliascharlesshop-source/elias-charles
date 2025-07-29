#!/usr/bin/env node

/**
 * Test Shopify Integration
 * Run this script to test your Shopify API connection
 */

const https = require('https')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

if (!STORE_DOMAIN || !ACCESS_TOKEN) {
  console.error('❌ Missing required environment variables:')
  console.error('   SHOPIFY_STORE_DOMAIN')
  console.error('   SHOPIFY_STOREFRONT_ACCESS_TOKEN')
  console.error('\nPlease update your .env.local file with your Shopify credentials.')
  console.error('\n🔧 To get your credentials:')
  console.error('1. Go to your Shopify Admin')
  console.error('2. Navigate to Settings → Apps and sales channels')
  console.error('3. Create a new private app')
  console.error('4. Copy the Storefront API access token')
  process.exit(1)
}

console.log('🛒 Testing Shopify Integration...')
console.log(`📍 Store: ${STORE_DOMAIN}`)
console.log(`🔑 Token: ${ACCESS_TOKEN.substring(0, 8)}...`)
console.log('')

// Test GraphQL query
const query = `
{
  products(first: 3) {
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
`

const postData = JSON.stringify({
  query: query
})

const options = {
  hostname: STORE_DOMAIN,
  port: 443,
  path: '/api/2023-10/graphql.json',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
    'Content-Length': Buffer.byteLength(postData)
  }
}

const req = https.request(options, (res) => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    console.log(`📡 Response Status: ${res.statusCode}`)
    
    if (res.statusCode === 200) {
      try {
        const response = JSON.parse(data)
        
        if (response.errors) {
          console.error('❌ GraphQL Errors:')
          response.errors.forEach(error => {
            console.error(`   ${error.message}`)
          })
          process.exit(1)
        }
        
        if (response.data && response.data.products) {
          const products = response.data.products.edges
          console.log('✅ Shopify connection successful!')
          console.log(`📦 Found ${products.length} products:`)
          
          products.forEach((edge, index) => {
            const product = edge.node
            const price = product.variants.edges[0]?.node.price
            console.log(`   ${index + 1}. ${product.title}`)
            console.log(`      Handle: ${product.handle}`)
            console.log(`      Available: ${product.availableForSale}`)
            if (price) {
              console.log(`      Price: ${price.amount} ${price.currencyCode}`)
            }
            console.log('')
          })
          
          console.log('🎉 Your EC Store is ready to use Shopify products!')
          console.log('')
          console.log('🚀 Next steps:')
          console.log('   1. Start your dev server: npm run dev')
          console.log('   2. Visit http://localhost:3000 to see your store')
          console.log('   3. Check the browser console for any API errors')
          console.log('   4. Products should now load from your Shopify store!')
        } else {
          console.error('❌ No products found in response')
          console.log('Raw response:', JSON.stringify(response, null, 2))
        }
      } catch (parseError) {
        console.error('❌ Error parsing response:', parseError)
        console.log('Raw response:', data)
      }
    } else {
      console.error(`❌ HTTP Error: ${res.statusCode}`)
      console.error('Response:', data)
      
      if (res.statusCode === 401) {
        console.error('\n🔧 Troubleshooting:')
        console.error('   • Check your SHOPIFY_STOREFRONT_ACCESS_TOKEN')
        console.error('   • Ensure the token has proper permissions')
        console.error('   • Verify the token is for the Storefront API (not Admin API)')
      } else if (res.statusCode === 403) {
        console.error('\n🔧 Troubleshooting:')
        console.error('   • Check your store domain is correct')
        console.error('   • Ensure your app has the required permissions')
        console.error('   • Verify your store is accessible')
      }
    }
  })
})

req.on('error', (err) => {
  console.error('❌ Request Error:', err.message)
  
  if (err.code === 'ENOTFOUND') {
    console.error('\n🔧 Troubleshooting:')
    console.error('   • Check your SHOPIFY_STORE_DOMAIN is correct')
    console.error('   • Ensure it ends with .myshopify.com')
    console.error('   • Check your internet connection')
  }
})

req.write(postData)
req.end()