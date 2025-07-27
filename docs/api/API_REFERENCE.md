# API Reference

Complete reference for all EC Store API endpoints.

## 🔗 Base URL

**Development**: `http://localhost:3000/api`  
**Production**: `https://your-domain.com/api`

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Getting an Auth Token
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## 📚 Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Products

#### Get All Products
```http
GET /api/products?page=1&limit=12&category=apparel&featured=true&sort=price&order=asc
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12, max: 50)
- `category` (optional): Filter by category
- `subcategory` (optional): Filter by subcategory
- `featured` (optional): Filter featured products (true/false)
- `inStock` (optional): Filter by stock status (true/false)
- `search` (optional): Search in title and description
- `sort` (optional): Sort field (title, price, createdAt)
- `order` (optional): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Classic Surf T-Shirt",
      "description": "Comfortable cotton t-shirt perfect for beach days",
      "price": 45,
      "salePrice": 35,
      "category": "apparel",
      "subcategory": "t-shirts",
      "sku": "SURF-TEE-001",
      "inventory": 25,
      "inStock": true,
      "images": ["/images/surf-tee.jpg"],
      "tags": ["surf", "casual", "cotton"],
      "featured": true,
      "weight": 0.3,
      "dimensions": {
        "length": 70,
        "width": 50,
        "height": 1
      },
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-20T14:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 24,
    "totalPages": 2
  }
}
```

#### Get Single Product
```http
GET /api/products/[id]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Classic Surf T-Shirt",
    // ... full product details
  }
}
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "title": "New Product",
  "description": "Product description",
  "price": 50,
  "category": "apparel",
  "sku": "NEW-001",
  "inventory": 10,
  "images": ["/images/new-product.jpg"],
  "tags": ["new", "featured"]
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/[id]
Authorization: Bearer <admin-token>
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/[id]
Authorization: Bearer <admin-token>
```

### Collections

#### Get All Collections
```http
GET /api/collections
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "handle": "summer-collection",
      "title": "Summer Collection",
      "description": "Hot weather essentials",
      "image": "/images/summer-collection.jpg",
      "products": ["1", "2", "3"],
      "featured": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Single Collection
```http
GET /api/collections/[id]
```

#### Create Collection (Admin Only)
```http
POST /api/collections
Authorization: Bearer <admin-token>
```

### Shopping Cart

#### Get Cart
```http
GET /api/cart?cartId=cart_123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart_123",
    "items": [
      {
        "productId": "1",
        "title": "Classic Surf T-Shirt",
        "price": 45,
        "salePrice": 35,
        "quantity": 2,
        "image": "/images/surf-tee.jpg",
        "sku": "SURF-TEE-001"
      }
    ],
    "itemCount": 2,
    "subtotal": 70,
    "tax": 7.00,
    "shipping": 10,
    "total": 87.00,
    "createdAt": "2025-01-20T10:00:00Z",
    "updatedAt": "2025-01-20T15:30:00Z"
  }
}
```

#### Add Item to Cart
```http
POST /api/cart
```

**Request Body:**
```json
{
  "cartId": "cart_123",
  "productId": "1",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart
```

**Request Body:**
```json
{
  "cartId": "cart_123",
  "productId": "1",
  "quantity": 3
}
```

#### Remove Item from Cart
```http
DELETE /api/cart
```

**Request Body:**
```json
{
  "cartId": "cart_123",
  "productId": "1"
}
```

### Orders

#### Get Orders
```http
GET /api/orders?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `email` (optional): Filter by customer email (admin only)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order_123",
      "orderNumber": "EC-2025-001",
      "email": "customer@example.com",
      "items": [
        {
          "productId": "1",
          "title": "Classic Surf T-Shirt",
          "price": 45,
          "quantity": 2
        }
      ],
      "shippingAddress": {
        "firstName": "John",
        "lastName": "Doe",
        "address1": "123 Main St",
        "city": "Los Angeles",
        "state": "CA",
        "zipCode": "90210",
        "country": "US"
      },
      "billingAddress": {
        // Same structure as shipping address
      },
      "subtotal": 90,
      "tax": 9.00,
      "shipping": 10,
      "total": 109.00,
      "status": "pending",
      "paymentStatus": "paid",
      "shippingMethod": "standard",
      "trackingNumber": "TRK123456789",
      "transactionId": "txn_abc123",
      "createdAt": "2025-01-20T15:00:00Z",
      "updatedAt": "2025-01-20T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

#### Create Order
```http
POST /api/orders
```

**Request Body:**
```json
{
  "email": "customer@example.com",
  "items": [
    {
      "productId": "1",
      "title": "Classic Surf T-Shirt",
      "price": 45,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210",
    "country": "US"
  },
  "billingAddress": {
    // Same structure as shipping address
  },
  "paymentMethod": {
    "type": "card",
    "token": "test_success_4242424242424242"
  },
  "shippingMethod": "standard"
}
```

#### Get Single Order
```http
GET /api/orders/[id]
Authorization: Bearer <token>
```

#### Update Order Status (Admin Only)
```http
PUT /api/orders/[id]
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789"
}
```

### Users (Admin Only)

#### Get All Users
```http
GET /api/users?page=1&limit=20&role=customer
Authorization: Bearer <admin-token>
```

#### Get User Details
```http
GET /api/users/[id]
Authorization: Bearer <admin-token>
```

#### Update User
```http
PUT /api/users/[id]
Authorization: Bearer <admin-token>
```

#### Delete User
```http
DELETE /api/users/[id]
Authorization: Bearer <admin-token>
```

### Inventory (Admin Only)

#### Get Inventory Status
```http
GET /api/inventory?lowStock=true
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productId": "1",
      "title": "Classic Surf T-Shirt",
      "sku": "SURF-TEE-001",
      "currentStock": 5,
      "lowStockThreshold": 10,
      "status": "low_stock"
    }
  ]
}
```

#### Bulk Update Inventory
```http
PUT /api/inventory
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "updates": [
    {
      "productId": "1",
      "inventory": 50
    },
    {
      "productId": "2",
      "inventory": 25
    }
  ]
}
```

### Admin Dashboard

#### Get Dashboard Analytics
```http
GET /api/admin/dashboard?period=30
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `period` (optional): Days to include in analytics (default: 30)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "totalRevenue": 15000,
    "totalProducts": 45,
    "totalUsers": 230,
    "recentOrders": [
      // Array of recent orders
    ],
    "topProducts": [
      // Array of best-selling products
    ],
    "lowStockProducts": [
      // Array of products with low inventory
    ],
    "salesData": [
      // Array of daily sales data
    ]
  }
}
```

## 📝 Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Optional success message",
  "pagination": {
    // Only for paginated endpoints
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {
    // Additional error details (for validation errors)
  }
}
```

## 🚨 Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

## 🔍 Testing

### Test Data
The API includes test payment tokens for development:
- `test_success_4242424242424242` - Successful payment
- `test_fail` - Failed payment
- `test_pending` - Pending payment

### Sample Admin User
```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### Rate Limiting
- **Development**: No rate limiting
- **Production**: 100 requests per 15 minutes per IP

---

For more detailed examples and testing scripts, see the `test-api.js` file in the project root.
