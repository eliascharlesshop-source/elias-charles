"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SubscriptionPlan, IEBox } from '@/types/box-model'

interface Subscription {
  id: string
  planId: string
  status: 'active' | 'paused' | 'cancelled'
  nextDelivery: Date
  boxes: string[]
  frequency: 'monthly' | 'quarterly'
  discount: number
}

interface SubscriptionContextType {
  subscriptions: Subscription[]
  activeSubscription: Subscription | null
  subscribe: (planId: string) => Promise<void>
  cancel: (subscriptionId: string) => Promise<void>
  pause: (subscriptionId: string) => Promise<void>
  resume: (subscriptionId: string) => Promise<void>
  updateBoxPreferences: (subscriptionId: string, boxes: string[]) => Promise<void>
  isLoading: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load subscriptions from localStorage on mount
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('ie-subscriptions')
    if (savedSubscriptions) {
      try {
        const parsed = JSON.parse(savedSubscriptions)
        setSubscriptions(parsed.map((sub: any) => ({
          ...sub,
          nextDelivery: new Date(sub.nextDelivery)
        })))
      } catch (error) {
        console.error('Failed to load subscriptions:', error)
      }
    }
  }, [])

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    if (subscriptions.length > 0) {
      localStorage.setItem('ie-subscriptions', JSON.stringify(subscriptions))
    }
  }, [subscriptions])

  const activeSubscription = subscriptions.find(sub => sub.status === 'active') || null

  const subscribe = async (planId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Find plan details (in real app, this would come from API)
      const plan: SubscriptionPlan = {
        id: planId,
        name: planId.includes('starter') ? 'IE Starter Subscription' : 
              planId.includes('street') ? 'IE Street Subscription' : 
              'IE Complete Subscription',
        description: 'Premium IE box subscription',
        boxes: planId.includes('complete') ? ['ie-starter', 'ie-street', 'ie-layered'] :
               planId.includes('street') ? ['ie-street'] : ['ie-starter'],
        frequency: planId.includes('complete') ? 'quarterly' : 'monthly',
        discount: planId.includes('complete') ? 0.20 : 0.15,
        price: planId.includes('complete') ? 179 : planId.includes('street') ? 119 : 59
      }

      const newSubscription: Subscription = {
        id: `sub_${Date.now()}`,
        planId,
        status: 'active',
        nextDelivery: new Date(Date.now() + (plan.frequency === 'monthly' ? 30 : 90) * 24 * 60 * 60 * 1000),
        boxes: plan.boxes,
        frequency: plan.frequency,
        discount: plan.discount
      }

      setSubscriptions(prev => [...prev, newSubscription])
    } catch (error) {
      console.error('Failed to subscribe:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const cancel = async (subscriptionId: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'cancelled' as const }
            : sub
        )
      )
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const pause = async (subscriptionId: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'paused' as const }
            : sub
        )
      )
    } catch (error) {
      console.error('Failed to pause subscription:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resume = async (subscriptionId: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'active' as const }
            : sub
        )
      )
    } catch (error) {
      console.error('Failed to resume subscription:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateBoxPreferences = async (subscriptionId: string, boxes: string[]) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, boxes }
            : sub
        )
      )
    } catch (error) {
      console.error('Failed to update box preferences:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SubscriptionContext.Provider value={{
      subscriptions,
      activeSubscription,
      subscribe,
      cancel,
      pause,
      resume,
      updateBoxPreferences,
      isLoading
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
