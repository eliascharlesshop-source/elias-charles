import { NextRequest, NextResponse } from 'next/server'
import { tiktokShopService } from '@/lib/tiktok-shop-service'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sku, quantity = 1 } = body

    if (!sku) {
      return NextResponse.json(
        { success: false, error: 'SKU is required' },
        { status: 400 }
      )
    }

    // Create checkout session via TikTok Shop service
    const session = await tiktokShopService.createCheckoutSession(sku, quantity)

    return NextResponse.json({
      success: true,
      data: session
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
