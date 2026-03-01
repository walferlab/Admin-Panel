'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary antialiased">
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-xl border border-border-subtle bg-bg-secondary p-6 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Application Error</p>
            <h2 className="font-display mt-2 text-2xl text-text-primary">Critical failure</h2>
            <p className="mt-3 text-sm text-text-muted">
              {error?.message || 'Unexpected failure while rendering the app.'}
            </p>
            <button className="btn-primary mt-5" onClick={() => reset()} type="button">
              Retry
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
