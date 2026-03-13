"use client"

import { SubscriptionPlan } from '@/types/box-model'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Check, Star, Calendar, Percent } from 'lucide-react'

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[]
  onSubscribe?: (planId: string) => void
}

export function SubscriptionPlans({ plans, onSubscribe }: SubscriptionPlansProps) {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Subscription Plans</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join the IE subscription and get curated boxes delivered regularly. 
          Save up to 20% with annual plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative overflow-hidden ${
            plan.name.includes('Complete') ? 'border-2 border-blue-300' : ''
          }`}>
            {plan.name.includes('Complete') && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-bold">
                Most Popular
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-gray-900">
                {plan.name}
              </CardTitle>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Price */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                  <span className="text-lg text-gray-500 font-normal">
                    /{plan.frequency === 'monthly' ? 'month' : 'quarter'}
                  </span>
                </div>
                {plan.discount > 0 && (
                  <div className="flex items-center justify-center text-green-600 text-sm mt-2">
                    <Percent className="w-4 h-4 mr-1" />
                    Save {Math.round(plan.discount * 100)}%
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  {plan.frequency === 'monthly' ? 'Monthly' : 'Quarterly'} delivery
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-blue-500" />
                  {plan.boxes.length} box{plan.boxes.length > 1 ? 'es' : ''} included
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-semibold text-gray-700">Included Boxes:</h4>
                  {plan.boxes.map((boxId) => (
                    <div key={boxId} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      {boxId.replace('ie-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => onSubscribe?.(plan.id)}
                variant={plan.name.includes('Complete') ? 'default' : 'outline'}
              >
                {plan.name.includes('Complete') ? 'Subscribe Now' : 'Choose Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
