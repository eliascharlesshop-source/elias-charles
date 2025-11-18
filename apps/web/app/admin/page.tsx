import { Suspense } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - EC Store',
  description: 'Administrative dashboard for managing the EC Store'
}

// Mock data for demonstration
const dashboardData = {
  totalProducts: 25,
  totalOrders: 150,
  revenue: 15420.50,
  customers: 342,
  recentOrders: [
    { id: 'EC001', customer: 'John Doe', total: 125.00, status: 'completed' },
    { id: 'EC002', customer: 'Jane Smith', total: 89.99, status: 'processing' },
    { id: 'EC003', customer: 'Mike Johnson', total: 234.50, status: 'shipped' }
  ],
  topProducts: [
    { name: 'Classic Surf T-Shirt', sold: 45, revenue: 2025.00 },
    { name: 'Board Shorts', sold: 32, revenue: 2080.00 },
    { name: 'Relaxed Fit Hoodie', sold: 28, revenue: 2380.00 }
  ]
}

function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
        <p className="text-3xl font-bold text-gray-900">{dashboardData.totalProducts}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
        <p className="text-3xl font-bold text-gray-900">{dashboardData.totalOrders}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
        <p className="text-3xl font-bold text-gray-900">${dashboardData.revenue.toLocaleString()}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Customers</h3>
        <p className="text-3xl font-bold text-gray-900">{dashboardData.customers}</p>
      </div>
    </div>
  )
}

function RecentOrders() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dashboardData.recentOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TopProducts() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {dashboardData.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">{product.sold} sold</p>
              </div>
              <p className="text-sm font-medium text-gray-900">${product.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your EC Store from here</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div>Loading stats...</div>}>
          <DashboardStats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Suspense fallback={<div>Loading orders...</div>}>
            <RecentOrders />
          </Suspense>
          
          <Suspense fallback={<div>Loading products...</div>}>
            <TopProducts />
          </Suspense>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Product
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Process Orders
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              View Analytics
            </button>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
