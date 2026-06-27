'use client'

import React from 'react'

interface GlassmorphicButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export function GlassmorphicButton({
  children,
  onClick,
  href,
  className = '',
  type = 'button'
}: GlassmorphicButtonProps) {
  const baseStyles = `
    relative px-6 py-3 text-sm uppercase tracking-widest font-bold
    overflow-hidden group
    border border-white/30
    backdrop-blur-md
    bg-white/10
    hover:bg-white/20
    text-white
    transition-all duration-300
    rounded-lg
  `

  const content = (
    <>
      {/* Wave distortion effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
          style={{ filter: 'url(#wave-filter)' }}
        >
          <defs>
            <filter id="wave-filter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.02"
                numOctaves="3"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="15"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
          <rect
            width="400"
            height="100"
            fill="rgba(255, 255, 255, 0.2)"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Liquid shimmer animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></div>

      {/* Text content */}
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${className} inline-flex`}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${className}`}
    >
      {content}
    </button>
  )
}
