import { NextRequest, NextResponse } from 'next/server'
import { ShopifyStorefront, transformShopifyProduct, withShopifyErrorHandling } from '@/src/lib/shopify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const order = searchParams.get('order')

    return await withShopifyErrorHandling(async () => {
      const shopify = new ShopifyStorefront()
      
      let products = []
      let hasNextPage = false

      if (search) {
        // Search products
        const data = await shopify.searchProducts(search, limit * 2) // Get more for filtering
        products = data.products.edges.map((edge: any) => transformShopifyProduct(edge.node))
      } else {
        // Get all products
        const data = await shopify.getProducts(limit * 2) // Get more for filtering
        products = data.products.edges.map((edge: any) => transformShopifyProduct(edge.node))
        hasNextPage = data.products.pageInfo.hasNextPage
      }

      // Apply filters
      if (category) {
        products = products.filter(product => 
          product.category.toLowerCase().includes(category.toLowerCase()) ||
          product.productType.toLowerCase().includes(category.toLowerCase())
        )
      }

      if (featured === 'true') {
        products = products.filter(product => product.featured)
      }

      // Apply sorting
      if (sort) {
        products.sort((a, b) => {
          let aValue, bValue
          
          switch (sort) {
            case 'title':
              aValue = a.title.toLowerCase()
              bValue = b.title.toLowerCase()
              break
            case 'price':
              aValue = a.price
              bValue = b.price
              break
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime()
              bValue = new Date(b.createdAt).getTime()
              break
            default:
              return 0
          }

          if (order === 'desc') {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
          } else {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
          }
        })
      }

      // Calculate pagination
      const totalCount = products.length
      const totalPages = Math.ceil(totalCount / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProducts = products.slice(startIndex, endIndex)

      return NextResponse.json({
        success: true,
        data: paginatedProducts,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
          hasNextPage: page < totalPages
        }
      })
    })

  } catch (error) {
    console.error('Shopify products API error:', error)
    
    // Check if it's a configuration error
    if (error instanceof Error && error.message.includes('Missing Shopify configuration')) {
      return NextResponse.json({
        success: false,
        error: 'Shopify is not configured. Please check your environment variables.',
        details: error.message,
        fallback: 'Using mock data instead'
      }, { status: 503 })
    }
    
    // Check for 402 payment required error (store billing issue)
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
      error: 'Failed to fetch products from Shopify',
      details: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'Using mock data instead'
    }, { status: 500 })
  }
}
