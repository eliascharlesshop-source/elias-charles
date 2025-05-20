import type React from "react"

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">{children}</main>
    </div>
  )
}
