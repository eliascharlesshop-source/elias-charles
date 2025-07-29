# Database Schema

## Entity Relationship Diagram

```mermaid
erDiagram
    Product {
        string id PK
        string title
        string handle UK
        string description
        string story
        number price
        number compareAtPrice
        string[] images
        string category
        string subcategory
        string[] tags
        string sku UK
        boolean inStock
        number inventory
        string[] sizes
        object[] colors
        string[] features
        string designer
        string designerQuote
        string sustainabilityInfo
        object editorial
        string createdAt
        string updatedAt
    }
    
    User {
        string id PK
        string email UK
        string firstName
        string lastName
        string phone
        string password
        string role
        object[] addresses
        string[] orders
        string createdAt
        string updatedAt
    }
    
    Cart {
        string id PK
        object[] items
        number totalQuantity
        number subtotal
        number tax
        number shipping
        number total
        string createdAt
        string updatedAt
    }
    
    CartItem {
        string id PK
        string productId FK
        string title
        number price
        string image
        number quantity
        string size
        string color
        string sku
    }
    
    Order {
        string id PK
        string orderNumber UK
        string userId FK
        string email
        object[] items
        object shippingAddress
        object billingAddress
        number subtotal
        number tax
        number shipping
        number total
        string status
        string paymentStatus
        string shippingMethod
        string trackingNumber
        string notes
        string createdAt
        string updatedAt
    }
    
    Collection {
        string id PK
        string title
        string handle UK
        string description
        string image
        string[] products
        string createdAt
        string updatedAt
    }
    
    Address {
        string id PK
        string firstName
        string lastName
        string company
        string address1
        string address2
        string city
        string province
        string country
        string zip
        string phone
        boolean isDefault
    }
    
    %% Relationships
    Product ||--o{ CartItem : "referenced by"
    Cart ||--o{ CartItem : "contains"
    User ||--o{ Order : "places"
    User ||--o{ Address : "has"
    Collection ||--o{ Product : "includes"
    Product ||--o{ Order : "ordered in"
```

## Data Types and Constraints

### Product Entity
- **Primary Key**: `id` (auto-generated)
- **Unique Keys**: `handle`, `sku`
- **Required Fields**: `title`, `description`, `price`, `category`, `sku`
- **Indexes**: `category`, `tags`, `inStock`, `createdAt`

### User Entity
- **Primary Key**: `id` (auto-generated)
- **Unique Keys**: `email`
- **Required Fields**: `email`, `firstName`, `lastName`, `password`
- **Indexes**: `email`, `createdAt`

### Cart Entity
- **Primary Key**: `id` (auto-generated)
- **Required Fields**: `items`, `totalQuantity`, `subtotal`, `total`
- **Indexes**: `createdAt`, `updatedAt`

### Order Entity
- **Primary Key**: `id` (auto-generated)
- **Unique Keys**: `orderNumber`
- **Foreign Keys**: `userId` (references User.id)
- **Required Fields**: `orderNumber`, `email`, `items`, `total`, `status`
- **Indexes**: `userId`, `email`, `status`, `createdAt`

### Collection Entity
- **Primary Key**: `id` (auto-generated)
- **Unique Keys**: `handle`
- **Required Fields**: `title`, `handle`, `description`
- **Indexes**: `handle`, `createdAt`

## Database Implementation

### Current (Development)
```typescript
// File-based JSON storage
class Database<T extends { id: string }> {
  private filename: string
  
  async read(): Promise<T[]>
  async write(data: T[]): Promise<void>
  async findById(id: string): Promise<T | null>
  async create(item: T): Promise<T>
  async update(id: string, updates: Partial<T>): Promise<T | null>
  async delete(id: string): Promise<boolean>
}
```

### Production (Planned)
```sql
-- PostgreSQL Schema
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  handle VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  story TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  images JSONB DEFAULT '[]',
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  tags JSONB DEFAULT '[]',
  sku VARCHAR(100) UNIQUE NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  inventory INTEGER DEFAULT 0,
  sizes JSONB DEFAULT '[]',
  colors JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  designer VARCHAR(255),
  designer_quote TEXT,
  sustainability_info TEXT,
  editorial JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_created_at ON products(created_at);
```

## Data Flow Patterns

### Product Data Flow
1. **Shopify → API → Frontend**: Primary data source
2. **Local DB → API → Frontend**: Fallback when Shopify unavailable
3. **Mock Data → API → Frontend**: Development/demo mode

### Cart Data Flow
1. **Frontend → Cart API → Local Storage**: Session persistence
2. **Cart API → Database**: Server-side cart storage
3. **Database → Cart API → Frontend**: Cart retrieval

### Order Data Flow
1. **Checkout → Order API → Database**: Order creation
2. **Order API → Email Service**: Order confirmation
3. **Admin → Order API → Database**: Order management

## Scalability Considerations

### Current Limitations
- File-based storage not suitable for production
- No connection pooling
- Limited concurrent access
- No data replication

### Production Recommendations
- **PostgreSQL** with connection pooling
- **Redis** for session/cart caching
- **Database replication** for high availability
- **Horizontal scaling** with read replicas