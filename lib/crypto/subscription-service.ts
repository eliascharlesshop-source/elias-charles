'use client'

import { 
  CryptoSubscription,
  SubscriptionTransaction,
  CryptoSubscriptionPlan,
  WalletAuthSession
} from '@/types/crypto-subscription'
import { PaymentService } from './payment-service'
import { SUBSCRIPTION_PLANS_CRYPTO } from '@/lib/crypto-config'

export class SubscriptionService {
  private static instance: SubscriptionService
  private paymentService: PaymentService

  private constructor() {
    this.paymentService = PaymentService.getInstance()
  }

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService()
    }
    return SubscriptionService.instance
  }

  async createSubscription(
    planId: string,
    walletAddress: string,
    currency: string,
    network: string
  ): Promise<CryptoSubscription> {
    try {
      const transaction = await this.paymentService.createSubscription(
        planId,
        walletAddress,
        currency as any,
        network as any
      )

      const subscription: CryptoSubscription = {
        id: transaction.subscriptionId,
        userId: walletAddress,
        walletAddress,
        planId,
        status: 'pending',
        currentPeriod: {
          start: new Date(),
          end: this.calculateEndDate(planId)
        },
        transactions: [transaction],
        features: {
          canPause: true,
          canUpgrade: true,
          canDowngrade: true,
          canCancel: true,
          autoRenew: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Store subscription (in real app, this would be saved to database)
      await this.saveSubscription(subscription)

      return subscription
    } catch (error) {
      throw error
    }
  }

  async activateSubscription(
    subscriptionId: string,
    transactionHash: string
  ): Promise<CryptoSubscription> {
    try {
      const subscription = await this.getSubscription(subscriptionId)
      if (!subscription) {
        throw new Error('Subscription not found')
      }

      const transaction = subscription.transactions.find(t => t.id === subscription.transactions[0].id)
      if (!transaction) {
        throw new Error('Transaction not found')
      }

      // Update transaction with hash
      transaction.transactionHash = transactionHash
      transaction.status = 'processing'

      // Confirm transaction
      const confirmation = await this.paymentService.confirmTransaction(
        transactionHash,
        transaction.network,
        transaction.amount
      )

      transaction.confirmation = confirmation

      if (confirmation.status === 'confirmed') {
        subscription.status = 'active'
        transaction.status = 'active'
        subscription.currentPeriod.start = new Date()
        subscription.currentPeriod.end = this.calculateEndDate(subscription.planId)
        transaction.activatedAt = new Date()
        transaction.expiresAt = subscription.currentPeriod.end
        transaction.nextBillingAt = subscription.currentPeriod.end
      } else {
        subscription.status = 'expired'
        transaction.status = 'expired'
      }

      subscription.updatedAt = new Date()

      await this.saveSubscription(subscription)

      return subscription
    } catch (error) {
      throw error
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<CryptoSubscription> {
    try {
      const subscription = await this.getSubscription(subscriptionId)
      if (!subscription) {
        throw new Error('Subscription not found')
      }

      if (subscription.status !== 'active') {
        throw new Error('Only active subscriptions can be cancelled')
      }

      subscription.status = 'cancelled'
      subscription.features.canCancel = false
      subscription.features.autoRenew = false
      subscription.updatedAt = new Date()

      // Update all pending transactions
      subscription.transactions.forEach(tx => {
        if (tx.status === 'pending') {
          tx.status = 'cancelled'
        }
      })

      await this.saveSubscription(subscription)

      return subscription
    } catch (error) {
      throw error
    }
  }

  async pauseSubscription(subscriptionId: string): Promise<CryptoSubscription> {
    try {
      const subscription = await this.getSubscription(subscriptionId)
      if (!subscription) {
        throw new Error('Subscription not found')
      }

      if (!subscription.features.canPause) {
        throw new Error('This subscription cannot be paused')
      }

      subscription.status = 'suspended'
      subscription.features.canPause = false
      subscription.updatedAt = new Date()

      await this.saveSubscription(subscription)

      return subscription
    } catch (error) {
      throw error
    }
  }

  async resumeSubscription(subscriptionId: string): Promise<CryptoSubscription> {
    try {
      const subscription = await this.getSubscription(subscriptionId)
      if (!subscription) {
        throw new Error('Subscription not found')
      }

      if (subscription.status !== 'suspended') {
        throw new Error('Only suspended subscriptions can be resumed')
      }

      subscription.status = 'active'
      subscription.features.canPause = true
      subscription.currentPeriod.end = this.calculateEndDate(subscription.planId)
      subscription.updatedAt = new Date()

      await this.saveSubscription(subscription)

      return subscription
    } catch (error) {
      throw error
    }
  }

  async upgradeSubscription(
    subscriptionId: string,
    newPlanId: string
  ): Promise<CryptoSubscription> {
    try {
      const subscription = await this.getSubscription(subscriptionId)
      if (!subscription) {
        throw new Error('Subscription not found')
      }

      if (!subscription.features.canUpgrade) {
        throw new Error('This subscription cannot be upgraded')
      }

      const newPlan = SUBSCRIPTION_PLANS_CRYPTO.find(p => p.id === newPlanId)
      if (!newPlan) {
        throw new Error('Invalid plan')
      }

      const currentPlan = SUBSCRIPTION_PLANS_CRYPTO.find(p => p.id === subscription.planId)
      if (!currentPlan) {
        throw new Error('Current plan not found')
      }

      // Check if it's actually an upgrade (higher price)
      if (parseFloat(newPlan.price.amount) <= parseFloat(currentPlan.price.amount)) {
        throw new Error('New plan must be more expensive for upgrade')
      }

      // Create upgrade transaction
      const upgradeTransaction = await this.paymentService.createSubscription(
        newPlanId,
        subscription.walletAddress,
        newPlan.price.currency,
        'ethereum' // Default network, should be dynamic
      )

      subscription.planId = newPlanId
      subscription.transactions.push(upgradeTransaction)
      subscription.updatedAt = new Date()

      await this.saveSubscription(subscription)

      return subscription
    } catch (error) {
      throw error
    }
  }

  async downgradeSubscription(
    subscriptionId: string,
    newPlanId: string
  ): Promise<CryptoSubscription> {
    try {
      const subscription = await this.getSubscription(subscriptionId)
      if (!subscription) {
        throw new Error('Subscription not found')
      }

      if (!subscription.features.canDowngrade) {
        throw new Error('This subscription cannot be downgraded')
      }

      const newPlan = SUBSCRIPTION_PLANS_CRYPTO.find(p => p.id === newPlanId)
      if (!newPlan) {
        throw new Error('Invalid plan')
      }

      const currentPlan = SUBSCRIPTION_PLANS_CRYPTO.find(p => p.id === subscription.planId)
      if (!currentPlan) {
        throw new Error('Current plan not found')
      }

      // Check if it's actually a downgrade (lower price)
      if (parseFloat(newPlan.price.amount) >= parseFloat(currentPlan.price.amount)) {
        throw new Error('New plan must be less expensive for downgrade')
      }

      // Downgrade takes effect at next billing cycle
      subscription.planId = newPlanId
      subscription.updatedAt = new Date()

      await this.saveSubscription(subscription)

      return subscription
    } catch (error) {
      throw error
    }
  }

  async renewSubscription(subscriptionId: string): Promise<CryptoSubscription> {
    try {
      const subscription = await this.getSubscription(subscriptionId)
      if (!subscription) {
        throw new Error('Subscription not found')
      }

      if (subscription.status !== 'active') {
        throw new Error('Only active subscriptions can be renewed')
      }

      if (!subscription.features.autoRenew) {
        throw new Error('Auto-renewal is disabled for this subscription')
      }

      const plan = SUBSCRIPTION_PLANS_CRYPTO.find(p => p.id === subscription.planId)
      if (!plan) {
        throw new Error('Plan not found')
      }

      // Create renewal transaction
      const renewalTransaction = await this.paymentService.createSubscription(
        subscription.planId,
        subscription.walletAddress,
        plan.price.currency,
        'ethereum' // Default network, should be dynamic
      )

      subscription.transactions.push(renewalTransaction)
      subscription.currentPeriod.start = new Date()
      subscription.currentPeriod.end = this.calculateEndDate(subscription.planId)
      subscription.updatedAt = new Date()

      await this.saveSubscription(subscription)

      return subscription
    } catch (error) {
      throw error
    }
  }

  async getSubscription(subscriptionId: string): Promise<CryptoSubscription | null> {
    // In a real app, this would query the database
    const subscriptions = this.getStoredSubscriptions()
    return subscriptions.find(s => s.id === subscriptionId) || null
  }

  async getUserSubscriptions(walletAddress: string): Promise<CryptoSubscription[]> {
    // In a real app, this would query the database
    const subscriptions = this.getStoredSubscriptions()
    return subscriptions.filter(s => s.walletAddress === walletAddress)
  }

  async getAllSubscriptions(): Promise<CryptoSubscription[]> {
    // In a real app, this would query the database with admin access
    return this.getStoredSubscriptions()
  }

  async getSubscriptionStats(): Promise<{
    total: number
    active: number
    cancelled: number
    expired: number
    suspended: number
  }> {
    const subscriptions = await this.getAllSubscriptions()
    
    return {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'active').length,
      cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
      expired: subscriptions.filter(s => s.status === 'expired').length,
      suspended: subscriptions.filter(s => s.status === 'suspended').length
    }
  }

  private calculateEndDate(planId: string): Date {
    const plan = SUBSCRIPTION_PLANS_CRYPTO.find(p => p.id === planId)
    if (!plan) {
      throw new Error('Plan not found')
    }

    const now = new Date()
    
    switch (plan.frequency) {
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1))
      case 'quarterly':
        return new Date(now.setMonth(now.getMonth() + 3))
      case 'annual':
        return new Date(now.setFullYear(now.getFullYear() + 1))
      default:
        return new Date(now.setMonth(now.getMonth() + 1))
    }
  }

  private async saveSubscription(subscription: CryptoSubscription): Promise<void> {
    // In a real app, this would save to database
    const subscriptions = this.getStoredSubscriptions()
    const existingIndex = subscriptions.findIndex(s => s.id === subscription.id)
    
    if (existingIndex >= 0) {
      subscriptions[existingIndex] = subscription
    } else {
      subscriptions.push(subscription)
    }

    localStorage.setItem('crypto_subscriptions', JSON.stringify(subscriptions))
  }

  private getStoredSubscriptions(): CryptoSubscription[] {
    // In a real app, this would query the database
    try {
      const stored = localStorage.getItem('crypto_subscriptions')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      return []
    }
  }

  private clearStoredSubscriptions(): void {
    localStorage.removeItem('crypto_subscriptions')
  }
}
