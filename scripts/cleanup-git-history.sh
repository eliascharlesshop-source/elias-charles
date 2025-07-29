#!/bin/bash

# Git History Cleanup and Standardization Script for EC Store
# This script will add semantic versioning tags and create a clean commit history

echo "🧹 EC Store Git History Cleanup & Standardization"
echo "=================================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Create semantic version tags for major milestones
echo "📝 Creating semantic version tags..."

# Tag the backend implementation completion (major milestone)
BACKEND_COMMIT="21a8fd3d6ccdba247ea4939af5e5acd358ebc049"
git tag -a "v0.1.0" $BACKEND_COMMIT -m "v0.1.0: Initial EC Store Backend Implementation

- Complete Next.js 15 + React 19 setup
- Shopify Storefront API integration
- Product catalog and collections
- Cart and checkout functionality
- Authentication system
- Admin dashboard foundation"

# Tag the deployment milestone
DEPLOY_COMMIT="03dab7c087c4a77d27d010b06b3006ae66643fcc"
git tag -a "v0.2.0" $DEPLOY_COMMIT -m "v0.2.0: Production Deployment Ready

- Vercel deployment configuration
- Environment variables setup
- Build optimization
- SSR/SSG implementation
- API routes deployment"

# Tag the image fixes (current stable release)
CURRENT_COMMIT=$(git rev-parse HEAD)
git tag -a "v0.2.1" $CURRENT_COMMIT -m "v0.2.1: Image Loading Fixes

- Fix placeholder SVG images with real product images
- Resolve 404 image loading issues
- Update all collection hero images
- Improve visual consistency across pages"

echo "✅ Created semantic version tags:"
echo "   v0.1.0 - Initial Backend Implementation"
echo "   v0.2.0 - Production Deployment"
echo "   v0.2.1 - Image Loading Fixes"

# Create release branches for major versions
echo "🌟 Creating release branches..."
git checkout -b "release/v0.1.x" $BACKEND_COMMIT
git checkout -b "release/v0.2.x" $DEPLOY_COMMIT
git checkout main

echo "✅ Created release branches:"
echo "   release/v0.1.x - Backend implementation branch"
echo "   release/v0.2.x - Deployment stable branch"

# Generate a clean changelog
echo "📋 Generating CHANGELOG.md..."
cat > CHANGELOG.md << 'EOF'
# Changelog

All notable changes to the EC Store project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2025-07-29

### Fixed
- Replace placeholder SVG images with real product images
- Resolve 404 image loading issues across all collection pages
- Fix men's collection hero image (men-surf-style.png)
- Fix sale collection hero image (diverse-beach-fashion.png)
- Fix collections page hero image (beach-product.png)
- Update self-care collection images with sustainable-fashion-collage.png

### Changed
- Updated all collection thumbnails and editorial images
- Improved visual consistency across pages

## [0.2.0] - 2025-07-29

### Added
- Vercel production deployment configuration
- Environment variables setup for Shopify integration
- Build optimization and SSR/SSG implementation
- API routes deployment
- Admin access security improvements (moved from navbar to login page)

### Fixed
- React 19 compatibility issues with legacy-peer-deps
- SSR window object access in AR/VR components
- Import path resolution for API routes
- Syntax errors in status and AR/VR pages

## [0.1.0] - 2025-07-29

### Added
- Initial EC Store backend implementation
- Next.js 15 + React 19 foundation
- Shopify Storefront API integration
- Complete product catalog system
- Collections and category management
- Shopping cart and checkout functionality
- User authentication system
- Admin dashboard foundation
- Responsive design with Tailwind CSS
- AR/VR product visualization
- Voice command integration
- Magazine-style product presentation
- SEO optimization and metadata management

### Features
- 66+ static and dynamic pages
- Shopify API integration with live data
- Mobile-first responsive design
- Advanced filtering and search
- Real-time cart management
- Secure authentication flows
- Admin portal for content management
EOF

echo "✅ Generated CHANGELOG.md"

# Create a .gitmessage template for future commits
echo "📝 Setting up commit message template..."
cat > .gitmessage << 'EOF'
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>

# Type should be one of:
# feat:     A new feature
# fix:      A bug fix
# docs:     Documentation only changes
# style:    Changes that do not affect the meaning of the code
# refactor: A code change that neither fixes a bug nor adds a feature
# perf:     A code change that improves performance
# test:     Adding missing tests or correcting existing tests
# chore:    Changes to the build process or auxiliary tools

# Scope examples: api, ui, auth, cart, products, collections, admin

# Subject line:
# - Use imperative mood ("add" not "added" or "adds")
# - Don't capitalize first letter
# - No dot (.) at the end
# - Max 50 characters

# Body:
# - Wrap at 72 characters
# - Explain what and why, not how
# - Can include multiple paragraphs

# Footer:
# - Reference issues and pull requests
# - Breaking changes start with BREAKING CHANGE:
EOF

git config commit.template .gitmessage

echo "✅ Set up commit message template"

# Push tags to remote
echo "🚀 Pushing tags to remote..."
git push origin --tags

echo "🎉 Git history cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  - Created semantic version tags (v0.1.0, v0.2.0, v0.2.1)"
echo "  - Generated CHANGELOG.md"
echo "  - Set up commit message template"
echo "  - Created release branches"
echo "  - Pushed tags to remote"
echo ""
echo "🔧 Next steps:"
echo "  - Use 'git log --oneline --graph --decorate --all' to see the clean history"
echo "  - Follow semantic commit messages for future commits"
echo "  - Update version tags for future releases"
