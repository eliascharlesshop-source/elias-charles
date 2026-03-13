'use client'

import { useState, useEffect, useCallback } from 'react'
import { WalletService } from '@/lib/crypto/wallet-service'
import { 
  WalletConnection, 
  SupportedWallet, 
  Network, 
  Cryptocurrency,
  PaymentProcessingError 
} from '@/types/crypto-subscription'

interface UseWalletReturn {
  connection: WalletConnection | null
  isConnected: boolean
  isConnecting: boolean
  error: PaymentProcessingError | null
  detectedWallets: SupportedWallet[]
  connect: (walletType: SupportedWallet, network: Network) => Promise<void>
  disconnect: () => Promise<void>
  getBalance: () => Promise<Record<Cryptocurrency, string>>
  refreshBalance: () => Promise<void>
  clearError: () => void
}

export function useWallet(): UseWalletReturn {
  const [connection, setConnection] = useState<WalletConnection | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<PaymentProcessingError | null>(null)
  const [detectedWallets, setDetectedWallets] = useState<SupportedWallet[]>([])

  const walletService = WalletService.getInstance()

  useEffect(() => {
    const detectWallets = async () => {
      try {
        const wallets = await walletService.detectWallets()
        setDetectedWallets(wallets)
      } catch (error) {
        console.error('Error detecting wallets:', error)
      }
    }

    detectWallets()
  }, [])

  useEffect(() => {
    // Check for existing connection on mount
    const existingConnection = walletService.getConnection()
    if (existingConnection) {
      setConnection(existingConnection)
    }
  }, [])

  const connect = useCallback(async (walletType: SupportedWallet, network: Network) => {
    setIsConnecting(true)
    setError(null)

    try {
      const newConnection = await walletService.connectWallet(walletType, network)
      setConnection(newConnection)
    } catch (err: any) {
      const error: PaymentProcessingError = {
        code: err.code || 'UNKNOWN_ERROR',
        message: err.message || 'Failed to connect wallet',
        retryable: err.retryable || true,
        suggestedAction: err.suggestedAction || 'Please try again'
      }
      setError(error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      await walletService.disconnectWallet()
      setConnection(null)
      setError(null)
    } catch (err: any) {
      console.error('Error disconnecting wallet:', err)
    }
  }, [])

  const getBalance = useCallback(async (): Promise<Record<Cryptocurrency, string>> => {
    if (!connection) {
      throw new Error('No wallet connected')
    }

    try {
      return await walletService.getBalance(connection.address, connection.network)
    } catch (err: any) {
      const error: PaymentProcessingError = {
        code: err.code || 'BALANCE_ERROR',
        message: err.message || 'Failed to get balance',
        retryable: true,
        suggestedAction: 'Try refreshing the balance'
      }
      setError(error)
      throw error
    }
  }, [connection])

  const refreshBalance = useCallback(async () => {
    if (!connection) return

    try {
      const balance = await getBalance()
      setConnection(prev => prev ? { ...prev, balance } : null)
    } catch (error) {
      console.error('Error refreshing balance:', error)
    }
  }, [connection, getBalance])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    connection,
    isConnected: connection?.isConnected || false,
    isConnecting,
    error,
    detectedWallets,
    connect,
    disconnect,
    getBalance,
    refreshBalance,
    clearError
  }
}
