'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-xl border border-border-subtle bg-bg-secondary p-6 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Page Error</p>
        <h2 className="font-display mt-2 text-2xl text-text-primary">Something went wrong</h2>
        <p className="mt-3 text-sm text-text-muted">The page hit an unexpected error.</p>
        <button className="btn-primary mt-5" onClick={() => reset()} type="button">
          Try again
        </button>
      </div>
    </div>
  )
}
