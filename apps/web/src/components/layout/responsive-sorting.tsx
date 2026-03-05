"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface SortOption {
  name: string
  value: string
}

interface ResponsiveSortingProps {
  options: SortOption[]
  defaultValue?: string
  onSortChange?: (value: string) => void
}

export function ResponsiveSorting({ options, defaultValue = options[0]?.value, onSortChange }: ResponsiveSortingProps) {
  const [open, setOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === defaultValue) || options[0],
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelect = (option: SortOption) => {
    setSelectedOption(option)
    setOpen(false)
    if (onSortChange) {
      onSortChange(option.value)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="group inline-flex justify-center text-sm font-medium text-primary hover:text-gray-500"
          id="menu-button"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen(!open)}
        >
          Sort
          <ChevronDown
            className={`-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-primary group-hover:text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {open && (
        <div
          className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  selectedOption.value === option.value ? "font-medium text-primary" : "text-gray-500"
                }`}
                role="menuitem"
                tabIndex={-1}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
