import type { ReactNode } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  rightSlot?: ReactNode
}

export function Header({ title, subtitle, rightSlot }: HeaderProps) {
  return (
    <header className="mb-4 border-b border-border-subtle pb-4 pt-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl leading-tight text-text-primary">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-text-muted">{subtitle}</p> : null}
        </div>

        {rightSlot ? <div className="flex items-center gap-2">{rightSlot}</div> : null}
      </div>
    </header>
  )
}
