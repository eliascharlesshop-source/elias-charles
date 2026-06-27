"use client"

import { useState } from "react"
import { BoxShowcase } from "@/components/boxes/box-showcase"
import { RegionSelector } from "@/components/boxes/region-selector"
import { PullQuote } from "@/components/layout/pull-quote"
import { CryptoSubscriptionPlans } from "@/src/components/crypto/crypto-subscription-plans"
import { WalletConnector } from "@/src/components/crypto/wallet-connector"
import { CryptoPaymentFlow } from "@/src/components/crypto/crypto-payment-flow"
import { IE_BOXES, IV_BOXES } from "@/data/box-config"
import { Cryptocurrency, Network, CryptoSubscription, PaymentProcessingError } from "@/types/crypto-subscription"

type Region = 'ie' | 'iv'

export default function BoxesPage() {
  const [region, setRegion] = useState<Region>('ie')
  const [currentWeek, setCurrentWeek] = useState(1)
  const [showPaymentFlow, setShowPaymentFlow] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<Cryptocurrency>('ETH')
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('ethereum')

  const boxes = region === 'ie' ? IE_BOXES : IV_BOXES
  const regionTitle = region === 'ie' ? 'Inland Empire' : 'Isla Vista'
  const regionDescription = region === 'ie' 
    ? 'Street culture meets curated drops. Essential basics with signature style.' 
    : 'Coastal living essentials. Island vibes with premium materials.'

  const handleSubscribe = (boxId: string) => {
    console.log('Subscribe to box:', boxId)
  }

  const handleLearnMore = (boxId: string) => {
    console.log('Learn more about box:', boxId)
  }

  const handleCryptoSubscribe = (planId: string, currency: Cryptocurrency, network: Network) => {
    setSelectedPlan(planId)
    setSelectedCurrency(currency)
    setSelectedNetwork(network)
    setShowPaymentFlow(true)
  }

  const handlePaymentSuccess = (subscription: CryptoSubscription) => {
    console.log('Payment successful:', subscription)
    setShowPaymentFlow(false)
    setSelectedPlan(null)
  }

  const handlePaymentError = (error: PaymentProcessingError) => {
    console.error('Payment failed:', error)
  }

  const handlePaymentCancel = () => {
    setShowPaymentFlow(false)
    setSelectedPlan(null)
  }

  return (
    <div className="magazine-layout">
      {/* Page Hero */}
      <section className="py-12 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block mb-4 text-xs tracking-widest uppercase text-beach-darker border-b pb-1">
            Spring 2026 Collection
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest uppercase text-gray-900 mb-4">
            {regionTitle} Boxes
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            {regionDescription}
          </p>
          
          {/* Region Selector */}
          <RegionSelector selectedRegion={region} onRegionChange={setRegion} />
        </div>
      </section>

      {/* Box Showcase */}
      <section id="boxes" className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <BoxShowcase 
            boxes={boxes}
            onSubscribe={handleSubscribe}
            onLearnMore={handleLearnMore}
            currentWeek={currentWeek}
          />
        </div>
      </section>

      {/* Pull Quote */}
      <PullQuote
        quote={region === 'ie' 
          ? "Perfect move. An IE Box model will raise AOV, simplify decisions, and make the drop feel collectible."
          : "Island living made simple. Curated pieces that bring coastal elegance to everyday style."
        }
        author={region === 'ie' ? "IE Strategy Team" : "IV Design Team"}
      />

      {/* Crypto Subscription Plans */}
      <section id="subscription" className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <CryptoSubscriptionPlans onSubscribe={handleCryptoSubscribe} />
        </div>
      </section>

      {/* Wallet Connector */}
      <section className="py-8 px-6 sm:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <WalletConnector />
        </div>
      </section>

      {/* Payment Flow Modal */}
      {showPaymentFlow && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CryptoPaymentFlow
              planId={selectedPlan}
              currency={selectedCurrency}
              network={selectedNetwork}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}
    </div>
  )
}
