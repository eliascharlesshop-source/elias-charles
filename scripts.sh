#!/bin/bash

# EC Store - Script Runner
# Centralized access to all organized scripts

echo "🛠️  EC Store - Script Runner"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

show_help() {
    echo "Available commands:"
    echo ""
    echo -e "${BLUE}📋 TESTING:${NC}"
    echo "  test-shopify        Run comprehensive Shopify integration test"
    echo "  test-api            Run backend API test suite"
    echo "  test-legacy         Run legacy Shopify integration test"
    echo ""
    echo -e "${BLUE}🔍 VERIFICATION:${NC}"
    echo "  verify              Run comprehensive status verification"
    echo "  verify-production   Test live production deployment"
    echo "  verify-store        Run store status check (legacy)"
    echo "  verify-apps         Run app verification check (legacy)"
    echo ""
    echo -e "${BLUE}⚙️  SETUP:${NC}"
    echo "  setup-shopify       Setup Shopify integration"
    echo ""
    echo -e "${BLUE}🔧 UTILITIES:${NC}"
    echo "  fix-imports         Fix import statements"
    echo "  update-imports      Update import statements"
    echo "  dev-startup         Start both web and mobile development servers"
    echo ""
    echo -e "${BLUE}📁 DIRECTORIES:${NC}"
    echo "  list-scripts        Show all available scripts"
    echo "  show-structure      Show organized script structure"
    echo ""
    echo "Usage: ./scripts.sh <command>"
    echo "Example: ./scripts.sh test-shopify"
}

list_all_scripts() {
    echo "📂 Organized Script Structure:"
    echo ""
    echo "scripts/"
    echo "├── testing/"
    find scripts/testing -name "*.js" -o -name "*.sh" | sed 's/scripts\/testing\//│   ├── /'
    echo "├── verification/"
    find scripts/verification -name "*.js" -o -name "*.sh" | sed 's/scripts\/verification\//│   ├── /'
    echo "├── setup/"
    find scripts/setup -name "*.js" -o -name "*.sh" | sed 's/scripts\/setup\//│   ├── /'
    echo "└── utilities/"
    find scripts/utilities -name "*.js" -o -name "*.sh" | sed 's/scripts\/utilities\//│   └── /'
}

run_script() {
    local command=$1
    
    case $command in
        "test-shopify")
            echo -e "${GREEN}🧪 Running Shopify Integration Test...${NC}"
            node scripts/testing/shopify-integration-test.js
            ;;
        "test-api")
            echo -e "${GREEN}🔌 Running API Test Suite...${NC}"
            node scripts/testing/test-api.js
            ;;
        "test-legacy")
            echo -e "${GREEN}🧪 Running Legacy Shopify Integration Test...${NC}"
            node scripts/testing/test-shopify-integration.js
            ;;
        "verify")
            echo -e "${GREEN}🔍 Running Comprehensive Status Verification...${NC}"
            bash scripts/verification/comprehensive-status-check.sh
            ;;
        "verify-production")
            echo -e "${GREEN}🌐 Testing Production Deployment...${NC}"
            node scripts/verification/production-verification.js
            ;;
        "verify-store")
            echo -e "${GREEN}🏪 Running Store Status Check...${NC}"
            bash scripts/verification/verify-store-status.sh
            ;;
        "verify-apps")
            echo -e "${GREEN}📱 Running App Verification...${NC}"
            bash scripts/verification/verify-apps.sh
            ;;
        "setup-shopify")
            echo -e "${GREEN}⚙️  Setting up Shopify Integration...${NC}"
            bash scripts/setup/setup-shopify.sh
            ;;
        "fix-imports")
            echo -e "${GREEN}🔧 Fixing Import Statements...${NC}"
            bash scripts/utilities/fix-imports.sh
            ;;
        "update-imports")
            echo -e "${GREEN}🔄 Updating Import Statements...${NC}"
            bash scripts/utilities/update-imports.sh
            ;;
        "dev-startup")
            echo -e "${GREEN}🚀 Starting Development Servers...${NC}"
            bash scripts/utilities/dev-startup.sh
            ;;
        "list-scripts")
            list_all_scripts
            ;;
        "show-structure")
            echo "📁 Current directory structure:"
            tree scripts/ 2>/dev/null || find scripts/ -type d | sed 's/[^-][^\/]*\//  /g;s/^  /├── /;s/-/|/'
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            echo -e "${YELLOW}⚠️  Unknown command: $command${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Main execution
if [ $# -eq 0 ]; then
    show_help
else
    run_script $1
fi
