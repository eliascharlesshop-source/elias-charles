import { ethers } from 'ethers'
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { 
  SubscriptionTransaction,
  TransactionConfirmation,
  CryptoSubscriptionPlan,
  GasEstimate,
  PaymentProcessingError,
  ERROR_CODES,
  Cryptocurrency,
  Network
} from '@/types/crypto-subscription'
import { WalletService } from './wallet-service'
import { SUPPORTED_NETWORKS, PAYMENT_PROCESSING_CONFIG, SUBSCRIPTION_PLANS_CRYPTO } from '@/lib/crypto-config'

export class PaymentService {
  private static instance: PaymentService
  private walletService: WalletService

  private constructor() {
    this.walletService = WalletService.getInstance()
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  async createSubscription(
    planId: string,
    walletAddress: string,
    currency: Cryptocurrency,
    network: Network
  ): Promise<SubscriptionTransaction> {
    try {
      const plan = SUBSCRIPTION_PLANS_CRYPTO.find(p => p.id === planId)
      if (!plan) {
        throw new Error('Invalid subscription plan')
      }

      if (!plan.supportedCurrencies.includes(currency)) {
        throw new Error(ERROR_CODES.NETWORK_NOT_SUPPORTED)
      }

      if (!plan.supportedNetworks.includes(network)) {
        throw new Error(ERROR_CODES.NETWORK_NOT_SUPPORTED)
      }

      const transaction = await this.initiatePayment(plan, walletAddress, currency, network)
      
      return {
        id: this.generateTransactionId(),
        subscriptionId: this.generateSubscriptionId(),
        userId: walletAddress, // In wallet-first architecture, wallet address is the user ID
        walletAddress,
        planId,
        amount: plan.price.amount,
        currency,
        network,
        transactionHash: '',
        status: 'pending',
        confirmation: this.createEmptyConfirmation(),
        createdAt: new Date(),
        autoRenew: true
      }
    } catch (error) {
      throw this.handlePaymentError(error)
    }
  }

  async processPayment(
    transaction: SubscriptionTransaction
  ): Promise<string> {
    try {
      const plan = SUBSCRIPTION_PLANS_CRYPTO.find(p => p.id === transaction.planId)
      if (!plan) {
        throw new Error('Invalid subscription plan')
      }

      let transactionHash: string

      if (['ethereum', 'polygon', 'arbitrum'].includes(transaction.network)) {
        transactionHash = await this.processEthereumPayment(transaction, plan)
      } else if (transaction.network === 'solana') {
        transactionHash = await this.processSolanaPayment(transaction, plan)
      } else {
        throw new Error(ERROR_CODES.NETWORK_NOT_SUPPORTED)
      }

      return transactionHash
    } catch (error) {
      throw this.handlePaymentError(error)
    }
  }

  private async processEthereumPayment(
    transaction: SubscriptionTransaction,
    plan: CryptoSubscriptionPlan
  ): Promise<string> {
    const signer = this.walletService.getSigner()
    if (!signer) {
      throw new Error(ERROR_CODES.WALLET_NOT_CONNECTED)
    }

    const networkConfig = SUPPORTED_NETWORKS.find(n => n.name === transaction.network)
    if (!networkConfig) {
      throw new Error(ERROR_CODES.NETWORK_NOT_SUPPORTED)
    }

    try {
      // Get contract address from config
      const contractAddress = PAYMENT_PROCESSING_CONFIG.contractAddresses[transaction.network].subscription
      if (!contractAddress) {
        throw new Error('Subscription contract not configured for this network')
      }

      // Create contract interface (simplified - would need actual ABI)
      const contractInterface = new ethers.Interface([
        'function subscribe(uint256 planId, address currency) payable'
      ])

      // Estimate gas
      const gasEstimate = await this.walletService.estimateGas(
        contractAddress,
        transaction.amount,
        contractInterface.encodeFunctionData('subscribe', [0, contractAddress]),
        transaction.network
      )

      // Send transaction
      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther(transaction.amount),
        data: contractInterface.encodeFunctionData('subscribe', [0, contractAddress]),
        gasLimit: BigInt(gasEstimate.gasLimit)
      })

      return tx.hash
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error(ERROR_CODES.TRANSACTION_REJECTED)
      }
      throw new Error(ERROR_CODES.TRANSACTION_FAILED)
    }
  }

  private async processSolanaPayment(
    transaction: SubscriptionTransaction,
    plan: CryptoSubscriptionPlan
  ): Promise<string> {
    const connection = this.walletService.getSolanaConnection()
    const wallet = this.walletService.getConnection()
    
    if (!connection || !wallet) {
      throw new Error(ERROR_CODES.WALLET_NOT_CONNECTED)
    }

    try {
      const programId = PAYMENT_PROCESSING_CONFIG.contractAddresses.solana.subscription
      if (!programId) {
        throw new Error('Subscription program not configured')
      }

      // Create Solana transaction (simplified)
      const solanaTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.address),
          toPubkey: new PublicKey(programId),
          lamports: parseFloat(transaction.amount) * 1e9 // Convert SOL to lamports
        })
      )

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      solanaTransaction.recentBlockhash = blockhash
      solanaTransaction.feePayer = new PublicKey(wallet.address)

      // Sign and send transaction
      const signature = await (window as any).phantom?.solana?.signAndSendTransaction(solanaTransaction)
      return signature.signature
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error(ERROR_CODES.TRANSACTION_REJECTED)
      }
      throw new Error(ERROR_CODES.TRANSACTION_FAILED)
    }
  }

  async confirmTransaction(
    transactionHash: string,
    network: Network,
    amount: string
  ): Promise<TransactionConfirmation> {
    try {
      const networkConfig = SUPPORTED_NETWORKS.find(n => n.name === network)
      if (!networkConfig) {
        throw new Error(ERROR_CODES.NETWORK_NOT_SUPPORTED)
      }

      let confirmation: TransactionConfirmation

      if (['ethereum', 'polygon', 'arbitrum'].includes(network)) {
        confirmation = await this.confirmEthereumTransaction(transactionHash, network, amount)
      } else if (network === 'solana') {
        confirmation = await this.confirmSolanaTransaction(transactionHash, network, amount)
      } else {
        throw new Error(ERROR_CODES.NETWORK_NOT_SUPPORTED)
      }

      return confirmation
    } catch (error) {
      throw this.handlePaymentError(error)
    }
  }

  private async confirmEthereumTransaction(
    hash: string,
    network: Network,
    amount: string
  ): Promise<TransactionConfirmation> {
    const provider = this.walletService.getProvider()
    if (!provider) {
      throw new Error(ERROR_CODES.WALLET_NOT_CONNECTED)
    }

    try {
      const receipt = await this.walletService.waitForConfirmation(hash, network)
      const transaction = await provider.getTransaction(hash)

      const networkConfig = SUPPORTED_NETWORKS.find(n => n.name === network)
      const requiredConfirmations = this.getRequiredConfirmations(amount, networkConfig)

      const confirmation: TransactionConfirmation = {
        hash,
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        blockNumber: receipt.blockNumber || undefined,
        blockHash: receipt.blockHash || undefined,
        confirmations: receipt.confirmations || 0,
        requiredConfirmations,
        timestamp: new Date(),
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString()
      }

      return confirmation
    } catch (error) {
      throw new Error(ERROR_CODES.CONFIRMATION_TIMEOUT)
    }
  }

  private async confirmSolanaTransaction(
    signature: string,
    network: Network,
    amount: string
  ): Promise<TransactionConfirmation> {
    const connection = this.walletService.getSolanaConnection()
    if (!connection) {
      throw new Error(ERROR_CODES.WALLET_NOT_CONNECTED)
    }

    try {
      const confirmation = await connection.confirmTransaction(signature)
      const transaction = await connection.getTransaction(signature)

      const networkConfig = SUPPORTED_NETWORKS.find(n => n.name === network)
      const requiredConfirmations = this.getRequiredConfirmations(amount, networkConfig)

      return {
        hash: signature,
        status: confirmation.value.err ? 'failed' : 'confirmed',
        blockNumber: transaction?.slot,
        confirmations: 1, // Solana typically has 1 confirmation
        requiredConfirmations,
        timestamp: new Date(),
        gasUsed: '0' // Solana uses different fee structure
      }
    } catch (error) {
      throw new Error(ERROR_CODES.CONFIRMATION_TIMEOUT)
    }
  }

  async retryPayment(transaction: SubscriptionTransaction): Promise<string> {
    const maxRetries = PAYMENT_PROCESSING_CONFIG.retryAttempts
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        await this.delay(PAYMENT_PROCESSING_CONFIG.retryDelay * Math.pow(2, attempt))
        
        const transactionHash = await this.processPayment(transaction)
        return transactionHash
      } catch (error) {
        attempt++
        if (attempt >= maxRetries) {
          throw error
        }
      }
    }

    throw new Error(ERROR_CODES.TRANSACTION_FAILED)
  }

  async validatePayment(
    walletAddress: string,
    amount: string,
    currency: Cryptocurrency,
    network: Network
  ): Promise<{ isValid: boolean; error?: PaymentProcessingError }> {
    try {
      // Check if wallet has sufficient balance
      const balance = await this.walletService.getBalance(walletAddress, network)
      const availableBalance = parseFloat(balance[currency] || '0')
      const requiredAmount = parseFloat(amount)

      if (availableBalance < requiredAmount) {
        return {
          isValid: false,
          error: {
            code: ERROR_CODES.INSUFFICIENT_BALANCE,
            message: 'Insufficient balance for this transaction',
            retryable: true,
            suggestedAction: `Add at least ${(requiredAmount - availableBalance).toFixed(4)} ${currency} to your wallet`
          }
        }
      }

      // Check minimum balance requirements
      const minimumBalance = PAYMENT_PROCESSING_CONFIG.minimumBalance[currency]
      if (availableBalance < parseFloat(minimumBalance)) {
        return {
          isValid: false,
          error: {
            code: ERROR_CODES.INSUFFICIENT_BALANCE,
            message: `Minimum balance of ${minimumBalance} ${currency} required`,
            retryable: true,
            suggestedAction: 'Add more funds to meet minimum balance requirement'
          }
        }
      }

      return { isValid: true }
    } catch (error) {
      return {
        isValid: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Payment validation failed',
          retryable: true,
          suggestedAction: 'Please check your wallet and try again'
        }
      }
    }
  }

  private getRequiredConfirmations(amount: string, networkConfig?: any): number {
    const amountUSD = parseFloat(amount) * 2000 // Simplified USD conversion
    
    if (amountUSD >= 1000) {
      return networkConfig?.confirmations.critical || 50
    } else if (amountUSD >= 100) {
      return networkConfig?.confirmations.highValue || 25
    } else {
      return networkConfig?.confirmations.standard || 12
    }
  }

  private createEmptyConfirmation(): TransactionConfirmation {
    return {
      hash: '',
      status: 'pending',
      confirmations: 0,
      requiredConfirmations: 12,
      timestamp: new Date(),
      gasUsed: '0'
    }
  }

  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private handlePaymentError(error: any): PaymentProcessingError {
    if (error.code) {
      return {
        code: error.code,
        message: error.message,
        retryable: error.retryable !== false,
        suggestedAction: error.suggestedAction
      }
    }

    return {
      code: ERROR_CODES.TRANSACTION_FAILED,
      message: 'Payment processing failed',
      retryable: true,
      suggestedAction: 'Please try again or contact support'
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
