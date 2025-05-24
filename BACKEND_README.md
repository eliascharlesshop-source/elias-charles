# EC Store Backend API Documentation

## Overview

The EC Store backend is a comprehensive e-commerce API built with Next.js API routes, featuring authentication, product management, cart functionality, order processing, payment integration, and admin tools.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (customer/admin)
- Password hashing with bcrypt
- Email validation and password strength requirements

### 🛍️ Product Management
- Full CRUD operations for products
- Product search and filtering
- Inventory tracking
- Image management
- SKU and category organization

### 🛒 Shopping Cart
- Add/remove/update cart items
- Real-time total calculations
- Tax and shipping calculations
- Persistent cart storage

### 📦 Order Management
- Order creation with payment processing
- Order status tracking
- Order history and pagination
- Email notifications (mock)

### 💳 Payment Processing
- Mock payment service (ready for Stripe/PayPal integration)
- Payment validation and error handling
- Transaction tracking
- Refund processing

### 👥 User Management
- User registration and profile management
- Address management
- Order history
- Admin user controls

### 📊 Admin Dashboard
- Sales analytics and reporting
- Inventory management
- User management
- Order management
- Low stock alerts

### 📧 Email Notifications
- Order confirmations
- Shipping notifications
- Welcome emails
- Password reset emails

## API Endpoints

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - User login
```

### Products
```
GET    /api/products           - Get all products (with pagination)
POST   /api/products           - Create product (admin only)
GET    /api/products/[id]      - Get single product
PUT    /api/products/[id]      - Update product (admin only)
DELETE /api/products/[id]      - Delete product (admin only)
```

### Collections
```
GET    /api/collections        - Get all collections
POST   /api/collections        - Create collection (admin only)
GET    /api/collections/[id]   - Get single collection
PUT    /api/collections/[id]   - Update collection (admin only)
DELETE /api/collections/[id]   - Delete collection (admin only)
```

### Cart
```
GET  /api/cart?cartId=xxx     - Get cart
POST /api/cart                - Add item to cart
PUT  /api/cart                - Update cart item
```

### Orders
```
GET  /api/orders              - Get orders (with filters)
POST /api/orders              - Create order with payment
GET  /api/orders/[id]         - Get single order
PUT  /api/orders/[id]         - Update order status (admin only)
```

### Users (Admin Only)
```
GET    /api/users             - Get all users (admin only)
GET    /api/users/[id]        - Get user details
PUT    /api/users/[id]        - Update user
DELETE /api/users/[id]        - Delete user (admin only)
```

### Inventory (Admin Only)
```
GET /api/inventory            - Get inventory status
PUT /api/inventory            - Bulk update inventory
```

### Admin Dashboard
```
GET /api/admin/dashboard      - Get dashboard analytics (admin only)
```

## Data Models

### Product
```typescript
interface Product {
  id: string
  title: string
  description: string
  price: number
  salePrice?: number
  category: string
  subcategory?: string
  sku: string
  inventory: number
  inStock: boolean
  images: string[]
  tags: string[]
  featured: boolean
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  createdAt: string
  updatedAt: string
}
```

### User
```typescript
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'customer' | 'admin'
  addresses: Address[]
  orders: string[]
  createdAt: string
  updatedAt: string
}
```

### Order
```typescript
interface Order {
  id: string
  orderNumber: string
  email: string
  items: CartItem[]
  shippingAddress: Address
  billingAddress: Address
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingMethod: string
  trackingNumber?: string
  transactionId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}
```

## Authentication

### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string
  email: string
  role: 'customer' | 'admin'
  iat: number
  exp: number
}
```

### Using Authentication
Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Payment Processing

### Test Payment Tokens
```typescript
const TEST_TOKENS = {
  SUCCESS: 'test_success_4242424242424242',
  FAIL: 'test_fail',
  PENDING: 'test_pending'
}
```

### Payment Method Structure
```typescript
interface PaymentMethod {
  type: 'card' | 'paypal' | 'stripe'
  token: string
  last4?: string
  brand?: string
}
```

## Error Handling

All API responses follow this structure:
```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Database

Currently using a file-based database for development. In production, replace with:
- PostgreSQL
- MongoDB
- MySQL

### Data Storage
- Products: `/data/products.json`
- Users: `/data/users.json`
- Orders: `/data/orders.json`
- Carts: `/data/carts.json`
- Collections: `/data/collections.json`

## Environment Variables

```env
# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email Service (for production)
EMAIL_SERVICE_API_KEY=your-email-service-key

# Payment Service (for production)
STRIPE_SECRET_KEY=your-stripe-secret-key
PAYPAL_CLIENT_ID=your-paypal-client-id
```

## Testing

Run the comprehensive API test suite:
```bash
node test-api.js
```

### Manual Testing Examples

#### Register User
```bash
curl -X POST http://localhost:12000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Create Order with Payment
```bash
curl -X POST http://localhost:12000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "items": [
      {
        "productId": "1",
        "title": "Classic Surf T-Shirt",
        "price": 45,
        "quantity": 1
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
      "firstName": "John",
      "lastName": "Doe",
      "address1": "123 Main St",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90210",
      "country": "US"
    },
    "paymentMethod": {
      "type": "card",
      "token": "test_success_4242424242424242"
    }
  }'
```

#### Get Admin Dashboard (requires admin token)
```bash
curl -X GET "http://localhost:12000/api/admin/dashboard?period=30" \
  -H "Authorization: Bearer <admin-token>"
```

## Production Deployment

### Required Integrations
1. **Database**: Replace file-based storage with PostgreSQL/MongoDB
2. **Payment Processing**: Integrate with Stripe, PayPal, or similar
3. **Email Service**: Integrate with SendGrid, Mailgun, or similar
4. **File Storage**: Use AWS S3, Cloudinary for product images
5. **Monitoring**: Add logging and error tracking

### Security Considerations
- Use HTTPS in production
- Implement rate limiting
- Add input validation middleware
- Use environment variables for secrets
- Implement CORS properly
- Add request logging
- Use secure JWT secrets

### Performance Optimizations
- Add database indexing
- Implement caching (Redis)
- Add CDN for static assets
- Optimize database queries
- Add pagination to all list endpoints

## Development

### Starting the Server
```bash
npm run dev
```

The server runs on `http://localhost:12000` with CORS enabled for development.

### Adding New Features
1. Define types in `/lib/types.ts`
2. Add database operations in `/lib/database.ts`
3. Create API routes in `/app/api/`
4. Add validation schemas in `/lib/validation.ts`
5. Update tests in `test-api.js`

## Support

For questions or issues, contact the development team or create an issue in the repository.

---

**EC Store Backend v1.0** - Built with Next.js, TypeScript, and modern web standards.