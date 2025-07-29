# Authentication & Authorization Flow

## Authentication Architecture Overview

```mermaid
graph TB
    subgraph "Client Side"
        LoginForm[Login Form]
        RegisterForm[Register Form]
        AuthContext[Auth Context]
        LocalStorage[Local Storage]
        ProtectedRoute[Protected Route]
    end
    
    subgraph "API Layer"
        AuthAPI[Auth API Routes]
        AuthMiddleware[Auth Middleware]
        JWTService[JWT Service]
        BCryptService[BCrypt Service]
    end
    
    subgraph "Data Layer"
        UserDB[(User Database)]
        SessionStore[Session Store]
    end
    
    LoginForm --> AuthAPI
    RegisterForm --> AuthAPI
    AuthAPI --> JWTService
    AuthAPI --> BCryptService
    AuthAPI --> UserDB
    
    JWTService --> AuthContext
    AuthContext --> LocalStorage
    AuthContext --> ProtectedRoute
    
    ProtectedRoute --> AuthMiddleware
    AuthMiddleware --> JWTService
    AuthMiddleware --> SessionStore
    
    classDef client fill:#e1f5fe
    classDef api fill:#f3e5f5
    classDef data fill:#e8f5e8
    
    class LoginForm,RegisterForm,AuthContext,LocalStorage,ProtectedRoute client
    class AuthAPI,AuthMiddleware,JWTService,BCryptService api
    class UserDB,SessionStore data
```

## User Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant RegisterForm
    participant AuthAPI
    participant BCrypt
    participant UserDB
    participant JWT
    participant AuthContext
    
    User->>RegisterForm: Fill registration form
    RegisterForm->>RegisterForm: Validate input (Zod)
    
    alt Validation Failed
        RegisterForm-->>User: Show validation errors
    else Validation Passed
        RegisterForm->>AuthAPI: POST /api/auth/register
        AuthAPI->>AuthAPI: Check email uniqueness
        
        alt Email exists
            AuthAPI-->>RegisterForm: Email already registered
            RegisterForm-->>User: Show error message
        else Email available
            AuthAPI->>BCrypt: Hash password
            BCrypt-->>AuthAPI: Hashed password
            
            AuthAPI->>UserDB: Create user record
            UserDB-->>AuthAPI: User created
            
            AuthAPI->>JWT: Generate token
            JWT-->>AuthAPI: JWT token
            
            AuthAPI-->>RegisterForm: User + token
            RegisterForm->>AuthContext: Update auth state
            AuthContext->>AuthContext: Store token in localStorage
            AuthContext-->>User: Registration successful
        end
    end
```

## User Login Flow

```mermaid
sequenceDiagram
    participant User
    participant LoginForm
    participant AuthAPI
    participant UserDB
    participant BCrypt
    participant JWT
    participant AuthContext
    
    User->>LoginForm: Enter credentials
    LoginForm->>LoginForm: Validate input
    
    alt Validation Failed
        LoginForm-->>User: Show validation errors
    else Validation Passed
        LoginForm->>AuthAPI: POST /api/auth/login
        AuthAPI->>UserDB: Find user by email
        
        alt User not found
            UserDB-->>AuthAPI: User not found
            AuthAPI-->>LoginForm: Invalid credentials
            LoginForm-->>User: Show error message
        else User found
            UserDB-->>AuthAPI: User data
            AuthAPI->>BCrypt: Verify password
            
            alt Password invalid
                BCrypt-->>AuthAPI: Password mismatch
                AuthAPI-->>LoginForm: Invalid credentials
                LoginForm-->>User: Show error message
            else Password valid
                BCrypt-->>AuthAPI: Password verified
                AuthAPI->>JWT: Generate token
                JWT-->>AuthAPI: JWT token
                
                AuthAPI-->>LoginForm: User + token
                LoginForm->>AuthContext: Update auth state
                AuthContext->>AuthContext: Store token in localStorage
                AuthContext-->>User: Login successful
            end
        end
    end
```

## Protected Route Access Flow

```mermaid
sequenceDiagram
    participant User
    participant ProtectedPage
    participant AuthContext
    participant AuthMiddleware
    participant JWT
    participant UserDB
    
    User->>ProtectedPage: Access protected route
    ProtectedPage->>AuthContext: Check auth state
    
    alt No token in localStorage
        AuthContext-->>ProtectedPage: Not authenticated
        ProtectedPage-->>User: Redirect to login
    else Token exists
        AuthContext->>AuthMiddleware: Validate token
        AuthMiddleware->>JWT: Verify token
        
        alt Token invalid/expired
            JWT-->>AuthMiddleware: Token invalid
            AuthMiddleware-->>AuthContext: Clear auth state
            AuthContext-->>ProtectedPage: Not authenticated
            ProtectedPage-->>User: Redirect to login
        else Token valid
            JWT-->>AuthMiddleware: Token payload
            AuthMiddleware->>UserDB: Verify user exists
            
            alt User not found
                UserDB-->>AuthMiddleware: User not found
                AuthMiddleware-->>AuthContext: Clear auth state
                AuthContext-->>ProtectedPage: Not authenticated
                ProtectedPage-->>User: Redirect to login
            else User exists
                UserDB-->>AuthMiddleware: User data
                AuthMiddleware-->>ProtectedPage: Access granted
                ProtectedPage-->>User: Show protected content
            end
        end
    end
```

## Role-Based Authorization Flow

```mermaid
flowchart TD
    UserRequest[User Request] --> AuthCheck{Authenticated?}
    
    AuthCheck -->|No| LoginRedirect[Redirect to Login]
    AuthCheck -->|Yes| RoleCheck{Check User Role}
    
    RoleCheck --> CustomerRole{Customer Role?}
    RoleCheck --> AdminRole{Admin Role?}
    
    CustomerRole -->|Yes| CustomerResources[Customer Resources]
    CustomerRole -->|No| AccessDenied[403 Access Denied]
    
    AdminRole -->|Yes| AdminResources[Admin Resources]
    AdminRole -->|No| RoleBasedAccess{Role-based Access}
    
    CustomerResources --> AllowedActions[Allowed Actions]
    AdminResources --> AllowedActions
    
    AllowedActions --> ProfileAccess[Profile Management]
    AllowedActions --> OrderAccess[Order History]
    AllowedActions --> CartAccess[Cart Operations]
    
    AdminResources --> AdminActions[Admin Actions]
    AdminActions --> ProductManagement[Product Management]
    AdminActions --> OrderManagement[Order Management]
    AdminActions --> UserManagement[User Management]
    AdminActions --> Analytics[Analytics Dashboard]
    
    RoleBasedAccess --> SpecificPermissions[Check Specific Permissions]
    SpecificPermissions --> GrantAccess[Grant Access]
    SpecificPermissions --> DenyAccess[Deny Access]
    
    classDef auth fill:#e1f5fe
    classDef role fill:#f3e5f5
    classDef access fill:#e8f5e8
    classDef admin fill:#fff3e0
    
    class UserRequest,AuthCheck,LoginRedirect auth
    class RoleCheck,CustomerRole,AdminRole,RoleBasedAccess role
    class CustomerResources,AllowedActions,ProfileAccess,OrderAccess,CartAccess access
    class AdminResources,AdminActions,ProductManagement,OrderManagement,UserManagement,Analytics admin
```

## JWT Token Management

```mermaid
graph TB
    subgraph "Token Lifecycle"
        TokenGeneration[Token Generation]
        TokenStorage[Token Storage]
        TokenValidation[Token Validation]
        TokenRefresh[Token Refresh]
        TokenExpiry[Token Expiry]
    end
    
    subgraph "Token Structure"
        Header[Header: Algorithm & Type]
        Payload[Payload: User Claims]
        Signature[Signature: Verification]
    end
    
    subgraph "Security Measures"
        SecretKey[Secret Key Management]
        Expiration[7-day Expiration]
        HTTPSOnly[HTTPS Only]
        SecureStorage[Secure Storage]
    end
    
    TokenGeneration --> Header
    TokenGeneration --> Payload
    TokenGeneration --> Signature
    
    Payload --> UserID[User ID]
    Payload --> Email[Email]
    Payload --> Role[Role]
    Payload --> IssuedAt[Issued At]
    Payload --> ExpiresAt[Expires At]
    
    TokenStorage --> LocalStorage2[localStorage]
    TokenStorage --> HTTPHeaders[Authorization Header]
    
    TokenValidation --> SignatureCheck[Signature Verification]
    TokenValidation --> ExpiryCheck[Expiry Check]
    TokenValidation --> UserCheck[User Existence Check]
    
    TokenExpiry --> AutoLogout[Auto Logout]
    TokenExpiry --> LoginPrompt[Login Prompt]
    
    classDef lifecycle fill:#e1f5fe
    classDef structure fill:#f3e5f5
    classDef security fill:#e8f5e8
    
    class TokenGeneration,TokenStorage,TokenValidation,TokenRefresh,TokenExpiry lifecycle
    class Header,Payload,Signature,UserID,Email,Role,IssuedAt,ExpiresAt structure
    class SecretKey,Expiration,HTTPSOnly,SecureStorage,SignatureCheck,ExpiryCheck,UserCheck security
```

## Authentication Context Implementation

```typescript
// Auth Context Type Definition
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  clearError: () => void
}

// Auth Provider Implementation Flow
const AuthProvider = ({ children }) => {
  // 1. Initialize state from localStorage
  // 2. Validate existing token on mount
  // 3. Provide auth methods to children
  // 4. Handle token expiry
  // 5. Manage loading and error states
}
```

## Security Considerations

### Password Security
```mermaid
graph LR
    PlainPassword[Plain Password] --> BCrypt[BCrypt Hash]
    BCrypt --> SaltRounds[12 Salt Rounds]
    SaltRounds --> HashedPassword[Hashed Password]
    HashedPassword --> Database[(Database)]
    
    LoginAttempt[Login Attempt] --> PasswordVerify[BCrypt Compare]
    PasswordVerify --> Database
    PasswordVerify --> AuthResult[Auth Result]
    
    classDef security fill:#ffebee
    classDef process fill:#e8f5e8
    
    class PlainPassword,HashedPassword,LoginAttempt,AuthResult security
    class BCrypt,SaltRounds,PasswordVerify,Database process
```

### Token Security
- **Secret Key**: Environment variable, never exposed to client
- **Expiration**: 7-day expiry to limit exposure window
- **HTTPS Only**: Tokens only transmitted over secure connections
- **No Sensitive Data**: Tokens contain minimal user information

### Authorization Levels

1. **Public Routes**: No authentication required
   - Homepage, product browsing, registration, login

2. **Authenticated Routes**: Valid JWT required
   - Profile management, order history, checkout

3. **Admin Routes**: Admin role required
   - Product management, order management, user management

4. **Owner Routes**: Resource ownership required
   - Edit own profile, view own orders

### Error Handling

```typescript
// Authentication Errors
enum AuthError {
  INVALID_CREDENTIALS = 'Invalid email or password',
  EMAIL_EXISTS = 'Email already registered',
  TOKEN_EXPIRED = 'Session expired, please login again',
  TOKEN_INVALID = 'Invalid authentication token',
  ACCESS_DENIED = 'Access denied',
  USER_NOT_FOUND = 'User account not found'
}
```

### Session Management

- **Client-side**: JWT stored in localStorage
- **Server-side**: Stateless authentication (no server sessions)
- **Token Refresh**: Manual re-authentication after expiry
- **Logout**: Clear localStorage and redirect to login

### Future Enhancements

1. **Refresh Tokens**: Implement refresh token rotation
2. **Multi-factor Authentication**: Add 2FA support
3. **OAuth Integration**: Social login (Google, Facebook)
4. **Session Management**: Server-side session tracking
5. **Rate Limiting**: Prevent brute force attacks
6. **Account Lockout**: Temporary lockout after failed attempts