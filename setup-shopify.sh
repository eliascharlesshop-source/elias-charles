#!/bin/bash

echo "🛒 EC Store - Shopify Integration Setup"
echo "======================================"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local from template..."
    touch .env.local
fi

echo ""
echo "📋 Setup Instructions:"
echo "1. Go to your Shopify Admin: https://eliascharles.myshopify.com/admin"
echo "2. Navigate to Settings → Apps and sales channels"
echo "3. Click 'Develop apps for your store'"
echo "4. Create a new app called 'EC Store Integration'"
echo "5. Configure the following API access scopes:"
echo ""
echo "   📦 Admin API Access Scopes:"
echo "   - read_products, write_products"
echo "   - read_orders, write_orders"
echo "   - read_customers, write_customers"
echo "   - read_inventory, write_inventory"
echo ""
echo "   🌐 Storefront API Access Scopes:"
echo "   - unauthenticated_read_product_listings"
echo "   - unauthenticated_read_product_collections"
echo "   - unauthenticated_write_checkouts"
echo "   - unauthenticated_read_customers"
echo ""
echo "6. Install the app and copy your tokens"
echo "7. Update .env.local with your credentials"
echo ""

# Function to prompt for input
prompt_for_value() {
    local var_name=$1
    local description=$2
    local current_value=$3
    
    if [ -z "$current_value" ] || [ "$current_value" = "your_${var_name,,}_here" ]; then
        echo -n "Enter your $description: "
        read value
        if [ ! -z "$value" ]; then
            # Update .env.local
            if grep -q "^$var_name=" .env.local; then
                # Use different delimiter for sed to avoid issues with slashes
                sed -i "s|^$var_name=.*|$var_name=$value|" .env.local
            else
                echo "$var_name=$value" >> .env.local
            fi
            echo "✅ Updated $var_name"
        fi
    else
        echo "✅ $var_name is already configured"
    fi
}

echo "🔧 Configuration Setup:"
echo ""

# Check current values
STORE_DOMAIN=$(grep "^SHOPIFY_STORE_DOMAIN=" .env.local 2>/dev/null | cut -d'=' -f2)
STOREFRONT_TOKEN=$(grep "^SHOPIFY_STOREFRONT_ACCESS_TOKEN=" .env.local 2>/dev/null | cut -d'=' -f2)
ADMIN_TOKEN=$(grep "^SHOPIFY_ADMIN_ACCESS_TOKEN=" .env.local 2>/dev/null | cut -d'=' -f2)

# Prompt for each value
prompt_for_value "SHOPIFY_STORE_DOMAIN" "store domain (e.g., eliascharles.myshopify.com)" "$STORE_DOMAIN"
prompt_for_value "SHOPIFY_STOREFRONT_ACCESS_TOKEN" "Storefront API access token" "$STOREFRONT_TOKEN"
prompt_for_value "SHOPIFY_ADMIN_ACCESS_TOKEN" "Admin API access token (optional)" "$ADMIN_TOKEN"

# Enable Shopify integration
if ! grep -q "^NEXT_PUBLIC_USE_SHOPIFY=" .env.local; then
    echo "NEXT_PUBLIC_USE_SHOPIFY=true" >> .env.local
else
    sed -i "s|^NEXT_PUBLIC_USE_SHOPIFY=.*|NEXT_PUBLIC_USE_SHOPIFY=true|" .env.local
fi

echo ""
echo "🧪 Testing Connection..."

# Test if we can reach the API
DOMAIN=$(grep "^SHOPIFY_STORE_DOMAIN=" .env.local | cut -d'=' -f2)
if [ ! -z "$DOMAIN" ]; then
    if curl -s --head "https://$DOMAIN" | head -n 1 | grep -q "200 OK"; then
        echo "✅ Shopify store is reachable"
    else
        echo "⚠️  Warning: Could not reach Shopify store at https://$DOMAIN"
    fi
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Start your development server: npm run dev"
echo "2. Visit http://localhost:3000 to see your Shopify products"
echo "3. Check the browser console for any API errors"
echo "4. Products should now load from your Shopify store!"
echo ""
echo "📚 Documentation:"
echo "- Shopify Integration Guide: docs/guides/SHOPIFY_INTEGRATION.md"
echo "- API Reference: docs/api/API_REFERENCE.md"
echo ""
echo "🆘 Need Help?"
echo "- Check your Shopify app permissions"
echo "- Verify your access tokens"
echo "- Review the console logs for errors"
echo "- Run 'npm run test:shopify' to test the connection"