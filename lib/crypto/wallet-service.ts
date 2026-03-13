'use client'

import { ethers } from 'ethers'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { 
  WalletConnection, 
  SupportedWallet, 
  Network, 
  Cryptocurrency,
  GasEstimate,
  PaymentProcessingError,
  ERROR_CODES
} from '@/types/crypto-subscription'
import { SUPPORTED_NETWORKS, WALLET_CONFIGS, PAYMENT_PROCESSING_CONFIG } from '@/lib/crypto-config'

declare global {
  interface Window {
    ethereum?: any
    solana?: any
    phantom?: any
    solflare?: any
  }
}

export class WalletService {
  private static instance: WalletService
  private connection: WalletConnection | null = null
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private solanaConnection: Connection | null = null

  private constructor() {}

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService()
    }
    return WalletService.instance
  }

  async detectWallets(): Promise<SupportedWallet[]> {
    const detected: SupportedWallet[] = []
    
    if (typeof window !== 'undefined') {
      if (window.ethereum?.isMetaMask) {
        detected.push('metamask')
      }
      if (window.phantom?.solana?.isPhantom) {
        detected.push('phantom')
      }
      if (window.solana?.isSolflare || window.solflare?.solana?.isSolflare) {
        detected.push('solflare')
      }
    }
    
    return detected
  }

  async connectWallet(walletType: SupportedWallet, network: Network): Promise<WalletConnection> {
    try {
      this.validateWalletNetwork(walletType, network)

      switch (walletType) {
        case 'metamask':
          return await this.connectMetaMask(network)
        case 'phantom':
          return await this.connectPhantom(network)
        case 'solflare':
          return await this.connectSolflare(network)
        default:
          throw new Error(ERROR_CODES.WALLET_NOT_INSTALLED)
      }
    } catch (error) {
      this.handleWalletError(error)
      throw error
    }
  }

  private async connectMetaMask(network: Network): Promise<WalletConnection> {
    if (!window.ethereum) {
      throw new Error(ERROR_CODES.WALLET_NOT_INSTALLED)
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      
      const address = await this.signer.getAddress()
      const balance = await this.getEthereumBalance(address, network)
      
      // Switch to correct network if needed
      await this.switchEthereumNetwork(network)

      this.connection = {
        walletType: 'metamask',
        address,
        network,
        isConnected: true,
        balance,
        lastConnected: new Date()
      }

      return this.connection
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error(ERROR_CODES.TRANSACTION_REJECTED)
      }
      throw error
    }
  }

  private async connectPhantom(network: Network): Promise<WalletConnection> {
    if (!window.phantom?.solana?.isPhantom) {
      throw new Error(ERROR_CODES.WALLET_NOT_INSTALLED)
    }

    try {
      const phantom = window.phantom.solana
      
      // Connect to Phantom
      const response = await phantom.connect()
      const address = response.publicKey.toString()
      
      // Initialize Solana connection
      this.solanaConnection = new Connection(
        SUPPORTED_NETWORKS.find(n => n.name === network)?.rpcUrl || clusterApiUrl('mainnet-beta')
      )
      
      const balance = await this.getSolanaBalance(address, network)

      this.connection = {
        walletType: 'phantom',
        address,
        network,
        isConnected: true,
        balance,
        lastConnected: new Date()
      }

      return this.connection
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error(ERROR_CODES.TRANSACTION_REJECTED)
      }
      throw error
    }
  }

  private async connectSolflare(network: Network): Promise<WalletConnection> {
    if (!window.solflare?.solana?.isSolflare && !window.solana?.isSolflare) {
      throw new Error(ERROR_CODES.WALLET_NOT_INSTALLED)
    }

    try {
      const solflare = window.solflare?.solana || window.solana
      
      // Connect to Solflare
      const response = await solflare.connect()
      const address = response.publicKey.toString()
      
      // Initialize Solana connection
      this.solanaConnection = new Connection(
        SUPPORTED_NETWORKS.find(n => n.name === network)?.rpcUrl || clusterApiUrl('mainnet-beta')
      )
      
      const balance = await this.getSolanaBalance(address, network)

      this.connection = {
        walletType: 'solflare',
        address,
        network,
        isConnected: true,
        balance,
        lastConnected: new Date()
      }

      return this.connection
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error(ERROR_CODES.TRANSACTION_REJECTED)
      }
      throw error
    }
  }

  async disconnectWallet(): Promise<void> {
    if (this.connection) {
      try {
        switch (this.connection.walletType) {
          case 'metamask':
            // MetaMask doesn't have a programmatic disconnect method
            break
          case 'phantom':
            await window.phantom?.solana?.disconnect()
            break
          case 'solflare':
            await (window.solflare?.solana || window.solana)?.disconnect()
            break
        }
      } catch (error) {
        console.warn('Error disconnecting wallet:', error)
      }
    }

    this.connection = null
    this.provider = null
    this.signer = null
    this.solanaConnection = null
  }

  async getBalance(address: string, network: Network): Promise<Record<Cryptocurrency, string>> {
    if (['ethereum', 'polygon', 'arbitrum'].includes(network)) {
      return await this.getEthereumBalance(address, network)
    } else if (network === 'solana') {
      return await this.getSolanaBalance(address, network)
    }
    throw new Error(ERROR_CODES.NETWORK_NOT_SUPPORTED)
  }

  private async getEthereumBalance(address: string, network: Network): Promise<Record<Cryptocurrency, string>> {
    if (!this.provider) {
      throw new Error(ERROR_CODES.WALLET_NOT_CONNECTED)
    }

    const networkConfig = SUPPORTED_NETWORKS.find(n => n.name === network)
    if (!networkConfig) {
      throw new Error(ERROR_CODES.NETWORK_NOT_SUPPORTED)
    }

    try {
      const balance = await this.provider.getBalance(address)
      
      return {
        ETH: ethers.formatEther(balance),
        USDC: '0', // Would need token contract address
        USDT: '0', // Would need token contract address
        SOL: '0',
        MATIC: network === 'polygon' ? ethers.formatEther(balance) : '0'
      }
    } catch (error) {
      throw new Error(ERROR_CODES.NETWORK_ERROR)
    }
  }

  private async getSolanaBalance(address: string, network: Network): Promise<Record<Cryptocurrency, string>> {
    if (!this.solanaConnection) {
      throw new Error(ERROR_CODES.WALLET_NOT_CONNECTED)
    }

    try {
      const publicKey = new PublicKey(address)
      const balance = await this.solanaConnection.getBalance(publicKey)
      
      return {
        SOL: (balance / 1e9).toString(),
        USDC: '0', // Would need token mint address
        USDT: '0', // Would need token mint address
        ETH: '0',
        MATIC: '0'
      }
    } catch (error) {
      throw new Error(ERROR_CODES.NETWORK_ERROR)
    }
  }

  async estimateGas(
    to: string, 
    value: string, 
    data: string = '0x', 
    network: Network
  ): Promise<GasEstimate> {
    if (!this.provider || !this.signer) {
      throw new Error(ERROR_CODES.WALLET_NOT_CONNECTED)
    }

    try {
      const networkConfig = SUPPORTED_NETWORKS.find(n => n.name === network)
      if (!networkConfig) {
        throw new Error(ERROR_CODES.NETWORK_NOT_SUPPORTED)
      }

      const gasLimit = await this.provider.estimateGas({
        to,
        value: ethers.parseEther(value),
        data
      })

      const feeData = await this.provider.getFeeData()
      const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei')
      
      const estimatedCost = gasLimit * gasPrice
      const estimatedCostUSD = await this.convertGasToUSD(estimatedCost.toString(), network)

      return {
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toString(),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
        estimatedCost: ethers.formatEther(estimatedCost),
        estimatedCostUSD,
        network
      }
    } catch (error) {
      throw new Error(ERROR_CODES.GAS_ESTIMATION_FAILED)
    }
  }

  async sendTransaction(
    to: string,
    value: string,
    data: string = '0x'
  ): Promise<string> {
    if (!this.signer) {
      throw new Error(ERROR_CODES.WALLET_NOT_CONNECTED)
    }

    try {
      const transaction = await this.signer.sendTransaction({
        to,
        value: ethers.parseEther(value),
        data
      })

      return transaction.hash
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error(ERROR_CODES.TRANSACTION_REJECTED)
      }
      throw new Error(ERROR_CODES.TRANSACTION_FAILED)
    }
  }

  async waitForConfirmation(
    hash: string,
    network: Network,
    confirmations?: number
  ): Promise<any> {
    if (!this.provider) {
      throw new Error(ERROR_CODES.WALLET_NOT_CONNECTED)
    }

    try {
      const networkConfig = SUPPORTED_NETWORKS.find(n => n.name === network)
      const requiredConfirmations = confirmations || networkConfig?.confirmations.standard || 12

      const receipt = await this.provider.waitForTransaction(hash, requiredConfirmations)
      return receipt
    } catch (error) {
      throw new Error(ERROR_CODES.CONFIRMATION_TIMEOUT)
    }
  }

  private async switchEthereumNetwork(network: Network): Promise<void> {
    if (!window.ethereum) return

    const networkConfig = SUPPORTED_NETWORKS.find(n => n.name === network)
    if (!networkConfig) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${networkConfig.chainId.toString(16)}` }]
      })
    } catch (error: any) {
      // Network not added, try to add it
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${networkConfig.chainId.toString(16)}`,
            chainName: networkConfig.name.charAt(0).toUpperCase() + networkConfig.name.slice(1),
            rpcUrls: [networkConfig.rpcUrl],
            blockExplorerUrls: [networkConfig.blockExplorerUrl],
            nativeCurrency: networkConfig.nativeCurrency
          }]
        })
      }
    }
  }

  private validateWalletNetwork(walletType: SupportedWallet, network: Network): void {
    const walletConfig = WALLET_CONFIGS[walletType]
    if (!walletConfig.supportedNetworks.includes(network)) {
      throw new Error(ERROR_CODES.NETWORK_NOT_SUPPORTED)
    }
  }

  private async convertGasToUSD(gasCost: string, network: Network): Promise<number> {
    // This would integrate with a price oracle API
    // For now, return a placeholder value
    const ethPriceUSD = 2000 // Placeholder
    const gasCostETH = parseFloat(gasCost)
    return gasCostETH * ethPriceUSD
  }

  private handleWalletError(error: any): PaymentProcessingError {
    if (error.code === 4001) {
      return {
        code: ERROR_CODES.TRANSACTION_REJECTED,
        message: 'Transaction rejected by user',
        retryable: false,
        suggestedAction: 'Try again if you wish to proceed'
      }
    }

    if (error.code === -32603) {
      return {
        code: ERROR_CODES.INSUFFICIENT_BALANCE,
        message: 'Insufficient balance for transaction',
        retryable: true,
        suggestedAction: 'Add more funds to your wallet'
      }
    }

    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: 'Network error occurred',
      retryable: true,
      suggestedAction: 'Check your connection and try again'
    }
  }

  getConnection(): WalletConnection | null {
    return this.connection
  }

  isConnected(): boolean {
    return this.connection?.isConnected || false
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider
  }

  getSolanaConnection(): Connection | null {
    return this.solanaConnection
  }
}
