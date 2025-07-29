const express = require('express')
const app = express()
const port = 3002

app.use(express.json())

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Express API is working!',
    timestamp: new Date().toISOString()
  })
})

// Products endpoint with mock data
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        title: 'Classic Surf T-Shirt',
        price: 45.00,
        image: '/placeholder.svg'
      },
      {
        id: '2',
        title: 'Board Shorts',
        price: 65.00,
        image: '/placeholder.svg'
      }
    ]
  })
})

// Admin dashboard endpoint
app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      totalProducts: 25,
      totalOrders: 150,
      revenue: 15420.50,
      customers: 342
    }
  })
})

app.listen(port, () => {
  console.log(`✅ Express server running at http://localhost:${port}`)
  console.log(`Test API: http://localhost:${port}/api/test`)
})
