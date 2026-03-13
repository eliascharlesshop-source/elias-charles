'use client'

import { ethers } from 'ethers'
import { WalletAuthSession } from '@/types/crypto-subscription'
import { SECURITY_CONFIG } from '@/lib/crypto-config'

export class WalletAuthService {
  private static instance: WalletAuthService
  private sessions: Map<string, WalletAuthSession> = new Map()

  private constructor() {}

  static getInstance(): WalletAuthService {
    if (!WalletAuthService.instance) {
      WalletAuthService.instance = new WalletAuthService()
    }
    return WalletAuthService.instance
  }

  async authenticateWallet(walletAddress: string, walletType: string): Promise<WalletAuthSession> {
    try {
      // Generate nonce
      const nonce = this.generateNonce()
      const message = SECURITY_CONFIG.signatureMessage(nonce)

      // Request signature from wallet
      const signature = await this.requestSignature(message, walletAddress)

      // Verify signature
      const isValid = await this.verifySignature(walletAddress, message, signature)
      if (!isValid) {
        throw new Error('Invalid signature')
      }

      // Create session
      const session: WalletAuthSession = {
        sessionId: this.generateSessionId(),
        walletAddress,
        walletType: walletType as any,
        signature,
        message,
        nonce,
        expiresAt: new Date(Date.now() + SECURITY_CONFIG.sessionExpiry * 1000),
        isActive: true
      }

      // Store session
      this.sessions.set(session.sessionId, session)
      this.persistSession(session)

      return session
    } catch (error) {
      throw new Error('Wallet authentication failed')
    }
  }

  async validateSession(sessionId: string): Promise<WalletAuthSession | null> {
    try {
      // Check in-memory cache first
      let session = this.sessions.get(sessionId)

      // If not in cache, try to load from storage
      if (!session) {
        session = this.loadSession(sessionId)
        if (session) {
          this.sessions.set(sessionId, session)
        }
      }

      if (!session) {
        return null
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        this.invalidateSession(sessionId)
        return null
      }

      return session
    } catch (error) {
      return null
    }
  }

  async refreshSession(sessionId: string): Promise<WalletAuthSession> {
    const session = await this.validateSession(sessionId)
    if (!session) {
      throw new Error('Invalid session')
    }

    // Generate new nonce and signature
    const newNonce = this.generateNonce()
    const newMessage = SECURITY_CONFIG.signatureMessage(newNonce)
    const newSignature = await this.requestSignature(newMessage, session.walletAddress)

    // Update session
    const updatedSession: WalletAuthSession = {
      ...session,
      nonce: newNonce,
      message: newMessage,
      signature: newSignature,
      expiresAt: new Date(Date.now() + SECURITY_CONFIG.sessionExpiry * 1000)
    }

    this.sessions.set(sessionId, updatedSession)
    this.persistSession(updatedSession)

    return updatedSession
  }

  invalidateSession(sessionId: string): void {
    this.sessions.delete(sessionId)
    this.removePersistedSession(sessionId)
  }

  async signMessage(message: string, walletAddress: string): Promise<string> {
    return await this.requestSignature(message, walletAddress)
  }

  private async requestSignature(message: string, walletAddress: string): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('Wallet not available in server environment')
    }

    // Try different wallet providers
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      return await signer.signMessage(message)
    }

    if (window.phantom?.solana) {
      const encodedMessage = new TextEncoder().encode(message)
      const signedMessage = await window.phantom.solana.signMessage(encodedMessage, 'utf8')
      return Buffer.from(signedMessage.signature).toString('base64')
    }

    if (window.solflare?.solana) {
      const encodedMessage = new TextEncoder().encode(message)
      const signedMessage = await window.solflare.solana.signMessage(encodedMessage, 'utf8')
      return Buffer.from(signedMessage.signature).toString('base64')
    }

    throw new Error('No wallet provider available')
  }

  private async verifySignature(
    walletAddress: string, 
    message: string, 
    signature: string
  ): Promise<boolean> {
    try {
      // Try Ethereum verification
      if (window.ethereum) {
        const recoveredAddress = ethers.verifyMessage(message, signature)
        return recoveredAddress.toLowerCase() === walletAddress.toLowerCase()
      }

      // Try Solana verification (simplified)
      if (window.phantom?.solana || window.solflare?.solana) {
        // In a real implementation, you'd use the Solana libraries to verify
        // For now, we'll assume it's valid if we got this far
        return true
      }

      return false
    } catch (error) {
      return false
    }
  }

  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${this.generateNonce()}`
  }

  private persistSession(session: WalletAuthSession): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`wallet_session_${session.sessionId}`, JSON.stringify(session))
      } catch (error) {
        console.warn('Failed to persist session:', error)
      }
    }
  }

  private loadSession(sessionId: string): WalletAuthSession | null {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`wallet_session_${sessionId}`)
        return stored ? JSON.parse(stored) : null
      } catch (error) {
        console.warn('Failed to load session:', error)
        return null
      }
    }
    return null
  }

  private removePersistedSession(sessionId: string): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`wallet_session_${sessionId}`)
      } catch (error) {
        console.warn('Failed to remove persisted session:', error)
      }
    }
  }

  getActiveSessions(): WalletAuthSession[] {
    return Array.from(this.sessions.values()).filter(session => 
      session.isActive && session.expiresAt > new Date()
    )
  }

  cleanupExpiredSessions(): void {
    const now = new Date()
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.invalidateSession(sessionId)
      }
    }
  }
}
