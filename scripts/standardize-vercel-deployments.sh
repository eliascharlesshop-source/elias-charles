#!/bin/bash

# Vercel Deployment History Standardization Script for EC Store
# This script will help tag and organize Vercel deployments

echo "🚀 EC Store Vercel Deployment History Standardization"
echo "====================================================="

# Check if Vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "❌ Error: Vercel CLI not found. Please install it first."
    exit 1
fi

# List recent deployments
echo "📋 Recent Vercel Deployments:"
vercel ls --scope elicharlese-deployments

echo ""
echo "🏷️  Deployment Tagging Strategy:"
echo "================================"

# Create deployment aliases for clean URLs
echo "🔗 Setting up deployment aliases..."

# Get the latest production deployment
LATEST_DEPLOYMENT=$(vercel ls --meta gitCommitSha=$(git rev-parse HEAD) --scope elicharlese-deployments | head -n 1 | awk '{print $1}')

if [ ! -z "$LATEST_DEPLOYMENT" ]; then
    echo "📌 Current production deployment: $LATEST_DEPLOYMENT"
    
    # Create semantic aliases
    echo "🎯 Creating semantic deployment aliases..."
    
    # Production stable alias
    vercel alias $LATEST_DEPLOYMENT eliascharles.com || echo "⚠️  Custom domain not configured yet"
    vercel alias $LATEST_DEPLOYMENT ec-store-stable.vercel.app || echo "⚠️  Alias may already exist"
    
    # Version-specific alias
    vercel alias $LATEST_DEPLOYMENT ec-store-v0-2-1.vercel.app || echo "⚠️  Alias may already exist"
    
    echo "✅ Created deployment aliases"
else
    echo "⚠️  Could not find current deployment"
fi

echo ""
echo "📝 Deployment Environment Variables:"
echo "===================================="
vercel env ls --scope elicharlese-deployments

echo ""
echo "🎉 Vercel deployment standardization complete!"
echo ""
echo "📊 Deployment Strategy:"
echo "  🌐 Production: eliascharles.com (when configured)"
echo "  🔒 Stable: ec-store-stable.vercel.app"
echo "  🏷️  Versioned: ec-store-v0-2-1.vercel.app"
echo ""
echo "🔧 Recommendations:"
echo "  - Set up custom domain (eliascharles.com) in Vercel dashboard"
echo "  - Use semantic aliases for each major release"
echo "  - Tag deployments with git commit SHA for traceability"
echo "  - Maintain staging and production environment separation"
