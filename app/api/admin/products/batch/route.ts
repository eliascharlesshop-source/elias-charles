import { NextRequest, NextResponse } from 'next/server'
import { productGenerationService } from '@/lib/product-generation-service'
import { AuthService, JWTPayload } from '@/src/lib/auth'
import { ApiResponse } from '@/src/lib/types'
import { CreateProductRequest } from '@/lib/product-generation-service'
export const dynamic = 'force-dynamic'

// POST /api/admin/products/batch - Batch create products (admin only)
export async function POST(request: NextRequest) {
  return AuthService.requireRole('admin', async (request: Request, auth: JWTPayload) => {
    try {
      const body = await request.json()
      const { products, operation } = body

      if (!products || !Array.isArray(products)) {
        return NextResponse.json(
          { success: false, error: 'Products array is required' },
          { status: 400 }
        )
      }

      if (products.length > 50) {
        return NextResponse.json(
          { success: false, error: 'Maximum 50 products allowed per batch' },
          { status: 400 }
        )
      }

      let result

      switch (operation) {
        case 'create':
          result = await productGenerationService.batchCreateProducts(products, auth)
          break
        
        case 'validate':
          // Batch validation
          const validationResults = await Promise.all(
            products.map(async (product: CreateProductRequest) => {
              const validation = await productGenerationService.validateProduct(product)
              return {
                product: product.title,
                isValid: validation.isValid,
                errors: validation.errors,
                warnings: validation.warnings
              }
            })
          )
          
          result = {
            success: true,
            data: validationResults,
            message: 'Batch validation completed'
          }
          break

        default:
          return NextResponse.json(
            { success: false, error: 'Invalid operation. Supported: create, validate' },
            { status: 400 }
          )
      }

      return NextResponse.json(result, {
        status: result.success ? 200 : 400
      })
    } catch (error) {
      console.error('Batch operation error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Batch operation failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })(request)
}

// PUT /api/admin/products/batch - Batch update products (admin only)
export async function PUT(request: NextRequest) {
  return AuthService.requireRole('admin', async (request: Request, auth: JWTPayload) => {
    try {
      const body = await request.json()
      const { updates } = body

      if (!updates || !Array.isArray(updates)) {
        return NextResponse.json(
          { success: false, error: 'Updates array is required' },
          { status: 400 }
        )
      }

      if (updates.length > 50) {
        return NextResponse.json(
          { success: false, error: 'Maximum 50 updates allowed per batch' },
          { status: 400 }
        )
      }

      const results = await Promise.allSettled(
        updates.map(async (update: { id: string; data: Partial<CreateProductRequest> }) => {
          const result = await productGenerationService.updateProduct(update.id, update.data, auth)
          return {
            id: update.id,
            success: result.success,
            error: result.error,
            data: result.data
          }
        })
      )

      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
      const failed = results.length - successful

      const response = {
        success: successful > 0,
        data: {
          total: results.length,
          successful,
          failed,
          results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: 'Operation failed' })
        },
        message: `Batch update completed: ${successful} successful, ${failed} failed`
      }

      return NextResponse.json(response)
    } catch (error) {
      console.error('Batch update error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Batch update failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })(request)
}

// DELETE /api/admin/products/batch - Batch delete products (admin only)
export async function DELETE(request: NextRequest) {
  return AuthService.requireRole('admin', async (request: Request, auth: JWTPayload) => {
    try {
      const body = await request.json()
      const { productIds } = body

      if (!productIds || !Array.isArray(productIds)) {
        return NextResponse.json(
          { success: false, error: 'Product IDs array is required' },
          { status: 400 }
        )
      }

      if (productIds.length > 50) {
        return NextResponse.json(
          { success: false, error: 'Maximum 50 products allowed per batch deletion' },
          { status: 400 }
        )
      }

      const results = await Promise.allSettled(
        productIds.map(async (productId: string) => {
          const result = await productGenerationService.deleteProduct(productId, auth)
          return {
            id: productId,
            success: result.success,
            error: result.error
          }
        })
      )

      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
      const failed = results.length - successful

      const response = {
        success: successful > 0,
        data: {
          total: results.length,
          successful,
          failed,
          results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: 'Operation failed' })
        },
        message: `Batch deletion completed: ${successful} successful, ${failed} failed`
      }

      return NextResponse.json(response)
    } catch (error) {
      console.error('Batch deletion error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Batch deletion failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })(request)
}
