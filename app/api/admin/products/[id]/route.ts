import { NextRequest, NextResponse } from 'next/server'
import { productGenerationService } from '@/lib/product-generation-service'
import { AuthService, JWTPayload } from '@/src/lib/auth'
import { ApiResponse } from '@/src/lib/types'

export const dynamic = 'force-dynamic'

// PUT /api/admin/products/[id] - Update a product (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return AuthService.requireRole('admin', async (request: Request, auth: JWTPayload) => {
    try {
      const { id } = params
      const updates = await request.json()

      const result = await productGenerationService.updateProduct(id, updates, auth)

      return NextResponse.json(result, {
        status: result.success ? 200 : 400
      })
    } catch (error) {
      console.error('Product update error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update product',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })(request)
}

// DELETE /api/admin/products/[id] - Delete a product (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return AuthService.requireRole('admin', async (request: Request, auth: JWTPayload) => {
    try {
      const { id } = params

      const result = await productGenerationService.deleteProduct(id, auth)

      return NextResponse.json(result, {
        status: result.success ? 200 : 400
      })
    } catch (error) {
      console.error('Product deletion error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete product',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })(request)
}

// GET /api/admin/products/[id] - Get a single product (admin only)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return AuthService.requireRole('admin', async (request: Request, auth: JWTPayload) => {
    try {
      const { id } = params

      // Get product from Shopify service
      const shopifyService = (await import('@/lib/shopify-service')).default
      const product = await shopifyService.getProduct(id)

      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        )
      }

      const response: ApiResponse<typeof product> = {
        success: true,
        data: product
      }

      return NextResponse.json(response)
    } catch (error) {
      console.error('Product fetch error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch product',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })(request)
}
