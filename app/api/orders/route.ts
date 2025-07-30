import { NextRequest, NextResponse } from 'next/server'
import { ordersDb, cartsDb, generateId, generateOrderNumber, initializeDatabase } from '@/lib/database'
import { ApiResponse, CreateOrderRequest, Order } from '@/lib/types'
import { PaymentService } from '@/lib/payment'

// Initialize database on first request
let initialized = false

async function ensureInitialized() {
  if (!initialized) {
    await initializeDatabase()
    initialized = true
  }
}

function calculateOrderTotals(items: any[]): {
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
    const email = searchParams.get('email')
    const orderId = searchParams.get('orderId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (orderId) {
      // Get specific order
      const order = await ordersDb.findById(orderId)
      if (!order) {
        const response: ApiResponse = {
          success: false,
          error: 'Order not found'
        }
        return NextResponse.json(response, { status: 404 })
      }

      const response: ApiResponse<Order> = {
        success: true,
        data: order
      }
      return NextResponse.json(response)
    }

    // Get orders with optional email filter
    let orders = await ordersDb.findAll()
    
    if (email) {
      orders = orders.filter(order => order.email === email)
    }

    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Paginate
    const total = orders.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedOrders = orders.slice(offset, offset + limit)

    const response = {
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching orders:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch orders'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureInitialized()
    
    const body: CreateOrderRequest & { cartId?: string, paymentMethod?: any } = await request.json()
    const { items, shippingAddress, billingAddress, shippingMethod, email, notes, cartId, paymentMethod } = body

    // Validate required fields
    if (!items || !items.length || !shippingAddress || !billingAddress || !email) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Calculate totals
    const totals = calculateOrderTotals(items)

    // Create order first
    const order: Order = {
      id: generateId(),
      orderNumber: generateOrderNumber(),
      email,
      items,
      shippingAddress,
      billingAddress,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      total: totals.total,
      status: 'pending',
      paymentStatus: 'pending',
      shippingMethod: shippingMethod || 'standard',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const createdOrder = await ordersDb.create(order)

    // Process payment if payment method provided
    if (paymentMethod) {
      try {
        const paymentResult = await PaymentService.processPayment(
          totals.total,
          'USD',
          paymentMethod,
          createdOrder.id
        )

        if (paymentResult.success) {
          // Update order with payment info
          const updatedOrder = await ordersDb.update(createdOrder.id, {
            paymentStatus: paymentResult.status === 'completed' ? 'paid' : 'pending',
            status: paymentResult.status === 'completed' ? 'processing' : 'pending',
            transactionId: paymentResult.transactionId,
            updatedAt: new Date().toISOString()
          })

          // Clear cart if payment successful and cartId provided
          if (paymentResult.status === 'completed' && cartId) {
            await cartsDb.update(cartId, {
              lines: [],
              totalQuantity: 0,
              subtotal: 0,
              tax: 0,
              shipping: 0,
              total: 0
            })
          }

          const response: ApiResponse<Order> = {
            success: true,
            data: updatedOrder || createdOrder,
            message: paymentResult.status === 'completed' ? 'Order created and payment processed successfully' : 'Order created, payment pending'
          }

          return NextResponse.json(response, { status: 201 })
        } else {
          // Payment failed, update order status
          await ordersDb.update(createdOrder.id, {
            paymentStatus: 'failed',
            status: 'cancelled',
            notes: `${notes || ''}\nPayment failed: ${paymentResult.error}`,
            updatedAt: new Date().toISOString()
          })

          const response: ApiResponse = {
            success: false,
            error: `Payment failed: ${paymentResult.error}`
          }
          return NextResponse.json(response, { status: 400 })
        }
      } catch (paymentError) {
        console.error('Payment processing error:', paymentError)
        
        // Update order with payment error
        await ordersDb.update(createdOrder.id, {
          paymentStatus: 'failed',
          status: 'cancelled',
          notes: `${notes || ''}\nPayment processing error`,
          updatedAt: new Date().toISOString()
        })

        const response: ApiResponse = {
          success: false,
          error: 'Payment processing failed'
        }
        return NextResponse.json(response, { status: 500 })
      }
    } else {
      // No payment method provided, return order for manual payment
      const response: ApiResponse<Order> = {
        success: true,
        data: createdOrder,
        message: 'Order created successfully. Payment required to complete.'
      }

      return NextResponse.json(response, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating order:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create order'
    }
    return NextResponse.json(response, { status: 500 })
  }
}