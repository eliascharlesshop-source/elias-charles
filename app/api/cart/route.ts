import { NextRequest, NextResponse } from 'next/server'
import { cartsDb, productsDb, generateId, initializeDatabase } from '@/lib/database'
import { ApiResponse, UpdateCartRequest, Cart, CartItem } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamic = 'force-dynamic'

// Initialize database on first request
let initialized = false

async function ensureInitialized() {
  if (!initialized) {
    await initializeDatabase()
    initialized = true
  }
}

function calculateCartTotals(items: CartItem[]): {
  subtotal: number
  tax: number
  shipping: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax rate
  const shipping = subtotal > 75 ? 0 : 10 // Free shipping over $75
  const total = subtotal + tax + shipping

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureInitialized()
    
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cartId')

    if (!cartId) {
      // Create a new cart
      const newCart: Cart = {
        id: generateId(),
        lines: [],
        totalQuantity: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const cart = await cartsDb.create(newCart)

      const response: ApiResponse<Cart> = {
        success: true,
        data: cart
      }

      return NextResponse.json(response)
    }

    const cart = await cartsDb.findById(cartId)

    if (!cart) {
      const response: ApiResponse = {
        success: false,
        error: 'Cart not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<Cart> = {
      success: true,
      data: cart
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching cart:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch cart'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureInitialized()
    
    const body: UpdateCartRequest & { cartId?: string } = await request.json()
    const { cartId, productId, quantity, size, color } = body

    if (!productId || !quantity || !size || !color) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields: productId, quantity, size, color'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Get the product
    const product = await productsDb.findById(productId)
    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: 'Product not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Get or create cart
    let cart: Cart
    if (cartId) {
      const existingCart = await cartsDb.findById(cartId)
      if (!existingCart) {
        const response: ApiResponse = {
          success: false,
          error: 'Cart not found'
        }
        return NextResponse.json(response, { status: 404 })
      }
      cart = existingCart
    } else {
      cart = await cartsDb.create({
        id: generateId(),
        lines: [],
        totalQuantity: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.lines.findIndex(
      item => item.productId === productId && item.size === size && item.color === color
    )

    if (existingItemIndex >= 0) {
      // Update existing item
      cart.lines[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      const newItem: CartItem = {
        id: generateId(),
        productId,
        title: product.title,
        price: product.price,
        image: product.images[0] || '',
        quantity,
        size,
        color,
        sku: product.sku
      }
      cart.lines.push(newItem)
    }

    // Recalculate totals
    cart.totalQuantity = cart.lines.reduce((sum, item) => sum + item.quantity, 0)
    const totals = calculateCartTotals(cart.lines)
    cart.subtotal = totals.subtotal
    cart.tax = totals.tax
    cart.shipping = totals.shipping
    cart.total = totals.total

    // Update cart in database
    const updatedCart = await cartsDb.update(cart.id, cart)

    const response: ApiResponse<Cart> = {
      success: true,
      data: updatedCart!,
      message: 'Item added to cart'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating cart:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update cart'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureInitialized()
    
    const body: { cartId: string; itemId: string; quantity: number } = await request.json()
    const { cartId, itemId, quantity } = body

    if (!cartId || !itemId || quantity < 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid request parameters'
      }
      return NextResponse.json(response, { status: 400 })
    }

    const cart = await cartsDb.findById(cartId)
    if (!cart) {
      const response: ApiResponse = {
        success: false,
        error: 'Cart not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    if (quantity === 0) {
      // Remove item from cart
      cart.lines = cart.lines.filter(item => item.id !== itemId)
    } else {
      // Update item quantity
      const itemIndex = cart.lines.findIndex(item => item.id === itemId)
      if (itemIndex >= 0) {
        cart.lines[itemIndex].quantity = quantity
      }
    }

    // Recalculate totals
    cart.totalQuantity = cart.lines.reduce((sum, item) => sum + item.quantity, 0)
    const totals = calculateCartTotals(cart.lines)
    cart.subtotal = totals.subtotal
    cart.tax = totals.tax
    cart.shipping = totals.shipping
    cart.total = totals.total

    // Update cart in database
    const updatedCart = await cartsDb.update(cart.id, cart)

    const response: ApiResponse<Cart> = {
      success: true,
      data: updatedCart!,
      message: 'Cart updated'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating cart:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update cart'
    }
    return NextResponse.json(response, { status: 500 })
  }
}