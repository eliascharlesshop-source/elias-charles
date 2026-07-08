import { NextRequest, NextResponse } from 'next/server'
import { usersDb, initializeDatabase } from '@/lib/database'
import { ApiResponse, User } from '@/lib/types'
import { AuthService } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const dynamic = 'force-dynamic'

// Initialize database on first request
let initialized = false

async function ensureInitialized() {
  if (!initialized) {
    await initializeDatabase()
    initialized = true
  }
}

// GET /api/users/[id] - Get user by ID (admin or own profile)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureInitialized()
    const { id } = await params
    
    const auth = await AuthService.authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Allow access if admin or accessing own profile
    if (auth.role !== 'admin' && auth.userId !== id) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const user = await usersDb.findById(id)
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user as any

    const response: ApiResponse<User> = {
      success: true,
      data: userWithoutPassword as User
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching user:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch user'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// PUT /api/users/[id] - Update user (admin or own profile)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureInitialized()
    const { id } = await params
    
    const auth = await AuthService.authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Allow access if admin or updating own profile
    if (auth.role !== 'admin' && auth.userId !== id) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, email, role } = body

    const existingUser = await usersDb.findById(id)
    if (!existingUser) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Only admin can change role
    const updateData: any = {
      firstName: firstName || existingUser.firstName,
      lastName: lastName || existingUser.lastName,
      email: email || existingUser.email,
      updatedAt: new Date().toISOString()
    }

    if (auth.role === 'admin' && role) {
      updateData.role = role
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        )
      }

      // Check if email is already taken by another user
      const emailExists = await usersDb.findOne(u => u.email === email && u.id !== id)
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email already taken' },
          { status: 409 }
        )
      }
    }

    const updatedUser = await usersDb.update(id, updateData)

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser as any

    const response: ApiResponse<User> = {
      success: true,
      data: userWithoutPassword as User,
      message: 'User updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating user:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update user'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication first
  const auth = await AuthService.authenticateRequest(request)
  if (!auth) {
    const response: ApiResponse = {
      success: false,
      error: 'Authentication required'
    }
    return NextResponse.json(response, { status: 401 })
  }

  // Check role
  if (auth.role !== 'admin') {
    const response: ApiResponse = {
      success: false,
      error: 'Insufficient permissions'
    }
    return NextResponse.json(response, { status: 403 })
  }

  try {
    await ensureInitialized()
    const { id } = await params

    const user = await usersDb.findById(id)
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    await usersDb.delete(id)

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting user:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete user'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
