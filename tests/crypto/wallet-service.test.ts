import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import { WalletService } from '@/lib/crypto/wallet-service'
import { SupportedWallet, Network, Cryptocurrency } from '@/types/crypto-subscription'

// Mock window object
const mockWindow = {
  ethereum: {
    isMetaMask: true,
    request: vi.fn(),
    enable: vi.fn()
  },
  phantom: {
    solana: {
      isPhantom: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      signMessage: vi.fn()
    }
  },
  solflare: {
    solana: {
      isSolflare: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      signMessage: vi.fn()
    }
  }
}

// Mock ethers
vi.mock('ethers', () => ({
  BrowserProvider: vi.fn().mockImplementation(() => ({
    getSigner: vi.fn().mockResolvedValue({
      getAddress: vi.fn().mockResolvedValue('0x1234567890123456789012345678901234567890'),
      sendTransaction: vi.fn().mockResolvedValue({
        hash: '0xabcdef1234567890'
      })
    }),
    getBalance: vi.fn().mockResolvedValue(BigInt('1000000000000000000')),
    estimateGas: vi.fn().mockResolvedValue(BigInt('21000')),
    getFeeData: vi.fn().mockResolvedValue({
      gasPrice: BigInt('20000000000'),
      maxFeePerGas: BigInt('30000000000'),
      maxPriorityFeePerGas: BigInt('2000000000')
    }),
    waitForTransaction: vi.fn().mockResolvedValue({
      status: 1,
      blockNumber: 12345,
      blockHash: '0x1234567890abcdef',
      confirmations: 12,
      gasUsed: BigInt('21000'),
      effectiveGasPrice: BigInt('20000000000')
    })
  })),
  JsonRpcSigner: vi.fn(),
  formatEther: vi.fn((value) => (Number(value) / 1e18).toString()),
  parseEther: vi.fn((value) => BigInt(Number(value) * 1e18)),
  Interface: vi.fn().mockImplementation(() => ({
    encodeFunctionData: vi.fn().mockReturnValue('0x12345678')
  })),
  verifyMessage: vi.fn().mockReturnValue('0x1234567890123456789012345678901234567890')
}))

// Mock Solana web3
vi.mock('@solana/web3.js', () => ({
  Connection: vi.fn().mockImplementation(() => ({
    getBalance: vi.fn().mockResolvedValue(1000000000),
    getLatestBlockhash: vi.fn().mockResolvedValue({
      blockhash: 'abc123'
    }),
    confirmTransaction: vi.fn().mockResolvedValue({ value: { err: null } }),
    getTransaction: vi.fn().mockResolvedValue({ slot: 12345 })
  })),
  PublicKey: vi.fn().mockImplementation(() => ({
    toString: vi.fn().mockReturnValue('SolanaPublicKey123456789')
  })),
  Transaction: vi.fn().mockImplementation(() => ({
    add: vi.fn().mockReturnThis(),
    recentBlockhash: '',
    feePayer: null
  })),
  SystemProgram: {
    transfer: vi.fn().mockReturnValue({
      publicKey: 'SolanaPublicKey123456789',
      lamports: 1000000000
    })
  }
}))

describe('WalletService', () => {
  let walletService: WalletService

  beforeEach(() => {
    // Setup global window mock
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true
    })

    walletService = WalletService.getInstance()
    vi.clearAllMocks()
  })

  describe('detectWallets', () => {
    it('should detect MetaMask wallet', async () => {
      const detected = await walletService.detectWallets()
      expect(detected).toContain('metamask')
    })

    it('should detect Phantom wallet', async () => {
      const detected = await walletService.detectWallets()
      expect(detected).toContain('phantom')
    })

    it('should detect Solflare wallet', async () => {
      const detected = await walletService.detectWallets()
      expect(detected).toContain('solflare')
    })

    it('should return empty array when no wallets installed', async () => {
      // Mock no wallets installed
      global.window.ethereum = undefined
      global.window.phantom = undefined
      global.window.solflare = undefined

      const detected = await walletService.detectWallets()
      expect(detected).toEqual([])
    })
  })

  describe('connectWallet', () => {
    it('should connect MetaMask wallet successfully', async () => {
      const mockRequest = mockWindow.ethereum.request as Mock
      mockRequest.mockResolvedValue(['0x1234567890123456789012345678901234567890'])

      const connection = await walletService.connectWallet('metamask', 'ethereum')

      expect(connection).toEqual({
        walletType: 'metamask',
        address: '0x1234567890123456789012345678901234567890',
        network: 'ethereum',
        isConnected: true,
        balance: expect.objectContaining({
          ETH: expect.any(String)
        }),
        lastConnected: expect.any(Date)
      })

      expect(mockRequest).toHaveBeenCalledWith({ method: 'eth_requestAccounts' })
    })

    it('should connect Phantom wallet successfully', async () => {
      const mockConnect = mockWindow.phantom.solana.connect as Mock
      mockConnect.mockResolvedValue({
        publicKey: { toString: vi.fn().mockReturnValue('SolanaPublicKey123456789') }
      })

      const connection = await walletService.connectWallet('phantom', 'solana')

      expect(connection).toEqual({
        walletType: 'phantom',
        address: 'SolanaPublicKey123456789',
        network: 'solana',
        isConnected: true,
        balance: expect.objectContaining({
          SOL: expect.any(String)
        }),
        lastConnected: expect.any(Date)
      })

      expect(mockConnect).toHaveBeenCalled()
    })

    it('should throw error when wallet not installed', async () => {
      global.window.ethereum = undefined

      await expect(walletService.connectWallet('metamask', 'ethereum'))
        .rejects.toThrow('WALLET_NOT_INSTALLED')
    })

    it('should throw error when network not supported', async () => {
      await expect(walletService.connectWallet('metamask', 'solana'))
        .rejects.toThrow('NETWORK_NOT_SUPPORTED')
    })
  })

  describe('disconnectWallet', () => {
    it('should disconnect wallet successfully', async () => {
      // First connect
      const mockRequest = mockWindow.ethereum.request as Mock
      mockRequest.mockResolvedValue(['0x1234567890123456789012345678901234567890'])
      await walletService.connectWallet('metamask', 'ethereum')

      // Then disconnect
      await walletService.disconnectWallet()

      expect(walletService.getConnection()).toBeNull()
    })
  })

  describe('getBalance', () => {
    beforeEach(async () => {
      const mockRequest = mockWindow.ethereum.request as Mock
      mockRequest.mockResolvedValue(['0x1234567890123456789012345678901234567890'])
      await walletService.connectWallet('metamask', 'ethereum')
    })

    it('should get Ethereum balance', async () => {
      const balance = await walletService.getBalance('0x1234567890123456789012345678901234567890', 'ethereum')

      expect(balance).toEqual({
        ETH: expect.any(String),
        USDC: '0',
        USDT: '0',
        SOL: '0',
        MATIC: '0'
      })
    })

    it('should throw error when wallet not connected', async () => {
      await walletService.disconnectWallet()

      await expect(walletService.getBalance('0x1234567890123456789012345678901234567890', 'ethereum'))
        .rejects.toThrow('WALLET_NOT_CONNECTED')
    })
  })

  describe('estimateGas', () => {
    beforeEach(async () => {
      const mockRequest = mockWindow.ethereum.request as Mock
      mockRequest.mockResolvedValue(['0x1234567890123456789012345678901234567890'])
      await walletService.connectWallet('metamask', 'ethereum')
    })

    it('should estimate gas for transaction', async () => {
      const estimate = await walletService.estimateGas(
        '0x1234567890123456789012345678901234567890',
        '0.1'
      )

      expect(estimate).toEqual({
        gasLimit: expect.any(String),
        gasPrice: expect.any(String),
        maxFeePerGas: expect.any(String),
        maxPriorityFeePerGas: expect.any(String),
        estimatedCost: expect.any(String),
        estimatedCostUSD: expect.any(Number),
        network: 'ethereum'
      })
    })
  })

  describe('sendTransaction', () => {
    beforeEach(async () => {
      const mockRequest = mockWindow.ethereum.request as Mock
      mockRequest.mockResolvedValue(['0x1234567890123456789012345678901234567890'])
      await walletService.connectWallet('metamask', 'ethereum')
    })

    it('should send transaction successfully', async () => {
      const hash = await walletService.sendTransaction(
        '0x1234567890123456789012345678901234567890',
        '0.1'
      )

      expect(hash).toBe('0xabcdef1234567890')
    })
  })

  describe('waitForConfirmation', () => {
    beforeEach(async () => {
      const mockRequest = mockWindow.ethereum.request as Mock
      mockRequest.mockResolvedValue(['0x1234567890123456789012345678901234567890'])
      await walletService.connectWallet('metamask', 'ethereum')
    })

    it('should wait for transaction confirmation', async () => {
      const confirmation = await walletService.waitForConfirmation('0xabcdef1234567890', 'ethereum')

      expect(confirmation).toEqual({
        status: 1,
        blockNumber: 12345,
        blockHash: '0x1234567890abcdef',
        confirmations: 12,
        gasUsed: BigInt('21000'),
        effectiveGasPrice: BigInt('20000000000')
      })
    })
  })
})
