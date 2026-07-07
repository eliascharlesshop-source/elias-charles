import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { WalletAuthService } = await import('@/lib/crypto/wallet-auth-service')
    const authService = WalletAuthService.getInstance()

    const body = await request.json()
    const { walletAddress, walletType } = body

    if (!walletAddress || !walletType) {
      return NextResponse.json(
        { error: 'Missing walletAddress or walletType' },
        { status: 400 }
      )
    }

    // Authenticate wallet
    const session = await authService.authenticateWallet(walletAddress, walletType)

    return NextResponse.json({
      success: true,
      session
    })
  } catch (error: any) {
    console.error('Wallet auth error:', error)
    return NextResponse.json(
      { error: error.message || 'Wallet authentication failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { WalletAuthService } = await import('@/lib/crypto/wallet-auth-service')
    const authService = WalletAuthService.getInstance()

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      )
    }

    const session = await authService.validateSession(sessionId)

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      session
    })
  } catch (error: any) {
    console.error('Validate session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to validate session' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { WalletAuthService } = await import('@/lib/crypto/wallet-auth-service')
    const authService = WalletAuthService.getInstance()

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      )
    }

    authService.invalidateSession(sessionId)

    return NextResponse.json({
      success: true,
      message: 'Session invalidated'
    })
  } catch (error: any) {
    console.error('Invalidate session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to invalidate session' },
      { status: 500 }
    )
  }
}
