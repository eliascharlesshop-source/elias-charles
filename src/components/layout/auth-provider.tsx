"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useAddress, useDisconnect, useConnectionStatus } from "@thirdweb-dev/react"

// Define the Auth Context type
type User = {
  id?: string
  email?: string
  name?: string
  image?: string
  walletAddress?: string
  authMethod: 'email' | 'google' | 'wallet'
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (method: 'email' | 'google' | 'wallet', credentials?: any) => Promise<void>
  logout: () => Promise<void>
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | null>(null)

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const walletAddress = useAddress()
  const disconnectWallet = useDisconnect()
  const connectionStatus = useConnectionStatus()
  
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Update user state when session or wallet changes
  useEffect(() => {
    setIsLoading(true)

    if (session?.user) {
      // User is authenticated via NextAuth (email/Google)
      setUser({
        id: session.user.id,
        email: session.user.email || undefined,
        name: session.user.name || undefined,
        image: session.user.image || undefined,
        authMethod: session.user.email?.includes('gmail.com') ? 'google' : 'email'
      })
    } else if (walletAddress && connectionStatus === "connected") {
      // User is authenticated via wallet
      setUser({
        walletAddress,
        authMethod: 'wallet'
      })
    } else {
      setUser(null)
    }

    setIsLoading(false)
  }, [session, walletAddress, connectionStatus])

  const isAuthenticated = !!user

  // Login function
  const login = async (method: 'email' | 'google' | 'wallet', credentials?: any) => {
    setIsLoading(true)
    
    try {
      if (method === 'email') {
        const result = await signIn('credentials', {
          email: credentials.email,
          password: credentials.password,
          redirect: false
        })
        
        if (result?.error) {
          throw new Error(result.error)
        }
      } else if (method === 'google') {
        await signIn('google', { redirect: false })
      } else if (method === 'wallet') {
        // Wallet connection is handled by Thirdweb hooks
        // The useEffect above will update the user state when wallet connects
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setIsLoading(true)
    
    try {
      // Sign out from NextAuth
      if (session) {
        await signOut({ redirect: false })
      }
      
      // Disconnect wallet
      if (walletAddress) {
        disconnectWallet()
      }
      
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Connect wallet function
  const connectWallet = async () => {
    // This will be handled by Thirdweb's ConnectWallet component
    // The useEffect above will update the user state when wallet connects
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isLoading, 
        login, 
        logout, 
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
