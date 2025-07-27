#!/bin/bash

# Script to update all component imports to use @/components path

echo "🔧 Updating component import paths..."

# Find all TypeScript/JavaScript files in app directory
find /workspaces/elias-charles/app -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | while read file; do
    # Update relative component imports to use @/components
    sed -i 's|from "../components/|from "@/components/|g' "$file"
    sed -i 's|from "../../components/|from "@/components/|g' "$file"
    sed -i 's|from "../../../components/|from "@/components/|g' "$file"
    sed -i 's|from "../../../../components/|from "@/components/|g' "$file"
    sed -i 's|from "../../../../../components/|from "@/components/|g' "$file"
    
    # Also handle import statements without 'from'
    sed -i "s|import.*'../components/|import '@/components/|g" "$file"
    sed -i "s|import.*'../../components/|import '@/components/|g" "$file"
    sed -i "s|import.*'../../../components/|import '@/components/|g" "$file"
    sed -i "s|import.*'../../../../components/|import '@/components/|g" "$file"
    sed -i "s|import.*'../../../../../components/|import '@/components/|g" "$file"
done

echo "✅ Component imports updated!"
