import { NextRequest, NextResponse } from 'next/server'
import { AuthService, JWTPayload } from '@/lib/auth'

// Enhanced middleware for admin authentication and access control
export async function adminMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Admin routes that require authentication
  const adminRoutes = [
    '/admin',
    '/api/admin',
    '/api/admin/dashboard',
    '/api/admin/products',
    '/api/admin/orders',
    '/api/admin/users',
    '/api/admin/settings'
  ]

  // Check if the route requires admin access
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  if (!isAdminRoute) {
    return NextResponse.next()
  }

  // For API routes, let the individual handlers handle authentication
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // For admin pages, check authentication
  const auth = await AuthService.authenticateRequest(request)
  
  if (!auth) {
    // Redirect to login page for admin access
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check if user has admin role
  if (auth.role !== 'admin') {
    // Redirect to unauthorized page
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Add user info to headers for client-side usage
  const response = NextResponse.next()
  response.headers.set('X-User-Role', auth.role)
  response.headers.set('X-User-ID', auth.userId)
  
  return response
}

// Session management utilities
export class SessionManager {
  private static readonly SESSION_COOKIE = 'admin_session'
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

  static createSession(user: JWTPayload): string {
    const token = AuthService.generateToken({
      userId: user.userId,
      email: user.email,
      role: user.role
    } as any)
    
    return token
  }

  static validateSession(request: NextRequest): JWTPayload | null {
    const token = this.extractTokenFromRequest(request)
    return token ? AuthService.verifyToken(token) : null
  }

  static extractTokenFromRequest(request: NextRequest): string | null {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get('Authorization')
    const headerToken = AuthService.extractTokenFromHeader(authHeader)
    
    if (headerToken) {
      return headerToken
    }

    // Try to get token from cookie
    const cookieToken = request.cookies.get(this.SESSION_COOKIE)?.value
    return cookieToken || null
  }

  static setSessionCookie(response: NextResponse, token: string): void {
    response.cookies.set(this.SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: this.SESSION_DURATION / 1000,
      path: '/'
    })
  }

  static clearSessionCookie(response: NextResponse): void {
    response.cookies.delete(this.SESSION_COOKIE)
  }
}

// Access Control Lists (ACL)
export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
  conditions?: {
    field?: string
    value?: any
    operator?: 'equals' | 'in' | 'not_in'
  }
}

export interface RoleACL {
  [role: string]: Permission[]
}

export const ACCESS_CONTROL_LISTS: RoleACL = {
  admin: [
    {
      resource: 'products',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      resource: 'orders',
      actions: ['read', 'update']
    },
    {
      resource: 'users',
      actions: ['read', 'update', 'delete']
    },
    {
      resource: 'dashboard',
      actions: ['read']
    },
    {
      resource: 'settings',
      actions: ['read', 'update']
    }
  ],
  manager: [
    {
      resource: 'products',
      actions: ['read', 'update']
    },
    {
      resource: 'orders',
      actions: ['read', 'update']
    },
    {
      resource: 'dashboard',
      actions: ['read']
    }
  ],
  customer: [
    {
      resource: 'products',
      actions: ['read']
    },
    {
      resource: 'orders',
      actions: ['create', 'read'],
      conditions: {
        field: 'userId',
        operator: 'equals',
        value: 'current_user'
      }
    }
  ]
}

export class AccessControlService {
  static hasPermission(
    user: JWTPayload,
    resource: string,
    action: string,
    context?: any
  ): boolean {
    const userPermissions = ACCESS_CONTROL_LISTS[user.role] || []
    
    const permission = userPermissions.find(perm => 
      perm.resource === resource && 
      perm.actions.includes(action as any)
    )

    if (!permission) {
      return false
    }

    // Check conditions if they exist
    if (permission.conditions && context) {
      return this.evaluateConditions(permission.conditions, context, user)
    }

    return true
  }

  private static evaluateConditions(
    conditions: any,
    context: any,
    user: JWTPayload
  ): boolean {
    const { field, value, operator = 'equals' } = conditions

    switch (operator) {
      case 'equals':
        return context[field] === (value === 'current_user' ? user.userId : value)
      case 'in':
        return Array.isArray(value) && value.includes(context[field])
      case 'not_in':
        return Array.isArray(value) && !value.includes(context[field])
      default:
        return false
    }
  }

  static getAccessibleResources(user: JWTPayload): string[] {
    const userPermissions = ACCESS_CONTROL_LISTS[user.role] || []
    return userPermissions.map(perm => perm.resource)
  }

  static filterAccessibleData<T extends Record<string, any>>(
    user: JWTPayload,
    data: T[],
    resource: string
  ): T[] {
    const permissions = ACCESS_CONTROL_LISTS[user.role] || []
    const permission = permissions.find(perm => perm.resource === resource)

    if (!permission) {
      return []
    }

    // If no conditions, return all data
    if (!permission.conditions) {
      return data
    }

    // Filter based on conditions
    return data.filter(item => 
      this.evaluateConditions(permission.conditions!, item, user)
    )
  }
}

// Rate limiting for admin routes
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>()
  private static readonly WINDOW_SIZE = 15 * 60 * 1000 // 15 minutes
  private static readonly MAX_REQUESTS = 100 // Max requests per window

  static isRateLimited(userId: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(userId)

    if (!userRequests || now > userRequests.resetTime) {
      // Reset or create new window
      this.requests.set(userId, {
        count: 1,
        resetTime: now + this.WINDOW_SIZE
      })
      return false
    }

    if (userRequests.count >= this.MAX_REQUESTS) {
      return true
    }

    userRequests.count++
    return false
  }

  static getRateLimitStatus(userId: string): { 
    remaining: number; 
    resetTime: number; 
    isLimited: boolean 
  } {
    const now = Date.now()
    const userRequests = this.requests.get(userId)

    if (!userRequests || now > userRequests.resetTime) {
      return {
        remaining: this.MAX_REQUESTS,
        resetTime: now + this.WINDOW_SIZE,
        isLimited: false
      }
    }

    return {
      remaining: Math.max(0, this.MAX_REQUESTS - userRequests.count),
      resetTime: userRequests.resetTime,
      isLimited: userRequests.count >= this.MAX_REQUESTS
    }
  }

  static cleanup(): void {
    const now = Date.now()
    for (const [userId, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(userId)
      }
    }
  }
}

// Security headers for admin routes
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // CSP for admin routes
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src 'none'",
      "object-src 'none'"
    ].join('; ')
  )

  return response
}
