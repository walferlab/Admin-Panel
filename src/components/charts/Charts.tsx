'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; color?: string }>
  label?: string
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-xs shadow-card">
      <p className="mb-1 text-text-secondary">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, idx) => (
          <p key={`tooltip-${idx}`} className="text-text-primary">
            <span style={{ color: entry.color ?? '#fff' }}>{entry.name}</span>: {entry.value}
          </p>
        ))}
      </div>
    </div>
  )
}

interface SimpleAreaChartProps {
  data: Array<Record<string, string | number>>
  dataKey: string
  xKey: string
  color?: string
  height?: number
}

export function SimpleAreaChart({
  data,
  dataKey,
  xKey,
  color = '#a78bfa',
  height = 220,
}: SimpleAreaChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="simple-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2840" />
          <XAxis dataKey={xKey} tick={{ fill: '#8f9ab8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#8f9ab8', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill="url(#simple-area)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

interface MultiLineChartProps {
  data: Array<Record<string, string | number>>
  lines: Array<{ dataKey: string; color: string; label: string }>
  xKey?: string
  height?: number
}

export function MultiLineChart({
  data,
  lines,
  xKey = 'date',
  height = 240,
}: MultiLineChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2840" />
          <XAxis dataKey={xKey} tick={{ fill: '#8f9ab8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#8f9ab8', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.label}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface SimpleBarChartProps {
  data: Array<Record<string, string | number>>
  dataKey: string
  xKey: string
  color?: string
  label?: string
  height?: number
}

export function SimpleBarChart({
  data,
  dataKey,
  xKey,
  color = '#60a5fa',
  label,
  height = 220,
}: SimpleBarChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2840" />
          <XAxis
            dataKey={xKey}
            tick={{ fill: '#8f9ab8', fontSize: 11 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis tick={{ fill: '#8f9ab8', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={dataKey} name={label ?? dataKey} fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
