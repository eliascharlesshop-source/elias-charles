#!/bin/bash

# EC Store - Comprehensive Status Verification
# Combines store status, app verification, and live connection testing

echo "🔍 EC STORE - COMPREHENSIVE STATUS VERIFICATION"
echo "==============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "success") echo -e "${GREEN}✅ $message${NC}" ;;
        "error") echo -e "${RED}❌ $message${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "info") echo -e "${BLUE}ℹ️  $message${NC}" ;;
    esac
}

# Function to check if endpoint responds
check_endpoint() {
    local url=$1
    local name=$2
    local timeout=${3:-5}
    
    if curl -s --connect-timeout $timeout "$url" > /dev/null 2>&1; then
        print_status "success" "$name is responding"
        return 0
    else
        print_status "error" "$name is not responding"
        return 1
    fi
}

# Function to check API endpoint with data preview
check_api_with_data() {
    local url=$1
    local name=$2
    local timeout=${3:-5}
    
    response=$(curl -s --connect-timeout $timeout "$url" 2>/dev/null)
    if [ $? -eq 0 ] && [ -n "$response" ]; then
        print_status "success" "$name API is working"
        echo "   Preview: $(echo "$response" | head -c 100)..."
        return 0
    else
        print_status "error" "$name API is not responding"
        return 1
    fi
}

# Function to check process by name
check_process() {
    local process_name=$1
    local display_name=$2
    
    if pgrep -f "$process_name" > /dev/null; then
        print_status "success" "$display_name is running"
        return 0
    else
        print_status "error" "$display_name is not running"
        return 1
    fi
}

# Function to check file exists
check_file() {
    local file_path=$1
    local display_name=$2
    
    if [ -f "$file_path" ]; then
        print_status "success" "$display_name exists"
        return 0
    else
        print_status "error" "$display_name is missing"
        return 1
    fi
}

# Load environment variables if available
if [ -f ".env.local" ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

echo "1. 🖥️  Server Status Check"
echo "========================="
web_server=0
mobile_server=0

check_endpoint "http://localhost:3000" "Next.js Web Server" && web_server=1
check_endpoint "http://localhost:4200" "React Native Mobile Server" && mobile_server=1

echo ""
echo "2. 🔧 Process Check"
echo "=================="
web_process=0
mobile_process=0

check_process "next dev" "Next.js Development Server" && web_process=1
check_process "nx serve" "Nx Mobile App Server" && mobile_process=1

echo ""
echo "3. 🌐 Frontend Pages Check"
echo "=========================="
homepage=0
collections=0
products=0

check_endpoint "http://localhost:3000/" "Homepage" && homepage=1
check_endpoint "http://localhost:3000/collections" "Collections Page" && collections=1
check_endpoint "http://localhost:3000/products/test_ec" "Product Page (TEST_EC)" && products=1

echo ""
echo "4. 🛍️  API Endpoints Check"
echo "=========================="
api_products=0
api_collections=0
api_test=0

check_api_with_data "http://localhost:3000/api/shopify/products?limit=1" "Products API" && api_products=1
check_api_with_data "http://localhost:3000/api/shopify/collections?limit=1" "Collections API" && api_collections=1
check_endpoint "http://localhost:3000/api/test" "Test API" && api_test=1

echo ""
echo "5. 🔑 Environment Configuration"
echo "==============================="
env_domain=0
env_token=0
env_use_shopify=0

if [ -n "$SHOPIFY_STORE_DOMAIN" ]; then
    print_status "success" "Shopify Domain: $SHOPIFY_STORE_DOMAIN"
    env_domain=1
else
    print_status "error" "SHOPIFY_STORE_DOMAIN not set"
fi

if [ -n "$SHOPIFY_STOREFRONT_ACCESS_TOKEN" ]; then
    print_status "success" "Access Token: ${SHOPIFY_STOREFRONT_ACCESS_TOKEN:0:8}..."
    env_token=1
else
    print_status "error" "SHOPIFY_STOREFRONT_ACCESS_TOKEN not set"
fi

if [ "$NEXT_PUBLIC_USE_SHOPIFY" = "true" ]; then
    print_status "success" "Use Shopify: ENABLED"
    env_use_shopify=1
else
    print_status "warning" "Use Shopify: DISABLED or not set"
fi

echo ""
echo "6. 📁 Critical Files Check"
echo "=========================="
file_checks=0
total_files=6

check_file "src/lib/shopify.ts" "Shopify Library" && ((file_checks++))
check_file "lib/shopify-service.ts" "Shopify Service" && ((file_checks++))
check_file "app/api/shopify/products/route.ts" "Products API Route" && ((file_checks++))
check_file "app/api/shopify/collections/route.ts" "Collections API Route" && ((file_checks++))
check_file "package.json" "Package Configuration" && ((file_checks++))
check_file ".env.local" "Environment Configuration" && ((file_checks++))

echo ""
echo "7. 📱 Mobile App Structure"
echo "========================="
mobile_files=0
mobile_total=4

check_file "ec-mobile/package.json" "Mobile Package Config" && ((mobile_files++))
check_file "ec-mobile/apps/ec-mobile/src/app/app.tsx" "Mobile App Component" && ((mobile_files++))
check_file "ec-mobile/shopify-sdk/src/lib/shopify-sdk.ts" "Mobile Shopify SDK" && ((mobile_files++))
check_file "ec-mobile/shared-ui/src/lib/shared-ui.tsx" "Shared UI Library" && ((mobile_files++))

echo ""
echo "8. 🧪 Live Shopify Connection Test"
echo "================================="
if [ -x "scripts/testing/shopify-integration-test.js" ]; then
    print_status "info" "Running comprehensive Shopify integration test..."
    echo ""
    if node scripts/testing/shopify-integration-test.js; then
        shopify_test=1
        print_status "success" "Shopify integration test passed"
    else
        shopify_test=0
        print_status "error" "Shopify integration test failed"
    fi
else
    print_status "warning" "Shopify integration test script not found"
    shopify_test=0
fi

echo ""
echo "📊 VERIFICATION SUMMARY"
echo "======================="

# Calculate scores
server_score=$((web_server + mobile_server))
process_score=$((web_process + mobile_process))
frontend_score=$((homepage + collections + products))
api_score=$((api_products + api_collections + api_test))
env_score=$((env_domain + env_token + env_use_shopify))

total_score=$((server_score + process_score + frontend_score + api_score + env_score + file_checks + mobile_files + shopify_test))
max_score=$((2 + 2 + 3 + 3 + 3 + total_files + mobile_total + 1))

echo "🖥️  Servers: $server_score/2"
echo "🔧 Processes: $process_score/2"
echo "🌐 Frontend: $frontend_score/3"
echo "🛍️  APIs: $api_score/3"
echo "🔑 Environment: $env_score/3"
echo "📁 Files: $file_checks/$total_files"
echo "📱 Mobile: $mobile_files/$mobile_total"
echo "🧪 Shopify Test: $shopify_test/1"

echo ""
echo "🎯 OVERALL SCORE: $total_score/$max_score"

# Determine status
if [ $total_score -eq $max_score ]; then
    print_status "success" "PERFECT! Your EC Store is fully operational"
    echo ""
    echo "🚀 Your store is ready for customers!"
    echo "   📱 Web Store: http://localhost:3000"
    echo "   📱 Mobile App: http://localhost:4200"
    echo "   🛍️  Live Shopify data is loading correctly"
elif [ $total_score -gt $((max_score * 3 / 4)) ]; then
    print_status "success" "EXCELLENT! Your EC Store is working well"
    echo ""
    echo "🎉 Minor issues detected but store is functional"
elif [ $total_score -gt $((max_score / 2)) ]; then
    print_status "warning" "GOOD! Your EC Store has some issues to fix"
    echo ""
    echo "🔧 Please address the failed checks above"
else
    print_status "error" "NEEDS ATTENTION! Multiple issues detected"
    echo ""
    echo "🚨 Please fix the critical issues before using the store"
fi

echo ""
echo "🔗 Quick Access:"
echo "   📖 Documentation: docs/README.md"
echo "   🧪 Run Tests: npm run test"
echo "   🛠️  Scripts: scripts/ directory"
echo ""

exit $((max_score - total_score))
