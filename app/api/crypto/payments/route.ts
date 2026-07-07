import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/crypto/payment-service'
import { SubscriptionService } from '@/lib/crypto/subscription-service'
import { WalletAuthService } from '@/lib/crypto/wallet-auth-service'

const paymentService = PaymentService.getInstance()
const subscriptionService = SubscriptionService.getInstance()
const authService = WalletAuthService.getInstance()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, sessionId } = body

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Missing transactionId' },
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

    // Process payment
    const transactionHash = await paymentService.processPayment({
      id: transactionId,
      subscriptionId: '',
      userId: walletAddress || 'unknown',
      walletAddress: walletAddress || 'unknown',
      planId: '',
      amount: '0',
      currency: 'ETH',
      network: 'ethereum',
      transactionHash: '',
      status: 'pending',
      confirmation: {
        hash: '',
        status: 'pending',
        confirmations: 0,
        requiredConfirmations: 12,
        timestamp: new Date(),
        gasUsed: '0'
      },
      createdAt: new Date(),
      autoRenew: true
    } as any)

    return NextResponse.json({
      success: true,
      transactionHash
    })
  } catch (error: any) {
    console.error('Process payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process payment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionHash = searchParams.get('hash')
    const network = searchParams.get('network')

    if (!transactionHash || !network) {
      return NextResponse.json(
        { error: 'Missing transactionHash or network' },
        { status: 400 }
      )
    }

    const confirmation = await paymentService.confirmTransaction(
      transactionHash,
      network as any,
      '0'
    )

    return NextResponse.json({
      success: true,
      confirmation
    })
  } catch (error: any) {
    console.error('Confirm transaction error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to confirm transaction' },
      { status: 500 }
    )
  }
}
