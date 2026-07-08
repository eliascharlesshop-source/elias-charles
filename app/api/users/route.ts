import { NextRequest, NextResponse } from 'next/server'
import { usersDb, initializeDatabase } from '@/lib/database'
import { ApiResponse, User } from '@/lib/types'
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

// GET /api/users - Get all users (admin only)
export const GET = AuthService.requireRole('admin', async (request: NextRequest) => {
  try {
    await ensureInitialized()
    
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''

    let users = await usersDb.findAll()

    // Filter by search term
    if (search) {
      users = users.filter(user => 
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user as any
      return userWithoutPassword
    })

    // Pagination
    const total = usersWithoutPasswords.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = usersWithoutPasswords.slice(startIndex, endIndex)

    const response: ApiResponse<{
      users: User[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }> = {
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching users:', error)
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch users'
    }
    return NextResponse.json(response, { status: 500 })
  }
})