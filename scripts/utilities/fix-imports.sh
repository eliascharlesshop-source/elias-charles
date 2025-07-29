#!/bin/bash

echo "🔧 Updating component imports for new structure..."

# Update all files to use new component paths
find /workspaces/elias-charles/app -name "*.tsx" -o -name "*.ts" | while read file; do
    # Update component imports to reflect new structure
    sed -i 's|@/components/layout|@/components/layout/layout|g' "$file"
    sed -i 's|@/components/cart-provider|@/components/commerce/cart-provider|g' "$file"
    sed -i 's|@/components/typography|@/components/layout/typography|g' "$file"
    sed -i 's|@/components/auth-provider|@/components/layout/auth-provider|g' "$file"
    sed -i 's|@/components/header|@/components/layout/header|g' "$file"
    sed -i 's|@/components/footer|@/components/layout/footer|g' "$file"
    sed -i 's|@/components/responsive-product-grid|@/components/commerce/responsive-product-grid|g' "$file"
    sed -i 's|@/components/magazine-product-card|@/components/commerce/magazine-product-card|g' "$file"
    sed -i 's|@/components/product-card|@/components/commerce/product-card|g' "$file"
    sed -i 's|@/components/mini-cart|@/components/commerce/mini-cart|g' "$file"
    
    # Fix app/components references that might still exist
    sed -i 's|@/app/components/|@/components/layout/|g' "$file"
done

echo "✅ Component imports updated for new structure!"
