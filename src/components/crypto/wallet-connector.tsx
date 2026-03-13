'use client'

import { useState } from 'react'
import { useWallet } from '@/src/hooks/use-wallet'
import { SupportedWallet, Network } from '@/types/crypto-subscription'
import { WALLET_CONFIGS, SUPPORTED_NETWORKS } from '@/lib/crypto-config'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Loader2, Wallet, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'

interface WalletConnectorProps {
  onConnect?: (connection: any) => void
  className?: string
}

export function WalletConnector({ onConnect, className }: WalletConnectorProps) {
  const { 
    detectedWallets, 
    connect, 
    disconnect, 
    isConnecting, 
    error, 
    clearError,
    connection,
    isConnected 
  } = useWallet()
  
  const [selectedWallet, setSelectedWallet] = useState<SupportedWallet | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('ethereum')

  const handleConnect = async () => {
    if (!selectedWallet) return

    try {
      clearError()
      await connect(selectedWallet, selectedNetwork)
      onConnect?.(connection)
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
  }

  const availableWallets = Object.entries(WALLET_CONFIGS).filter(([walletType]) =>
    detectedWallets.includes(walletType as SupportedWallet)
  )

  if (isConnected && connection) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            Your wallet is connected and ready for crypto transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{WALLET_CONFIGS[connection.walletType].name}</p>
              <p className="text-xs text-gray-500 font-mono">
                {connection.address.slice(0, 6)}...{connection.address.slice(-4)}
              </p>
            </div>
            <Badge variant="secondary">
              {connection.network.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">ETH:</span>
              <span className="ml-2 font-medium">{connection.balance.ETH}</span>
            </div>
            <div>
              <span className="text-gray-500">USDC:</span>
              <span className="ml-2 font-medium">{connection.balance.USDC}</span>
            </div>
          </div>

          <Button onClick={handleDisconnect} variant="outline" className="w-full">
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Your Wallet
        </CardTitle>
        <CardDescription>
          Connect your crypto wallet to purchase subscriptions with cryptocurrency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {detectedWallets.length === 0 ? (
          <div className="space-y-3">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No crypto wallets detected. Please install a supported wallet.
              </AlertDescription>
            </Alert>
            <div className="grid gap-2">
              {Object.entries(WALLET_CONFIGS).map(([walletType, config]) => (
                <div key={walletType} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src={config.icon} alt={config.name} className="h-6 w-6" />
                    <span className="font-medium">{config.name}</span>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <a href={config.installUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Install
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Wallet</label>
              <Select value={selectedWallet || ''} onValueChange={(value) => setSelectedWallet(value as SupportedWallet)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your wallet" />
                </SelectTrigger>
                <SelectContent>
                  {availableWallets.map(([walletType, config]) => (
                    <SelectItem key={walletType} value={walletType}>
                      <div className="flex items-center gap-2">
                        <img src={config.icon} alt={config.name} className="h-4 w-4" />
                        {config.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Select Network</label>
              <Select value={selectedNetwork} onValueChange={(value) => setSelectedNetwork(value as Network)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_NETWORKS.filter(network => 
                    selectedWallet && WALLET_CONFIGS[selectedWallet].supportedNetworks.includes(network.name as Network)
                  ).map((network) => (
                    <SelectItem key={network.name} value={network.name}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          network.name === 'ethereum' ? 'bg-blue-500' :
                          network.name === 'polygon' ? 'bg-purple-500' :
                          network.name === 'arbitrum' ? 'bg-cyan-500' :
                          'bg-green-500'
                        }`} />
                        {network.name.charAt(0).toUpperCase() + network.name.slice(1)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleConnect} 
              disabled={!selectedWallet || isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </div>
      </CardContent>
    </Card>
  )
}
