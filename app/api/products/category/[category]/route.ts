import { NextRequest, NextResponse } from 'next/server'
import { getAllProductsByCategory } from '@/data/tiktok-products'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category is required' },
        { status: 400 }
      )
    }

    // Fetch products by category
    const products = getAllProductsByCategory(category as any)
    const limited = limit ? products.slice(0, limit) : products

    return NextResponse.json({
      success: true,
      data: limited,
      pagination: {
        total: products.length,
        returned: limited.length
      }
    })
  } catch (error) {
    console.error('Error fetching category products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
