import type { ReactNode } from "react"

interface TypographyProps {
  children: ReactNode
  className?: string
}

export function PageTitle({ children, className = "" }: TypographyProps) {
  return (
    <h1
      className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-normal tracking-widest uppercase text-primary leading-tight ${className}`}
    >
      {children}
    </h1>
  )
}

export function SectionTitle({ children, className = "" }: TypographyProps) {
  return (
    <h2
      className={`text-xl xs:text-2xl sm:text-3xl md:text-4xl font-normal tracking-widest uppercase text-primary leading-tight ${className}`}
    >
      {children}
    </h2>
  )
}

export function SubsectionTitle({ children, className = "" }: TypographyProps) {
  return (
    <h3
      className={`text-lg xs:text-xl sm:text-2xl font-normal tracking-wider uppercase text-primary leading-snug ${className}`}
    >
      {children}
    </h3>
  )
}

export function BodyText({ children, className = "" }: TypographyProps) {
  return <p className={`text-sm sm:text-base font-light text-primary leading-relaxed ${className}`}>{children}</p>
}

export function SmallText({ children, className = "" }: TypographyProps) {
  return <p className={`text-xs sm:text-sm font-light text-primary leading-relaxed ${className}`}>{children}</p>
}

export function CTALink({ children, href, className = "" }: TypographyProps & { href: string }) {
  return (
    <a
      href={href}
      className={`text-xs sm:text-sm font-normal tracking-wider uppercase text-primary border-b border-[#d0e1f2] pb-1 hover:text-[#a8c5e0] hover:border-[#a8c5e0] transition-all duration-300 ${className}`}
    >
      {children}
    </a>
  )
}

export function NavLink({ children, href, className = "" }: TypographyProps & { href: string }) {
  return (
    <a
      href={href}
      className={`text-xs sm:text-sm font-normal tracking-widest uppercase text-primary hover:text-[#a8c5e0] transition-colors duration-300 ${className}`}
    >
      {children}
    </a>
  )
}

export function BeachLink({ children, href, className = "" }: TypographyProps & { href: string }) {
  return (
    <a href={href} className={`beach-link text-sm font-normal text-primary ${className}`}>
      {children}
    </a>
  )
}

export function ProductTitle({ children, className = "" }: TypographyProps) {
  return (
    <h3 className={`text-xs sm:text-sm font-normal tracking-wide text-primary line-clamp-2 ${className}`}>
      {children}
    </h3>
  )
}

export function ProductPrice({ children, className = "" }: TypographyProps) {
  return <p className={`text-xs sm:text-sm font-normal text-primary ${className}`}>{children}</p>
}

export function ProductDescription({ children, className = "" }: TypographyProps) {
  return <p className={`text-xs sm:text-sm font-light text-primary leading-relaxed ${className}`}>{children}</p>
}

export function BeachHighlight({ children, className = "" }: TypographyProps) {
  return <span className={`beach-highlight ${className}`}>{children}</span>
}
