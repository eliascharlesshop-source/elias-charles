"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Define the Auth Context type
type User = {
  id?: string
  email?: string
  walletAddress?: string
  name?: string
  avatar?: string
  authProvider?: string
  role?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  signup: (userData: User) => void
  logout: () => void
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | null>(null)

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Failed to parse stored user:", error)
          localStorage.removeItem("user")
        }
      }
    }
  }, [])

  // Login function
  const login = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem("user", JSON.stringify(userData))
    }
  }

  // Signup function
  const signup = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem("user", JSON.stringify(userData))
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user")
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext)
}
