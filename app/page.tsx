"use client"

import { PullQuote } from "@/components/layout/pull-quote"
import { DevNotice } from "@/components/ui/dev-notice"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { BoxShowcase } from "@/components/boxes/box-showcase"
import { CryptoSubscriptionPlans } from "@/src/components/crypto/crypto-subscription-plans"
import { WalletConnector } from "@/src/components/crypto/wallet-connector"
import { CryptoPaymentFlow } from "@/src/components/crypto/crypto-payment-flow"
import { useState } from "react"
import { IE_BOXES } from "@/data/box-config"
import { Cryptocurrency, Network, CryptoSubscription, PaymentProcessingError } from "@/types/crypto-subscription"

interface Product {
  id: string
  title: string
  handle: string
  price: number
  compareAtPrice?: number
  images: string[]
  vendor: string
  description: string
}

interface Collection {
  id: string
  title: string
  handle: string
  description: string
  image?: string
}

export default function Home() {
  const [currentWeek, setCurrentWeek] = useState(1)
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(true)
  const [showPaymentFlow, setShowPaymentFlow] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<Cryptocurrency>('ETH')
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('ethereum')

  const handleSubscribe = (boxId: string) => {
    console.log('Subscribe to box:', boxId)
    // TODO: Redirect to box crypto subscription
  }

  const handleLearnMore = (boxId: string) => {
    console.log('Learn more about box:', boxId)
    // TODO: Navigate to box details
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
    // TODO: Show success message and redirect to subscription management
  }

  const handlePaymentError = (error: PaymentProcessingError) => {
    console.error('Payment failed:', error)
    // TODO: Show error handling
  }

  const handlePaymentCancel = () => {
    setShowPaymentFlow(false)
    setSelectedPlan(null)
  }

  return (
    <div className="magazine-layout">
      {/* Magazine Cover Hero - Always shows immediately */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src="/images/ocean-bw-1.jpg"
            alt="Ocean waves in black and white"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24">
          <div className="max-w-md">
            <span className="inline-block mb-4 text-xs tracking-widest uppercase text-white border-b pb-1">
              Spring 2026 Collection
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-widest uppercase text-white mb-6">
              Inland Empire <br /> Box Model
            </h1>
            <p className="text-white text-sm sm:text-base md:text-lg mb-8 max-w-sm">
              Curated boxes around seasonal moments. Simplified decisions, elevated experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#boxes"
                className="inline-block bg-white text-beach-darker px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-gray-100 transition-colors text-center"
              >
                Explore Boxes
              </Link>
              <Link
                href="#subscription"
                className="inline-block border border-white text-white px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-beach-darker transition-colors text-center"
              >
                Pay with Crypto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Box Model Showcase */}
      <section id="boxes" className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <BoxShowcase 
            boxes={IE_BOXES}
            onSubscribe={handleSubscribe}
            onLearnMore={handleLearnMore}
            currentWeek={currentWeek}
          />
        </div>
      </section>

      {/* Pull Quote */}
      <PullQuote
        quote="Perfect move. An IE Box model will raise AOV, simplify decisions, and make the drop feel collectible."
        author="IE Strategy Team"
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

      {/* Editorial Grid - Always shows */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl uppercase tracking-wider steel-gradient mb-12">Trending Now</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "The Rise of Sustainable Surf Gear",
                  excerpt: "How eco-conscious brands are changing the industry standard.",
                  image: "/images/ocean-bw-2.jpg",
                },
                {
                  title: "Summer Essentials",
                  excerpt: "The must-have pieces for your beach days and beyond.",
                  image: "/images/ocean-bw-3.jpg",
                },
                {
                  title: "Skate Culture Meets High Fashion",
                  excerpt: "The unexpected influence of skate aesthetics on runway trends.",
                  image: "/images/lifestyle/palm-trees-street-1.jpg",
                },
              ].map((article, index) => (
                <div key={index} className="group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-6">
                    <span className="text-xs uppercase tracking-widest text-beach-darker mb-3">Trending</span>
                    <h3 className="text-lg sm:text-xl uppercase tracking-wider text-gray-900 mt-2 group-hover:opacity-70 transition-opacity leading-tight">
                      {article.title}
                    </h3>
                    <p className="steel-text mt-3 text-sm sm:text-base leading-relaxed">{article.excerpt}</p>
                    <Link
                      href="/in-life"
                      className="inline-block mt-4 text-xs uppercase tracking-widest steel-text border-b border-gray-400 pb-1 hover:border-beach-darker"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Rest of the static content that always shows */}
      {/* Category Feature */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-widest steel-text mb-6">Featured Collection</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider steel-gradient mb-6 leading-tight">
                The Skate <br />
                Collection
              </h2>
              <p className="steel-text mb-6 text-sm sm:text-base leading-relaxed">
                From street to beach, our skate collection combines performance, style, and sustainability. Designed for
                those who see the world as their playground.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <span className="block w-8 h-0.5 bg-beach-darker mb-4"></span>
                  <p className="text-sm steel-text leading-relaxed">Sustainable materials that don't compromise on performance</p>
                </div>
                <div>
                  <span className="block w-8 h-0.5 bg-beach-darker mb-4"></span>
                  <p className="text-sm steel-text leading-relaxed">Designed by skaters for skaters with coastal influences</p>
                </div>
              </div>
              <Link
                href="/collections/boards"
                className="inline-block bg-white border border-gray-300 text-beach-darker px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors"
              >
                Explore Collection
              </Link>
            </div>
            <div>
              <div className="aspect-[4/5] overflow-hidden">
                <img src="/images/brand/highway-lights-2.jpg" alt="Skate collection" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Square Grid - Nature/Product Alternating Pattern */}
      <section className="bg-cream">
        <div className="grid grid-cols-2 md:grid-cols-2">
          {/* Row 1: Nature Product */}
          <div className="aspect-square">
            <img src="/images/ocean-bw-4.jpg" alt="Ocean waves" className="h-full w-full object-cover" />
          </div>
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-gray-900 mb-3 sm:mb-4 leading-tight">Summer Essentials</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                Discover our curated collection of beach-ready items for the perfect summer.
              </p>
              <Link
                href="/collections"
                className="inline-block border border-gray-300 text-beach-darker px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Row 2: Product Nature */}
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-gray-900 mb-3 sm:mb-4 leading-tight">Surf Collection</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">Performance gear designed for those who live for the waves.</p>
              <Link
                href="/collections/boards"
                className="inline-block border border-gray-300 text-beach-darker px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                Explore
              </Link>
            </div>
          </div>
          <div className="aspect-square">
            <img src="/images/lifestyle/palm-trees-sky-1.jpg" alt="Ocean landscape" className="h-full w-full object-cover" />
          </div>

          {/* Row 3: Nature Product */}
          <div className="aspect-square">
            <img src="/images/ocean-bw-5.jpg" alt="Beach sunset" className="h-full w-full object-cover" />
          </div>
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-gray-900 mb-3 sm:mb-4 leading-tight">Coastal Living</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">Bring the beach home with our curated home and lifestyle products.</p>
              <Link
                href="/collections/life"
                className="inline-block border border-gray-300 text-beach-darker px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                Discover
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Article / Editorial */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/images/brand/highway-lights-1.jpg"
                  alt="Night highway with streaking lights"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center max-w-2xl">
              <span className="text-xs uppercase tracking-widest steel-text mb-6">Featured Article</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider steel-gradient mb-6 leading-tight">
                The Art of Sustainable Surfwear
              </h2>
              <p className="steel-text mb-6 text-sm sm:text-base leading-relaxed">
                Our latest collection represents our commitment to sustainable fashion that doesn't compromise on style
                or performance. Each piece is crafted with attention to environmental impact, using organic cotton and
                eco-friendly dyes.
              </p>
              <p className="steel-text mb-8 text-sm sm:text-base leading-relaxed">
                We spoke with our designers about the inspiration behind the collection and the challenges of creating
                high-performance gear that respects our oceans.
              </p>
              <Link
                href="/in-life"
                className="inline-block text-sm uppercase tracking-widest steel-text border-b border-gray-400 pb-1 hover:border-beach-darker"
              >
                Read the full story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
