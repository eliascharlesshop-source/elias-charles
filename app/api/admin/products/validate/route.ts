import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse } from '@/src/lib/types'
import type { CreateProductRequest } from '@/lib/product-generation-service'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const dynamic = 'force-dynamic'

// POST /api/admin/products/validate - Validate product data before creation
export async function POST(request: NextRequest) {
  const { AuthService } = await import('@/src/lib/auth')
  const { productGenerationService } = await import('@/lib/product-generation-service')
  return AuthService.requireRole('admin', async (req: NextRequest) => {
    try {
      const auth = await AuthService.authenticateRequest(req)

      if (!auth) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        )
      }

      const body = await req.json()
      const productData: CreateProductRequest = body

      const validation = await productGenerationService.validateProduct(productData)

      const response: ApiResponse<typeof validation> = {
        success: validation.isValid,
        data: validation,
        message: validation.isValid ? 'Product data is valid' : 'Product validation failed'
      }

      return NextResponse.json(response)
    } catch (error) {
      console.error('Product validation error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })(request)
}
