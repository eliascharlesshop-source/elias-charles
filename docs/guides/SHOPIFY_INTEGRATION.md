# Shopify Integration Guide

## 🏪 Setting Up Your EliasCharles Shopify Store Integration

This guide will help you integrate your EC Store with your EliasCharles Shopify store.

## 📋 What You Need

### 1. Shopify Store Information
- **Store Domain**: `eliascharles.myshopify.com` (your actual domain)
- **Store URL**: The public URL of your store

### 2. API Credentials

#### Option A: Create a Custom App (Recommended)
1. Go to your Shopify Admin: `https://eliascharles.myshopify.com/admin`
2. Navigate to **Settings** → **Apps and sales channels**
3. Click **Develop apps for your store**
4. Click **Create an app**
5. Name it "EC Store Integration"
6. Click **Create app**

#### Configure API Access:
**Admin API Access:**
- Products: `read_products`, `write_products`
- Orders: `read_orders`, `write_orders`
- Customers: `read_customers`, `write_customers`
- Inventory: `read_inventory`, `write_inventory`

**Storefront API Access:**
- Products: `unauthenticated_read_product_listings`
- Collections: `unauthenticated_read_product_collections`
- Checkouts: `unauthenticated_write_checkouts`
- Customer: `unauthenticated_read_customers`

#### Option B: Use Shopify Partners (For Public Apps)
1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Create a development store
3. Create a new app

## 🔑 Environment Variables Needed

Add these to your `.env.local`:

```env
# Shopify Configuration
SHOPIFY_STORE_DOMAIN=eliascharles.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_access_token
SHOPIFY_API_VERSION=2024-01

# Optional: Webhook verification
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
```

## 📝 Getting Your Credentials

### Storefront API Token:
1. In your custom app, go to **API credentials**
2. Scroll down to **Storefront API access scopes**
3. Enable required scopes
4. Copy the **Storefront access token**

### Admin API Token:
1. In your custom app, go to **API credentials**
2. Scroll down to **Admin API access scopes**
3. Enable required scopes
4. Click **Install app**
5. Copy the **Admin API access token**

## 🚀 Quick Setup Commands

Once you have your credentials, run:

```bash
# Install Shopify dependencies
npm install @shopify/shopify-api shopify-buy

# Set up environment variables
echo "SHOPIFY_STORE_DOMAIN=eliascharles.myshopify.com" >> .env.local
echo "SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here" >> .env.local
echo "SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token_here" >> .env.local
```

## 📊 Integration Features We'll Implement

### Customer Features:
- ✅ Real Shopify products on your site
- ✅ Shopify cart and checkout
- ✅ Customer accounts
- ✅ Order tracking
- ✅ Real-time inventory

### Admin Features:
- ✅ Product management through Shopify
- ✅ Order management
- ✅ Customer management
- ✅ Inventory tracking
- ✅ Analytics from Shopify

## 🔧 Next Steps

1. **Get your Shopify credentials** using the steps above
2. **Provide the credentials** to set up the integration
3. **Test the connection** with basic API calls
4. **Migrate existing data** (if needed)
5. **Deploy the integrated version**

---

**Ready to proceed?** Please provide your Shopify store domain and we'll get you set up!
