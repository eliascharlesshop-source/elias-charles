import { NextRequest, NextResponse } from 'next/server'
import shopifyService from '@/lib/shopify-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50)
    const category = searchParams.get('category') || undefined
    const featured = searchParams.get('featured') === 'true'
    const search = searchParams.get('search') || undefined
    const sort = searchParams.get('sort') as 'title' | 'price' | 'createdAt' | 'bestSelling' | undefined
    const order = searchParams.get('order') as 'asc' | 'desc' | undefined

    // Use GraphQL-enhanced service with proper options
    const result = await shopifyService.getProducts({
      limit,
      page,
      category,
      featured,
      search,
      sort,
      order
    })

    if (Array.isArray(result)) {
      // Shopify not configured, return empty data
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNextPage: false
        },
        meta: {
          source: 'GraphQL',
          cached: false,
          queryTime: new Date().toISOString()
        }
      })
    } else {
      return NextResponse.json({
        success: true,
        data: result.products,
        pagination: result.pagination,
        meta: {
          source: 'GraphQL',
          cached: true,
          queryTime: new Date().toISOString()
        }
      })
    }

  } catch (error) {
    console.error('Shopify products API error:', error)
    
    // Enhanced error handling with GraphQL context
    if (error instanceof Error && error.message.includes('Missing Shopify configuration')) {
      return NextResponse.json({
        success: false,
        error: 'Shopify GraphQL is not configured. Please check your environment variables.',
        details: error.message,
        fallback: 'Using mock data instead'
      }, { status: 503 })
    }
    
    if (error instanceof Error && (
      error.message.includes('402') || 
      error.message.includes('Unavailable Shop') ||
      error.message.includes('PAYMENT_REQUIRED')
    )) {
      return NextResponse.json({
        success: false,
        error: 'Shopify store is unavailable (billing/setup issue)',
        details: 'Store may need billing setup or has access restrictions',
        fallback: 'Using mock data instead',
        action: 'Check your Shopify store billing and setup'
      }, { status: 402 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products from Shopify GraphQL',
      details: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'Using mock data instead',
      source: 'GraphQL Enhanced API'
    }, { status: 500 })
  }
}
