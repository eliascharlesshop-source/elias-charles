"use client"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // On mount, check localStorage or system preference
    const saved = localStorage.getItem("theme")
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    } else {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    }
  }, [])

  const toggle = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDark(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setIsDark(true)
    }
  }

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 bg-theme-surface border border-gray-300 dark:border-[#292A2B] rounded-full shadow-lg p-3 transition-colors hover:bg-cream dark:hover:bg-[#292A2B]"
    >
      {isDark ? (
        <Sun className="h-6 w-6 text-primary" aria-hidden="true" />
      ) : (
        <Moon className="h-6 w-6 text-primary" aria-hidden="true" />
      )}
    </button>
  )
}
