# EC Store - Production Deployment & Domain Setup Guide

## 🎯 **Architecture Confirmation**

✅ **You're absolutely correct!** Here's your live flow:

```
Custom Domain (eliascharles.com)
        ↓
    Vercel/Production Deployment
        ↓
    Next.js Frontend (Your Store)
        ↓
    API Routes (/api/shopify/*)
        ↓
    Shopify Storefront API (eliascharles-shop.myshopify.com)
        ↓
    Live Product Data & Inventory
```

## 🚀 **Step 1: Production Deployment**

### Option A: Vercel (Recommended - Already in dependencies)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy to production
vercel --prod

# Or use the build command for other platforms
npm run build
```

### Option B: Alternative Platforms
- **Netlify:** `npm run build` + drag/drop `dist` folder
- **Railway:** Connect GitHub repo
- **DigitalOcean App Platform:** Connect GitHub repo

## 🌐 **Step 2: Domain Configuration**

### If using Vercel:

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Domains"
   - Add `eliascharles.com` and `www.eliascharles.com`

2. **DNS Configuration (at your domain registrar):**
   ```
   # Add these DNS records:
   Type: A     Name: @        Value: 76.76.19.61 (Vercel's IP)
   Type: CNAME Name: www      Value: cname.vercel-dns.com
   Type: CNAME Name: *        Value: cname.vercel-dns.com (for subdomains)
   ```

### If using other platforms:
- **Netlify:** Add domain in site settings, update DNS to Netlify's nameservers
- **Custom server:** Point A record to your server IP

## 🔧 **Step 3: Environment Variables for Production**

Create these environment variables in your deployment platform:

```bash
# Shopify Configuration
SHOPIFY_STORE_DOMAIN=eliascharles-shop.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=e022fd0d... (your token)
SHOPIFY_API_VERSION=2024-01

# Frontend Configuration  
NEXT_PUBLIC_USE_SHOPIFY=true
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=eliascharles-shop.myshopify.com
NEXT_PUBLIC_SITE_URL=https://eliascharles.com

# Security
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://eliascharles.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📊 **Step 4: Production Verification Script**

Let me create a production verification script for you:

```bash
# Test production deployment
./scripts.sh verify-production
```

## 🛡️ **Step 5: Security & Performance**

### SSL Certificate
- ✅ **Vercel:** Automatic SSL (Let's Encrypt)
- ✅ **Netlify:** Automatic SSL
- ⚠️ **Custom:** Manual SSL setup required

### Performance Optimizations
```javascript
// Already configured in your next.config.mjs:
- Image optimization disabled (for static export compatibility)
- CORS headers for API access
- Security headers configured
```

## 🎯 **Step 6: Traffic Routing**

Once your domain is connected, traffic flows like this:

1. **Customer visits** `eliascharles.com`
2. **DNS resolves** to your deployment platform
3. **Next.js serves** your storefront
4. **Customer browses** products (loaded via your API)
5. **Add to cart** → Your API → Shopify
6. **Checkout** → Shopify's secure checkout
7. **Order completion** → Webhooks back to your API

## 🧪 **Step 7: Pre-Launch Testing**

Test these key flows before going live:

```bash
# 1. Test Shopify integration
./scripts.sh test-shopify

# 2. Test production build locally
npm run build
npm run start

# 3. Test production APIs
curl https://eliascharles.com/api/shopify/products
curl https://eliascharles.com/api/shopify/collections
```

## 📈 **Step 8: Monitoring & Analytics**

### Add these to production:
- **Google Analytics** for traffic monitoring
- **Shopify Analytics** for sales data
- **Vercel Analytics** for performance monitoring
- **Error tracking** (Sentry recommended)

## 🚀 **Quick Deployment Commands**

```bash
# Build and test locally first
npm run build
npm run start

# Deploy to Vercel
vercel --prod

# Verify production deployment
curl https://eliascharles.com/api/test
```

## 🔗 **Domain Propagation**

After DNS changes:
- **Initial propagation:** 1-4 hours
- **Global propagation:** 24-48 hours
- **Check status:** Use `dig eliascharles.com` or online DNS checkers

## ✅ **Post-Launch Checklist**

- [ ] Domain resolves to your app
- [ ] SSL certificate is active
- [ ] All pages load correctly
- [ ] Shopify products display
- [ ] Cart functionality works
- [ ] Checkout redirects to Shopify
- [ ] Mobile responsiveness verified
- [ ] Page speed optimized
- [ ] Analytics tracking active

## 🎉 **Expected Result**

Once complete, customers will:
1. Visit `eliascharles.com`
2. Browse your beautiful custom storefront
3. See live products from your Shopify store
4. Add items to cart through your API
5. Complete secure checkout on Shopify
6. Receive orders in your Shopify admin

Your store will be a **professional headless e-commerce site** with the power of Shopify's backend and your custom frontend! 🛍️
