import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWallet } from '@/src/hooks/use-wallet'
import { WalletService } from '@/lib/crypto/wallet-service'
import { SupportedWallet, Network } from '@/types/crypto-subscription'

// Mock WalletService
vi.mock('@/lib/crypto/wallet-service', () => ({
  WalletService: vi.fn().mockImplementation(() => ({
    detectWallets: vi.fn().mockResolvedValue(['metamask', 'phantom']),
    connectWallet: vi.fn().mockResolvedValue({
      walletType: 'metamask',
      address: '0x1234567890123456789012345678901234567890',
      network: 'ethereum',
      isConnected: true,
      balance: { ETH: '1.0', USDC: '0', USDT: '0', SOL: '0', MATIC: '0' },
      lastConnected: new Date()
    }),
    disconnect: vi.fn().mockResolvedValue(undefined),
    getBalance: vi.fn().mockResolvedValue({ ETH: '1.0', USDC: '100', USDT: '100', SOL: '0', MATIC: '0' }),
    getConnection: vi.fn().mockReturnValue(null),
    getSigner: vi.fn().mockReturnValue(null),
    getProvider: vi.fn().mockReturnValue(null),
    getSolanaConnection: vi.fn().mockReturnValue(null)
  }))
}))

describe('useWallet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWallet())

    expect(result.current.connection).toBeNull()
    expect(result.current.isConnected).toBe(false)
    expect(result.current.isConnecting).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.detectedWallets).toEqual([])
  })

  it('should detect wallets on mount', async () => {
    const { result } = renderHook(() => useWallet())

    // Wait for wallet detection
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.detectedWallets).toContain('metamask')
    expect(result.current.detectedWallets).toContain('phantom')
  })

  it('should connect wallet successfully', async () => {
    const { result } = renderHook(() => useWallet())

    await act(async () => {
      await result.current.connect('metamask', 'ethereum')
    })

    expect(result.current.isConnecting).toBe(false)
    expect(result.current.connection).toEqual({
      walletType: 'metamask',
      address: '0x1234567890123456789012345678901234567890',
      network: 'ethereum',
      isConnected: true,
      balance: { ETH: '1.0', USDC: '0', USDT: '0', SOL: '0', MATIC: '0' },
      lastConnected: expect.any(Date)
    })
    expect(result.current.error).toBeNull()
  })

  it('should handle connection errors', async () => {
    const mockWalletService = {
      detectWallets: vi.fn().mockResolvedValue(['metamask']),
      connectWallet: vi.fn().mockRejectedValue(new Error('Connection failed')),
      disconnect: vi.fn(),
      getBalance: vi.fn(),
      getConnection: vi.fn().mockReturnValue(null),
      getSigner: vi.fn().mockReturnValue(null),
      getProvider: vi.fn().mockReturnValue(null),
      getSolanaConnection: vi.fn().mockReturnValue(null)
    }

    vi.mocked(WalletService).mockImplementation(() => mockWalletService as any)

    const { result } = renderHook(() => useWallet())

    await act(async () => {
      try {
        await result.current.connect('metamask', 'ethereum')
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.isConnecting).toBe(false)
    expect(result.current.error).toEqual({
      code: 'UNKNOWN_ERROR',
      message: 'Connection failed',
      retryable: true,
      suggestedAction: 'Please try again'
    })
  })

  it('should disconnect wallet successfully', async () => {
    const { result } = renderHook(() => useWallet())

    // First connect
    await act(async () => {
      await result.current.connect('metamask', 'ethereum')
    })

    expect(result.current.isConnected).toBe(true)

    // Then disconnect
    await act(async () => {
      await result.current.disconnect()
    })

    expect(result.current.connection).toBeNull()
    expect(result.current.isConnected).toBe(false)
  })

  it('should get balance', async () => {
    const { result } = renderHook(() => useWallet())

    // First connect
    await act(async () => {
      await result.current.connect('metamask', 'ethereum')
    })

    const balance = await act(async () => {
      return await result.current.getBalance()
    })

    expect(balance).toEqual({
      ETH: '1.0',
      USDC: '100',
      USDT: '100',
      SOL: '0',
      MATIC: '0'
    })
  })

  it('should throw error when getting balance without connection', async () => {
    const { result } = renderHook(() => useWallet())

    await expect(result.current.getBalance()).rejects.toThrow('No wallet connected')
  })

  it('should clear error', () => {
    const { result } = renderHook(() => useWallet())

    // Manually set error
    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })

  it('should refresh balance', async () => {
    const { result } = renderHook(() => useWallet())

    // First connect
    await act(async () => {
      await result.current.connect('metamask', 'ethereum')
    })

    const initialBalance = result.current.connection?.balance

    await act(async () => {
      await result.current.refreshBalance()
    })

    // Balance should be updated (in real implementation, this would fetch fresh data)
    expect(result.current.connection?.balance).toBeDefined()
  })

  it('should handle refresh balance without connection', async () => {
    const { result } = renderHook(() => useWallet())

    await act(async () => {
      await result.current.refreshBalance()
    })

    // Should not throw error, just do nothing
    expect(result.current.connection).toBeNull()
  })
})
