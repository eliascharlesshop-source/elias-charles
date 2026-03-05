interface PullQuoteProps {
  quote: string
  author?: string
  role?: string
}

export function PullQuote({ quote, author, role }: PullQuoteProps) {
  return (
    <div className="my-12 sm:my-16 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      {role && (
        <div className="text-right">
          <span className="text-sm text-gray-500">{role}</span>
        </div>
      )}
    </div>
  )
}
