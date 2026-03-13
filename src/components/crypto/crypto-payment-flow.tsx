'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/src/hooks/use-wallet'
import { 
  SubscriptionTransaction, 
  TransactionConfirmation,
  CryptoSubscription,
  Cryptocurrency,
  Network,
  PaymentProcessingError 
} from '@/types/crypto-subscription'
import { PaymentService } from '@/lib/crypto/payment-service'
import { SubscriptionService } from '@/lib/crypto/subscription-service'
import { SUPPORTED_NETWORKS } from '@/lib/crypto-config'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Clock,
  DollarSign,
  Shield,
  Zap
} from 'lucide-react'

interface CryptoPaymentFlowProps {
  planId: string
  currency: Cryptocurrency
  network: Network
  onSuccess?: (subscription: CryptoSubscription) => void
  onError?: (error: PaymentProcessingError) => void
  onCancel?: () => void
  className?: string
}

type PaymentStep = 'validation' | 'confirmation' | 'processing' | 'confirmation' | 'completed' | 'failed'

export function CryptoPaymentFlow({ 
  planId, 
  currency, 
  network, 
  onSuccess, 
  onError, 
  onCancel, 
  className 
}: CryptoPaymentFlowProps) {
  const { connection, refreshBalance } = useWallet()
  const [currentStep, setCurrentStep] = useState<PaymentStep>('validation')
  const [transaction, setTransaction] = useState<SubscriptionTransaction | null>(null)
  const [confirmation, setConfirmation] = useState<TransactionConfirmation | null>(null)
  const [subscription, setSubscription] = useState<CryptoSubscription | null>(null)
  const [error, setError] = useState<PaymentProcessingError | null>(null)
  const [progress, setProgress] = useState(0)

  const paymentService = PaymentService.getInstance()
  const subscriptionService = SubscriptionService.getInstance()

  useEffect(() => {
    if (connection && planId) {
      initiatePayment()
    }
  }, [connection, planId])

  useEffect(() => {
    if (confirmation && confirmation.status === 'confirmed') {
      activateSubscription()
    } else if (confirmation && confirmation.status === 'failed') {
      handlePaymentFailure()
    }
  }, [confirmation])

  const initiatePayment = async () => {
    if (!connection) return

    try {
      setCurrentStep('validation')
      setProgress(10)

      // Validate payment
      const validation = await paymentService.validatePayment(
        connection.address,
        '0.025', // Would get from plan
        currency,
        network
      )

      if (!validation.isValid && validation.error) {
        throw validation.error
      }

      setProgress(25)

      // Create subscription transaction
      const newTransaction = await paymentService.createSubscription(
        planId,
        connection.address,
        currency,
        network
      )

      setTransaction(newTransaction)
      setCurrentStep('confirmation')
      setProgress(40)
    } catch (err: any) {
      const paymentError: PaymentProcessingError = {
        code: err.code || 'VALIDATION_ERROR',
        message: err.message || 'Payment validation failed',
        retryable: err.retryable !== false,
        suggestedAction: err.suggestedAction || 'Please check your wallet and try again'
      }
      setError(paymentError)
      setCurrentStep('failed')
      onError?.(paymentError)
    }
  }

  const confirmPayment = async () => {
    if (!transaction) return

    try {
      setCurrentStep('processing')
      setProgress(50)

      // Process payment
      const transactionHash = await paymentService.processPayment(transaction)
      
      // Update transaction with hash
      transaction.transactionHash = transactionHash
      setTransaction({ ...transaction })
      setProgress(70)

      // Wait for confirmation
      const transactionConfirmation = await paymentService.confirmTransaction(
        transactionHash,
        network,
        transaction.amount
      )

      setConfirmation(transactionConfirmation)
      setProgress(90)

      if (transactionConfirmation.status === 'confirmed') {
        setCurrentStep('confirmation')
      } else {
        throw new Error('Transaction failed')
      }
    } catch (err: any) {
      const paymentError: PaymentProcessingError = {
        code: err.code || 'TRANSACTION_FAILED',
        message: err.message || 'Transaction processing failed',
        retryable: err.retryable !== false,
        suggestedAction: err.suggestedAction || 'Please try again or contact support'
      }
      setError(paymentError)
      setCurrentStep('failed')
      onError?.(paymentError)
    }
  }

  const activateSubscription = async () => {
    if (!transaction || !confirmation) return

    try {
      const newSubscription = await subscriptionService.activateSubscription(
        transaction.subscriptionId,
        transaction.transactionHash
      )

      setSubscription(newSubscription)
      setCurrentStep('completed')
      setProgress(100)
      onSuccess?.(newSubscription)
      
      // Refresh wallet balance
      refreshBalance()
    } catch (err: any) {
      const paymentError: PaymentProcessingError = {
        code: err.code || 'SUBSCRIPTION_ERROR',
        message: err.message || 'Failed to activate subscription',
        retryable: false,
        suggestedAction: 'Please contact support'
      }
      setError(paymentError)
      setCurrentStep('failed')
      onError?.(paymentError)
    }
  }

  const handlePaymentFailure = () => {
    setCurrentStep('failed')
    setProgress(0)
  }

  const retryPayment = async () => {
    setError(null)
    await initiatePayment()
  }

  const getExplorerUrl = (hash: string) => {
    const networkConfig = SUPPORTED_NETWORKS.find(n => n.name === network)
    return networkConfig ? `${networkConfig.blockExplorerUrl}/tx/${hash}` : '#'
  }

  const getStepIcon = () => {
    switch (currentStep) {
      case 'validation': return <Shield className="h-6 w-6 text-blue-500" />
      case 'confirmation': return <DollarSign className="h-6 w-6 text-yellow-500" />
      case 'processing': return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
      case 'completed': return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'failed': return <AlertCircle className="h-6 w-6 text-red-500" />
      default: return <Clock className="h-6 w-6 text-gray-500" />
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 'validation': return 'Validating Payment'
      case 'confirmation': return 'Confirm Transaction'
      case 'processing': return 'Processing Payment'
      case 'confirmation': return 'Confirming on Blockchain'
      case 'completed': return 'Subscription Active!'
      case 'failed': return 'Payment Failed'
      default: return 'Processing'
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 'validation': return 'Checking wallet balance and requirements...'
      case 'confirmation': return 'Please confirm the transaction in your wallet'
      case 'processing': return 'Sending transaction to the network...'
      case 'confirmation': return 'Waiting for blockchain confirmation...'
      case 'completed': return 'Your subscription is now active!'
      case 'failed': return error?.message || 'Something went wrong'
      default: return 'Processing payment...'
    }
  }

  if (!connection) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
          <p className="text-gray-600 mb-4">Please connect your wallet to proceed with payment</p>
          <Button onClick={onCancel} variant="outline">
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {getStepIcon()}
          {getStepTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div>
          <Progress value={progress} className="mb-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Validation</span>
            <span>Payment</span>
            <span>Confirmation</span>
            <span>Active</span>
          </div>
        </div>

        {/* Status Description */}
        <div className="text-center">
          <p className="text-gray-600">{getStepDescription()}</p>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>{error.message}</p>
                {error.suggestedAction && (
                  <p className="text-sm">Suggestion: {error.suggestedAction}</p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Transaction Details */}
        {transaction && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm">Transaction Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Amount:</span>
                <span className="ml-2 font-medium">
                  {transaction.amount} {transaction.currency}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Network:</span>
                <span className="ml-2 font-medium">{transaction.network}</span>
              </div>
              <div>
                <span className="text-gray-500">Plan:</span>
                <span className="ml-2 font-medium">{transaction.planId}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <Badge variant={transaction.status === 'active' ? 'default' : 'secondary'}>
                  {transaction.status}
                </Badge>
              </div>
            </div>

            {transaction.transactionHash && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Transaction Hash:</span>
                  <Button asChild size="sm" variant="ghost">
                    <a 
                      href={getExplorerUrl(transaction.transactionHash)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View on Explorer
                    </a>
                  </Button>
                </div>
                <div className="text-xs font-mono text-gray-600 mt-1 truncate">
                  {transaction.transactionHash}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Details */}
        {confirmation && (
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              Blockchain Confirmation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Confirmations:</span>
                <span className="ml-2 font-medium">
                  {confirmation.confirmations}/{confirmation.requiredConfirmations}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <Badge variant={confirmation.status === 'confirmed' ? 'default' : 'secondary'}>
                  {confirmation.status}
                </Badge>
              </div>
              {confirmation.gasUsed && (
                <div>
                  <span className="text-gray-500">Gas Used:</span>
                  <span className="ml-2 font-medium">{confirmation.gasUsed}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {currentStep === 'confirmation' && (
            <Button onClick={confirmPayment} className="flex-1">
              <Zap className="h-4 w-4 mr-2" />
              Confirm Payment
            </Button>
          )}

          {currentStep === 'failed' && error?.retryable && (
            <Button onClick={retryPayment} className="flex-1">
              <Loader2 className="h-4 w-4 mr-2" />
              Retry Payment
            </Button>
          )}

          {currentStep === 'completed' && subscription && (
            <div className="flex-1 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-green-600">Subscription Activated!</p>
              <p className="text-sm text-gray-600">Your subscription is now active</p>
            </div>
          )}

          {(currentStep === 'failed' || currentStep === 'completed') && (
            <Button onClick={onCancel} variant="outline">
              {currentStep === 'failed' ? 'Go Back' : 'Continue'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
