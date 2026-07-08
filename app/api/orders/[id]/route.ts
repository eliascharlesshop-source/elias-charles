import { NextRequest, NextResponse } from 'next/server'
import { ordersDb, initializeDatabase } from '@/lib/database'
import { ApiResponse, Order } from '@/lib/types'

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureInitialized()
    
    const { id } = await params
    
    // Try to find by ID first, then by order number
    let order = await ordersDb.findById(id)
    
    if (!order) {
      order = await ordersDb.findOne(o => o.orderNumber === id)
    }

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
  } catch (error) {
    console.error('Error fetching order:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch order'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureInitialized()
    
    const { id } = await params
    const updates = await request.json()

    // Validate status updates
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded']

    if (updates.status && !validStatuses.includes(updates.status)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid order status'
      }
      return NextResponse.json(response, { status: 400 })
    }

    if (updates.paymentStatus && !validPaymentStatuses.includes(updates.paymentStatus)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid payment status'
      }
      return NextResponse.json(response, { status: 400 })
    }

    const order = await ordersDb.update(id, updates)

    if (!order) {
      const response: ApiResponse = {
        success: false,
        error: 'Order not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<Order> = {
      success: true,
      data: order,
      message: 'Order updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating order:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update order'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
