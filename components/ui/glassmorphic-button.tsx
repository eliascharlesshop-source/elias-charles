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
