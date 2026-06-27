// Core cryptocurrency subscription system types

export const ERROR_CODES = {
  WALLET_NOT_INSTALLED: 'WALLET_NOT_INSTALLED',
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  NETWORK_NOT_SUPPORTED: 'NETWORK_NOT_SUPPORTED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  GAS_ESTIMATION_FAILED: 'GAS_ESTIMATION_FAILED',
  CONFIRMATION_TIMEOUT: 'CONFIRMATION_TIMEOUT',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const

export type SupportedWallet = 'metamask' | 'phantom' | 'solflare'

export type Network = 'ethereum' | 'solana' | 'polygon' | 'arbitrum'

export type Cryptocurrency = 'ETH' | 'SOL' | 'USDC' | 'USDT' | 'MATIC'

export interface WalletConnection {
  walletType: SupportedWallet
  address: string
  network: Network
  isConnected: boolean
  balance: Record<Cryptocurrency, string>
  lastConnected: Date
}

export interface GasEstimate {
  gasLimit: string
  gasPrice: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  estimatedCost: string
  estimatedCostUSD: number
  network: Network
}

export interface TransactionConfirmation {
  hash: string
  status: 'pending' | 'confirmed' | 'failed' | 'reverted'
  blockNumber?: number
  blockHash?: string
  confirmations: number
  requiredConfirmations: number
  timestamp: Date
  gasUsed: string
  effectiveGasPrice?: string
}

export interface CryptoSubscriptionPlan {
  id: string
  name: string
  description: string
  price: {
    amount: string
    currency: Cryptocurrency
    usdEquivalent: number
  }
  frequency: 'monthly' | 'quarterly' | 'annual'
  discount: number
  features: string[]
  boxes: string[]
  supportedNetworks: Network[]
  supportedCurrencies: Cryptocurrency[]
  isActive: boolean
  maxSupply?: number
  currentSupply?: number
}

export interface SubscriptionTransaction {
  id: string
  subscriptionId: string
  userId: string
  walletAddress: string
  planId: string
  amount: string
  currency: Cryptocurrency
  network: Network
  transactionHash: string
  status: 'pending' | 'processing' | 'active' | 'expired' | 'cancelled'
  confirmation: TransactionConfirmation
  createdAt: Date
  activatedAt?: Date
  expiresAt?: Date
  nextBillingAt?: Date
  autoRenew: boolean
}

export interface CryptoSubscription {
  id: string
  userId: string
  walletAddress: string
  planId: string
  status: 'active' | 'expired' | 'cancelled' | 'suspended'
  currentPeriod: {
    start: Date
    end: Date
  }
  transactions: SubscriptionTransaction[]
  features: {
    canPause: boolean
    canUpgrade: boolean
    canDowngrade: boolean
    canCancel: boolean
    autoRenew: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface WalletAuthSession {
  sessionId: string
  walletAddress: string
  walletType: SupportedWallet
  signature: string
  message: string
  nonce: string
  expiresAt: Date
  isActive: boolean
}

export interface PaymentProcessingError {
  code: string
  message: string
  details?: Record<string, any>
  retryable: boolean
  suggestedAction?: string
}

export interface NetworkConfig {
  name: Network
  chainId: number | string
  rpcUrl: string
  blockExplorerUrl: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  confirmations: {
    standard: number
    highValue: number
    critical: number
  }
  gasMultiplier: number
}

export interface WebhookPayload {
  event: string
  data: {
    subscriptionId: string
    transactionId: string
    walletAddress: string
    amount: string
    currency: Cryptocurrency
    status: string
    timestamp: Date
  }
  signature: string
  timestamp: number
}

export interface AdminMetrics {
  totalSubscriptions: number
  activeSubscriptions: number
  totalRevenue: {
    [key in Cryptocurrency]: string
  }
  totalRevenueUSD: number
  averageTransactionValue: number
  churnRate: number
  renewalRate: number
  networkUsage: {
    [key in Network]: {
      transactionCount: number
      volume: string
      averageGas: string
    }
  }
  walletDistribution: {
    [key in SupportedWallet]: number
  }
}

export interface AuditLog {
  id: string
  userId?: string
  walletAddress?: string
  action: string
  resource: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
}
