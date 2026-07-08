import { NextRequest, NextResponse } from 'next/server'
import { productsDb, ordersDb, usersDb, initializeDatabase } from '@/lib/database'
import { ApiResponse } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const dynamic = 'force-dynamic'

let initialized = false

async function ensureInitialized() {
  if (!initialized) {
    await initializeDatabase()
    initialized = true
  }
}

// GET /api/admin/dashboard - Get dashboard statistics (admin only)
export async function GET(request: NextRequest) {
  const { AuthService } = await import('@/lib/auth')
  return AuthService.requireRole('admin', async (req: NextRequest) => {
    try {
      await ensureInitialized()

      const url = new URL(req.url)
      const period = url.searchParams.get('period') || '30'

      const [products, orders, users] = await Promise.all([
        productsDb.findAll(),
        ordersDb.findAll(),
        usersDb.findAll()
      ])

      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - parseInt(period))

      const recentOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= startDate && orderDate <= endDate
      })

      const totalRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0)
      const averageOrderValue = recentOrders.length > 0 ? totalRevenue / recentOrders.length : 0

      const orderStatusBreakdown = recentOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const productSales = recentOrders.reduce((acc, order) => {
        order.items.forEach(item => {
          if (!acc[item.productId]) {
            acc[item.productId] = { productId: item.productId, title: item.title, quantity: 0, revenue: 0 }
          }
          acc[item.productId].quantity += item.quantity
          acc[item.productId].revenue += item.price * item.quantity
        })
        return acc
      }, {} as Record<string, any>)

      const topProducts = Object.values(productSales)
        .sort((a: any, b: any) => b.quantity - a.quantity)
        .slice(0, 5)

      const lowStockProducts = products.filter(p => p.inventory <= 10 && p.inventory > 0)
      const outOfStockProducts = products.filter(p => p.inventory === 0)

      const recentActivity = [
        ...recentOrders.slice(-5).map(order => ({
          type: 'order',
          id: order.id,
          description: `Order #${order.id.slice(-8)} - $${order.total.toFixed(2)}`,
          timestamp: order.createdAt,
          status: order.status
        })),
        ...users.slice(-3).map(user => ({
          type: 'user',
          id: user.id,
          description: `New user: ${user.firstName} ${user.lastName}`,
          timestamp: user.createdAt,
          status: 'active'
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

      const dailySales = []
      for (let i = parseInt(period) - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= dayStart && orderDate < dayEnd
        })
        dailySales.push({
          date: dayStart.toISOString().split('T')[0],
          revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
          orders: dayOrders.length
        })
      }

      const dashboardData = {
        overview: { totalRevenue, totalOrders: recentOrders.length, totalProducts: products.length, totalUsers: users.length, averageOrderValue, period: parseInt(period) },
        orderStatus: orderStatusBreakdown,
        topProducts,
        inventory: {
          lowStock: lowStockProducts.length,
          outOfStock: outOfStockProducts.length,
          lowStockProducts: lowStockProducts.slice(0, 5).map(p => ({ id: p.id, title: p.title, inventory: p.inventory })),
          outOfStockProducts: outOfStockProducts.slice(0, 5).map(p => ({ id: p.id, title: p.title, inventory: p.inventory }))
        },
        recentActivity,
        salesChart: dailySales
      }

      const response: ApiResponse<typeof dashboardData> = { success: true, data: dashboardData }
      return NextResponse.json(response)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      const response: ApiResponse = { success: false, error: 'Failed to fetch dashboard data' }
      return NextResponse.json(response, { status: 500 })
    }
  })(request)
}
