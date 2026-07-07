import { NextRequest, NextResponse } from 'next/server'
import { productGenerationService } from '@/lib/product-generation-service'
import { AuthService } from '@/src/lib/auth'
import { ApiResponse } from '@/src/lib/types'
import { CreateProductRequest } from '@/lib/product-generation-service'

export const dynamic = 'force-dynamic'

// POST /api/admin/products/validate - Validate product data before creation
export const POST = AuthService.requireRole('admin', async (request: NextRequest) => {
  try {
    const auth = await AuthService.authenticateRequest(request)
    
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
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
})
