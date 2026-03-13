"use client"

import { useState, useEffect } from 'react'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Calendar, Clock, Users, TrendingUp } from 'lucide-react'

interface LaunchPhase {
  week: number
  title: string
  boxes: string[]
  status: 'completed' | 'active' | 'upcoming'
  startDate: Date
  endDate: Date
  metrics?: {
    sales: number
    target: number
    conversion: number
  }
}

interface LaunchProgressProps {
  currentWeek?: number
  phases?: LaunchPhase[]
}

export function LaunchProgress({ 
  currentWeek = 1, 
  phases = defaultPhases 
}: LaunchProgressProps) {
  const [overallProgress, setOverallProgress] = useState(0)
  const [timeProgress, setTimeProgress] = useState(0)

  useEffect(() => {
    // Calculate overall progress based on completed phases
    const completedPhases = phases.filter(p => p.status === 'completed').length
    const totalPhases = phases.length
    setOverallProgress((completedPhases / totalPhases) * 100)

    // Calculate time progress through current phase
    const activePhase = phases.find(p => p.status === 'active')
    if (activePhase) {
      const now = new Date()
      const phaseDuration = activePhase.endDate.getTime() - activePhase.startDate.getTime()
      const elapsed = now.getTime() - activePhase.startDate.getTime()
      setTimeProgress(Math.min((elapsed / phaseDuration) * 100, 100))
    }
  }, [phases, currentWeek])

  const getStatusColor = (status: LaunchPhase['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'active': return 'bg-blue-500'
      case 'upcoming': return 'bg-gray-300'
    }
  }

  const getStatusBadge = (status: LaunchPhase['status']) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'active': return <Badge className="bg-blue-100 text-blue-800">Active</Badge>
      case 'upcoming': return <Badge variant="outline">Upcoming</Badge>
    }
  }

  return (
    <section className="space-y-8">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Launch Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Campaign Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Week {currentWeek} of 3</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Spring 2026 Collection</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>4 Box Configurations</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase-by-Phase Progress */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Launch Phases</h3>
        
        {phases.map((phase, index) => (
          <Card key={phase.week} className={phase.status === 'active' ? 'border-blue-300' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Week {phase.week}: {phase.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {phase.boxes.map((box) => (
                      <Badge key={box} variant="outline" className="text-xs">
                        {box.replace('ie-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
                {getStatusBadge(phase.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Phase Progress */}
              {phase.status === 'active' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Week Progress</span>
                    <span>{Math.round(timeProgress)}%</span>
                  </div>
                  <Progress value={timeProgress} className="h-2" />
                </div>
              )}

              {/* Phase Timeline */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{phase.startDate.toLocaleDateString()}</span>
                </div>
                <span>→</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{phase.endDate.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Metrics (for completed phases) */}
              {phase.status === 'completed' && phase.metrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {phase.metrics.sales}
                    </div>
                    <div className="text-sm text-gray-600">Boxes Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((phase.metrics.sales / phase.metrics.target) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">of Target</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {phase.metrics.conversion}%
                    </div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </div>
              )}

              {/* Upcoming Phase Preview */}
              {phase.status === 'upcoming' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    This phase will focus on {phase.title.toLowerCase()} with strategic emphasis on 
                    {phase.week === 3 ? ' scarcity and creator storytelling' : 
                     phase.week === 2 ? ' premium positioning and AOV growth' : 
                     ' volume and social proof generation'}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">68%</div>
              <div className="text-sm text-gray-600">Average Margin</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">$142</div>
              <div className="text-sm text-gray-600">Average Order Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">4.2%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">18%</div>
              <div className="text-sm text-gray-600">Subscription Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

// Default launch phases data
const defaultPhases: LaunchPhase[] = [
  {
    week: 1,
    title: "Foundation Launch",
    boxes: ["ie-starter", "ie-street"],
    status: 'completed',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-03-07'),
    metrics: {
      sales: 156,
      target: 150,
      conversion: 4.2
    }
  },
  {
    week: 2,
    title: "Premium Expansion",
    boxes: ["ie-layered"],
    status: 'active',
    startDate: new Date('2026-03-08'),
    endDate: new Date('2026-03-14'),
    metrics: {
      sales: 89,
      target: 100,
      conversion: 3.8
    }
  },
  {
    week: 3,
    title: "Limited Edition",
    boxes: ["ie-diamond"],
    status: 'upcoming',
    startDate: new Date('2026-03-15'),
    endDate: new Date('2026-03-21')
  }
]
