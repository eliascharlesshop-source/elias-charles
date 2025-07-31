# Authentication System Setup

The application now has a comprehensive authentication system supporting:

## 🔐 Authentication Methods

1. **Email & Password** - Traditional email/password authentication with bcrypt hashing
2. **Google OAuth** - Sign in with Google using NextAuth.js
3. **Web3 Wallets** - Connect crypto wallets using Thirdweb (MetaMask, WalletConnect, etc.)

## 🛠️ Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

### 2. Required Environment Variables

#### NextAuth.js Configuration
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

```
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

#### Thirdweb Configuration
1. Go to [Thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Create a new project
3. Get your Client ID from the API Keys section

```
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your-thirdweb-client-id-here
```

### 3. Test the Authentication

1. **Email Login**: Use the demo credentials provided on the login page:
   - Email: `demo@example.com`
   - Password: `password123`

2. **Google OAuth**: Click "Sign in with Google" button

3. **Web3 Wallet**: Click "Connect Wallet" and choose your preferred wallet

## 🏗️ Architecture

### Components
- `AuthProvider` - Unified authentication context combining NextAuth and Thirdweb
- `ThirdwebProvider` - Wrapper for Thirdweb Web3 functionality
- `ClientProviders` - Client-side provider wrapper for SSR compatibility

### Pages
- `/auth/login` - Login page with all three authentication methods
- `/auth/signup` - Registration page with email signup and social login
- `/profile` - User profile showing authentication status and user info

### API Routes
- `/api/auth/[...nextauth]` - NextAuth.js API routes for email and Google OAuth

## 🔧 Features

- **Unified User State** - Single user object regardless of authentication method
- **SSR Compatible** - Proper server-side rendering support
- **TypeScript** - Full type safety for user data and authentication states
- **Loading States** - Proper loading indicators during authentication
- **Error Handling** - Comprehensive error messages for failed authentication
- **Auto-redirect** - Automatic redirects based on authentication state

## 🚀 Usage

```tsx
import { useAuth } from "@/src/components/layout/auth-provider"

function MyComponent() {
  const { user, login, logout, signup, isLoading } = useAuth()
  
  // Login with email
  await login('email', { email, password })
  
  // Login with Google
  await login('google')
  
  // Signup with email
  await signup({ email, password, firstName, lastName })
  
  // Logout
  await logout()
}
```

## 📝 User Object Structure

```typescript
interface User {
  id?: string
  email?: string
  name?: string
  firstName?: string
  lastName?: string
  image?: string
  walletAddress?: string
  provider?: 'email' | 'google' | 'wallet'
}
```

## 🎨 UI Features

- **Dark Mode Support** - All authentication pages support light/dark themes
- **Responsive Design** - Mobile-friendly authentication forms
- **Consistent Icons** - Lucide React icons throughout
- **Profile Dashboard** - Comprehensive user profile with authentication status
- **Demo Credentials** - Built-in demo account for testing

## 🔍 Testing

The application is running at `http://localhost:3000`

Test all three authentication methods:
1. Visit `/auth/login` for email login
2. Try Google OAuth (requires setup)
3. Connect a Web3 wallet (requires wallet browser extension)
4. Visit `/profile` to see your authentication status

## ⚠️ Notes

- Google OAuth requires proper domain configuration for production
- Web3 wallet connection requires a crypto wallet browser extension
- The demo email credentials are for development testing only
- Environment variables are required for full functionality
