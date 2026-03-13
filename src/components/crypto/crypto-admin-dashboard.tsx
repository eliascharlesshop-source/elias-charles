'use client'

import { useState, useEffect } from 'react'
import { 
  CryptoSubscription, 
  SubscriptionTransaction, 
  AdminMetrics,
  PaymentProcessingError 
} from '@/types/crypto-subscription'
import { SubscriptionService } from '@/lib/crypto/subscription-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/src/components/ui/table'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Download
} from 'lucide-react'

export function CryptoAdminDashboard() {
  const [subscriptions, setSubscriptions] = useState<CryptoSubscription[]>([])
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const subscriptionService = SubscriptionService.getInstance()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [allSubscriptions, stats] = await Promise.all([
        subscriptionService.getAllSubscriptions(),
        subscriptionService.getSubscriptionStats()
      ])

      setSubscriptions(allSubscriptions)
      setMetrics({
        totalSubscriptions: stats.total,
        activeSubscriptions: stats.active,
        totalRevenue: {
          ETH: '0',
          SOL: '0',
          USDC: '0',
          USDT: '0',
          MATIC: '0'
        },
        totalRevenueUSD: 0,
        averageTransactionValue: 0,
        churnRate: 0,
        renewalRate: 0,
        networkUsage: {
          ethereum: { transactionCount: 0, volume: '0', averageGas: '0' },
          polygon: { transactionCount: 0, volume: '0', averageGas: '0' },
          arbitrum: { transactionCount: 0, volume: '0', averageGas: '0' },
          solana: { transactionCount: 0, volume: '0', averageGas: '0' }
        },
        walletDistribution: {
          metamask: 0,
          phantom: 0,
          solflare: 0
        }
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />
      case 'expired': return <AlertCircle className="h-4 w-4 text-gray-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      pending: 'secondary',
      cancelled: 'destructive',
      expired: 'outline'
    }
    return variants[status] || 'outline'
  }

  const exportData = () => {
    const csvData = subscriptions.map(sub => ({
      id: sub.id,
      wallet: sub.walletAddress,
      plan: sub.planId,
      status: sub.status,
      createdAt: sub.createdAt,
      transactions: sub.transactions.length
    }))

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crypto_subscriptions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Crypto Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage cryptocurrency subscriptions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.activeSubscriptions} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalRevenueUSD.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.averageTransactionValue.toFixed(2)} avg transaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(metrics.renewalRate * 100).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {(metrics.churnRate * 100).toFixed(1)}% churn rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(metrics.networkUsage).reduce((sum, net) => sum + net.transactionCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total transactions
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Network Usage */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Network Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(metrics.networkUsage).map(([network, usage]) => (
                <div key={network} className="text-center">
                  <h4 className="font-semibold capitalize">{network}</h4>
                  <div className="text-2xl font-bold">{usage.transactionCount}</div>
                  <div className="text-sm text-gray-500">{usage.volume} volume</div>
                  <div className="text-xs text-gray-400">{usage.averageGas} avg gas</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Distribution */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(metrics.walletDistribution).map(([wallet, count]) => (
                <div key={wallet} className="text-center">
                  <h4 className="font-semibold capitalize">{wallet}</h4>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-500">
                    {metrics.totalSubscriptions > 0 
                      ? `${((count / metrics.totalSubscriptions) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.slice(0, 10).map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-mono text-xs">
                    {subscription.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {subscription.walletAddress.slice(0, 6)}...{subscription.walletAddress.slice(-4)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {subscription.planId.replace('ie-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(subscription.status)}
                      <Badge variant={getStatusBadge(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{subscription.transactions.length}</TableCell>
                  <TableCell className="text-sm">
                    {subscription.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
