import { NextRequest, NextResponse } from 'next/server'
import { productsDb, initializeDatabase } from '@/lib/database'
import { ApiResponse, Product } from '@/lib/types'
import { AuthService } from '@/lib/auth'

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

// GET /api/inventory - Get inventory status (admin only)
export const GET = AuthService.requireRole('admin', async (request: NextRequest) => {
  try {
    await ensureInitialized()
    
    const url = new URL(request.url)
    const lowStock = url.searchParams.get('lowStock') === 'true'
    const outOfStock = url.searchParams.get('outOfStock') === 'true'
    const threshold = parseInt(url.searchParams.get('threshold') || '10')

    const products = await productsDb.findAll()

    let filteredProducts = products

    if (outOfStock) {
      filteredProducts = products.filter(p => p.inventory === 0)
    } else if (lowStock) {
      filteredProducts = products.filter(p => p.inventory > 0 && p.inventory <= threshold)
    }

    const inventoryData = filteredProducts.map(product => ({
      id: product.id,
      title: product.title,
      sku: product.sku,
      inventory: product.inventory,
      inStock: product.inStock,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory
    }))

    const response: ApiResponse<{
      products: any[]
      summary: {
        total: number
        inStock: number
        outOfStock: number
        lowStock: number
      }
    }> = {
      success: true,
      data: {
        products: inventoryData,
        summary: {
          total: products.length,
          inStock: products.filter(p => p.inventory > threshold).length,
          outOfStock: products.filter(p => p.inventory === 0).length,
          lowStock: products.filter(p => p.inventory > 0 && p.inventory <= threshold).length
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch inventory'
    }
    return NextResponse.json(response, { status: 500 })
  }
})

// PUT /api/inventory - Bulk update inventory (admin only)
export const PUT = AuthService.requireRole('admin', async (request: NextRequest) => {
  try {
    await ensureInitialized()
    
    const { updates } = await request.json()

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: 'Updates must be an array' },
        { status: 400 }
      )
    }

    const results = []

    for (const update of updates) {
      const { productId, inventory, inStock } = update

      if (!productId || inventory === undefined) {
        results.push({
          productId,
          success: false,
          error: 'Product ID and inventory are required'
        })
        continue
      }

      try {
        const product = await productsDb.findById(productId)
        if (!product) {
          results.push({
            productId,
            success: false,
            error: 'Product not found'
          })
          continue
        }

        const updatedProduct = await productsDb.update(productId, {
          inventory: parseInt(inventory),
          inStock: inStock !== undefined ? inStock : inventory > 0,
          updatedAt: new Date().toISOString()
        })

        results.push({
          productId,
          success: true,
          inventory: updatedProduct.inventory,
          inStock: updatedProduct.inStock
        })
      } catch (error) {
        results.push({
          productId,
          success: false,
          error: 'Failed to update product'
        })
      }
    }

    const response: ApiResponse<{ results: any[] }> = {
      success: true,
      data: { results },
      message: 'Inventory update completed'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating inventory:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update inventory'
    }
    return NextResponse.json(response, { status: 500 })
  }
})