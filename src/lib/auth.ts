import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from './types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'
const SALT_ROUNDS = 12

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role || 'customer'
    }
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
      return null
    }
  }

  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7)
  }

  static async authenticateRequest(request: Request): Promise<JWTPayload | null> {
    const authHeader = request.headers.get('Authorization')
    const token = this.extractTokenFromHeader(authHeader)
    
    if (!token) {
      return null
    }
    
    return this.verifyToken(token)
  }

  static requireAuth(handler: (request: Request, auth: JWTPayload) => Promise<Response>) {
    return async (request: Request): Promise<Response> => {
      const auth = await this.authenticateRequest(request)
      
      if (!auth) {
        return new Response(
          JSON.stringify({ success: false, error: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      return handler(request, auth)
    }
  }

  static requireRole(role: string, handler: (request: Request, auth: JWTPayload) => Promise<Response>) {
    return this.requireAuth(async (request: Request, auth: JWTPayload) => {
      if (auth.role !== role && auth.role !== 'admin') {
        return new Response(
          JSON.stringify({ success: false, error: 'Insufficient permissions' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      return handler(request, auth)
    })
  }
}