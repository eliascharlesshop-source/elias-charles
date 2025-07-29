import { NextRequest, NextResponse } from 'next/server'
import shopifyService from '@/lib/shopify-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

    // Fetch collections using GraphQL-enhanced service with caching
    const collections = await shopifyService.getCollections(limit)

    return NextResponse.json({
      success: true,
      data: collections,
      meta: {
        source: 'GraphQL',
        cached: true,
        count: collections.length,
        queryTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Shopify collections API error:', error)
    
    // Enhanced error handling with GraphQL context
    if (error instanceof Error && error.message.includes('Missing Shopify configuration')) {
      return NextResponse.json({
        success: false,
        error: 'Shopify GraphQL is not configured. Please check your environment variables.',
        details: error.message,
        fallback: 'Using mock data instead'
      }, { status: 503 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch collections from Shopify GraphQL',
      details: error instanceof Error ? error.message : 'Unknown error',
      source: 'GraphQL Enhanced API'
    }, { status: 500 })
  }
}
