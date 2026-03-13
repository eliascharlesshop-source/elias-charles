import { AuditLog } from '@/types/crypto-subscription'
import * as crypto from 'crypto'

export class SecurityService {
  private static instance: SecurityService
  private auditLogs: AuditLog[] = []
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map()

  private constructor() {}

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService()
    }
    return SecurityService.instance
  }

  async logAuditEvent(
    action: string,
    resource: string,
    details: Record<string, any>,
    userId?: string,
    walletAddress?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const auditLog: AuditLog = {
      id: this.generateAuditId(),
      userId,
      walletAddress,
      action,
      resource,
      details: this.sanitizeDetails(details),
      ipAddress: ipAddress || this.getClientIP(),
      userAgent: userAgent || this.getClientUserAgent(),
      timestamp: new Date(),
      severity
    }

    this.auditLogs.push(auditLog)
    
    // In production, this would:
    // 1. Save to database with proper indexing
    // 2. Send to logging service (e.g., ELK stack, Datadog)
    // 3. Set up alerts for high-severity events
    // 4. Implement log retention policies

    // Trigger alerts for critical events
    if (severity === 'critical') {
      await this.triggerSecurityAlert(auditLog)
    }

    // Clean up old logs (retention policy)
    this.cleanupOldLogs()
  }

  async validateInput(input: string, type: 'wallet' | 'transaction' | 'session' | 'general'): Promise<{ isValid: boolean; error?: string }> {
    const patterns = {
      wallet: /^0x[a-fA-F0-9]{40}$|^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      transaction: /^0x[a-fA-F0-9]{64}$|^[1-9A-HJ-NP-Za-km-z]{88}$/,
      session: /^[a-zA-Z0-9_-]{20,50}$/,
      general: /^[\w\s\-\.@#$%^&*()+=\[\]{}|;:'",<>/?\\`~]{0,1000}$/
    }

    const pattern = patterns[type]
    if (!pattern.test(input)) {
      return {
        isValid: false,
        error: `Invalid ${type} format`
      }
    }

    // Check for common attack patterns
    const attackPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      /union\s+select/gi,
      /drop\s+table/gi,
      /insert\s+into/gi,
      /delete\s+from/gi
    ]

    for (const attackPattern of attackPatterns) {
      if (attackPattern.test(input)) {
        await this.logAuditEvent(
          'security_violation',
          'input_validation',
          { input: input.substring(0, 100), type, pattern: attackPattern.source },
          undefined,
          undefined,
          'high'
        )
        return {
          isValid: false,
          error: 'Potentially malicious input detected'
        }
      }
    }

    return { isValid: true }
  }

  async checkRateLimit(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 900000 // 15 minutes
  ): Promise<{ allowed: boolean; resetTime?: number }> {
    const now = Date.now()
    const key = identifier

    const current = this.rateLimitMap.get(key)
    
    if (!current || now > current.resetTime) {
      // Reset or create new limit
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return { allowed: true }
    }

    if (current.count >= maxRequests) {
      await this.logAuditEvent(
        'rate_limit_exceeded',
        'rate_limiting',
        { 
          identifier: identifier.substring(0, 20), 
          count: current.count, 
          maxRequests,
          resetTime: new Date(current.resetTime)
        },
        undefined,
        undefined,
        'medium'
      )
      return { 
        allowed: false, 
        resetTime: current.resetTime 
      }
    }

    current.count++
    return { allowed: true }
  }

  async detectSuspiciousActivity(
    walletAddress: string,
    action: string,
    details: Record<string, any>
  ): Promise<{ isSuspicious: boolean; riskScore: number; reasons: string[] }> {
    const reasons: string[] = []
    let riskScore = 0

    // Check for rapid successive transactions
    const recentLogs = this.auditLogs.filter(log => 
      log.walletAddress === walletAddress &&
      log.action === action &&
      (Date.now() - log.timestamp.getTime()) < 60000 // Last minute
    )

    if (recentLogs.length > 5) {
      reasons.push('High frequency transactions')
      riskScore += 30
    }

    // Check for unusual transaction amounts
    if (details.amount) {
      const amount = parseFloat(details.amount)
      if (amount > 10) { // Unusually high amount
        reasons.push('Unusually high transaction amount')
        riskScore += 25
      }
      if (amount < 0.001) { // Unusually low amount (dusting)
        reasons.push('Unusually low transaction amount (dusting)')
        riskScore += 20
      }
    }

    // Check for multiple failed attempts
    const failedAttempts = this.auditLogs.filter(log =>
      log.walletAddress === walletAddress &&
      log.details.error &&
      (Date.now() - log.timestamp.getTime()) < 300000 // Last 5 minutes
    ).length

    if (failedAttempts > 3) {
      reasons.push('Multiple failed attempts')
      riskScore += 40
    }

    // Check for new wallet activity
    const walletAge = this.auditLogs.filter(log =>
      log.walletAddress === walletAddress
    ).length

    if (walletAge <= 2) {
      reasons.push('New wallet activity')
      riskScore += 15
    }

    const isSuspicious = riskScore > 50

    if (isSuspicious) {
      await this.logAuditEvent(
        'suspicious_activity_detected',
        'fraud_detection',
        { 
          walletAddress: walletAddress.substring(0, 10) + '...', 
          action, 
          riskScore, 
          reasons 
        },
        undefined,
        walletAddress,
        riskScore > 75 ? 'high' : 'medium'
      )
    }

    return { isSuspicious, riskScore, reasons }
  }

  async generateSecureNonce(): Promise<string> {
    return crypto.randomBytes(32).toString('hex')
  }

  async hashSensitiveData(data: string): Promise<string> {
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  async encryptSensitiveData(data: string, key: string): Promise<string> {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return iv.toString('hex') + ':' + encrypted
  }

  async decryptSensitiveData(encryptedData: string, key: string): Promise<string> {
    const parts = encryptedData.split(':')
    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = parts[1]
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }

  private sanitizeDetails(details: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(details)) {
      // Remove sensitive information from logs
      if (key.toLowerCase().includes('private') || 
          key.toLowerCase().includes('secret') ||
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('key')) {
        sanitized[key] = '[REDACTED]'
      } else if (typeof value === 'string' && value.length > 500) {
        // Truncate long strings
        sanitized[key] = value.substring(0, 500) + '...'
      } else {
        sanitized[key] = value
      }
    }
    
    return sanitized
  }

  private async triggerSecurityAlert(auditLog: AuditLog): Promise<void> {
    // In production, this would:
    // 1. Send alerts to security team
    // 2. Integrate with SIEM systems
    // 3. Trigger automated responses
    // 4. Create incident tickets
    
    console.error('SECURITY ALERT:', auditLog)
  }

  private cleanupOldLogs(): void {
    const retentionDays = 90
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)
    
    this.auditLogs = this.auditLogs.filter(log => log.timestamp > cutoffDate)
  }

  private generateAuditId(): string {
    return `audit_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
  }

  private getClientIP(): string {
    // In a real implementation, this would get the IP from request headers
    return '0.0.0.0'
  }

  private getClientUserAgent(): string {
    // In a real implementation, this would get the User-Agent from request headers
    return 'security-service'
  }

  getAuditLogs(filters?: {
    userId?: string
    walletAddress?: string
    action?: string
    severity?: string
    startDate?: Date
    endDate?: Date
  }): AuditLog[] {
    let filtered = [...this.auditLogs]

    if (filters) {
      if (filters.userId) {
        filtered = filtered.filter(log => log.userId === filters.userId)
      }
      if (filters.walletAddress) {
        filtered = filtered.filter(log => log.walletAddress === filters.walletAddress)
      }
      if (filters.action) {
        filtered = filtered.filter(log => log.action === filters.action)
      }
      if (filters.severity) {
        filtered = filtered.filter(log => log.severity === filters.severity)
      }
      if (filters.startDate) {
        filtered = filtered.filter(log => log.timestamp >= filters.startDate!)
      }
      if (filters.endDate) {
        filtered = filtered.filter(log => log.timestamp <= filters.endDate!)
      }
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  getSecurityMetrics(): {
    totalLogs: number
    criticalEvents: number
    highSeverityEvents: number
    suspiciousActivities: number
    rateLimitViolations: number
  } {
    const totalLogs = this.auditLogs.length
    const criticalEvents = this.auditLogs.filter(log => log.severity === 'critical').length
    const highSeverityEvents = this.auditLogs.filter(log => log.severity === 'high').length
    const suspiciousActivities = this.auditLogs.filter(log => log.action === 'suspicious_activity_detected').length
    const rateLimitViolations = this.auditLogs.filter(log => log.action === 'rate_limit_exceeded').length

    return {
      totalLogs,
      criticalEvents,
      highSeverityEvents,
      suspiciousActivities,
      rateLimitViolations
    }
  }
}
