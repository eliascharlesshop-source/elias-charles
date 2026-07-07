import { tiktokShopService } from '@/lib/tiktok-shop-service'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sku = searchParams.get('sku')

    if (!sku) {
      return Response.json({
        success: false,
        error: 'SKU parameter required'
      }, { status: 400 })
    }

    // In production, verify admin authentication here
    const result = await tiktokShopService.syncProduct(sku)
    
    return Response.json({
      success: result.success,
      sku,
      error: result.error
    })
  } catch (error) {
    console.error('TikTok sync error:', error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sync product'
    }, { status: 500 })
  }
}
