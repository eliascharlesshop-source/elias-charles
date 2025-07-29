# System Architecture Overview

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end
    
    subgraph "Frontend - Next.js Application"
        App[Next.js App Router]
        Pages[Pages & Components]
        Context[React Context]
        Hooks[Custom Hooks]
        
        subgraph "State Management"
            CartCtx[Cart Context]
            AuthCtx[Auth Context]
        end
        
        subgraph "UI Components"
            Layout[Layout Components]
            Commerce[Commerce Components]
            Forms[Form Components]
            UI[Radix UI Components]
        end
    end
    
    subgraph "API Layer - Next.js API Routes"
        ProductAPI[Products API]
        CartAPI[Cart API]
        AuthAPI[Auth API]
        OrderAPI[Orders API]
        CollectionAPI[Collections API]
        ShopifyAPI[Shopify Proxy API]
    end
    
    subgraph "Data Layer"
        FileDB[(File-based Database)]
        MockData[Mock Data]
        
        subgraph "External Services"
            Shopify[Shopify Storefront API]
            ShopifyAdmin[Shopify Admin API]
        end
    end
    
    subgraph "Infrastructure"
        Vercel[Vercel Deployment]
        CDN[Vercel CDN]
        Analytics[Vercel Analytics]
    end
    
    Browser --> App
    Mobile --> App
    
    App --> Pages
    Pages --> Context
    Pages --> UI
    Context --> CartCtx
    Context --> AuthCtx
    
    Pages --> ProductAPI
    Pages --> CartAPI
    Pages --> AuthAPI
    Pages --> OrderAPI
    Pages --> CollectionAPI
    
    ProductAPI --> ShopifyAPI
    ShopifyAPI --> Shopify
    ProductAPI --> FileDB
    CartAPI --> FileDB
    AuthAPI --> FileDB
    OrderAPI --> FileDB
    CollectionAPI --> FileDB
    
    ProductAPI --> MockData
    
    App --> Vercel
    Vercel --> CDN
    Vercel --> Analytics
    
    classDef frontend fill:#e1f5fe
    classDef api fill:#f3e5f5
    classDef data fill:#e8f5e8
    classDef external fill:#fff3e0
    classDef infra fill:#fce4ec
    
    class App,Pages,Context,Hooks,Layout,Commerce,Forms,UI,CartCtx,AuthCtx frontend
    class ProductAPI,CartAPI,AuthAPI,OrderAPI,CollectionAPI,ShopifyAPI api
    class FileDB,MockData data
    class Shopify,ShopifyAdmin external
    class Vercel,CDN,Analytics infra
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes
- **Authentication**: JWT with bcryptjs
- **Database**: File-based (development), PostgreSQL (production planned)
- **External APIs**: Shopify Storefront API

### Infrastructure
- **Deployment**: Vercel
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics
- **Environment**: Node.js

## Key Features

1. **Headless E-commerce**: Shopify backend with custom frontend
2. **Hybrid Data Strategy**: Shopify API with local fallback
3. **Progressive Enhancement**: Works with and without Shopify
4. **Mobile-First Design**: Responsive across all devices
5. **SEO Optimized**: Server-side rendering with Next.js
6. **Performance**: Edge deployment and CDN optimization