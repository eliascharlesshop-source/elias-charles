import { NextRequest, NextResponse } from 'next/server'
import { ShopifyProductService, ShopifyDataTransformer } from '@/lib/shopify-service'

interface RouteParams {
  params: {
    handle: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { handle } = params

    const shopifyProduct = await ShopifyProductService.getProductByHandle(handle)
    
    if (!shopifyProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    const product = ShopifyDataTransformer.productToAppFormat(shopifyProduct)

    return NextResponse.json({
      success: true,
      data: product
    })

  } catch (error) {
    console.error('Shopify product API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product from Shopify',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
