import { NextRequest, NextResponse } from 'next/server'
import { ShopifyStorefront, withShopifyErrorHandling } from '@/lib/shopify'

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

    return await withShopifyErrorHandling(async () => {
      const shopify = new ShopifyStorefront()
      const data = await shopify.createCart(lines)
      
      if (data.cartCreate.userErrors.length > 0) {
        return NextResponse.json({
          success: false,
          error: 'Failed to create cart',
          details: data.cartCreate.userErrors
        }, { status: 400 })
      }

      const cart = data.cartCreate.cart

      return NextResponse.json({
        success: true,
        data: {
          id: cart.id,
          checkoutUrl: cart.checkoutUrl,
          lines: cart.lines.edges.map((edge: any) => ({
            id: edge.node.id,
            quantity: edge.node.quantity,
            merchandise: {
              id: edge.node.merchandise.id,
              title: edge.node.merchandise.title,
              product: edge.node.merchandise.product,
              price: edge.node.merchandise.price,
              image: edge.node.merchandise.image
            }
          })),
          cost: cart.cost
        }
      })
    })

  } catch (error) {
    console.error('Shopify cart creation error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create cart',
      details: error instanceof Error ? error.message : 'Unknown error'
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

    return await withShopifyErrorHandling(async () => {
      const shopify = new ShopifyStorefront()
      const data = await shopify.addToCart(cartId, lines)
      
      if (data.cartLinesAdd.userErrors.length > 0) {
        return NextResponse.json({
          success: false,
          error: 'Failed to add items to cart',
          details: data.cartLinesAdd.userErrors
        }, { status: 400 })
      }

      const cart = data.cartLinesAdd.cart

      return NextResponse.json({
        success: true,
        data: {
          id: cart.id,
          lines: cart.lines.edges.map((edge: any) => ({
            id: edge.node.id,
            quantity: edge.node.quantity,
            merchandise: {
              id: edge.node.merchandise.id,
              title: edge.node.merchandise.title,
              product: edge.node.merchandise.product,
              price: edge.node.merchandise.price
            }
          })),
          cost: cart.cost
        }
      })
    })

  } catch (error) {
    console.error('Shopify cart update error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update cart',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
