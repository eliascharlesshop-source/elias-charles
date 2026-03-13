"use client"

import { IEBox } from '@/types/box-model'
import { BoxCard } from './box-card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { ArrowRight, Calendar, Gift, Sparkles } from 'lucide-react'

interface BoxShowcaseProps {
  boxes: IEBox[]
  onSubscribe?: (boxId: string) => void
  onLearnMore?: (boxId: string) => void
  currentWeek?: number
}

export function BoxShowcase({ boxes, onSubscribe, onLearnMore, currentWeek = 1 }: BoxShowcaseProps) {
  const availableBoxes = boxes.filter(box => box.availability === 'available')
  const limitedBoxes = boxes.filter(box => box.isLimited || box.availability === 'limited')
  const comingSoonBoxes = boxes.filter(box => box.availability === 'coming-soon')
  
  const thisWeekBoxes = boxes.filter(box => box.launchWeek === currentWeek)
  const nextWeekBoxes = boxes.filter(box => box.launchWeek === currentWeek + 1)

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <Badge variant="secondary" className="text-blue-700 bg-blue-100">
            New Box Model Launch
          </Badge>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Inland Empire
            <span className="block text-blue-600">Box Collection</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curated boxes that raise AOV, simplify decisions, and make the drop feel collectible.
            Built around upcoming seasonal moments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Launch Week {currentWeek}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Gift className="w-4 h-4" />
            <span>{boxes.length} Premium Boxes</span>
          </div>
        </div>
      </section>

      {/* This Week's Launch */}
      {thisWeekBoxes.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">This Week's Launch</h2>
              <p className="text-gray-600">Available now - limited quantities</p>
            </div>
            <Badge className="bg-green-100 text-green-800">Live</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thisWeekBoxes.map((box) => (
              <BoxCard
                key={box.id}
                box={box}
                onSubscribe={onSubscribe}
                onLearnMore={onLearnMore}
                progress={box.launchWeek === currentWeek ? 100 : 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Available Boxes */}
      {availableBoxes.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Complete Collection</h2>
            <p className="text-gray-600">Choose your perfect IE experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBoxes.map((box) => (
              <BoxCard
                key={box.id}
                box={box}
                onSubscribe={onSubscribe}
                onLearnMore={onLearnMore}
                progress={box.launchWeek && box.launchWeek <= currentWeek ? 100 : 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Limited Edition */}
      {limitedBoxes.length > 0 && (
        <section className="space-y-6 bg-orange-50 p-8 rounded-xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-900">Limited Edition</h2>
            <p className="text-orange-700">Exclusive drops with creator stories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {limitedBoxes.map((box) => (
              <BoxCard
                key={box.id}
                box={box}
                onSubscribe={onSubscribe}
                onLearnMore={onLearnMore}
                progress={0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Coming Soon */}
      {comingSoonBoxes.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
            <p className="text-gray-600">Get notified when these boxes drop</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonBoxes.map((box) => (
              <BoxCard
                key={box.id}
                box={box}
                onSubscribe={onSubscribe}
                onLearnMore={onLearnMore}
                progress={0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Next Week Preview */}
      {nextWeekBoxes.length > 0 && (
        <section className="space-y-6 bg-gray-50 p-8 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Next Week</h3>
              <p className="text-gray-600">Preview of upcoming releases</p>
            </div>
            <Badge variant="outline">Week {currentWeek + 1}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nextWeekBoxes.map((box) => (
              <Card key={box.id} className="opacity-75">
                <CardHeader>
                  <CardTitle className="text-lg">{box.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{box.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">${box.targetPrice.min}</span>
                    <Button variant="outline" size="sm" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="text-center space-y-6 bg-blue-50 p-12 rounded-xl">
        <h2 className="text-3xl font-bold text-gray-900">Ready to Build Your Collection?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join the Inland Empire subscription and never miss a drop. Get exclusive access to limited editions and member-only perks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8">
            Subscribe Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            Learn More
          </Button>
        </div>
      </section>
    </div>
  )
}
