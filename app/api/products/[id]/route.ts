import { NextRequest, NextResponse } from 'next/server'
import { productsDb, initializeDatabase } from '@/lib/database'
import { ApiResponse } from '@/lib/types'

// Initialize database on first request
let initialized = false

async function ensureInitialized() {
  if (!initialized) {
    await initializeDatabase()
    initialized = true
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureInitialized()
    
    const { id } = await params
    
    // Try to find by ID first, then by handle
    let product = await productsDb.findById(id)
    
    if (!product) {
      product = await productsDb.findOne(p => p.handle === id)
    }

    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: 'Product not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<typeof product> = {
      success: true,
      data: product
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching product:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch product'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureInitialized()
    
    const { id } = await params
    const updates = await request.json()

    const product = await productsDb.update(id, updates)

    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: 'Product not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<typeof product> = {
      success: true,
      data: product,
      message: 'Product updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating product:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update product'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureInitialized()
    
    const { id } = await params
    
    const deleted = await productsDb.delete(id)

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Product not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse = {
      success: true,
      message: 'Product deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting product:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete product'
    }
    return NextResponse.json(response, { status: 500 })
  }
}