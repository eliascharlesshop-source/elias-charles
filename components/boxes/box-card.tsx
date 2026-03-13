"use client"

import { IEBox } from '@/types/box-model'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/src/components/ui/card'
import { Progress } from '@/src/components/ui/progress'
import { Star, Package, Clock, TrendingUp } from 'lucide-react'

interface BoxCardProps {
  box: IEBox
  onSubscribe?: (boxId: string) => void
  onLearnMore?: (boxId: string) => void
  progress?: number
}

export function BoxCard({ box, onSubscribe, onLearnMore, progress = 0 }: BoxCardProps) {
  const isAvailable = box.availability === 'available'
  const isLimited = box.isLimited || box.availability === 'limited'
  const isComingSoon = box.availability === 'coming-soon'

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
      isLimited ? 'border-2 border-orange-300' : ''
    } ${isComingSoon ? 'opacity-75' : ''}`}>
      {/* Theme Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
      
      {/* Limited Badge */}
      {isLimited && (
        <Badge className="absolute top-4 right-4 z-10 bg-orange-500 hover:bg-orange-600">
          Limited Edition
        </Badge>
      )}

      {/* Coming Soon Badge */}
      {isComingSoon && (
        <Badge className="absolute top-4 right-4 z-10 bg-gray-500 hover:bg-gray-600">
          Coming Soon
        </Badge>
      )}

      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{box.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{box.description}</p>
            <Badge variant="secondary" className="text-xs">
              {box.positioning}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {/* Price Range */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${box.targetPrice.min}
            </span>
            {box.targetPrice.max > box.targetPrice.min && (
              <span className="text-lg text-gray-500 ml-2">
                - ${box.targetPrice.max}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              {Math.round(box.margin * 100)}% margin
            </div>
          </div>
        </div>

        {/* Contents Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Box Contents ({box.contents.length} items)
          </h4>
          <div className="grid grid-cols-1 gap-1">
            {box.contents.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between text-xs text-gray-600">
                <span>{item.name}</span>
                <span className="text-gray-400">${item.retailValue}</span>
              </div>
            ))}
            {box.contents.length > 3 && (
              <div className="text-xs text-gray-500 italic">
                +{box.contents.length - 3} more items
              </div>
            )}
          </div>
        </div>

        {/* Launch Info */}
        {box.launchWeek && (
          <div className="flex items-center text-xs text-blue-600">
            <Clock className="w-4 h-4 mr-2" />
            Launch Week {box.launchWeek}
            {box.theme && ` • ${box.theme} Theme`}
          </div>
        )}

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Collection Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Value Proposition */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center text-xs text-blue-700">
            <Star className="w-4 h-4 mr-2" />
            Total Value: ${box.contents.reduce((sum, item) => sum + item.retailValue, 0)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative z-10 pt-3">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onLearnMore?.(box.id)}
          >
            Learn More
          </Button>
          <Button
            size="sm"
            className="flex-1"
            disabled={!isAvailable}
            onClick={() => onSubscribe?.(box.id)}
          >
            {isComingSoon ? 'Notify Me' : isAvailable ? 'Subscribe' : 'Sold Out'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
