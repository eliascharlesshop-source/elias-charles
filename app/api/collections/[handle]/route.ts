import { NextRequest, NextResponse } from 'next/server'
import { collectionsDb, productsDb, initializeDatabase } from '@/lib/database'
import { ApiResponse, Collection } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const dynamic = 'force-dynamic'

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
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    await ensureInitialized()
    
    const { handle } = await params
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    
    // Try to find by handle first, then by ID
    let collection = await collectionsDb.findOne(c => c.handle === handle)
    
    if (!collection) {
      collection = await collectionsDb.findById(handle)
    }

    if (!collection) {
      const response: ApiResponse = {
        success: false,
        error: 'Collection not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    if (includeProducts) {
      // Populate collection with actual product data
      const products = await Promise.all(
        collection.products.map(productId => productsDb.findById(productId))
      )
      
      const collectionWithProducts = {
        ...collection,
        products: products.filter(Boolean) // Remove null products
      }

      const response: ApiResponse<typeof collectionWithProducts> = {
        success: true,
        data: collectionWithProducts
      }

      return NextResponse.json(response)
    }

    const response: ApiResponse<Collection> = {
      success: true,
      data: collection
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching collection:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch collection'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    await ensureInitialized()
    
    const { handle } = await params
    const updates = await request.json()

    // Find collection by handle or ID
    let collection = await collectionsDb.findOne(c => c.handle === handle)
    
    if (!collection) {
      collection = await collectionsDb.findById(handle)
    }

    if (!collection) {
      const response: ApiResponse = {
        success: false,
        error: 'Collection not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const updatedCollection = await collectionsDb.update(collection.id, updates)

    const response: ApiResponse<Collection> = {
      success: true,
      data: updatedCollection!,
      message: 'Collection updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating collection:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update collection'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    await ensureInitialized()
    
    const { handle } = await params
    
    // Find collection by handle or ID
    let collection = await collectionsDb.findOne(c => c.handle === handle)
    
    if (!collection) {
      collection = await collectionsDb.findById(handle)
    }

    if (!collection) {
      const response: ApiResponse = {
        success: false,
        error: 'Collection not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const deleted = await collectionsDb.delete(collection.id)

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Failed to delete collection'
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse = {
      success: true,
      message: 'Collection deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting collection:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete collection'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
