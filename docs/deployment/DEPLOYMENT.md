# Deployment Guide

This guide covers deploying EC Store to production environments.

## 🎯 Deployment Options

### 1. Vercel (Recommended)
- Zero-configuration deployment
- Automatic HTTPS and CDN
- Serverless functions
- Environment variable management

### 2. Docker Container
- Full control over environment
- Works with any cloud provider
- Scalable and portable

### 3. Traditional Server
- VPS or dedicated server
- Manual configuration required
- Full customization possible

## 🚀 Vercel Deployment

### Prerequisites
- GitHub/GitLab repository
- Vercel account

### Step 1: Prepare for Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

### Step 2: Configure Environment Variables
In your Vercel dashboard or via CLI:

```bash
# Production environment variables
vercel env add JWT_SECRET production
vercel env add DATABASE_URL production
vercel env add STRIPE_SECRET_KEY production
vercel env add SENDGRID_API_KEY production
vercel env add NEXT_PUBLIC_BASE_URL production
```

**Required Environment Variables:**
```env
# Essential
JWT_SECRET=your-super-secure-jwt-secret-256-bits-minimum
DATABASE_URL=postgresql://user:password@host:port/database
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Payment Processing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email Service
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@your-domain.com

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional
SENTRY_DSN=https://...
NEXT_PUBLIC_GA_TRACKING_ID=GA-...
```

### Step 3: Deploy
```bash
# Deploy to production
vercel --prod

# Or connect GitHub repository for automatic deployments
vercel --prod --github
```

### Step 4: Configure Custom Domain
1. Go to Vercel dashboard
2. Navigate to your project
3. Go to Settings > Domains
4. Add your custom domain
5. Configure DNS records as instructed

## 🐳 Docker Deployment

### Step 1: Create Production Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN npm install -g pnpm && pnpm build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Step 2: Create docker-compose.yml
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
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=ecstore
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Step 3: Configure Nginx
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### Step 4: Deploy with Docker
```bash
# Build and start services
docker-compose up -d --build

# Check logs
docker-compose logs -f app

# Scale the application
docker-compose up -d --scale app=3
```

## 🗄️ Database Setup

### PostgreSQL Setup
```sql
-- init.sql
CREATE DATABASE ecstore;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    addresses JSONB DEFAULT '[]',
    orders TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    sku VARCHAR(100) UNIQUE NOT NULL,
    inventory INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    weight DECIMAL(8,2),
    dimensions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    items JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(100),
    transaction_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handle VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    products TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_in_stock ON products(in_stock) WHERE in_stock = true;
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### Migration Script
```typescript
// scripts/migrate.ts
import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function migrate() {
  try {
    // Read and execute init.sql
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8')
    await pool.query(sql)
    
    console.log('Database migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

migrate()
```

## 🔐 SSL Certificate Setup

### Using Let's Encrypt with Certbot
```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Set up auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring Setup

### Application Monitoring
```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})

export function captureError(error: Error, context?: any) {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context)
    }
    Sentry.captureException(error)
  })
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level)
}
```

### Health Check Endpoint
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    database: 'checking...',
    memory: process.memoryUsage(),
    uptime: process.uptime()
  }

  try {
    // Check database connection
    await pool.query('SELECT 1')
    checks.database = 'connected'
  } catch (error) {
    checks.database = 'disconnected'
    return NextResponse.json({
      status: 'unhealthy',
      checks
    }, { status: 503 })
  }

  return NextResponse.json({
    status: 'healthy',
    checks
  })
}
```

## 🚨 Post-Deployment Checklist

### Immediate Verification
- [ ] Application loads without errors
- [ ] SSL certificate is valid
- [ ] Database connection works
- [ ] API endpoints respond correctly
- [ ] Payment processing works
- [ ] Email notifications work
- [ ] Admin dashboard accessible

### Performance Testing
```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 https://your-domain.com/

# Test API endpoints
ab -n 100 -c 5 https://your-domain.com/api/products
```

### Security Scan
```bash
# Install security scanner
npm install -g nsp

# Run security audit
npm audit
nsp check
```

### Backup Setup
```bash
# Database backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > $BACKUP_DIR/ecstore_$DATE.sql
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Database Connection Issues
```bash
# Check connection string format
# PostgreSQL: postgresql://user:password@host:port/database
# Test connection
psql $DATABASE_URL
```

#### Environment Variable Issues
```bash
# Verify environment variables are set
vercel env ls
# Pull environment variables for local testing
vercel env pull .env.local
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates
# Renew certificate
sudo certbot renew
```

---

**Deployment Complete!** 🎉

Your EC Store is now live in production. Monitor the application closely in the first few days and have a rollback plan ready.

For ongoing maintenance, see the [Monitoring Guide](./MONITORING.md) and [Production Checklist](./PRODUCTION_CHECKLIST.md).
