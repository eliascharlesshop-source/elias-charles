import type { ReactNode } from "react"

interface BeachSectionProps {
  children: ReactNode
  title?: string
  className?: string
  withWave?: boolean
}

export function BeachSection({ children, title, className = "", withWave = false }: BeachSectionProps) {
  return (
    <section className={`relative bg-[#f8f9fa] border-l-4 border-[#d0e1f2] p-6 rounded-r-md ${className}`}>
      {title && <h2 className="text-xl font-normal tracking-wider uppercase mb-4">{title}</h2>}
      {children}
    </section>
  )
}
