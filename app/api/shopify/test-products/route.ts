import { NextResponse } from 'next/server'
import { ShopifyProductService, ShopifyDataTransformer } from '@/lib/shopify-services'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('🔍 Testing Shopify products connection...')
    
    // Test products fetch
    const products = await ShopifyProductService.getAllProducts(10)
    const transformedProducts = products.map(product => 
      ShopifyDataTransformer.productToAppFormat(product)
    )
    
    console.log(`✅ Successfully fetched ${products.length} products from Shopify`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully connected to Shopify. Found ${products.length} products.`,
      data: {
        productsCount: products.length,
        products: transformedProducts,
        firstProduct: transformedProducts[0] || null
      }
    })
  } catch (error) {
    console.error('❌ Shopify products test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to connect to Shopify or fetch products'
    }, { status: 500 })
  }
}
