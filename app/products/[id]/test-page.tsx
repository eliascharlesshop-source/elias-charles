"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function TestProductPage() {
  const params = useParams()
  const id = params?.id as string
  const [loading, setLoading] = useState(true)

  console.log('TestProductPage component mounted, id:', id)

  useEffect(() => {
    console.log('useEffect triggered with id:', id)
    setTimeout(() => {
      console.log('Setting loading to false')
      setLoading(false)
    }, 2000)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fdf4ec" }}>
        <div className="text-center">
          <p className="text-primary">Test Loading... ID: {id}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fdf4ec" }}>
      <div className="text-center">
        <p className="text-primary">Test Loaded! ID: {id}</p>
      </div>
    </div>
  )
}