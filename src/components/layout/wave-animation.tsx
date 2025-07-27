"use client"

interface WaveAnimationProps {
  height?: number
  width?: number
  color?: string
  speed?: number
  className?: string
}

export function WaveAnimation({
  height = 100,
  width = 1200,
  color = "#d0e1f2",
  speed = 0.5,
  className = "",
}: WaveAnimationProps) {
  // Return an empty div with the same dimensions instead of the animation
  return (
    <div
      className={`w-full ${className}`}
      style={{
        height: `${height}px`,
        backgroundColor: color,
        opacity: 0.2,
      }}
    />
  )
}
