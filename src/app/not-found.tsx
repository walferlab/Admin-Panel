import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-2xl border border-border-subtle bg-bg-secondary p-8 text-center">
        <Image
          src="/logo.png"
          alt="PDF Lovers"
          width={46}
          height={46}
          className="mx-auto"
        />
        <p className="mt-5 text-xs uppercase tracking-[0.2em] text-text-muted">Error 404</p>
        <h1 className="font-display mt-2 text-3xl text-text-primary">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-text-muted">
          The page you requested does not exist or may have been moved.
        </p>
        <div className="mt-6">
          <Link href="/dashboard" className="btn-primary">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
