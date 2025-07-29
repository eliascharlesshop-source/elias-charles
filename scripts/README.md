# EC Store - Scripts Documentation

This directory contains organized scripts for testing, verification, setup, and utilities for the EC Store project.

## 📁 Directory Structure

```
scripts/
├── testing/           # Test scripts for various components
├── verification/      # Status and health check scripts  
├── setup/            # Setup and configuration scripts
└── utilities/        # Helper and maintenance scripts
```

## 🚀 Quick Start

Use the centralized script runner for easy access to all scripts:

```bash
# Show all available commands
./scripts.sh help

# Run comprehensive Shopify test
./scripts.sh test-shopify

# Run full status verification
./scripts.sh verify

# Show script structure
./scripts.sh show-structure
```

## 📋 Testing Scripts

### `testing/shopify-integration-test.js` ⭐ **RECOMMENDED**
Comprehensive Shopify integration test that combines the best features from all previous test scripts.

**Features:**
- Environment configuration validation
- Shop information retrieval
- Products API testing with performance metrics
- Collections API testing
- File structure validation
- Specific product testing (TEST_EC)
- Detailed error reporting and troubleshooting

**Usage:**
```bash
./scripts.sh test-shopify
# OR
node scripts/testing/shopify-integration-test.js
```

### `testing/test-api.js`
Backend API test suite for testing all internal API endpoints.

**Tests:**
- Authentication endpoints
- Product CRUD operations
- Cart functionality
- Order management
- Admin dashboard features

**Usage:**
```bash
./scripts.sh test-api
# OR
node scripts/testing/test-api.js
```

### `testing/test-shopify-integration.js` (Legacy)
Original comprehensive integration test maintained for compatibility.

**Usage:**
```bash
./scripts.sh test-legacy
# OR
node scripts/testing/test-shopify-integration.js
```

## 🔍 Verification Scripts

### `verification/comprehensive-status-check.sh` ⭐ **RECOMMENDED**
Complete status verification that combines all previous verification scripts.

**Checks:**
- Server status (web and mobile)
- Process monitoring
- Frontend page accessibility
- API endpoint functionality
- Environment configuration
- Critical file presence
- Mobile app structure
- Live Shopify connection test

**Usage:**
```bash
./scripts.sh verify
# OR
bash scripts/verification/comprehensive-status-check.sh
```

### `verification/verify-store-status.sh` (Legacy)
Original store status verification script.

**Usage:**
```bash
./scripts.sh verify-store
# OR
bash scripts/verification/verify-store-status.sh
```

### `verification/verify-apps.sh` (Legacy)
Original app verification script.

**Usage:**
```bash
./scripts.sh verify-apps
# OR
bash scripts/verification/verify-apps.sh
```

## ⚙️ Setup Scripts

### `setup/setup-shopify.sh`
Initial Shopify integration setup script.

**Usage:**
```bash
./scripts.sh setup-shopify
# OR
bash scripts/setup/setup-shopify.sh
```

## 🔧 Utility Scripts

### `utilities/fix-imports.sh`
Fixes import statement issues across the codebase.

**Usage:**
```bash
./scripts.sh fix-imports
# OR
bash scripts/utilities/fix-imports.sh
```

### `utilities/update-imports.sh`
Updates import statements to match current project structure.

**Usage:**
```bash
./scripts.sh update-imports
# OR
bash scripts/utilities/update-imports.sh
```

## 🎯 Recommended Workflow

1. **Initial Setup:**
   ```bash
   ./scripts.sh setup-shopify
   ```

2. **Test Integration:**
   ```bash
   ./scripts.sh test-shopify
   ```

3. **Verify Everything:**
   ```bash
   ./scripts.sh verify
   ```

4. **Regular Monitoring:**
   ```bash
   # Quick status check
   ./scripts.sh verify
   
   # Full integration test
   ./scripts.sh test-shopify
   ```

## 🚨 Troubleshooting

If any script fails:

1. **Check Environment Variables:**
   - Ensure `.env.local` exists with correct Shopify credentials
   - Verify `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

2. **Verify Servers are Running:**
   ```bash
   npm run dev              # Start web server
   cd ec-mobile && npm run start  # Start mobile app
   ```

3. **Check Shopify Store Access:**
   - Confirm store URL is correct (eliascharles-shop.myshopify.com)
   - Verify Storefront API access token permissions

4. **File Permissions:**
   ```bash
   chmod +x scripts.sh
   chmod +x scripts/verification/comprehensive-status-check.sh
   chmod +x scripts/testing/shopify-integration-test.js
   ```

## 📊 Script Performance

The new organized scripts provide:
- **Faster execution** through optimized code
- **Better error handling** with detailed troubleshooting
- **Performance metrics** for API calls
- **Comprehensive reporting** with colored output
- **Modular design** for easy maintenance

## 🔄 Migration from Old Scripts

**Removed Files:**
- `test-shopify.js` (root) → Use `scripts/testing/shopify-integration-test.js`
- `test-shopify-connection.js` (root) → Use `scripts/testing/shopify-integration-test.js`
- `scripts/test-shopify.js` → Use `scripts/testing/shopify-integration-test.js`

**Consolidated Functionality:**
- All Shopify tests → `scripts/testing/shopify-integration-test.js`
- All verification → `scripts/verification/comprehensive-status-check.sh`
- Organized by function → Separate directories for each purpose

## 🤝 Contributing

When adding new scripts:
1. Place in appropriate directory based on function
2. Follow naming convention: `kebab-case.js` or `kebab-case.sh`
3. Add to `scripts.sh` runner with appropriate command
4. Update this documentation
5. Ensure script is executable: `chmod +x script-name`

---

**Note:** All scripts maintain backward compatibility and preserve the full functionality of the original codebase. No working features have been removed, only duplicates eliminated and organization improved.
