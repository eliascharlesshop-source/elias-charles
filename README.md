# 🏄‍♂️ Elias Charles - Professional Headless E-Commerce Store

> Modern headless commerce platform built with Next.js 15 and Shopify Storefront API

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Shopify](https://img.shields.io/badge/Shopify-Storefront%20API-green?style=flat-square&logo=shopify)](https://shopify.dev/api/storefront)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-cyan?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://vercel.com/)

## 🚀 **Live Site**
**Production**: [https://elias-charles-37bq3blqb-elicharlese-deployments.vercel.app](https://elias-charles-37bq3blqb-elicharlese-deployments.vercel.app)

## 📋 **Table of Contents**
- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Development](#-development)
- [🚀 Deployment](#-deployment)
- [📚 Documentation](#-documentation)

## 🎯 **Project Overview**

Elias Charles is a premium headless e-commerce platform that combines the flexibility of a custom Next.js frontend with the power of Shopify's commerce engine. This architecture provides:

- **Superior Performance** - Lightning-fast loading with Next.js optimizations
- **Complete Design Control** - Custom React components and Tailwind CSS
- **Scalable Commerce** - Shopify's robust backend for orders, payments, and inventory
- **SEO Excellence** - Server-side rendering and static generation
- **Developer Experience** - Modern TypeScript, component-driven architecture

## ✨ **Features**

### 🛍️ **E-Commerce Core**
- ✅ Product catalog with advanced filtering
- ✅ Shopping cart with persistent storage
- ✅ Secure Shopify checkout integration
- ✅ Order management and tracking
- ✅ Inventory synchronization
- ✅ Multi-collection organization

### 🎨 **Design & UX**
- ✅ Professional magazine-style layouts
- ✅ Mobile-first responsive design
- ✅ Smooth animations and interactions
- ✅ Accessible components (WCAG compliant)
- ✅ Dark/light theme support
- ✅ Optimized images and assets

### 🔧 **Technical Excellence**
- ✅ TypeScript for type safety
- ✅ Component-driven architecture
- ✅ API-first design patterns
- ✅ Performance monitoring
- ✅ SEO optimization
- ✅ Error boundaries and handling

## 🛠️ **Tech Stack**

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.0.2
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Animations**: Framer Motion

### **Backend & Services**
- **E-Commerce**: Shopify Storefront API
- **Database**: Shopify + Local JSON (development)
- **Authentication**: Custom JWT implementation
- **Payments**: Shopify Checkout
- **Image Hosting**: Shopify CDN

### **Development & Deployment**
- **Package Manager**: pnpm
- **Deployment**: Vercel
- **Version Control**: Git
- **Environment**: Node.js 18+

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- pnpm (recommended) or npm
- Shopify store with Storefront API access

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/elicharlese/elias-charles.git
   cd elias-charles
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.shopify.example .env.local
   ```
   
   Edit `.env.local` with your Shopify credentials:
   ```env
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
   NEXT_PUBLIC_USE_SHOPIFY=true
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 **Project Structure**

```
elias-charles/
├── 📁 app/                         # Next.js app directory
│   ├── 📁 api/                     # API routes
│   │   ├── 📁 shopify/             # Shopify integration
│   │   ├── 📁 auth/                # Authentication
│   │   └── 📁 cart/                # Cart management
│   ├── 📁 collections/             # Product collections
│   ├── 📁 products/                # Product pages
│   ├── 📁 components/              # Page-specific components
│   └── 📄 layout.tsx               # Root layout
├── 📁 src/                         # Source code
│   ├── 📁 components/              # Reusable UI components
│   ├── 📁 lib/                     # Utilities & services
│   ├── 📁 hooks/                   # Custom React hooks
│   ├── 📁 styles/                  # Global styles
│   └── 📁 types/                   # TypeScript definitions
├── 📁 public/                      # Static assets
│   ├── 📁 products/                # Product images
│   ├── 📁 lifestyle/               # Lifestyle images
│   └── 📁 icons/                   # SVG icons
├── 📁 docs/                        # Documentation
│   ├── 📁 guides/                  # Setup guides
│   ├── 📁 api/                     # API documentation
│   └── 📁 deployment/              # Deployment guides
└── 📁 scripts/                     # Build & utility scripts
```

## 🔧 **Development**

### **Available Scripts**

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Testing & Utilities  
pnpm test:shopify     # Test Shopify connection
pnpm test:api         # Test API endpoints
```

### **Key Development Commands**

```bash
# Add new dependencies
pnpm add package-name

# Update dependencies
pnpm update

# Check build locally
pnpm build && pnpm start
```

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `SHOPIFY_STORE_DOMAIN` | Your Shopify store domain | ✅ |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token | ✅ |
| `NEXT_PUBLIC_USE_SHOPIFY` | Enable Shopify integration | ✅ |
| `JWT_SECRET` | JWT signing secret | ⚠️ Production |
| `NEXT_PUBLIC_SITE_URL` | Site URL for SEO | ⚠️ Production |

## 🚀 **Deployment**

### **Vercel (Recommended)**

1. **Connect to Vercel**
   ```bash
   pnpm add -g vercel
   vercel login
   vercel --prod
   ```

2. **Set environment variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required environment variables
   - Redeploy if needed

3. **Custom domain** (optional)
   - Add your domain in Vercel Dashboard
   - Configure DNS records as instructed

### **Alternative Platforms**
- **Netlify**: Deploy with Next.js plugin
- **AWS**: Use AWS Amplify or custom deployment
- **Railway**: Direct Git integration

## 📚 **Documentation**

### **Guides**
- [📖 Backend Setup](docs/guides/BACKEND_README.md)
- [🛍️ Shopify Integration](docs/guides/SHOPIFY_SETUP_COMPLETE.md)
- [🚀 Platform Strategy](docs/guides/PLATFORM_STRATEGY.md)
- [⚙️ Shopify Options](docs/guides/SHOPIFY_OPTIONS.md)

### **API Documentation**
- [🔌 API Reference](docs/api/SHOPIFY_API_EXPLAINED.md)
- [🔗 Shopify Endpoints](app/api/shopify/)

### **Deployment**
- [✅ Production Checklist](docs/deployment/PRODUCTION_CHECKLIST.md)
- [🚀 Deployment Guide](docs/deployment/)

## 🏗️ **Architecture**

### **Headless Commerce Benefits**
- **Performance**: Static generation + CDN delivery
- **Flexibility**: Complete design and functionality control  
- **Scalability**: Shopify handles commerce infrastructure
- **SEO**: Server-side rendering for search optimization
- **Developer Experience**: Modern React/TypeScript development

### **Data Flow**
```
Frontend (Next.js) ←→ Shopify Storefront API ←→ Shopify Admin
     ↓                        ↓                      ↓
  User Interface        Product Data           Order Management
  Cart Management       Collections            Inventory
  Checkout Flow         Customer Data          Payment Processing
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ **Support**

- 📧 **Email**: support@eliascharles.com
- 💬 **Discord**: [Join our community](https://discord.gg/eliascharles)
- 📖 **Documentation**: [docs.eliascharles.com](https://docs.eliascharles.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/elicharlese/elias-charles/issues)

---

**Built with ❤️ by the Elias Charles team**
