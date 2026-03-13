import { NetworkConfig, SupportedWallet, Cryptocurrency, Network } from '@/types/crypto-subscription'

const getEnvVar = (key: string, fallback: string = '') => {
  if (typeof window !== 'undefined') {
    return (window as any).__ENV?.[key] || fallback
  }
  return (globalThis as any).process?.env?.[key] || fallback
}

export const SUPPORTED_NETWORKS: NetworkConfig[] = [
  {
    name: 'ethereum',
    chainId: 1,
    rpcUrl: getEnvVar('NEXT_PUBLIC_ETHEREUM_RPC', 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'),
    blockExplorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    confirmations: {
      standard: 12,
      highValue: 25,
      critical: 50
    },
    gasMultiplier: 1.1
  },
  {
    name: 'polygon',
    chainId: 137,
    rpcUrl: getEnvVar('NEXT_PUBLIC_POLYGON_RPC', 'https://polygon-rpc.com'),
    blockExplorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    confirmations: {
      standard: 5,
      highValue: 10,
      critical: 20
    },
    gasMultiplier: 1.2
  },
  {
    name: 'arbitrum',
    chainId: 42161,
    rpcUrl: getEnvVar('NEXT_PUBLIC_ARBITRUM_RPC', 'https://arb1.arbitrum.io/rpc'),
    blockExplorerUrl: 'https://arbiscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    confirmations: {
      standard: 5,
      highValue: 10,
      critical: 15
    },
    gasMultiplier: 1.15
  },
  {
    name: 'solana',
    chainId: 'mainnet-beta',
    rpcUrl: getEnvVar('NEXT_PUBLIC_SOLANA_RPC', 'https://api.mainnet-beta.solana.com'),
    blockExplorerUrl: 'https://solscan.io',
    nativeCurrency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9
    },
    confirmations: {
      standard: 1,
      highValue: 2,
      critical: 3
    },
    gasMultiplier: 1.0
  }
]

export const WALLET_CONFIGS = {
  metamask: {
    name: 'MetaMask',
    supportedNetworks: ['ethereum', 'polygon', 'arbitrum'],
    installUrl: 'https://metamask.io/download/',
    icon: '/icons/metamask.svg'
  },
  phantom: {
    name: 'Phantom',
    supportedNetworks: ['solana'],
    installUrl: 'https://phantom.app/',
    icon: '/icons/phantom.svg'
  },
  solflare: {
    name: 'Solflare',
    supportedNetworks: ['solana'],
    installUrl: 'https://solflare.com/',
    icon: '/icons/solflare.svg'
  }
} as const

export const CRYPTO_PRICE_FEEDS = {
  ethereum: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cusd-coin%2Ctether%2Cmatic-token&vs_currencies=usd',
  solana: 'https://api.coingecko.com/api/v3/simple/price?ids=solana%2Cusd-coin%2Ctether&vs_currencies=usd',
  polygon: 'https://api.coingecko.com/api/v3/simple/price?ids=matic-token%2Cusd-coin%2Ctether&vs_currencies=usd',
  arbitrum: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cusd-coin%2Ctether&vs_currencies=usd'
}

export const SUBSCRIPTION_PLANS_CRYPTO = [
  {
    id: 'ie-starter-crypto',
    name: 'IE Starter Crypto Subscription',
    description: 'Monthly curated IE Starter Box with cryptocurrency payments',
    price: {
      amount: '0.025',
      currency: 'ETH' as Cryptocurrency,
      usdEquivalent: 59
    },
    frequency: 'monthly' as const,
    discount: 0.15,
    features: [
      'Monthly IE Starter Box',
      'Exclusive crypto holder benefits',
      'Early access to new drops',
      'Community Discord access'
    ],
    boxes: ['ie-starter'],
    supportedNetworks: ['ethereum', 'polygon', 'arbitrum'] as Network[],
    supportedCurrencies: ['ETH', 'USDC', 'USDT'] as Cryptocurrency[],
    isActive: true
  },
  {
    id: 'ie-street-crypto',
    name: 'IE Street Crypto Subscription',
    description: 'Monthly core streetwear essentials with crypto payments',
    price: {
      amount: '0.05',
      currency: 'ETH' as Cryptocurrency,
      usdEquivalent: 119
    },
    frequency: 'monthly' as const,
    discount: 0.15,
    features: [
      'Monthly IE Street Box',
      'Limited edition NFT drops',
      'VIP event access',
      'Free shipping worldwide'
    ],
    boxes: ['ie-street'],
    supportedNetworks: ['ethereum', 'polygon', 'arbitrum'] as Network[],
    supportedCurrencies: ['ETH', 'USDC', 'USDT'] as Cryptocurrency[],
    isActive: true
  },
  {
    id: 'ie-complete-crypto',
    name: 'IE Complete Crypto Subscription',
    description: 'Quarterly rotation through all IE boxes - the full experience',
    price: {
      amount: '0.075',
      currency: 'ETH' as Cryptocurrency,
      usdEquivalent: 179
    },
    frequency: 'quarterly' as const,
    discount: 0.20,
    features: [
      'Quarterly box rotation',
      'Exclusive merchandise',
      '1-on-1 styling session',
      'Annual IE meetup access'
    ],
    boxes: ['ie-starter', 'ie-street', 'ie-layered'],
    supportedNetworks: ['ethereum', 'polygon', 'arbitrum'] as Network[],
    supportedCurrencies: ['ETH', 'USDC', 'USDT'] as Cryptocurrency[],
    isActive: true,
    maxSupply: 500,
    currentSupply: 0
  },
  {
    id: 'ie-solana-starter',
    name: 'IE Starter Solana Subscription',
    description: 'Monthly subscription with SOL payments',
    price: {
      amount: '0.25',
      currency: 'SOL' as Cryptocurrency,
      usdEquivalent: 59
    },
    frequency: 'monthly' as const,
    discount: 0.15,
    features: [
      'Monthly IE Starter Box',
      'Solana ecosystem benefits',
      'Phantom wallet integration',
      'Low gas fees'
    ],
    boxes: ['ie-starter'],
    supportedNetworks: ['solana'] as Network[],
    supportedCurrencies: ['SOL', 'USDC'] as Cryptocurrency[],
    isActive: true
  }
]

export const PAYMENT_PROCESSING_CONFIG = {
  retryAttempts: 3,
  retryDelay: 2000,
  gasMultiplier: 1.1,
  maxGasPrice: '100000000000', // 100 gwei
  transactionTimeout: 300000, // 5 minutes
  confirmationTimeout: 600000, // 10 minutes
  minimumBalance: {
    ETH: '0.01',
    SOL: '0.1',
    USDC: '1',
    USDT: '1',
    MATIC: '10'
  },
  contractAddresses: {
    ethereum: {
      subscription: getEnvVar('NEXT_PUBLIC_ETH_SUBSCRIPTION_CONTRACT', ''),
      payment: getEnvVar('NEXT_PUBLIC_ETH_PAYMENT_CONTRACT', ''),
      nft: getEnvVar('NEXT_PUBLIC_ETH_NFT_CONTRACT', '')
    },
    polygon: {
      subscription: getEnvVar('NEXT_PUBLIC_POLYGON_SUBSCRIPTION_CONTRACT', ''),
      payment: getEnvVar('NEXT_PUBLIC_POLYGON_PAYMENT_CONTRACT', ''),
      nft: getEnvVar('NEXT_PUBLIC_POLYGON_NFT_CONTRACT', '')
    },
    arbitrum: {
      subscription: getEnvVar('NEXT_PUBLIC_ARBITRUM_SUBSCRIPTION_CONTRACT', ''),
      payment: getEnvVar('NEXT_PUBLIC_ARBITRUM_PAYMENT_CONTRACT', ''),
      nft: getEnvVar('NEXT_PUBLIC_ARBITRUM_NFT_CONTRACT', '')
    },
    solana: {
      subscription: getEnvVar('NEXT_PUBLIC_SOLANA_SUBSCRIPTION_PROGRAM', ''),
      payment: getEnvVar('NEXT_PUBLIC_SOLANA_PAYMENT_PROGRAM', ''),
      nft: getEnvVar('NEXT_PUBLIC_SOLANA_NFT_PROGRAM', '')
    }
  }
}

export const ERROR_CODES = {
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  WALLET_NOT_INSTALLED: 'WALLET_NOT_INSTALLED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  NETWORK_NOT_SUPPORTED: 'NETWORK_NOT_SUPPORTED',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',
  GAS_ESTIMATION_FAILED: 'GAS_ESTIMATION_FAILED',
  CONFIRMATION_TIMEOUT: 'CONFIRMATION_TIMEOUT',
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const

export const WEBHOOK_ENDPOINTS = {
  payment: '/api/webhooks/payment',
  subscription: '/api/webhooks/subscription',
  wallet: '/api/webhooks/wallet',
  audit: '/api/webhooks/audit'
}

export const SECURITY_CONFIG = {
  nonceExpiry: 300, // 5 minutes
  sessionExpiry: 86400, // 24 hours
  maxLoginAttempts: 5,
  lockoutDuration: 900, // 15 minutes
  signatureMessage: (nonce: string) => 
    `Welcome to IE Crypto Subscriptions!\n\n` +
    `Please sign this message to authenticate your wallet.\n\n` +
    `Nonce: ${nonce}\n` +
    `Timestamp: ${Date.now()}\n\n` +
    `This signature will be used to verify your identity and manage your subscription.`
}
