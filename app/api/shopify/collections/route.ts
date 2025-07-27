import { NextRequest, NextResponse } from 'next/server'
import { ShopifyCollectionService, ShopifyDataTransformer } from '@/lib/shopify-service'

export async function GET(request: NextRequest) {
  try {
    const shopifyCollections = await ShopifyCollectionService.getAllCollections()
    
    const collections = shopifyCollections.map(collection => 
      ShopifyDataTransformer.collectionToAppFormat(collection)
    )

    return NextResponse.json({
      success: true,
      data: collections
    })

  } catch (error) {
    console.error('Shopify collections API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch collections from Shopify',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
