import type { ActivityHeatmapCell } from '@/types'

interface ActivityHeatmapProps {
  data: ActivityHeatmapCell[]
}

const levelClass: Record<ActivityHeatmapCell['level'], string> = {
  0: 'bg-bg-elevated border-border-subtle',
  1: 'bg-accent-purple/20 border-accent-purple/30',
  2: 'bg-accent-purple/40 border-accent-purple/50',
  3: 'bg-accent-purple/70 border-accent-purple/70',
  4: 'bg-accent-purple border-accent-purple',
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  if (!data.length) {
    return <p className="text-xs text-text-muted">No activity data available.</p>
  }

  const start = Math.max(0, data.length - 364)
  const normalized = data.slice(start)

  const weeks: ActivityHeatmapCell[][] = []
  for (let i = 0; i < normalized.length; i += 7) {
    weeks.push(normalized.slice(i, i + 7))
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-[660px] gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
            {week.map((cell) => (
              <div
                key={cell.date}
                title={`${cell.date}: ${cell.count} events`}
                className={`h-3 w-3 rounded-[2px] border ${levelClass[cell.level]}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
