import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
export const dynamic = 'force-dynamic'

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
    const { email, password } = body

    if (!email || !password) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields: email, password'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Find user by email
    const user = await usersDb.findOne(u => u.email === email) as any

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid email or password'
      }
      return NextResponse.json(response, { status: 401 })
    }

    // Verify password with bcrypt
    const isValidPassword = await AuthService.verifyPassword(password, user.password)
    if (!isValidPassword) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid email or password'
      }
      return NextResponse.json(response, { status: 401 })
    }

    // Generate JWT token
    const token = AuthService.generateToken(user as User)

    // Return user without password
    const { password: _, ...userResponse } = user
    
    const response: ApiResponse<{ user: User; token: string }> = {
      success: true,
      data: { user: userResponse as User, token },
      message: 'Login successful'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error logging in user:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to login'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
