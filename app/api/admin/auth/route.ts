import { NextRequest, NextResponse } from 'next/server'
import { AuthService, JWTPayload } from '@/src/lib/auth'
import { ApiResponse } from '@/src/lib/types'

// POST /api/admin/auth/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate credentials (this would typically check against a database)
    // For now, we'll use a simple validation
    const isValidAdmin = await validateAdminCredentials(email, password)
    
    if (!isValidAdmin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const user = {
      id: 'admin_user_id',
      email,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    }

    const token = AuthService.generateToken(user as any)

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      }
    })

    // Set HTTP-only cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Login failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/auth/logout - Admin logout
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Clear session cookie
    response.cookies.delete('admin_session')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Logout failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/admin/auth/me - Get current admin user
export async function GET(request: NextRequest) {
  try {
    const auth = await AuthService.authenticateRequest(request)
    
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Return user info (without sensitive data)
    const userInfo = {
      id: auth.userId,
      email: auth.email,
      role: auth.role
    }

    return NextResponse.json({
      success: true,
      data: userInfo
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get user info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/admin/auth/refresh - Refresh admin session
export async function PUT(request: NextRequest) {
  try {
    const auth = await AuthService.authenticateRequest(request)
    
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Generate new token
    const user = {
      id: auth.userId,
      email: auth.email,
      role: auth.role,
      firstName: 'Admin',
      lastName: 'User'
    }

    const newToken = AuthService.generateToken(user as any)

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token: newToken
      }
    })

    // Update session cookie
    response.cookies.set('admin_session', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Refresh session error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to refresh session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to validate admin credentials
async function validateAdminCredentials(email: string, password: string): Promise<boolean> {
  // In a real application, this would:
  // 1. Check against a database of admin users
  // 2. Use proper password hashing (bcrypt)
  // 3. Check account status (active, locked, etc.)
  // 4. Log login attempts for security
  
  // For demo purposes, we'll use environment variables or a simple check
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  
  return email === adminEmail && password === adminPassword
}

// POST /api/admin/auth/forgot-password - Request password reset
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if email exists in admin users
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    
    if (email !== adminEmail) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      })
    }

    // Generate reset token (in a real app, this would be stored in database)
    const resetToken = generateResetToken(email)
    
    // Send reset email (in a real app, this would use an email service)
    console.log(`Password reset token for ${email}: ${resetToken}`)
    
    return NextResponse.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process password reset',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/auth/reset-password - Reset password with token
export async function POST_RESET(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Validate reset token (in a real app, this would check database)
    const email = validateResetToken(token)
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Update password (in a real app, this would hash and store in database)
    console.log(`Password reset for ${email} with new password: ${newPassword}`)
    
    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to reset password',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper functions for password reset
function generateResetToken(email: string): string {
  // In a real app, this would generate a secure token and store it with expiration
  const timestamp = Date.now()
  const data = `${email}:${timestamp}`
  return Buffer.from(data).toString('base64')
}

function validateResetToken(token: string): string | null {
  try {
    const data = Buffer.from(token, 'base64').toString()
    const [email, timestamp] = data.split(':')
    
    // Check if token is not expired (24 hours)
    const tokenAge = Date.now() - parseInt(timestamp)
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return null
    }
    
    return email
  } catch {
    return null
  }
}
