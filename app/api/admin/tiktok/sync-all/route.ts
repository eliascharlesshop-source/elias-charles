import { tiktokShopService } from '@/lib/tiktok-shop-service'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    // In production, verify admin authentication here
    const result = await tiktokShopService.syncAllProducts()
    
    return Response.json({
      success: result.success,
      synced: result.synced,
      failed: result.failed,
      errors: result.errors,
      lastSync: result.lastSync
    })
  } catch (error) {
    console.error('TikTok sync error:', error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sync products',
      synced: 0,
      failed: 0
    }, { status: 500 })
  }
}
