# Environment Configuration

This document covers all environment variables and configuration options for EC Store.

## 📋 Environment Files

### `.env.local` (Development)
```env
# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-development-only

# API Configuration
API_BASE_URL=http://localhost:3000/api

# Development Features
NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS=true
NEXT_PUBLIC_ENABLE_MOCK_EMAILS=true
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true

# Database (Development)
# File-based storage is used by default in development
# Uncomment below to use a real database in development
# DATABASE_URL=postgresql://user:password@localhost:5432/ecstore_dev

# Optional Development Services
# STRIPE_SECRET_KEY=sk_test_...
# SENDGRID_API_KEY=SG...
```

### `.env.production` (Production)
```env
# Production Configuration
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# JWT Configuration (REQUIRED)
JWT_SECRET=your-super-secure-production-jwt-secret-256-bits-minimum

# Database (REQUIRED)
DATABASE_URL=postgresql://user:password@host:port/database

# Payment Processing (REQUIRED for real payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Service (REQUIRED for real emails)
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@your-domain.com
SUPPORT_EMAIL=support@your-domain.com

# File Storage (REQUIRED for production)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Monitoring & Analytics
SENTRY_DSN=https://...
NEXT_PUBLIC_GA_TRACKING_ID=GA-...
VERCEL_ANALYTICS_ID=...

# Security
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# Feature Flags
NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS=false
NEXT_PUBLIC_ENABLE_MOCK_EMAILS=false
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Optional Services
REDIS_URL=redis://...
WEBHOOK_SECRET=your-webhook-secret
```

## 🔧 Configuration Categories

### Core Application

#### `NODE_ENV`
- **Values**: `development`, `production`, `test`
- **Purpose**: Determines application behavior and optimizations
- **Required**: Yes

#### `NEXT_PUBLIC_BASE_URL`
- **Example**: `https://your-domain.com`
- **Purpose**: Base URL for the application
- **Required**: Yes
- **Note**: Must start with `NEXT_PUBLIC_` to be available in browser

### Authentication & Security

#### `JWT_SECRET`
- **Example**: `your-super-secure-secret-key-256-bits-minimum`
- **Purpose**: Signs and verifies JWT tokens
- **Required**: Yes
- **Security**: Must be at least 32 characters, random, and kept secret
- **Generation**: Use `openssl rand -base64 32` to generate

#### `CORS_ORIGIN`
- **Example**: `https://your-domain.com`
- **Purpose**: Controls which domains can access your API
- **Required**: Production only
- **Multiple**: Separate with commas for multiple domains

#### `RATE_LIMIT_MAX`
- **Example**: `100`
- **Purpose**: Maximum requests per time window
- **Default**: 100
- **Required**: No

#### `RATE_LIMIT_WINDOW_MS`
- **Example**: `900000` (15 minutes)
- **Purpose**: Time window for rate limiting
- **Default**: 15 minutes
- **Required**: No

### Database Configuration

#### `DATABASE_URL`
- **Example**: `postgresql://user:password@localhost:5432/database`
- **Purpose**: Connection string for primary database
- **Required**: Production only
- **Formats**:
  - PostgreSQL: `postgresql://user:password@host:port/database`
  - MongoDB: `mongodb://user:password@host:port/database`
  - MySQL: `mysql://user:password@host:port/database`

#### `REDIS_URL`
- **Example**: `redis://user:password@host:port`
- **Purpose**: Redis connection for caching and sessions
- **Required**: No (recommended for production)
- **Benefits**: Improved performance, session storage

### Payment Processing

#### Stripe Configuration
```env
STRIPE_SECRET_KEY=sk_live_... # or sk_test_... for testing
STRIPE_PUBLISHABLE_KEY=pk_live_... # or pk_test_... for testing
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### PayPal Configuration (Future)
```env
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_ENVIRONMENT=live # or sandbox
```

### Email Services

#### SendGrid Configuration
```env
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@your-domain.com
SUPPORT_EMAIL=support@your-domain.com
```

#### Alternative Email Services
```env
# Mailgun
MAILGUN_API_KEY=key-...
MAILGUN_DOMAIN=mg.your-domain.com

# Amazon SES
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY_ID=...
AWS_SES_SECRET_ACCESS_KEY=...
```

### File Storage

#### Cloudinary Configuration
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### AWS S3 Configuration (Alternative)
```env
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY_ID=...
AWS_S3_SECRET_ACCESS_KEY=...
```

### Monitoring & Analytics

#### Error Tracking
```env
SENTRY_DSN=https://...
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=1.0.0
```

#### Analytics
```env
NEXT_PUBLIC_GA_TRACKING_ID=GA-...
VERCEL_ANALYTICS_ID=...
HOTJAR_ID=...
```

#### Logging
```env
LOG_LEVEL=info # debug, info, warn, error
LOG_FORMAT=json # json, text
```

### Feature Flags

#### Development Features
```env
NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS=true
NEXT_PUBLIC_ENABLE_MOCK_EMAILS=true
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
```

#### Production Features
```env
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT_SUPPORT=true
NEXT_PUBLIC_ENABLE_REVIEWS=false
NEXT_PUBLIC_ENABLE_WISHLIST=false
```

## 🔐 Security Best Practices

### Secret Management
1. **Never commit secrets** to version control
2. **Use environment variables** for all secrets
3. **Rotate secrets regularly** (quarterly recommended)
4. **Use different secrets** for different environments
5. **Limit access** to production secrets

### JWT Secret Requirements
- **Minimum length**: 32 characters
- **Complexity**: Mix of letters, numbers, symbols
- **Uniqueness**: Different for each environment
- **Rotation**: Change regularly in production

### Database Security
- **Use SSL connections** in production
- **Limit database user permissions**
- **Use connection pooling**
- **Regular backups**
- **Monitor access logs**

## 📝 Environment Setup Scripts

### Development Setup
```bash
#!/bin/bash
# setup-dev.sh

echo "Setting up development environment..."

# Copy environment template
cp .env.example .env.local

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
sed -i "s/your-super-secret-jwt-key-for-development-only/$JWT_SECRET/" .env.local

echo "Development environment configured!"
echo "Please update .env.local with your specific values."
```

### Production Verification
```bash
#!/bin/bash
# verify-production.sh

echo "Verifying production environment configuration..."

required_vars=(
  "NODE_ENV"
  "NEXT_PUBLIC_BASE_URL"
  "JWT_SECRET"
  "DATABASE_URL"
  "STRIPE_SECRET_KEY"
  "SENDGRID_API_KEY"
)

missing_vars=()

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
  fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
  echo "✅ All required environment variables are set!"
else
  echo "❌ Missing required environment variables:"
  printf '%s\n' "${missing_vars[@]}"
  exit 1
fi
```

## 🧪 Testing Configuration

### Test Environment
```env
# .env.test
NODE_ENV=test
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=test-jwt-secret-do-not-use-in-production
DATABASE_URL=sqlite://test.db
NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS=true
NEXT_PUBLIC_ENABLE_MOCK_EMAILS=true
```

### Environment-Specific Testing
```typescript
// lib/config.ts
export const config = {
  env: process.env.NODE_ENV || 'development',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  database: {
    url: process.env.DATABASE_URL,
  },
  payments: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  },
  email: {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
    fromEmail: process.env.FROM_EMAIL || 'noreply@example.com',
  },
  features: {
    mockPayments: process.env.NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS === 'true',
    mockEmails: process.env.NEXT_PUBLIC_ENABLE_MOCK_EMAILS === 'true',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },
}

// Validation
export function validateConfig() {
  const required = ['JWT_SECRET']
  
  if (config.env === 'production') {
    required.push('DATABASE_URL', 'STRIPE_SECRET_KEY', 'SENDGRID_API_KEY')
  }
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
```

## 🔄 Environment Migration

### From Development to Production
1. **Create production environment file**
2. **Update all secret values**
3. **Configure real services** (database, payments, email)
4. **Test configuration** thoroughly
5. **Deploy and monitor**

### Environment Synchronization
```bash
# Sync environment variables (excluding secrets)
vercel env pull .env.local
# Edit sensitive values
# Push to production
vercel env add JWT_SECRET production
```

## 🚨 Troubleshooting

### Common Issues

#### Environment Variables Not Loading
- Check file name (`.env.local`, not `.env`)
- Restart development server
- Verify file placement (project root)
- Check for syntax errors in env file

#### JWT Secret Issues
- Ensure secret is at least 32 characters
- Check for special characters causing parsing issues
- Verify secret is the same across requests

#### Database Connection Failures
- Verify connection string format
- Check network connectivity
- Ensure database is running
- Verify credentials and permissions

#### CORS Errors
- Check `CORS_ORIGIN` setting
- Verify domain spelling
- Include protocol (https://)
- Check for trailing slashes

---

For additional configuration help, see the [Getting Started Guide](./GETTING_STARTED.md) or contact support.
