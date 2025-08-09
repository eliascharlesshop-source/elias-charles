"use client"

interface LoadingSkeletonProps {
  className?: string
  type?: 'card' | 'text' | 'image' | 'button'
}

export function LoadingSkeleton({ className = '', type = 'card' }: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700"
  
  switch (type) {
    case 'text':
      return <div className={`${baseClasses} h-4 rounded ${className}`} />
    case 'image':
      return <div className={`${baseClasses} aspect-square rounded ${className}`} />
    case 'button':
      return <div className={`${baseClasses} h-10 rounded-md ${className}`} />
    case 'card':
    default:
      return (
        <div className={`${baseClasses} rounded-lg p-4 ${className}`}>
          <div className="space-y-3">
            <div className="h-40 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      )
  }
}
