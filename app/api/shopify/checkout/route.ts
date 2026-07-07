import { NextRequest, NextResponse } from 'next/server'
import { ShopifyCartService } from '@/lib/shopify-services'
export const dynamic = 'force-dynamic'

// Create a new Shopify checkout
export async function POST(request: NextRequest) {
  try {
    const checkout = await ShopifyCartService.createCheckout()

    return NextResponse.json({
      success: true,
      data: {
        checkoutId: checkout.id,
        webUrl: checkout.webUrl,
        lineItems: checkout.lineItems,
        subtotal: parseFloat(checkout.subtotalPrice.amount),
        tax: parseFloat(checkout.totalTax.amount),
        total: parseFloat(checkout.totalPrice.amount),
        currencyCode: checkout.totalPrice.currencyCode
      }
    })

  } catch (error) {
    console.error('Shopify checkout creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create checkout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Add items to checkout
export async function PATCH(request: NextRequest) {
  try {
    const { checkoutId, lineItems, action } = await request.json()

    if (!checkoutId) {
      return NextResponse.json({
        success: false,
        error: 'Checkout ID is required'
      }, { status: 400 })
    }

    let checkout

    switch (action) {
      case 'add':
        checkout = await ShopifyCartService.addLineItems(checkoutId, lineItems)
        break
      case 'update':
        checkout = await ShopifyCartService.updateLineItems(checkoutId, lineItems)
        break
      case 'remove':
        const lineItemIds = lineItems.map((item: any) => item.id)
        checkout = await ShopifyCartService.removeLineItems(checkoutId, lineItemIds)
        break
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Must be add, update, or remove'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        checkoutId: checkout.id,
        webUrl: checkout.webUrl,
        lineItems: checkout.lineItems,
        subtotal: parseFloat(checkout.subtotalPrice.amount),
        tax: parseFloat(checkout.totalTax.amount),
        total: parseFloat(checkout.totalPrice.amount),
        currencyCode: checkout.totalPrice.currencyCode
      }
    })

  } catch (error) {
    console.error('Shopify checkout update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update checkout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
