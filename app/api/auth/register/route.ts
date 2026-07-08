import { NextRequest, NextResponse } from 'next/server'
import { usersDb, generateId, initializeDatabase } from '@/lib/database'
import { ApiResponse, AuthRequest, User } from '@/lib/types'
import { AuthService } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Initialize database on first request
let initialized = false

async function ensureInitialized() {
  if (!initialized) {
    await initializeDatabase()
    initialized = true
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureInitialized()
    
    const body: AuthRequest = await request.json()
    const { email, password, firstName, lastName } = body

    if (!email || !password || !firstName || !lastName) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields: email, password, firstName, lastName'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid email format'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      const response: ApiResponse = {
        success: false,
        error: 'Password must be at least 8 characters long'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await usersDb.findOne(u => u.email === email)
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: 'User with this email already exists'
      }
      return NextResponse.json(response, { status: 409 })
    }

    // Hash password with bcrypt
    const hashedPassword = await AuthService.hashPassword(password)

    // Create user
    const user: User & { password?: string } = {
      id: generateId(),
      email,
      firstName,
      lastName,
      addresses: [],
      orders: [],
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const createdUser = await usersDb.create(user)

    // Generate JWT token
    const token = AuthService.generateToken(createdUser as User)

    // Return user without password
    const { password: _, ...userResponse } = createdUser as any
    
    const response: ApiResponse<{ user: User; token: string }> = {
      success: true,
      data: { user: userResponse as User, token },
      message: 'User registered successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error registering user:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to register user'
    }
    return NextResponse.json(response, { status: 500 })
  }
}