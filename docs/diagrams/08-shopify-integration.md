# Shopify Integration Architecture

## Shopify Integration Overview

```mermaid
graph TB
    subgraph "Next.js Application"
        Frontend[Frontend Components]
        APIRoutes[API Routes]
        ShopifyProxy[Shopify Proxy APIs]
    end
    
    subgraph "Shopify Services"
        StorefrontAPI[Shopify Storefront API]
        AdminAPI[Shopify Admin API]
        Webhooks[Shopify Webhooks]
        CDN[Shopify CDN]
    end
    
    subgraph "Local Fallback System"
        LocalDB[(Local Database)]
        MockData[Mock Data]
        CacheLayer[Cache Layer]
    end
    
    subgraph "Configuration"
        EnvVars[Environment Variables]
        ShopifyConfig[Shopify Configuration]
        APIKeys[API Keys & Tokens]
    end
    
    Frontend --> APIRoutes
    APIRoutes --> ShopifyProxy
    ShopifyProxy --> StorefrontAPI
    ShopifyProxy --> AdminAPI
    
    StorefrontAPI --> CDN
    AdminAPI --> Webhooks
    
    ShopifyProxy --> LocalDB
    ShopifyProxy --> MockData
    ShopifyProxy --> CacheLayer
    
    ShopifyConfig --> EnvVars
    ShopifyConfig --> APIKeys
    APIKeys --> StorefrontAPI
    APIKeys --> AdminAPI
    
    classDef nextjs fill:#e1f5fe
    classDef shopify fill:#96f2d7
    classDef local fill:#f3e5f5
    classDef config fill:#fff3e0
    
    class Frontend,APIRoutes,ShopifyProxy nextjs
    class StorefrontAPI,AdminAPI,Webhooks,CDN shopify
    class LocalDB,MockData,CacheLayer local
    class EnvVars,ShopifyConfig,APIKeys config
```

## Shopify Storefront API Integration

```mermaid
sequenceDiagram
    participant Frontend
    participant ProductsAPI
    participant ShopifyProxy
    participant StorefrontAPI
    participant LocalDB
    participant MockData
    
    Frontend->>ProductsAPI: GET /api/products
    ProductsAPI->>ProductsAPI: Check SHOPIFY_ENABLED flag
    
    alt Shopify Enabled
        ProductsAPI->>ShopifyProxy: GET /api/shopify/products
        ShopifyProxy->>StorefrontAPI: GraphQL Query
        
        alt Shopify Success
            StorefrontAPI-->>ShopifyProxy: Products data
            ShopifyProxy->>ShopifyProxy: Transform data format
            ShopifyProxy-->>ProductsAPI: Transformed products
            ProductsAPI-->>Frontend: Shopify products
        else Shopify Failed
            StorefrontAPI-->>ShopifyProxy: Error response
            ShopifyProxy->>LocalDB: Fallback to local data
            LocalDB-->>ShopifyProxy: Local products
            ShopifyProxy-->>ProductsAPI: Local products + warning
            ProductsAPI-->>Frontend: Fallback products
        end
    else Shopify Disabled
        ProductsAPI->>LocalDB: Query local database
        alt Local DB Empty
            LocalDB-->>ProductsAPI: No data
            ProductsAPI->>MockData: Get sample data
            MockData-->>ProductsAPI: Mock products
        else Local DB Has Data
            LocalDB-->>ProductsAPI: Local products
        end
        ProductsAPI-->>Frontend: Local/Mock products
    end
```

## GraphQL Query Structure

```mermaid
graph TD
    subgraph "Product Queries"
        GetProducts[getProducts Query]
        GetProduct[getProduct Query]
        SearchProducts[searchProducts Query]
    end
    
    subgraph "Collection Queries"
        GetCollections[getCollections Query]
        GetCollection[getCollection Query]
    end
    
    subgraph "Cart Operations"
        CreateCart[cartCreate Mutation]
        AddToCart[cartLinesAdd Mutation]
        UpdateCart[cartLinesUpdate Mutation]
        GetCart[cart Query]
    end
    
    subgraph "Checkout Operations"
        CreateCheckout[checkoutCreate Mutation]
        UpdateCheckout[checkoutUpdate Mutation]
        CompleteCheckout[checkoutComplete Mutation]
    end
    
    GetProducts --> ProductFields[Product Fields]
    GetProduct --> ProductFields
    SearchProducts --> ProductFields
    
    ProductFields --> BasicInfo[id, title, handle, description]
    ProductFields --> PricingInfo[price, compareAtPrice]
    ProductFields --> MediaInfo[images, featuredImage]
    ProductFields --> VariantInfo[variants, options]
    ProductFields --> MetaInfo[tags, metafields, seo]
    
    GetCollections --> CollectionFields[Collection Fields]
    GetCollection --> CollectionFields
    CollectionFields --> CollectionInfo[id, title, handle, description, image]
    
    CreateCart --> CartFields[Cart Fields]
    AddToCart --> CartFields
    UpdateCart --> CartFields
    GetCart --> CartFields
    
    CartFields --> CartInfo[id, lines, cost, checkoutUrl]
    
    classDef query fill:#e1f5fe
    classDef mutation fill:#f3e5f5
    classDef fields fill:#e8f5e8
    
    class GetProducts,GetProduct,SearchProducts,GetCollections,GetCollection,GetCart query
    class CreateCart,AddToCart,UpdateCart,CreateCheckout,UpdateCheckout,CompleteCheckout mutation
    class ProductFields,CollectionFields,CartFields,BasicInfo,PricingInfo,MediaInfo,VariantInfo,MetaInfo,CollectionInfo,CartInfo fields
```

## Data Transformation Layer

```mermaid
flowchart TD
    ShopifyData[Raw Shopify Data] --> DataTransformer[Data Transformer]
    
    DataTransformer --> ProductTransform[Product Transformation]
    DataTransformer --> CollectionTransform[Collection Transformation]
    DataTransformer --> CartTransform[Cart Transformation]
    
    ProductTransform --> ExtractID[Extract Shopify ID]
    ProductTransform --> FormatPrice[Format Price Data]
    ProductTransform --> ProcessImages[Process Image URLs]
    ProductTransform --> ExtractMetafields[Extract Metafields]
    ProductTransform --> ProcessVariants[Process Variants]
    
    ExtractID --> CleanID[Remove 'gid://shopify/Product/' prefix]
    FormatPrice --> ParsePrice[Parse price.amount to number]
    ProcessImages --> ImageArray[Convert edges to URL array]
    ExtractMetafields --> CustomFields[Map to custom fields]
    ProcessVariants --> VariantArray[Process variant options]
    
    CollectionTransform --> CollectionID[Extract Collection ID]
    CollectionTransform --> CollectionProducts[Map Product References]
    
    CartTransform --> CartID[Extract Cart ID]
    CartTransform --> CartLines[Transform Cart Lines]
    CartTransform --> CartCost[Process Cost Structure]
    
    CleanID --> LocalFormat[Local Data Format]
    ParsePrice --> LocalFormat
    ImageArray --> LocalFormat
    CustomFields --> LocalFormat
    VariantArray --> LocalFormat
    CollectionID --> LocalFormat
    CollectionProducts --> LocalFormat
    CartID --> LocalFormat
    CartLines --> LocalFormat
    CartCost --> LocalFormat
    
    LocalFormat --> APIResponse[Standardized API Response]
    
    classDef shopify fill:#96f2d7
    classDef transform fill:#e1f5fe
    classDef process fill:#f3e5f5
    classDef output fill:#e8f5e8
    
    class ShopifyData shopify
    class DataTransformer,ProductTransform,CollectionTransform,CartTransform transform
    class ExtractID,FormatPrice,ProcessImages,ExtractMetafields,ProcessVariants,CollectionID,CollectionProducts,CartID,CartLines,CartCost process
    class LocalFormat,APIResponse output
```

## Error Handling & Fallback Strategy

```mermaid
flowchart TD
    ShopifyRequest[Shopify API Request] --> ConnectionCheck{Connection Available?}
    
    ConnectionCheck -->|No| NetworkError[Network Error]
    ConnectionCheck -->|Yes| AuthCheck{Authentication Valid?}
    
    AuthCheck -->|No| AuthError[Authentication Error]
    AuthCheck -->|Yes| RateLimitCheck{Within Rate Limits?}
    
    RateLimitCheck -->|No| RateLimitError[Rate Limit Error]
    RateLimitCheck -->|Yes| APICall[Make API Call]
    
    APICall --> ResponseCheck{Response OK?}
    ResponseCheck -->|No| APIError[API Error]
    ResponseCheck -->|Yes| DataValidation{Data Valid?}
    
    DataValidation -->|No| DataError[Data Validation Error]
    DataValidation -->|Yes| SuccessResponse[Success Response]
    
    NetworkError --> FallbackStrategy[Fallback Strategy]
    AuthError --> FallbackStrategy
    RateLimitError --> FallbackStrategy
    APIError --> FallbackStrategy
    DataError --> FallbackStrategy
    
    FallbackStrategy --> LocalDataCheck{Local Data Available?}
    LocalDataCheck -->|Yes| LocalData[Return Local Data]
    LocalDataCheck -->|No| MockDataCheck{Mock Data Available?}
    
    MockDataCheck -->|Yes| MockData[Return Mock Data]
    MockDataCheck -->|No| EmptyResponse[Return Empty Response]
    
    LocalData --> AddWarning[Add Fallback Warning]
    MockData --> AddWarning
    EmptyResponse --> AddError[Add Error Message]
    
    AddWarning --> FallbackResponse[Fallback Response]
    AddError --> ErrorResponse[Error Response]
    
    classDef request fill:#e1f5fe
    classDef check fill:#fff3e0
    classDef error fill:#ffebee
    classDef success fill:#e8f5e8
    classDef fallback fill:#f3e5f5
    
    class ShopifyRequest,APICall request
    class ConnectionCheck,AuthCheck,RateLimitCheck,ResponseCheck,DataValidation,LocalDataCheck,MockDataCheck check
    class NetworkError,AuthError,RateLimitError,APIError,DataError,ErrorResponse error
    class SuccessResponse success
    class FallbackStrategy,LocalData,MockData,EmptyResponse,FallbackResponse fallback
```

## Shopify Configuration Management

```mermaid
graph TB
    subgraph "Environment Configuration"
        EnvFile[.env.local]
        EnvVars[Environment Variables]
        ConfigValidation[Configuration Validation]
    end
    
    subgraph "Shopify Settings"
        StoreDomain[SHOPIFY_STORE_DOMAIN]
        StorefrontToken[SHOPIFY_STOREFRONT_ACCESS_TOKEN]
        AdminToken[SHOPIFY_ADMIN_ACCESS_TOKEN]
        UseShopify[NEXT_PUBLIC_USE_SHOPIFY]
        APIVersion[SHOPIFY_API_VERSION]
    end
    
    subgraph "Runtime Configuration"
        ShopifyClient[Shopify Client Instance]
        ErrorHandling[Error Handling Config]
        RetryLogic[Retry Logic Config]
        CacheConfig[Cache Configuration]
    end
    
    EnvFile --> EnvVars
    EnvVars --> ConfigValidation
    
    ConfigValidation --> StoreDomain
    ConfigValidation --> StorefrontToken
    ConfigValidation --> AdminToken
    ConfigValidation --> UseShopify
    ConfigValidation --> APIVersion
    
    StoreDomain --> ShopifyClient
    StorefrontToken --> ShopifyClient
    AdminToken --> ShopifyClient
    UseShopify --> ShopifyClient
    APIVersion --> ShopifyClient
    
    ShopifyClient --> ErrorHandling
    ShopifyClient --> RetryLogic
    ShopifyClient --> CacheConfig
    
    classDef env fill:#e8f5e8
    classDef config fill:#e1f5fe
    classDef runtime fill:#f3e5f5
    
    class EnvFile,EnvVars,ConfigValidation env
    class StoreDomain,StorefrontToken,AdminToken,UseShopify,APIVersion config
    class ShopifyClient,ErrorHandling,RetryLogic,CacheConfig runtime
```

## Shopify Webhook Integration

```mermaid
sequenceDiagram
    participant Shopify
    participant WebhookEndpoint
    participant Verification
    participant EventProcessor
    participant LocalDB
    participant Cache
    participant Notification
    
    Shopify->>WebhookEndpoint: POST /api/webhooks/shopify
    WebhookEndpoint->>Verification: Verify webhook signature
    
    alt Invalid Signature
        Verification-->>WebhookEndpoint: Signature invalid
        WebhookEndpoint-->>Shopify: 401 Unauthorized
    else Valid Signature
        Verification-->>WebhookEndpoint: Signature valid
        WebhookEndpoint->>EventProcessor: Process webhook event
        
        EventProcessor->>EventProcessor: Determine event type
        
        alt Product Update
            EventProcessor->>LocalDB: Update product data
            EventProcessor->>Cache: Invalidate product cache
        else Inventory Update
            EventProcessor->>LocalDB: Update inventory
            EventProcessor->>Cache: Invalidate inventory cache
        else Order Update
            EventProcessor->>LocalDB: Update order status
            EventProcessor->>Notification: Send status notification
        end
        
        EventProcessor-->>WebhookEndpoint: Processing complete
        WebhookEndpoint-->>Shopify: 200 OK
    end
```

## Performance Optimization Strategies

### Caching Strategy
```mermaid
graph TD
    APIRequest[API Request] --> CacheCheck{Cache Hit?}
    
    CacheCheck -->|Yes| CacheReturn[Return Cached Data]
    CacheCheck -->|No| ShopifyCall[Call Shopify API]
    
    ShopifyCall --> ShopifyResponse[Shopify Response]
    ShopifyResponse --> CacheStore[Store in Cache]
    CacheStore --> ResponseReturn[Return Response]
    
    CacheReturn --> TTLCheck{TTL Expired?}
    TTLCheck -->|Yes| BackgroundRefresh[Background Refresh]
    TTLCheck -->|No| ServeCache[Serve Cached Data]
    
    BackgroundRefresh --> ShopifyCall
    
    classDef cache fill:#e1f5fe
    classDef api fill:#f3e5f5
    classDef check fill:#fff3e0
    
    class CacheCheck,CacheReturn,CacheStore,TTLCheck,BackgroundRefresh cache
    class APIRequest,ShopifyCall,ShopifyResponse,ResponseReturn api
    class TTLCheck check
```

### Rate Limiting Management
- **Storefront API**: 1000 requests per minute
- **Admin API**: 40 requests per app per store per minute
- **Retry Strategy**: Exponential backoff with jitter
- **Queue Management**: Request queuing during rate limits

### Data Synchronization
- **Real-time**: Webhooks for immediate updates
- **Batch Sync**: Scheduled synchronization jobs
- **Conflict Resolution**: Last-write-wins strategy
- **Partial Sync**: Incremental updates only

## Integration Testing Strategy

### Test Scenarios
1. **Happy Path**: Successful Shopify API calls
2. **Network Failure**: Shopify API unavailable
3. **Authentication Error**: Invalid API tokens
4. **Rate Limiting**: API rate limits exceeded
5. **Data Corruption**: Invalid response data
6. **Partial Failure**: Some products fail to load

### Mock Data Strategy
```typescript
// Mock data structure matches Shopify format
const mockShopifyProduct = {
  id: 'gid://shopify/Product/123',
  title: 'Test Product',
  handle: 'test-product',
  variants: {
    edges: [
      {
        node: {
          id: 'gid://shopify/ProductVariant/456',
          price: { amount: '29.99', currencyCode: 'USD' }
        }
      }
    ]
  }
}
```

## Monitoring & Observability

### Key Metrics
- **API Response Time**: < 500ms average
- **Success Rate**: > 99.5%
- **Fallback Usage**: < 5% of requests
- **Cache Hit Rate**: > 80%

### Error Tracking
- **Shopify API Errors**: Rate limits, authentication failures
- **Network Errors**: Connection timeouts, DNS failures
- **Data Errors**: Invalid response format, missing fields
- **Fallback Triggers**: When and why fallbacks are used

### Alerting
- **High Error Rate**: > 5% error rate for 5 minutes
- **Fallback Mode**: Extended fallback usage
- **Rate Limit Warnings**: Approaching API limits
- **Webhook Failures**: Webhook processing errors