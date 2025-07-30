import Link from 'next/link'

interface DevNoticeProps {
  type: 'info' | 'warning' | 'success'
  message: string
  details?: string
  action?: {
    text: string
    href?: string
    onClick?: () => void
  }
}

export function DevNotice({ type, message, details, action }: DevNoticeProps) {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }

  return (
    <div className={`border-l-4 p-4 ${typeStyles[type]}`}>
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
          {details && (
            <p className="mt-1 text-sm opacity-90">{details}</p>
          )}
          {action && (
            <div className="mt-2">
              {action.href ? (
                <Link 
                  href={action.href}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  {action.text}
                </Link>
              ) : (
                <button 
                  onClick={action.onClick}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  {action.text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
