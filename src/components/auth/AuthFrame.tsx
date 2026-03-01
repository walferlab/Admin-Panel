import type { ReactNode } from 'react'
import Image from 'next/image'

interface AuthFrameProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthFrame({ title, subtitle, children }: AuthFrameProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-primary px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(217,118,59,0.18),transparent_28%),radial-gradient(circle_at_100%_0%,rgba(124,164,209,0.15),transparent_32%)]" />

      <div className="relative w-full max-w-md border border-border-default bg-bg-secondary p-6">
        <div className="mb-5 text-center">
          <Image
            src="/logo.png"
            alt="PDF Lovers"
            width={42}
            height={42}
            className="mx-auto"
            priority
          />
          <h1 className="font-display mt-3 text-2xl text-text-primary">{title}</h1>
          <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  )
}
