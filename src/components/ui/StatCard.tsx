import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  change?: number
  suffix?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-accent-purple',
  change,
  suffix,
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-muted">{title}</p>
          <p className="mt-1 font-display text-2xl font-bold text-text-primary">
            {value}
            {suffix ? <span className="ml-1 text-sm text-text-muted">{suffix}</span> : null}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center border border-border-subtle bg-bg-elevated/60">
          <Icon size={18} className={cn(iconColor)} />
        </div>
      </div>

      {typeof change === 'number' && (
        <p
          className={cn(
            'mt-4 text-xs',
            change >= 0 ? 'text-accent-emerald' : 'text-accent-red',
          )}
        >
          {change >= 0 ? '+' : ''}
          {change.toFixed(1)}% vs last period
        </p>
      )}
    </div>
  )
}
