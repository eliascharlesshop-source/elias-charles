import { NextRequest, NextResponse } from 'next/server'
import { tiktokShopService } from '@/lib/tiktok-shop-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { sku: string } }
) {
  try {
    const sku = params.sku

    if (!sku) {
      return NextResponse.json(
        { success: false, error: 'SKU is required' },
        { status: 400 }
      )
    }

    // Fetch product from TikTok Shop service
    const product = await tiktokShopService.fetchProductBySku(sku)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Fetch related products
    const relatedProducts = await tiktokShopService.fetchRelatedProducts(sku)

    return NextResponse.json({
      success: true,
      data: {
        product,
        related: relatedProducts
      }
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
