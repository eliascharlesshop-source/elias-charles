# EC Store Production Deployment Checklist

## 🚀 Pre-Deployment Checklist

### Database Migration
- [ ] Set up production database (PostgreSQL/MongoDB)
- [ ] Create database schema/collections
- [ ] Migrate sample data to production database
- [ ] Set up database connection pooling
- [ ] Configure database backups
- [ ] Add database indexes for performance

### Environment Configuration
- [ ] Set up production environment variables
- [ ] Configure JWT secret (strong, unique)
- [ ] Set up CORS for production domains
- [ ] Configure rate limiting
- [ ] Set up SSL/HTTPS certificates

### Payment Integration
- [ ] Set up Stripe/PayPal production accounts
- [ ] Configure webhook endpoints
- [ ] Test payment flows in sandbox
- [ ] Implement webhook signature verification
- [ ] Set up payment failure handling
- [ ] Configure refund processing

### Email Service Integration
- [ ] Set up SendGrid/Mailgun account
- [ ] Configure email templates
- [ ] Set up transactional email flows
- [ ] Test email delivery
- [ ] Configure email bounce handling
- [ ] Set up email analytics

### File Storage
- [ ] Set up AWS S3/Cloudinary for images
- [ ] Configure CDN for static assets
- [ ] Implement image optimization
- [ ] Set up file upload validation
- [ ] Configure backup storage

### Security Hardening
- [ ] Implement input validation middleware
- [ ] Add request sanitization
- [ ] Set up rate limiting per endpoint
- [ ] Configure CORS properly
- [ ] Add security headers
- [ ] Implement API key authentication for admin
- [ ] Set up IP whitelisting for admin endpoints
- [ ] Add request logging and monitoring

### Performance Optimization
- [ ] Add Redis caching layer
- [ ] Implement database query optimization
- [ ] Add response compression
- [ ] Set up CDN for API responses
- [ ] Implement pagination for all list endpoints
- [ ] Add database connection pooling
- [ ] Optimize image loading and resizing

### Monitoring & Logging
- [ ] Set up error tracking (Sentry)
- [ ] Configure application logging
- [ ] Set up performance monitoring
- [ ] Add health check endpoints
- [ ] Configure uptime monitoring
- [ ] Set up alerting for critical errors

### Testing
- [ ] Run full test suite
- [ ] Perform load testing
- [ ] Test payment flows end-to-end
- [ ] Test email notifications
- [ ] Verify admin dashboard functionality
- [ ] Test mobile responsiveness
- [ ] Perform security testing

## 🔧 Code Changes Required for Production

### 1. Database Layer (`/lib/database.ts`)
Replace file-based storage with proper database:

```typescript
// Example PostgreSQL integration
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export class ProductsDatabase {
  async findAll(filters?: any): Promise<Product[]> {
    const query = 'SELECT * FROM products WHERE deleted_at IS NULL'
    const result = await pool.query(query)
    return result.rows
  }
  
  async findById(id: string): Promise<Product | null> {
    const query = 'SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL'
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }
  
  // ... other methods
}
```

### 2. Payment Service (`/lib/payment.ts`)
Replace mock with real payment processor:

```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export class PaymentService {
  static async processPayment(
    amount: number,
    currency: string,
    paymentMethod: PaymentMethod,
    orderId: string
  ): Promise<PaymentResult> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        payment_method: paymentMethod.token,
        confirm: true,
        metadata: {
          orderId
        }
      })

      return {
        success: true,
        transactionId: paymentIntent.id,
        amount,
        currency,
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}
```

### 3. Email Service (`/lib/email.ts`)
Replace mock with real email service:

```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export class EmailService {
  static async sendEmail(
    to: EmailRecipient,
    template: EmailTemplate,
    variables: Record<string, any> = {}
  ): Promise<EmailResult> {
    try {
      const msg = {
        to: to.email,
        from: process.env.FROM_EMAIL!,
        subject: this.replaceVariables(template.subject, variables),
        html: this.replaceVariables(template.html, variables),
        text: this.replaceVariables(template.text, variables)
      }

      const result = await sgMail.send(msg)
      
      return {
        success: true,
        messageId: result[0].headers['x-message-id']
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}
```

### 4. Add Input Validation Middleware
Create `/lib/middleware.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'

export function validateInput<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest, handler: Function) => {
    try {
      const body = await request.json()
      const validatedData = schema.parse(body)
      return handler(request, validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        }, { status: 400 })
      }
      throw error
    }
  }
}

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})
```

### 5. Add Health Check Endpoint
Create `/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  // Check database connection
  // Check external services
  // Return health status
  
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
}
```

## 🌐 Infrastructure Setup

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add JWT_SECRET
vercel env add DATABASE_URL
vercel env add STRIPE_SECRET_KEY
vercel env add SENDGRID_API_KEY
```

### Docker Deployment
Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=ecstore
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 📊 Monitoring Setup

### Error Tracking with Sentry
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})

// In API routes
export async function POST(request: NextRequest) {
  try {
    // ... your code
  } catch (error) {
    Sentry.captureException(error)
    throw error
  }
}
```

### Performance Monitoring
```typescript
// Add to API routes
import { performance } from 'perf_hooks'

export async function GET(request: NextRequest) {
  const start = performance.now()
  
  try {
    // ... your code
    const end = performance.now()
    console.log(`API call took ${end - start} milliseconds`)
  } catch (error) {
    // ... error handling
  }
}
```

## 🔒 Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Implement proper CORS
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use secure JWT secrets
- [ ] Implement proper session management
- [ ] Add security headers
- [ ] Regular security audits
- [ ] Keep dependencies updated

## 📈 Performance Checklist

- [ ] Database query optimization
- [ ] Implement caching strategy
- [ ] Add CDN for static assets
- [ ] Optimize images
- [ ] Implement lazy loading
- [ ] Add response compression
- [ ] Monitor Core Web Vitals
- [ ] Implement pagination
- [ ] Add database indexes

## 🚨 Post-Deployment

### Immediate Actions
- [ ] Verify all endpoints are working
- [ ] Test payment flows
- [ ] Check email notifications
- [ ] Monitor error rates
- [ ] Verify SSL certificates
- [ ] Test admin dashboard

### Ongoing Monitoring
- [ ] Set up daily health checks
- [ ] Monitor performance metrics
- [ ] Track error rates
- [ ] Monitor payment success rates
- [ ] Review security logs
- [ ] Monitor database performance

### Maintenance Schedule
- [ ] Weekly dependency updates
- [ ] Monthly security reviews
- [ ] Quarterly performance audits
- [ ] Regular database maintenance
- [ ] Backup verification tests

---

**Remember**: Always test thoroughly in a staging environment before deploying to production!