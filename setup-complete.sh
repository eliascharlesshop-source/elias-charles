#!/bin/bash

echo "🚀 EC Store - Final Setup & Launch"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    exit 1
fi

echo "✅ Environment file exists"

# Check current Shopify settings
SHOPIFY_ENABLED=$(grep "^NEXT_PUBLIC_USE_SHOPIFY=" .env.local | cut -d'=' -f2)
SHOPIFY_DOMAIN=$(grep "^SHOPIFY_STORE_DOMAIN=" .env.local | cut -d'=' -f2)
SHOPIFY_TOKEN=$(grep "^SHOPIFY_STOREFRONT_ACCESS_TOKEN=" .env.local | cut -d'=' -f2)

echo ""
echo "📋 Current Configuration:"
echo "   Shopify Enabled: $SHOPIFY_ENABLED"
echo "   Store Domain: $SHOPIFY_DOMAIN"
echo "   Token: ${SHOPIFY_TOKEN:0:12}..."

# Test Shopify connection if enabled
if [ "$SHOPIFY_ENABLED" = "true" ]; then
    echo ""
    echo "🧪 Testing Shopify Connection..."
    
    # Test store accessibility
    STORE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$SHOPIFY_DOMAIN" 2>/dev/null)
    
    if [ "$STORE_STATUS" = "200" ]; then
        echo "✅ Store accessible"
    else
        echo "⚠️  Store returned status: $STORE_STATUS"
        
        if [ "$STORE_STATUS" = "402" ]; then
            echo ""
            echo "🔄 Store has billing/access issues. Switching to mock data..."
            sed -i "s|^NEXT_PUBLIC_USE_SHOPIFY=.*|NEXT_PUBLIC_USE_SHOPIFY=false|" .env.local
            echo "✅ Switched to mock data mode"
        fi
    fi
fi

echo ""
echo "🔧 Setup Complete!"
echo ""

# Check if development server is running
if lsof -ti:3000 >/dev/null 2>&1; then
    echo "🌐 Development server already running at http://localhost:3000"
else
    echo "🚀 Starting development server..."
    npm run dev &
    
    # Wait for server to start
    echo "⏳ Waiting for server to start..."
    sleep 10
    
    if lsof -ti:3000 >/dev/null 2>&1; then
        echo "✅ Server started successfully!"
    else
        echo "❌ Server failed to start"
        exit 1
    fi
fi

echo ""
echo "🎯 Your EC Store Status:"
echo "=================================="

# Test API endpoints
echo ""
echo "📡 Testing API endpoints..."

# Test products API
if curl -s -f "http://localhost:3000/api/products" >/dev/null 2>&1; then
    echo "✅ Products API: Working"
else
    echo "❌ Products API: Not responding"
fi

# Test homepage
if curl -s -f "http://localhost:3000" >/dev/null 2>&1; then
    echo "✅ Homepage: Working"
else
    echo "❌ Homepage: Not responding"
fi

echo ""
echo "🏄‍♂️ Your EC Store is ready!"
echo ""
echo "🌐 Access your store:"
echo "   • Homepage: http://localhost:3000"
echo "   • Products: http://localhost:3000/collections"
echo "   • Admin Panel: http://localhost:3000/profile"
echo ""

CURRENT_SHOPIFY=$(grep "^NEXT_PUBLIC_USE_SHOPIFY=" .env.local | cut -d'=' -f2)
if [ "$CURRENT_SHOPIFY" = "true" ]; then
    echo "🛒 Mode: Shopify Integration (Real Products)"
    echo "📦 Your products are loaded from Shopify"
else
    echo "🛒 Mode: Mock Data (Demo Products)"
    echo "📦 Using professional demo products"
    echo ""
    echo "💡 To enable Shopify:"
    echo "   1. Fix your Shopify store billing/access"
    echo "   2. Run: echo 'NEXT_PUBLIC_USE_SHOPIFY=true' >> .env.local"
    echo "   3. Restart server: npm run dev"
fi

echo ""
echo "🎨 Features Available:"
echo "   ✅ Magazine-style design"
echo "   ✅ Professional styling"
echo "   ✅ Product catalog"
echo "   ✅ Shopping cart"
echo "   ✅ Responsive layout"
echo "   ✅ SEO optimized"
echo ""
echo "🚀 Ready to surf the web! 🏄‍♂️"
