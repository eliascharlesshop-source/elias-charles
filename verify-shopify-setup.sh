#!/bin/bash

# Shopify Store Connection Verification Script
# Run this after setting up your .env.local file

echo "🔍 Verifying Shopify Store Connection..."
echo "========================================="

# Check if environment file exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "📋 Please copy .env.template to .env.local and configure your Shopify credentials"
    exit 1
fi

# Check if server is running
echo "🚀 Checking if development server is running..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Server is running at http://localhost:3001"
    SERVER_URL="http://localhost:3001"
elif curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running at http://localhost:3000"
    SERVER_URL="http://localhost:3000"
else
    echo "❌ Server is not running. Please run 'npm run dev' first"
    exit 1
fi

echo ""
echo "🧪 Testing Shopify API connections..."
echo "======================================"

# Test products endpoint
echo "📦 Testing products connection..."
PRODUCTS_RESPONSE=$(curl -s $SERVER_URL/api/shopify/test-products)
if echo "$PRODUCTS_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Products API working"
    PRODUCT_COUNT=$(echo "$PRODUCTS_RESPONSE" | grep -o '"productsCount":[0-9]*' | cut -d':' -f2)
    echo "   📊 Found $PRODUCT_COUNT products"
else
    echo "⚠️  Products API not connected (expected if no products yet)"
    echo "$PRODUCTS_RESPONSE" | grep -o '"message":"[^"]*"' | cut -d':' -f2-
fi

echo ""

# Test collections endpoint
echo "📂 Testing collections connection..."
COLLECTIONS_RESPONSE=$(curl -s $SERVER_URL/api/shopify/test-collections)
if echo "$COLLECTIONS_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Collections API working"
    COLLECTION_COUNT=$(echo "$COLLECTIONS_RESPONSE" | grep -o '"collectionsCount":[0-9]*' | cut -d':' -f2)
    echo "   📊 Found $COLLECTION_COUNT collections"
else
    echo "⚠️  Collections API not connected (expected if no collections yet)"
    echo "$COLLECTIONS_RESPONSE" | grep -o '"message":"[^"]*"' | cut -d':' -f2-
fi

echo ""
echo "🌐 Testing collection pages..."
echo "============================="

# Test collection pages
for collection in "boards" "apparel" "self-care" "life" "men" "women" "sale"; do
    if curl -s "$SERVER_URL/collections/$collection" | grep -q "<title>"; then
        echo "✅ /collections/$collection - Loading correctly"
    else
        echo "❌ /collections/$collection - Failed to load"
    fi
done

echo ""
echo "📋 Summary & Next Steps"
echo "======================="

if echo "$PRODUCTS_RESPONSE" | grep -q '"success":true' && echo "$COLLECTIONS_RESPONSE" | grep -q '"success":true'; then
    echo "🎉 Perfect! Your Shopify store is fully connected and working!"
    echo ""
    echo "✅ What's working:"
    echo "   - Products API connected"
    echo "   - Collections API connected"
    echo "   - Collection pages loading"
    echo ""
    echo "🚀 You can now:"
    echo "   1. Add more products in Shopify Admin"
    echo "   2. Create collections and assign products"
    echo "   3. Products will automatically appear on your website"
    
elif echo "$PRODUCTS_RESPONSE" | grep -q '"success":false' || echo "$COLLECTIONS_RESPONSE" | grep -q '"success":false'; then
    echo "🔧 Shopify connection needs setup:"
    echo ""
    echo "📝 To connect your Shopify store:"
    echo "   1. Check your .env.local file has correct credentials"
    echo "   2. Verify SHOPIFY_STORE_DOMAIN (format: your-store.myshopify.com)"
    echo "   3. Verify SHOPIFY_STOREFRONT_ACCESS_TOKEN is valid"
    echo "   4. Restart the server: npm run dev"
    echo ""
    echo "📖 See SHOPIFY_COLLECTIONS_SETUP_GUIDE.md for detailed instructions"
    
else
    echo "🤔 Partial connection - this is normal if you're just getting started!"
    echo ""
    echo "📝 What to do next:"
    echo "   1. Add your first product in Shopify Admin"
    echo "   2. Create a collection (e.g., 'boards', 'apparel')"
    echo "   3. Assign the product to the collection"
    echo "   4. Run this script again to verify"
fi

echo ""
echo "🔗 Useful URLs:"
echo "   Website: $SERVER_URL"
echo "   Collections: $SERVER_URL/collections"
echo "   Test Products: $SERVER_URL/api/shopify/test-products"
echo "   Test Collections: $SERVER_URL/api/shopify/test-collections"
echo ""
echo "✨ Happy selling! ✨"
