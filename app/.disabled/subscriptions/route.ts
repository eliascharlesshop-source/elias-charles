import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

let paymentService: any = null
let subscriptionService: any = null
let authService: any = null

async function initializeServices() {
  if (!paymentService) {
    const { PaymentService } = await import('@/lib/crypto/payment-service')
    const { SubscriptionService } = await import('@/lib/crypto/subscription-service')
    const { WalletAuthService } = await import('@/lib/crypto/wallet-auth-service')
    paymentService = PaymentService.getInstance()
    subscriptionService = SubscriptionService.getInstance()
    authService = WalletAuthService.getInstance()
  }
}

type Cryptocurrency = any
type Network = any

export async function POST(request: NextRequest) {
  try {
    await initializeServices()
    const body = await request.json()
    const { planId, currency, network, sessionId } = body

    if (!planId || !currency || !network) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, currency, network' },
        { status: 400 }
      )
    }

    // Validate session if provided
    let walletAddress = null
    if (sessionId) {
      const session = await authService.validateSession(sessionId)
      if (!session) {
        return NextResponse.json(
          { error: 'Invalid or expired session' },
          { status: 401 }
        )
      }
      walletAddress = session.walletAddress
    }

    // Create subscription transaction
    const transaction = await paymentService.createSubscription(
      planId,
      walletAddress || 'unknown',
      currency as Cryptocurrency,
      network as Network
    )

    return NextResponse.json({
      success: true,
      transaction
    })
  } catch (error: any) {
    console.error('Create subscription error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await initializeServices()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const walletAddress = searchParams.get('walletAddress')

    if (!sessionId && !walletAddress) {
      return NextResponse.json(
        { error: 'Missing sessionId or walletAddress' },
        { status: 400 }
      )
    }

    let subscriptions = []

    if (sessionId) {
      const session = await authService.validateSession(sessionId)
      if (!session) {
        return NextResponse.json(
          { error: 'Invalid or expired session' },
          { status: 401 }
        )
      }
      subscriptions = await subscriptionService.getUserSubscriptions(session.walletAddress)
    } else if (walletAddress) {
      subscriptions = await subscriptionService.getUserSubscriptions(walletAddress)
    }

    return NextResponse.json({
      success: true,
      subscriptions
    })
  } catch (error: any) {
    console.error('Get subscriptions error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get subscriptions' },
      { status: 500 }
    )
  }
}
