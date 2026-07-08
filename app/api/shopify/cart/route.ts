import { NextRequest, NextResponse } from 'next/server'
import shopifyService from '@/lib/shopify-service'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lines } = body

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid cart lines provided'
      }, { status: 400 })
    }

    // Use GraphQL-enhanced cart service
    const cart = await shopifyService.createCart(lines)

    return NextResponse.json({
      success: true,
      data: cart,
      meta: {
        source: 'GraphQL',
        cartId: cart.id,
        queryTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Shopify cart creation error:', error)
    
    if (error instanceof Error && error.message.includes('Missing Shopify configuration')) {
      return NextResponse.json({
        success: false,
        error: 'Shopify GraphQL is not configured. Please check your environment variables.',
        details: error.message
      }, { status: 503 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create cart',
      details: error instanceof Error ? error.message : 'Unknown error',
      source: 'GraphQL Enhanced API'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartId, lines } = body

    if (!cartId || !lines || !Array.isArray(lines)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid cart data provided'
      }, { status: 400 })
    }

    // Use GraphQL-enhanced cart service
    const cart = await shopifyService.addToCart(cartId, lines)

    return NextResponse.json({
      success: true,
      data: cart,
      meta: {
        source: 'GraphQL',
        cartId: cart.id,
        queryTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Shopify cart update error:', error)
    
    if (error instanceof Error && error.message.includes('Missing Shopify configuration')) {
      return NextResponse.json({
        success: false,
        error: 'Shopify GraphQL is not configured. Please check your environment variables.',
        details: error.message
      }, { status: 503 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update cart',
      details: error instanceof Error ? error.message : 'Unknown error',
      source: 'GraphQL Enhanced API'
    }, { status: 500 })
  }
}

// GET method for retrieving cart by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cartId')

    if (!cartId) {
      return NextResponse.json({
        success: false,
        error: 'Cart ID is required'
      }, { status: 400 })
    }

    // Use GraphQL-enhanced cart service
    const cart = await shopifyService.getCart(cartId)

    return NextResponse.json({
      success: true,
      data: cart,
      meta: {
        source: 'GraphQL',
        cartId: cart.id,
        queryTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Shopify cart retrieval error:', error)
    
    if (error instanceof Error && error.message.includes('Missing Shopify configuration')) {
      return NextResponse.json({
        success: false,
        error: 'Shopify GraphQL is not configured. Please check your environment variables.',
        details: error.message
      }, { status: 503 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve cart',
      details: error instanceof Error ? error.message : 'Unknown error',
      source: 'GraphQL Enhanced API'
    }, { status: 500 })
  }
}
