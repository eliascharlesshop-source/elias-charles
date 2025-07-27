"use client"

import { X } from "lucide-react"
import { useState } from "react"

interface FilterOption {
  value: string
  label: string
  checked: boolean
}

interface FilterSection {
  id: string
  name: string
  options: FilterOption[]
}

interface ResponsiveFiltersProps {
  filters: FilterSection[]
  onFilterChange?: (sectionId: string, optionValue: string, checked: boolean) => void
}

export function ResponsiveFilters({ filters, onFilterChange }: ResponsiveFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const handleFilterChange = (sectionId: string, optionValue: string, checked: boolean) => {
    if (onFilterChange) {
      onFilterChange(sectionId, optionValue, checked)
    }
  }

  return (
    <>
      {/* Mobile filter button */}
      <div className="flex items-center lg:hidden">
        <button
          type="button"
          className="ml-4 p-2 text-primary hover:text-gray-500 sm:ml-6"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <span className="sr-only">Filters</span>
          <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Mobile filter dialog */}
      <div className={`relative z-40 lg:hidden ${mobileFiltersOpen ? "" : "hidden"}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-black bg-opacity-25"></div>

        <div className="fixed inset-0 z-40 flex">
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-cream py-4 pb-12 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-primary">Filters</h2>
              <button
                type="button"
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-cream p-2 text-primary"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Filters */}
            <form className="mt-4 border-t border-gray-200">
              {filters.map((section) => (
                <div key={section.id} className="border-t border-gray-200 px-4 py-6">
                  <h3 className="text-sm font-medium text-primary">{section.name}</h3>
                  <div className="mt-4 space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-mobile-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          value={option.value}
                          type="checkbox"
                          defaultChecked={option.checked}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-accent"
                          onChange={(e) => handleFilterChange(section.id, option.value, e.target.checked)}
                        />
                        <label
                          htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                          className="ml-3 text-sm text-primary"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>

      {/* Desktop filters */}
      <form className="hidden lg:block">
        {filters.map((section) => (
          <div key={section.id} className="border-b border-gray-200 py-6">
            <h3 className="text-sm font-medium text-primary">{section.name}</h3>
            <div className="mt-4 space-y-4">
              {section.options.map((option, optionIdx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`filter-${section.id}-${optionIdx}`}
                    name={`${section.id}[]`}
                    value={option.value}
                    type="checkbox"
                    defaultChecked={option.checked}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-accent"
                    onChange={(e) => handleFilterChange(section.id, option.value, e.target.checked)}
                  />
                  <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-primary">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </form>
    </>
  )
}
