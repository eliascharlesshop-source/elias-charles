#!/bin/bash

echo "🔍 ELIAS CHARLES STORE - LIVE SHOPIFY FRONTEND VERIFICATION"
echo "=========================================================="
echo ""

# Function to check if server is responding
check_endpoint() {
    local url=$1
    local name=$2
    echo -n "🔗 Testing $name... "
    
    if curl -s --connect-timeout 5 "$url" > /dev/null 2>&1; then
        echo "✅ WORKING"
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

# Function to check API endpoint and show data
check_api() {
    local url=$1
    local name=$2
    echo ""
    echo "📊 Testing $name API:"
    echo "URL: $url"
    
    response=$(curl -s --connect-timeout 5 "$url" 2>/dev/null)
    if [ $? -eq 0 ] && [ -n "$response" ]; then
        echo "✅ Response received"
        echo "📦 Data preview:"
        echo "$response" | head -c 200
        echo "..."
        echo ""
    else
        echo "❌ No response or connection failed"
        echo ""
    fi
}

echo "1. 🚀 Server Status Check"
echo "------------------------"
check_endpoint "http://localhost:3000" "Next.js Server"
check_endpoint "http://localhost:3000/api/test" "API Server"

echo ""
echo "2. 🛍️ Shopify Integration Check"
echo "------------------------------"
check_api "http://localhost:3000/api/shopify/products?limit=1" "Products"
check_api "http://localhost:3000/api/shopify/collections?limit=1" "Collections"

echo ""
echo "3. 🖥️ Frontend Pages Check"
echo "--------------------------"
check_endpoint "http://localhost:3000/" "Homepage"
check_endpoint "http://localhost:3000/collections" "Collections Page"
check_endpoint "http://localhost:3000/products/test_ec" "Product Page"

echo ""
echo "4. 📱 Mobile App Check"
echo "---------------------"
check_endpoint "http://localhost:4200" "Mobile App (React Native)"

echo ""
echo "5. 🔧 Configuration Check"
echo "-------------------------"
echo -n "🔑 Shopify Domain: "
if [ -n "$SHOPIFY_STORE_DOMAIN" ]; then
    echo "✅ $SHOPIFY_STORE_DOMAIN"
else
    echo "❌ NOT SET"
fi

echo -n "🔑 Access Token: "
if [ -n "$SHOPIFY_STOREFRONT_ACCESS_TOKEN" ]; then
    echo "✅ ${SHOPIFY_STOREFRONT_ACCESS_TOKEN:0:8}..."
else
    echo "❌ NOT SET"
fi

echo -n "🔑 Use Shopify: "
if [ "$NEXT_PUBLIC_USE_SHOPIFY" = "true" ]; then
    echo "✅ ENABLED"
else
    echo "❌ DISABLED"
fi

echo ""
echo "6. 🌐 Direct Shopify Connection Test"
echo "-----------------------------------"
node test-shopify-connection.js

echo ""
echo "=========================================================="
echo "🎉 STORE STATUS VERIFICATION COMPLETE"
echo "=========================================================="
