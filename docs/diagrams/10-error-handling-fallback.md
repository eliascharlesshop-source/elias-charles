# Error Handling & Fallback Flow

## Error Handling Architecture Overview

```mermaid
graph TB
    subgraph "Error Sources"
        NetworkError[Network Errors]
        APIError[API Errors]
        ValidationError[Validation Errors]
        AuthError[Authentication Errors]
        DatabaseError[Database Errors]
        ShopifyError[Shopify API Errors]
    end
    
    subgraph "Error Detection"
        ErrorBoundary[React Error Boundary]
        APIErrorHandler[API Error Handler]
        ValidationMiddleware[Validation Middleware]
        NetworkMonitor[Network Monitor]
    end
    
    subgraph "Error Processing"
        ErrorClassifier[Error Classifier]
        ErrorLogger[Error Logger]
        ErrorNotifier[Error Notifier]
        FallbackTrigger[Fallback Trigger]
    end
    
    subgraph "Recovery Strategies"
        RetryMechanism[Retry Mechanism]
        FallbackData[Fallback Data]
        GracefulDegradation[Graceful Degradation]
        UserNotification[User Notification]
    end
    
    NetworkError --> ErrorBoundary
    APIError --> APIErrorHandler
    ValidationError --> ValidationMiddleware
    AuthError --> APIErrorHandler
    DatabaseError --> APIErrorHandler
    ShopifyError --> APIErrorHandler
    
    ErrorBoundary --> ErrorClassifier
    APIErrorHandler --> ErrorClassifier
    ValidationMiddleware --> ErrorClassifier
    NetworkMonitor --> ErrorClassifier
    
    ErrorClassifier --> ErrorLogger
    ErrorClassifier --> ErrorNotifier
    ErrorClassifier --> FallbackTrigger
    
    FallbackTrigger --> RetryMechanism
    FallbackTrigger --> FallbackData
    FallbackTrigger --> GracefulDegradation
    FallbackTrigger --> UserNotification
    
    classDef error fill:#ffebee
    classDef detection fill:#e3f2fd
    classDef processing fill:#f3e5f5
    classDef recovery fill:#e8f5e8
    
    class NetworkError,APIError,ValidationError,AuthError,DatabaseError,ShopifyError error
    class ErrorBoundary,APIErrorHandler,ValidationMiddleware,NetworkMonitor detection
    class ErrorClassifier,ErrorLogger,ErrorNotifier,FallbackTrigger processing
    class RetryMechanism,FallbackData,GracefulDegradation,UserNotification recovery
```

## Error Classification & Response Flow

```mermaid
flowchart TD
    ErrorOccurred[Error Occurred] --> ErrorType{Classify Error Type}
    
    ErrorType -->|Network| NetworkErrorFlow[Network Error Flow]
    ErrorType -->|API| APIErrorFlow[API Error Flow]
    ErrorType -->|Validation| ValidationErrorFlow[Validation Error Flow]
    ErrorType -->|Authentication| AuthErrorFlow[Auth Error Flow]
    ErrorType -->|Database| DatabaseErrorFlow[Database Error Flow]
    ErrorType -->|Shopify| ShopifyErrorFlow[Shopify Error Flow]
    ErrorType -->|Unknown| UnknownErrorFlow[Unknown Error Flow]
    
    NetworkErrorFlow --> NetworkSeverity{Severity Level}
    NetworkSeverity -->|Critical| NetworkCritical[Show Offline Mode]
    NetworkSeverity -->|Warning| NetworkWarning[Show Connection Warning]
    NetworkSeverity -->|Info| NetworkRetry[Auto Retry]
    
    APIErrorFlow --> APIStatus{HTTP Status Code}
    APIStatus -->|4xx| ClientError[Client Error Handling]
    APIStatus -->|5xx| ServerError[Server Error Handling]
    APIStatus -->|Timeout| TimeoutError[Timeout Handling]
    
    ValidationErrorFlow --> ValidationDisplay[Display Field Errors]
    ValidationDisplay --> PreventSubmission[Prevent Form Submission]
    
    AuthErrorFlow --> AuthAction{Auth Action Required}
    AuthAction -->|Token Expired| RefreshToken[Attempt Token Refresh]
    AuthAction -->|Invalid Credentials| LoginPrompt[Prompt Re-login]
    AuthAction -->|Insufficient Permissions| AccessDenied[Show Access Denied]
    
    DatabaseErrorFlow --> DatabaseFallback[Use Cached Data]
    DatabaseFallback --> DatabaseNotify[Notify Admin]
    
    ShopifyErrorFlow --> ShopifyFallback[Use Local Data]
    ShopifyFallback --> ShopifyWarning[Show Fallback Warning]
    
    UnknownErrorFlow --> GenericError[Generic Error Message]
    GenericError --> ErrorReport[Generate Error Report]
    
    NetworkCritical --> LogError[Log Error]
    NetworkWarning --> LogError
    NetworkRetry --> LogError
    ClientError --> LogError
    ServerError --> LogError
    TimeoutError --> LogError
    ValidationDisplay --> LogError
    RefreshToken --> LogError
    LoginPrompt --> LogError
    AccessDenied --> LogError
    DatabaseNotify --> LogError
    ShopifyWarning --> LogError
    ErrorReport --> LogError
    
    classDef error fill:#ffebee
    classDef decision fill:#fff3e0
    classDef action fill:#e1f5fe
    classDef log fill:#f3e5f5
    
    class ErrorOccurred,NetworkErrorFlow,APIErrorFlow,ValidationErrorFlow,AuthErrorFlow,DatabaseErrorFlow,ShopifyErrorFlow,UnknownErrorFlow error
    class ErrorType,NetworkSeverity,APIStatus,AuthAction decision
    class NetworkCritical,NetworkWarning,NetworkRetry,ClientError,ServerError,TimeoutError,ValidationDisplay,RefreshToken,LoginPrompt,AccessDenied,DatabaseFallback,ShopifyFallback,GenericError action
    class LogError log
```

## Shopify API Fallback Strategy

```mermaid
sequenceDiagram
    participant Frontend
    participant ProductAPI
    participant ShopifyAPI
    participant LocalDB
    participant MockData
    participant ErrorHandler
    participant UserNotification
    
    Frontend->>ProductAPI: Request products
    ProductAPI->>ShopifyAPI: Call Shopify API
    
    alt Shopify API Success
        ShopifyAPI-->>ProductAPI: Products data
        ProductAPI-->>Frontend: Return products
    else Shopify API Error
        ShopifyAPI-->>ProductAPI: Error response
        ProductAPI->>ErrorHandler: Handle Shopify error
        
        ErrorHandler->>ErrorHandler: Classify error type
        
        alt Temporary Error (Rate limit, timeout)
            ErrorHandler->>ErrorHandler: Schedule retry
            ErrorHandler->>LocalDB: Check cached data
            
            alt Cache Available
                LocalDB-->>ErrorHandler: Cached products
                ErrorHandler-->>ProductAPI: Cached data + warning
                ProductAPI-->>Frontend: Products with warning
                ProductAPI->>UserNotification: Show "Using cached data"
            else No Cache
                ErrorHandler->>MockData: Get fallback data
                MockData-->>ErrorHandler: Mock products
                ErrorHandler-->>ProductAPI: Mock data + warning
                ProductAPI-->>Frontend: Mock products with warning
                ProductAPI->>UserNotification: Show "Limited functionality"
            end
        else Permanent Error (Auth, config)
            ErrorHandler->>LocalDB: Use local data only
            LocalDB-->>ErrorHandler: Local products
            ErrorHandler-->>ProductAPI: Local data + error
            ProductAPI-->>Frontend: Local products
            ProductAPI->>UserNotification: Show "Shopify unavailable"
        end
    end
```

## React Error Boundary Implementation

```mermaid
graph TD
    ComponentTree[React Component Tree] --> ErrorBoundary[Error Boundary]
    
    ErrorBoundary --> ComponentRender{Component Renders?}
    ComponentRender -->|Success| NormalFlow[Normal Rendering]
    ComponentRender -->|Error| ErrorCaught[Error Caught]
    
    ErrorCaught --> ErrorAnalysis[Analyze Error]
    ErrorAnalysis --> ErrorType{Error Type}
    
    ErrorType -->|Recoverable| RecoverableError[Recoverable Error]
    ErrorType -->|Fatal| FatalError[Fatal Error]
    
    RecoverableError --> RetryComponent[Retry Component]
    RecoverableError --> FallbackUI[Show Fallback UI]
    
    FatalError --> ErrorPage[Show Error Page]
    FatalError --> ReloadPrompt[Prompt Page Reload]
    
    RetryComponent --> ComponentRender
    FallbackUI --> LogError2[Log Error]
    ErrorPage --> LogError2
    ReloadPrompt --> LogError2
    
    LogError2 --> ErrorReporting[Send Error Report]
    ErrorReporting --> UserSupport[Notify Support Team]
    
    classDef component fill:#e1f5fe
    classDef boundary fill:#f3e5f5
    classDef decision fill:#fff3e0
    classDef recovery fill:#e8f5e8
    classDef error fill:#ffebee
    
    class ComponentTree,NormalFlow component
    class ErrorBoundary,ErrorAnalysis boundary
    class ComponentRender,ErrorType decision
    class RecoverableError,RetryComponent,FallbackUI recovery
    class ErrorCaught,FatalError,ErrorPage,ReloadPrompt,LogError2,ErrorReporting error
```

## Network Error Handling

```mermaid
stateDiagram-v2
    [*] --> Online
    Online --> NetworkCheck : Periodic Check
    NetworkCheck --> Online : Connection OK
    NetworkCheck --> Offline : Connection Failed
    
    Offline --> RetryConnection : Auto Retry
    RetryConnection --> Online : Connection Restored
    RetryConnection --> Offline : Still Offline
    
    Online --> APICall : Make Request
    APICall --> Success : Request OK
    APICall --> NetworkError : Request Failed
    
    NetworkError --> ErrorAnalysis : Analyze Error
    ErrorAnalysis --> TemporaryError : Transient Issue
    ErrorAnalysis --> PermanentError : Persistent Issue
    
    TemporaryError --> RetryRequest : Exponential Backoff
    RetryRequest --> APICall : Retry
    RetryRequest --> GiveUp : Max Retries
    
    PermanentError --> FallbackMode : Use Cached Data
    GiveUp --> FallbackMode
    
    FallbackMode --> Online : Connection Restored
    Success --> Online : Continue Normal Flow
```

## Error Logging & Monitoring

```mermaid
graph TB
    subgraph "Error Sources"
        ClientError[Client-side Errors]
        ServerError[Server-side Errors]
        APIError2[API Errors]
        NetworkError2[Network Errors]
    end
    
    subgraph "Error Collection"
        ErrorLogger2[Error Logger]
        ErrorAggregator[Error Aggregator]
        ErrorFilter[Error Filter]
    end
    
    subgraph "Error Storage"
        LocalLogs[Local Logs]
        RemoteLogs[Remote Logs]
        ErrorDatabase[(Error Database)]
    end
    
    subgraph "Error Analysis"
        ErrorDashboard[Error Dashboard]
        AlertSystem[Alert System]
        ErrorReports[Error Reports]
        TrendAnalysis[Trend Analysis]
    end
    
    ClientError --> ErrorLogger2
    ServerError --> ErrorLogger2
    APIError2 --> ErrorLogger2
    NetworkError2 --> ErrorLogger2
    
    ErrorLogger2 --> ErrorAggregator
    ErrorAggregator --> ErrorFilter
    
    ErrorFilter --> LocalLogs
    ErrorFilter --> RemoteLogs
    ErrorFilter --> ErrorDatabase
    
    LocalLogs --> ErrorDashboard
    RemoteLogs --> ErrorDashboard
    ErrorDatabase --> ErrorDashboard
    
    ErrorDashboard --> AlertSystem
    ErrorDashboard --> ErrorReports
    ErrorDashboard --> TrendAnalysis
    
    classDef source fill:#ffebee
    classDef collection fill:#e3f2fd
    classDef storage fill:#f3e5f5
    classDef analysis fill:#e8f5e8
    
    class ClientError,ServerError,APIError2,NetworkError2 source
    class ErrorLogger2,ErrorAggregator,ErrorFilter collection
    class LocalLogs,RemoteLogs,ErrorDatabase storage
    class ErrorDashboard,AlertSystem,ErrorReports,TrendAnalysis analysis
```

## User-Facing Error Messages

```mermaid
flowchart TD
    ErrorOccurred2[Error Occurred] --> UserImpact{User Impact Level}
    
    UserImpact -->|No Impact| SilentLog[Log Silently]
    UserImpact -->|Minor Impact| InfoMessage[Info Message]
    UserImpact -->|Major Impact| WarningMessage[Warning Message]
    UserImpact -->|Critical Impact| ErrorMessage[Error Message]
    
    SilentLog --> BackgroundFix[Background Recovery]
    
    InfoMessage --> ToastNotification[Toast Notification]
    ToastNotification --> AutoDismiss[Auto Dismiss]
    
    WarningMessage --> BannerNotification[Banner Notification]
    BannerNotification --> UserAction[User Action Required]
    
    ErrorMessage --> ModalDialog[Modal Dialog]
    ModalDialog --> UserDecision{User Decision}
    
    UserDecision -->|Retry| RetryAction[Retry Action]
    UserDecision -->|Cancel| CancelAction[Cancel Action]
    UserDecision -->|Contact Support| SupportAction[Contact Support]
    
    RetryAction --> ErrorOccurred2
    CancelAction --> FallbackFlow[Fallback Flow]
    SupportAction --> SupportTicket[Create Support Ticket]
    
    classDef error fill:#ffebee
    classDef decision fill:#fff3e0
    classDef message fill:#e1f5fe
    classDef action fill:#e8f5e8
    
    class ErrorOccurred2 error
    class UserImpact,UserDecision decision
    class SilentLog,InfoMessage,WarningMessage,ErrorMessage,ToastNotification,BannerNotification,ModalDialog message
    class BackgroundFix,AutoDismiss,UserAction,RetryAction,CancelAction,SupportAction,FallbackFlow,SupportTicket action
```

## Error Recovery Strategies

### Retry Mechanisms
```typescript
// Exponential backoff with jitter
const retryWithBackoff = async (
  operation: () => Promise<any>,
  maxRetries: number = 3,
  baseDelay: number = 1000
) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries - 1) throw error
      
      const delay = baseDelay * Math.pow(2, attempt)
      const jitter = Math.random() * 0.1 * delay
      await new Promise(resolve => setTimeout(resolve, delay + jitter))
    }
  }
}
```

### Circuit Breaker Pattern
```typescript
class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }
    
    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }
}
```

## Error Prevention Strategies

### Input Validation
```mermaid
graph LR
    UserInput[User Input] --> ClientValidation[Client Validation]
    ClientValidation --> ServerValidation[Server Validation]
    ServerValidation --> DatabaseValidation[Database Validation]
    
    ClientValidation -->|Invalid| ClientError2[Client Error]
    ServerValidation -->|Invalid| ServerError2[Server Error]
    DatabaseValidation -->|Invalid| DatabaseError2[Database Error]
    
    ClientError2 --> UserFeedback[User Feedback]
    ServerError2 --> ErrorResponse[Error Response]
    DatabaseError2 --> SystemAlert[System Alert]
    
    classDef validation fill:#e8f5e8
    classDef error fill:#ffebee
    classDef feedback fill:#e1f5fe
    
    class ClientValidation,ServerValidation,DatabaseValidation validation
    class ClientError2,ServerError2,DatabaseError2 error
    class UserFeedback,ErrorResponse,SystemAlert feedback
```

### Error Boundaries Placement
- **Page Level**: Catch page-specific errors
- **Component Level**: Catch component-specific errors
- **Route Level**: Catch routing errors
- **Global Level**: Catch application-wide errors

### Monitoring & Alerting Rules

1. **Critical Alerts** (Immediate Response)
   - Error rate > 5% for 5 minutes
   - API response time > 5 seconds
   - Shopify API completely unavailable

2. **Warning Alerts** (Within 1 hour)
   - Error rate > 2% for 15 minutes
   - Fallback mode activated
   - High retry rates

3. **Info Alerts** (Daily Summary)
   - Error trends and patterns
   - Performance degradation
   - User experience metrics

### Error Message Guidelines

1. **Be Specific**: Explain what went wrong
2. **Be Actionable**: Tell users what they can do
3. **Be Empathetic**: Acknowledge the inconvenience
4. **Be Consistent**: Use consistent language and tone
5. **Be Helpful**: Provide next steps or alternatives

### Example Error Messages
```typescript
const errorMessages = {
  network: {
    title: "Connection Problem",
    message: "We're having trouble connecting to our servers. Please check your internet connection and try again.",
    action: "Retry"
  },
  shopify: {
    title: "Limited Functionality",
    message: "Some features may be temporarily unavailable. You can still browse our catalog using cached data.",
    action: "Continue Browsing"
  },
  validation: {
    title: "Please Check Your Information",
    message: "Some fields need your attention before we can continue.",
    action: "Review Form"
  }
}
```

## Performance Impact of Error Handling

### Error Handling Overhead
- **Error Boundaries**: ~1-2ms per boundary
- **Try-Catch Blocks**: ~0.1ms per block
- **Error Logging**: ~5-10ms per log entry
- **Retry Logic**: Variable based on retry count

### Optimization Strategies
- **Lazy Error Reporting**: Batch error reports
- **Error Sampling**: Sample non-critical errors
- **Async Error Handling**: Don't block user interactions
- **Error Caching**: Cache error responses to prevent repeated failures