import { NextRequest, NextResponse } from 'next/server'

// Middleware to block fiat payment endpoints and redirect to crypto
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = request.nextUrl.pathname

  // Block fiat payment endpoints
  const blockedPaths = [
    '/api/checkout',
    '/api/payments',
    '/api/stripe',
    '/api/paypal',
    '/api/shopify/payment',
    '/api/orders/create',
    '/api/subscriptions/create'
  ]

  // Check if path should be blocked
  if (blockedPaths.some(path => pathname.startsWith(path))) {
    // Return 404 for fiat payment endpoints
    return new NextResponse(
      JSON.stringify({
        error: 'Fiat payments are no longer supported',
        message: 'Please use cryptocurrency payments instead',
        redirectTo: '/subscription'
      }),
      {
        status: 410,
        headers: {
          'Content-Type': 'application/json',
          'X-Deprecated-Endpoint': 'true'
        }
      }
    )
  }

  // Redirect old subscription pages to crypto subscription
  if (pathname === '/subscription' || pathname === '/subscribe') {
    url.pathname = '/#subscription'
    return NextResponse.redirect(url, 301)
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'payment=*')
  
  // CSP headers to block external payment scripts
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.coingecko.com https://mainnet.infura.io https://polygon-rpc.com https://arb1.arbitrum.io https://api.mainnet-beta.solana.com; frame-src 'none';"
  )

  return response
}

export const config = {
  matcher: [
    '/api/checkout/:path*',
    '/api/payments/:path*',
    '/api/stripe/:path*',
    '/api/paypal/:path*',
    '/api/shopify/payment/:path*',
    '/api/orders/create/:path*',
    '/api/subscriptions/create/:path*',
    '/subscription',
    '/subscribe',
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}
