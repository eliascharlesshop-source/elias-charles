import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse } from '@/src/lib/types'
import type { CreateProductRequest } from '@/lib/product-generation-service'

export const dynamic = 'force-dynamic'

// POST /api/admin/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  const { AuthService } = await import('@/src/lib/auth')
  const { productGenerationService } = await import('@/lib/product-generation-service')
  return AuthService.requireRole('admin', async (req: NextRequest) => {
    try {
      const body = await req.json()
      const auth = await AuthService.authenticateRequest(req)

      if (!auth) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        )
      }

      const productData: CreateProductRequest = body
      const result = await productGenerationService.createProduct(productData, auth)

      return NextResponse.json(result, {
        status: result.success ? 201 : 400
      })
    } catch (error) {
      console.error('Product creation error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })(request)
}

// GET /api/admin/products - List products with filtering (admin only)
export async function GET(request: NextRequest) {
  const { AuthService } = await import('@/src/lib/auth')
  return AuthService.requireRole('admin', async (req: NextRequest) => {
    try {
      const auth = await AuthService.authenticateRequest(req)

      if (!auth) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        )
      }

      const url = new URL(req.url)
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '20')
      const search = url.searchParams.get('search') || undefined
      const status = url.searchParams.get('status') as any || undefined
      const category = url.searchParams.get('category') || undefined

      const shopifyService = (await import('@/lib/shopify-service')).default
      const result = await shopifyService.getProducts({
        page,
        limit,
        search,
        category,
        featured: status === 'featured'
      })

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result
      }

      return NextResponse.json(response)
    } catch (error) {
      console.error('Product listing error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch products',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })(request)
}
