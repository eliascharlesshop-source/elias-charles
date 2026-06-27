"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

// Define the Auth Context type
type User = {
  id?: string
  email?: string
  name?: string
  image?: string
  authMethod: 'email' | 'google'
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (method: 'email' | 'google', credentials?: any) => Promise<void>
  signup: (credentials: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>
  logout: () => Promise<void>
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | null>(null)

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Update user state when session changes
  useEffect(() => {
    setIsLoading(true)

    if (session?.user) {
      // User is authenticated via NextAuth (email/Google)
      setUser({
        id: session.user.id || session.user.email || 'unknown',
        email: session.user.email || undefined,
        name: session.user.name || undefined,
        image: session.user.image || undefined,
        authMethod: session.user.email?.includes('gmail.com') ? 'google' : 'email'
      })
    } else {
      setUser(null)
    }

    setIsLoading(false)
  }, [session, status])

  const isAuthenticated = !!user

  // Login function
  const login = async (method: 'email' | 'google', credentials?: any) => {
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
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Signup function
  const signup = async (credentials: { email: string; password: string; firstName?: string; lastName?: string }) => {
    setIsLoading(true)
    
    try {
      // Call your signup API endpoint here
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Signup failed')
      }

      // Sign in the user after successful signup
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false
      })

      if (result?.error) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Signup failed:', error)
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
      
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isLoading, 
        login, 
        logout,
        signup
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
