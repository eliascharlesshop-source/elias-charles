import { NextResponse } from 'next/server'
import { ShopifyCollectionService, ShopifyDataTransformer } from '@/lib/shopify-services'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('🔍 Testing Shopify collections connection...')
    
    // Test collections fetch
    const collections = await ShopifyCollectionService.getAllCollections(10)
    const transformedCollections = collections.map(collection => 
      ShopifyDataTransformer.collectionToAppFormat(collection)
    )
    
    console.log(`✅ Successfully fetched ${collections.length} collections from Shopify`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully connected to Shopify. Found ${collections.length} collections.`,
      data: {
        collectionsCount: collections.length,
        collections: transformedCollections,
        firstCollection: transformedCollections[0] || null
      }
    })
  } catch (error) {
    console.error('❌ Shopify collections test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to connect to Shopify or fetch collections. This is expected if you only have one test product.'
    }, { status: 500 })
  }
}
