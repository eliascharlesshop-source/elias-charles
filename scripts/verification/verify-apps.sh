#!/bin/bash

# EC Store - Application Verification Script
echo "🚀 EC Store - Application Status Check"
echo "======================================"

# Check if web store is running
echo "📱 Checking Web Store (Next.js)..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Web Store is running at http://localhost:3000"
else
    echo "❌ Web Store is not accessible"
fi

# Check if mobile app is running
echo "📱 Checking Mobile App (React Native)..."
if curl -s http://localhost:4200 > /dev/null; then
    echo "✅ Mobile App is running at http://localhost:4200"
else
    echo "❌ Mobile App is not accessible"
fi

# Check API endpoints
echo "🔗 Checking API Endpoints..."
endpoints=(
    "/api/products"
    "/api/collections" 
    "/api/cart"
    "/admin"
    "/sampling"
    "/data-sharing"
    "/arvr"
    "/voice"
    "/status"
)

for endpoint in "${endpoints[@]}"; do
    if curl -s "http://localhost:3000$endpoint" > /dev/null; then
        echo "✅ $endpoint - OK"
    else
        echo "❌ $endpoint - Failed"
    fi
done

# Check shared libraries
echo "📚 Checking Shared Libraries..."
cd /workspaces/elias-charles/ec-mobile

if [ -f "shared-ui/dist/index.js" ]; then
    echo "✅ shared-ui library is built"
else
    echo "❌ shared-ui library not built"
fi

if [ -f "shopify-sdk/dist/index.js" ]; then
    echo "✅ shopify-sdk library is built"
else
    echo "❌ shopify-sdk library not built"
fi

# Check process status
echo "🔄 Checking Running Processes..."
if pgrep -f "next dev" > /dev/null; then
    echo "✅ Next.js development server is running"
else
    echo "❌ Next.js development server is not running"
fi

if pgrep -f "nx serve" > /dev/null; then
    echo "✅ Nx serve (mobile app) is running"
else
    echo "❌ Nx serve (mobile app) is not running"
fi

echo ""
echo "🎉 Application Status Check Complete!"
echo "🌐 Web Store: http://localhost:3000"
echo "📱 Mobile App: http://localhost:4200"
echo "📖 Documentation: CODEBASE_STRUCTURE_SUMMARY.md"
