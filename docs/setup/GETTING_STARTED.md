# Getting Started with EC Store

This guide will help you set up the EC Store development environment on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (recommended) or npm - [Install pnpm](https://pnpm.io/installation)
- **Git** - [Download here](https://git-scm.com/)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### Recommended VS Code Extensions
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd elias-charles
```

### 2. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Development settings
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Configuration
API_BASE_URL=http://localhost:3000/api

# Development flags
NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS=true
NEXT_PUBLIC_ENABLE_MOCK_EMAILS=true
```

### 4. Start Development Server
```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Development Setup

### Project Structure Overview
```
/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── components/        # Page-specific components
│   └── [pages]/           # Application pages
├── components/            # Shared UI components
├── lib/                   # Utility functions and services
├── data/                  # Mock data (JSON files)
├── public/                # Static assets
├── styles/                # Global styles
└── docs/                  # Documentation
```

### Key Configuration Files
- `next.config.mjs` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - Shadcn/ui configuration
- `package.json` - Project dependencies and scripts

## 🎯 First Steps

### 1. Explore the Application
- **Homepage**: `http://localhost:3000` - Main storefront
- **Products**: Browse product collections
- **Cart**: Add items and test checkout flow
- **Admin**: Access admin features (create admin account)

### 2. Test Core Features
```bash
# Run the API test suite
node test-api.js
```

### 3. Create Admin Account
Visit `/auth/signup` and create an account, then manually set the role to 'admin' in `/data/users.json`

### 4. Sample Data
The application comes with sample data in the `/data/` folder:
- Products with images
- Sample collections
- Test users

## 🛠️ Development Commands

### Available Scripts
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Format code
pnpm format

# Type checking
pnpm type-check
```

### Useful Development Tools
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# View build analysis
pnpm build && pnpm analyze
```

## 🔍 Testing Your Setup

### 1. Frontend Testing
- Navigate to different pages
- Test responsive design (mobile, tablet, desktop)
- Check browser console for errors

### 2. API Testing
```bash
# Test API endpoints
node test-api.js

# Manual API testing
curl http://localhost:3000/api/products
```

### 3. Features to Test
- [ ] User registration and login
- [ ] Product browsing and filtering
- [ ] Add to cart functionality
- [ ] Checkout process
- [ ] Admin dashboard access
- [ ] Product management (admin)

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
pnpm dev -- -p 3001
```

### Node Version Issues
```bash
# Check Node version
node --version

# Use nvm to switch versions
nvm use 18
```

### Module Resolution Issues
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

### TypeScript Errors
```bash
# Check TypeScript configuration
pnpm type-check

# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

## 📚 Next Steps

1. **Read the Documentation**
   - [Development Guide](./DEVELOPMENT.md)
   - [API Reference](./API_REFERENCE.md)
   - [User Guide](./USER_GUIDE.md)

2. **Explore the Codebase**
   - Start with `/app/page.tsx` (homepage)
   - Check `/app/api/` for backend logic
   - Review `/lib/` for utilities

3. **Make Your First Change**
   - Update the homepage content
   - Add a new product
   - Customize the styling

4. **Set Up Production Environment**
   - Follow the [Deployment Guide](./DEPLOYMENT.md)
   - Complete the [Production Checklist](./PRODUCTION_CHECKLIST.md)

## 🆘 Getting Help

### Documentation
- Browse the `/docs` folder for comprehensive guides
- Check the [FAQ](./FAQ.md) for common questions

### Support Channels
- **GitHub Issues**: Report bugs or request features
- **GitHub Discussions**: Ask questions and share ideas
- **Code Comments**: Inline documentation in the codebase

### Debugging Tips
1. Check browser console for frontend errors
2. Check terminal output for backend errors
3. Use VS Code debugger for step-by-step debugging
4. Review API responses with browser dev tools

---

**Happy coding!** 🎉

If you encounter any issues during setup, please create an issue on GitHub or check our [Troubleshooting Guide](./TROUBLESHOOTING.md).
