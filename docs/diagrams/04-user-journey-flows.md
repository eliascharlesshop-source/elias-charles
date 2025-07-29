# User Journey Flow Diagrams

## Customer Browse & Purchase Journey

```mermaid
flowchart TD
    Start([User visits site]) --> Landing[Landing Page]
    Landing --> Browse{Browse Products?}
    
    Browse -->|Yes| Collections[Collections Page]
    Browse -->|No| Search[Search Products]
    
    Collections --> CategoryFilter[Filter by Category]
    CategoryFilter --> ProductGrid[Product Grid View]
    
    Search --> SearchResults[Search Results]
    SearchResults --> ProductGrid
    
    ProductGrid --> ProductClick[Click Product]
    ProductClick --> ProductDetail[Product Detail Page]
    
    ProductDetail --> ProductActions{User Action}
    ProductActions -->|Add to Cart| AddCart[Add to Cart]
    ProductActions -->|View More| RelatedProducts[Related Products]
    ProductActions -->|Back| ProductGrid
    
    AddCart --> CartNotification[Cart Notification]
    CartNotification --> ContinueShopping{Continue Shopping?}
    
    ContinueShopping -->|Yes| ProductGrid
    ContinueShopping -->|No| ViewCart[View Cart]
    
    ViewCart --> CartPage[Cart Page]
    CartPage --> CartActions{Cart Action}
    
    CartActions -->|Update Quantity| UpdateCart[Update Cart]
    CartActions -->|Remove Item| RemoveItem[Remove Item]
    CartActions -->|Checkout| CheckoutFlow[Checkout Flow]
    CartActions -->|Continue Shopping| ProductGrid
    
    UpdateCart --> CartPage
    RemoveItem --> CartPage
    
    CheckoutFlow --> CheckoutSteps[Checkout Process]
    CheckoutSteps --> OrderComplete[Order Confirmation]
    OrderComplete --> End([Journey Complete])
    
    RelatedProducts --> ProductGrid
    
    classDef startEnd fill:#e8f5e8
    classDef process fill:#e1f5fe
    classDef decision fill:#fff3e0
    classDef action fill:#f3e5f5
    
    class Start,End startEnd
    class Landing,Collections,ProductGrid,ProductDetail,CartPage,CheckoutSteps,OrderComplete process
    class Browse,ProductActions,ContinueShopping,CartActions decision
    class AddCart,UpdateCart,RemoveItem,CheckoutFlow action
```

## Detailed Checkout Flow

```mermaid
flowchart TD
    CartPage[Cart Page] --> CheckoutBtn[Click Checkout]
    CheckoutBtn --> AuthCheck{User Authenticated?}
    
    AuthCheck -->|No| GuestCheckout{Guest Checkout?}
    AuthCheck -->|Yes| Step1[Step 1: Information]
    
    GuestCheckout -->|Yes| Step1
    GuestCheckout -->|No| LoginPrompt[Login/Register]
    
    LoginPrompt --> LoginForm[Login Form]
    LoginForm --> LoginSubmit{Login Success?}
    LoginSubmit -->|Yes| Step1
    LoginSubmit -->|No| LoginError[Show Error]
    LoginError --> LoginForm
    
    Step1 --> ContactInfo[Enter Contact Info]
    ContactInfo --> ShippingInfo[Enter Shipping Address]
    ShippingInfo --> ValidateStep1{Validation OK?}
    
    ValidateStep1 -->|No| Step1Error[Show Validation Errors]
    ValidateStep1 -->|Yes| Step2[Step 2: Shipping Method]
    
    Step1Error --> Step1
    
    Step2 --> ShippingOptions[Select Shipping Method]
    ShippingOptions --> BillingAddress[Billing Address]
    BillingAddress --> SameAsShipping{Same as Shipping?}
    
    SameAsShipping -->|Yes| Step3[Step 3: Payment]
    SameAsShipping -->|No| BillingForm[Enter Billing Address]
    BillingForm --> ValidateStep2{Validation OK?}
    
    ValidateStep2 -->|No| Step2Error[Show Validation Errors]
    ValidateStep2 -->|Yes| Step3
    
    Step2Error --> Step2
    
    Step3 --> PaymentMethod[Select Payment Method]
    PaymentMethod --> CreditCard{Credit Card?}
    
    CreditCard -->|Yes| CardForm[Enter Card Details]
    CreditCard -->|No| PayPal[PayPal Checkout]
    
    CardForm --> ValidatePayment{Payment Valid?}
    PayPal --> PayPalAuth[PayPal Authentication]
    PayPalAuth --> ValidatePayment
    
    ValidatePayment -->|No| PaymentError[Show Payment Error]
    ValidatePayment -->|Yes| ReviewOrder[Review Order]
    
    PaymentError --> Step3
    
    ReviewOrder --> PlaceOrder[Place Order Button]
    PlaceOrder --> ProcessOrder[Process Order]
    ProcessOrder --> OrderSuccess{Order Created?}
    
    OrderSuccess -->|Yes| Confirmation[Order Confirmation]
    OrderSuccess -->|No| OrderError[Order Error]
    
    OrderError --> ReviewOrder
    Confirmation --> EmailConfirmation[Send Email Confirmation]
    EmailConfirmation --> ThankYou[Thank You Page]
    
    classDef process fill:#e1f5fe
    classDef decision fill:#fff3e0
    classDef error fill:#ffebee
    classDef success fill:#e8f5e8
    
    class CartPage,Step1,Step2,Step3,ContactInfo,ShippingInfo,ShippingOptions,BillingForm,CardForm,ReviewOrder,ProcessOrder,Confirmation,ThankYou process
    class AuthCheck,GuestCheckout,LoginSubmit,ValidateStep1,ValidateStep2,SameAsShipping,CreditCard,ValidatePayment,OrderSuccess decision
    class Step1Error,Step2Error,PaymentError,OrderError,LoginError error
    class EmailConfirmation success
```

## User Authentication Journey

```mermaid
flowchart TD
    UserAction[User Action Requiring Auth] --> AuthCheck{Authenticated?}
    
    AuthCheck -->|Yes| AuthorizedAction[Proceed with Action]
    AuthCheck -->|No| AuthPrompt[Show Auth Prompt]
    
    AuthPrompt --> AuthChoice{Login or Register?}
    
    AuthChoice -->|Login| LoginForm[Login Form]
    AuthChoice -->|Register| RegisterForm[Registration Form]
    
    LoginForm --> LoginData[Enter Email/Password]
    LoginData --> LoginSubmit[Submit Login]
    LoginSubmit --> LoginValidation{Valid Credentials?}
    
    LoginValidation -->|No| LoginError[Show Login Error]
    LoginValidation -->|Yes| LoginSuccess[Login Successful]
    
    LoginError --> LoginForm
    
    RegisterForm --> RegisterData[Enter User Details]
    RegisterData --> RegisterSubmit[Submit Registration]
    RegisterSubmit --> RegisterValidation{Valid Data?}
    
    RegisterValidation -->|No| RegisterError[Show Validation Errors]
    RegisterValidation -->|Yes| CreateAccount[Create Account]
    
    RegisterError --> RegisterForm
    
    CreateAccount --> AccountCreated{Account Created?}
    AccountCreated -->|No| RegisterError
    AccountCreated -->|Yes| AutoLogin[Auto Login User]
    
    LoginSuccess --> SetAuthToken[Set JWT Token]
    AutoLogin --> SetAuthToken
    
    SetAuthToken --> UpdateAuthState[Update Auth Context]
    UpdateAuthState --> AuthorizedAction
    
    AuthorizedAction --> End([Action Complete])
    
    classDef process fill:#e1f5fe
    classDef decision fill:#fff3e0
    classDef error fill:#ffebee
    classDef success fill:#e8f5e8
    
    class LoginForm,RegisterForm,LoginData,RegisterData,CreateAccount,SetAuthToken,UpdateAuthState,AuthorizedAction process
    class AuthCheck,AuthChoice,LoginValidation,RegisterValidation,AccountCreated decision
    class LoginError,RegisterError error
    class LoginSuccess,AutoLogin success
```

## Product Discovery Journey

```mermaid
flowchart TD
    Homepage[Homepage] --> DiscoveryMethod{How to Discover?}
    
    DiscoveryMethod -->|Browse| Navigation[Main Navigation]
    DiscoveryMethod -->|Search| SearchBar[Search Bar]
    DiscoveryMethod -->|Featured| FeaturedProducts[Featured Products]
    
    Navigation --> CategoryMenu[Category Menu]
    CategoryMenu --> CategoryPage[Category Page]
    
    SearchBar --> SearchQuery[Enter Search Term]
    SearchQuery --> SearchResults[Search Results]
    
    FeaturedProducts --> ProductCard[Featured Product Card]
    
    CategoryPage --> FilterOptions[Filter & Sort Options]
    FilterOptions --> ProductListing[Product Listing]
    
    SearchResults --> SearchFilters[Search Filters]
    SearchFilters --> ProductListing
    
    ProductCard --> ProductPage[Product Detail Page]
    ProductListing --> ProductCard
    
    ProductPage --> ProductInfo[Product Information]
    ProductInfo --> ProductActions{User Action}
    
    ProductActions -->|Add to Cart| AddToCart[Add to Cart]
    ProductActions -->|View Similar| RelatedProducts[Related Products]
    ProductActions -->|Share| ShareProduct[Share Product]
    ProductActions -->|Save| Wishlist[Add to Wishlist]
    
    AddToCart --> CartUpdated[Cart Updated]
    RelatedProducts --> ProductListing
    ShareProduct --> SocialShare[Social Media Share]
    Wishlist --> WishlistUpdated[Wishlist Updated]
    
    CartUpdated --> ContinueOrCheckout{Continue Shopping?}
    ContinueOrCheckout -->|Continue| ProductListing
    ContinueOrCheckout -->|Checkout| CheckoutProcess[Checkout Process]
    
    WishlistUpdated --> ProductPage
    SocialShare --> ProductPage
    
    classDef entry fill:#e8f5e8
    classDef process fill:#e1f5fe
    classDef decision fill:#fff3e0
    classDef action fill:#f3e5f5
    
    class Homepage entry
    class Navigation,CategoryPage,SearchResults,ProductPage,ProductInfo,CartUpdated,WishlistUpdated process
    class DiscoveryMethod,ProductActions,ContinueOrCheckout decision
    class AddToCart,ShareProduct,Wishlist,CheckoutProcess action
```

## Mobile User Experience Flow

```mermaid
flowchart TD
    MobileVisit[Mobile Site Visit] --> MobileHome[Mobile Homepage]
    MobileHome --> MobileNav{Navigation Method}
    
    MobileNav -->|Hamburger Menu| MobileMenu[Mobile Menu]
    MobileNav -->|Search| MobileSearch[Mobile Search]
    MobileNav -->|Swipe| MobileBrowse[Swipe to Browse]
    
    MobileMenu --> MobileCategories[Mobile Categories]
    MobileCategories --> MobileProductGrid[Mobile Product Grid]
    
    MobileSearch --> MobileSearchResults[Mobile Search Results]
    MobileSearchResults --> MobileProductGrid
    
    MobileBrowse --> MobileCarousel[Product Carousel]
    MobileCarousel --> MobileProductGrid
    
    MobileProductGrid --> MobileProductCard[Mobile Product Card]
    MobileProductCard --> MobileProductDetail[Mobile Product Detail]
    
    MobileProductDetail --> MobileProductActions{Mobile Actions}
    
    MobileProductActions -->|Add to Cart| MobileAddCart[Mobile Add to Cart]
    MobileProductActions -->|Quick View| MobileQuickView[Mobile Quick View]
    MobileProductActions -->|Share| MobileShare[Mobile Share]
    
    MobileAddCart --> MobileCartNotification[Mobile Cart Notification]
    MobileCartNotification --> MobileContinue{Continue Shopping?}
    
    MobileContinue -->|Yes| MobileProductGrid
    MobileContinue -->|No| MobileCart[Mobile Cart View]
    
    MobileCart --> MobileCheckout[Mobile Checkout]
    MobileCheckout --> MobilePayment[Mobile Payment]
    MobilePayment --> MobileConfirmation[Mobile Order Confirmation]
    
    MobileQuickView --> MobileProductDetail
    MobileShare --> MobileSocialShare[Mobile Social Share]
    MobileSocialShare --> MobileProductDetail
    
    classDef mobile fill:#e3f2fd
    classDef process fill:#e1f5fe
    classDef decision fill:#fff3e0
    classDef action fill:#f3e5f5
    
    class MobileVisit,MobileHome,MobileMenu,MobileSearch,MobileBrowse mobile
    class MobileCategories,MobileProductGrid,MobileProductDetail,MobileCart,MobileCheckout,MobileConfirmation process
    class MobileNav,MobileProductActions,MobileContinue decision
    class MobileAddCart,MobileShare,MobilePayment action
```

## Key User Experience Metrics

### Conversion Funnel
1. **Homepage Visit** → **Product Discovery** (85%)
2. **Product Discovery** → **Product View** (45%)
3. **Product View** → **Add to Cart** (25%)
4. **Add to Cart** → **Checkout Start** (70%)
5. **Checkout Start** → **Order Complete** (60%)

### Critical User Paths
- **Quick Purchase**: Homepage → Search → Product → Add to Cart → Checkout (< 3 minutes)
- **Browse & Compare**: Homepage → Category → Filter → Compare → Purchase (5-10 minutes)
- **Mobile Shopping**: Mobile optimized flow with touch-friendly interactions

### User Experience Principles
- **Progressive Disclosure**: Show information as needed
- **Mobile-First**: Optimized for mobile devices
- **Guest Checkout**: No forced registration
- **Clear Navigation**: Intuitive category structure
- **Trust Signals**: Security badges, reviews, return policy