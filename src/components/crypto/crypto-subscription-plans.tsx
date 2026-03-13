'use client'

import { useState } from 'react'
import { useWallet } from '@/src/hooks/use-wallet'
import { CryptoSubscriptionPlan, Cryptocurrency, Network } from '@/types/crypto-subscription'
import { SUBSCRIPTION_PLANS_CRYPTO } from '@/lib/crypto-config'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { 
  Check, 
  Star, 
  Calendar, 
  Percent, 
  Bitcoin, 
  Zap, 
  Shield, 
  Crown,
  Loader2,
  AlertCircle
} from 'lucide-react'

interface CryptoSubscriptionPlansProps {
  onSubscribe?: (planId: string, currency: Cryptocurrency, network: Network) => void
  className?: string
}

export function CryptoSubscriptionPlans({ onSubscribe, className }: CryptoSubscriptionPlansProps) {
  const { isConnected, connection } = useWallet()
  const [selectedCurrency, setSelectedCurrency] = useState<Cryptocurrency>('ETH')
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('ethereum')
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)

  const getPlanPrice = (plan: CryptoSubscriptionPlan, currency: Cryptocurrency): string => {
    if (plan.price.currency === currency) {
      return plan.price.amount
    }
    
    // Simple conversion logic (in real app, would use price oracle)
    const conversions: Record<string, Record<string, number>> = {
      'ETH': { 'USDC': 2000, 'USDT': 2000, 'SOL': 0.05, 'MATIC': 2000 },
      'SOL': { 'USDC': 150, 'USDT': 150, 'ETH': 20, 'MATIC': 150 },
      'USDC': { 'ETH': 0.0005, 'SOL': 0.0067, 'USDT': 1, 'MATIC': 1 },
      'USDT': { 'ETH': 0.0005, 'SOL': 0.0067, 'USDC': 1, 'MATIC': 1 },
      'MATIC': { 'ETH': 0.0005, 'SOL': 0.0067, 'USDC': 1, 'USDT': 1 }
    }
    
    const rate = conversions[currency]?.[plan.price.currency] || 1
    const convertedAmount = parseFloat(plan.price.amount) * rate
    return convertedAmount.toFixed(6)
  }

  const getCurrencyIcon = (currency: Cryptocurrency) => {
    switch (currency) {
      case 'ETH': return <Bitcoin className="h-4 w-4" />
      case 'SOL': return <Zap className="h-4 w-4" />
      case 'USDC':
      case 'USDT': return <Shield className="h-4 w-4" />
      case 'MATIC': return <Crown className="h-4 w-4" />
      default: return <Bitcoin className="h-4 w-4" />
    }
  }

  const getPlanIcon = (planId: string) => {
    if (planId.includes('complete')) return <Crown className="h-6 w-6 text-yellow-500" />
    if (planId.includes('street')) return <Star className="h-6 w-6 text-blue-500" />
    return <Shield className="h-6 w-6 text-green-500" />
  }

  const handleSubscribe = async (planId: string) => {
    if (!isConnected) {
      return
    }

    setProcessingPlan(planId)
    
    try {
      onSubscribe?.(planId, selectedCurrency, selectedNetwork)
    } catch (error) {
      console.error('Subscription failed:', error)
    } finally {
      setProcessingPlan(null)
    }
  }

  const getNetworkBadgeColor = (network: Network) => {
    switch (network) {
      case 'ethereum': return 'bg-blue-100 text-blue-800'
      case 'polygon': return 'bg-purple-100 text-purple-800'
      case 'arbitrum': return 'bg-cyan-100 text-cyan-800'
      case 'solana': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={className}>
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Crypto Subscription Plans</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join the IE crypto subscription and pay with cryptocurrency. 
          Exclusive benefits for Web3 enthusiasts.
        </p>
      </div>

      {!isConnected && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect your wallet to subscribe to crypto plans with exclusive Web3 benefits.
          </AlertDescription>
        </Alert>
      )}

      {/* Currency and Network Selection */}
      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-sm font-medium mb-2 block">Payment Currency</label>
            <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as Cryptocurrency)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">
                  <div className="flex items-center gap-2">
                    <Bitcoin className="h-4 w-4" />
                    Ethereum (ETH)
                  </div>
                </SelectItem>
                <SelectItem value="SOL">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Solana (SOL)
                  </div>
                </SelectItem>
                <SelectItem value="USDC">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    USD Coin (USDC)
                  </div>
                </SelectItem>
                <SelectItem value="USDT">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Tether (USDT)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Network</label>
            <Select value={selectedNetwork} onValueChange={(value) => setSelectedNetwork(value as Network)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">
                  <Badge className={getNetworkBadgeColor('ethereum')}>Ethereum</Badge>
                </SelectItem>
                <SelectItem value="polygon">
                  <Badge className={getNetworkBadgeColor('polygon')}>Polygon</Badge>
                </SelectItem>
                <SelectItem value="arbitrum">
                  <Badge className={getNetworkBadgeColor('arbitrum')}>Arbitrum</Badge>
                </SelectItem>
                <SelectItem value="solana">
                  <Badge className={getNetworkBadgeColor('solana')}>Solana</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_PLANS_CRYPTO.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden transition-all hover:shadow-lg ${
              plan.name.includes('Complete') ? 'border-2 border-yellow-300 ring-2 ring-yellow-100' : ''
            }`}
          >
            {plan.name.includes('Complete') && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 text-xs font-bold">
                MOST POPULAR
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                {getPlanIcon(plan.id)}
              </div>
              <CardTitle className="text-lg font-bold text-gray-900">
                {plan.name}
              </CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Price */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                  {getCurrencyIcon(selectedCurrency)}
                  <span>{getPlanPrice(plan, selectedCurrency)}</span>
                  <span className="text-sm text-gray-500 font-normal">
                    {selectedCurrency}/{plan.frequency === 'monthly' ? 'mo' : 'qtr'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ≈ ${plan.price.usdEquivalent} USD
                </div>
                {plan.discount > 0 && (
                  <div className="flex items-center justify-center text-green-600 text-sm mt-2">
                    <Percent className="w-4 h-4 mr-1" />
                    Save {Math.round(plan.discount * 100)}%
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  {plan.frequency === 'monthly' ? 'Monthly' : 'Quarterly'} delivery
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-blue-500" />
                  {plan.boxes.length} box{plan.boxes.length > 1 ? 'es' : ''} included
                </div>

                <div className="space-y-1 pt-2">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600">
                      <Check className="w-3 h-3 mr-2 text-green-500" />
                      {feature}
                    </div>
                  ))}
                  {plan.features.length > 3 && (
                    <div className="text-xs text-gray-500 pl-5">
                      +{plan.features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>

              {/* Network Support */}
              <div className="flex flex-wrap gap-1">
                {plan.supportedNetworks.slice(0, 3).map((network) => (
                  <Badge key={network} variant="outline" className="text-xs">
                    {network.charAt(0).toUpperCase() + network.slice(1)}
                  </Badge>
                ))}
                {plan.supportedNetworks.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{plan.supportedNetworks.length - 3}
                  </Badge>
                )}
              </div>

              {/* Supply Limit */}
              {plan.maxSupply && (
                <div className="text-center">
                  <div className="text-xs text-orange-600 font-medium">
                    Limited: {plan.currentSupply || 0}/{plan.maxSupply} available
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-orange-500 h-1 rounded-full" 
                      style={{ width: `${((plan.currentSupply || 0) / plan.maxSupply) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(plan.id)}
                disabled={!isConnected || processingPlan === plan.id}
                variant={plan.name.includes('Complete') ? 'default' : 'outline'}
              >
                {processingPlan === plan.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : !isConnected ? (
                  'Connect Wallet First'
                ) : plan.name.includes('Complete') ? (
                  'Subscribe Now'
                ) : (
                  'Choose Plan'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Crypto Benefits Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Crypto Holder Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Exclusive NFT Drops</h4>
            <p className="text-sm text-gray-600">Get limited edition NFTs with your subscription</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Lower Gas Fees</h4>
            <p className="text-sm text-gray-600">Optimized transactions on multiple networks</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Crown className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">VIP Access</h4>
            <p className="text-sm text-gray-600">Priority access to new drops and events</p>
          </div>
        </div>
      </div>
    </div>
  )
}
