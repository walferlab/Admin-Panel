'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  className?: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  pageSize?: number
}

type SortDirection = 'asc' | 'desc'

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data found',
  pageSize = 20,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    if (!sortKey) {
      return data
    }

    const next = [...data]

    next.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey]
      const bv = (b as Record<string, unknown>)[sortKey]

      if (av == null && bv == null) {
        return 0
      }
      if (av == null) {
        return 1
      }
      if (bv == null) {
        return -1
      }

      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDirection === 'asc' ? av - bv : bv - av
      }

      return sortDirection === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })

    return next
  }, [data, sortDirection, sortKey])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const pageData = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [pageSize, safePage, sorted])

  function onSort(column: Column<T>) {
    if (!column.sortable) {
      return
    }

    const key = String(column.key)
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table min-w-[860px]">
        <thead>
          <tr>
            {columns.map((column) => {
              const isSorted = sortKey === String(column.key)

              return (
                <th
                  key={String(column.key)}
                  onClick={() => onSort(column)}
                  className={cn(column.sortable && 'cursor-pointer select-none')}
                >
                  <span className="inline-flex items-center gap-1">
                    {column.header}
                    {column.sortable && isSorted &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      ))}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {loading &&
            Array.from({ length: 8 }).map((_, idx) => (
              <tr key={`loading-${idx}`}>
                <td colSpan={columns.length}>
                  <div className="skeleton h-8 w-full" />
                </td>
              </tr>
            ))}

          {!loading && pageData.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <div className="py-12 text-center text-sm text-text-muted">
                  {emptyMessage}
                </div>
              </td>
            </tr>
          )}

          {!loading &&
            pageData.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {columns.map((column) => {
                  const key = String(column.key)
                  const value = (row as Record<string, unknown>)[key]

                  return (
                    <td key={key} className={column.className}>
                      {column.render ? column.render(row) : String(value ?? '-')}
                    </td>
                  )
                })}
              </tr>
            ))}
        </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border-subtle p-3">
        <p className="text-xs text-text-muted">
          Page {safePage} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary px-3 py-1.5 text-xs"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage <= 1}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn-secondary px-3 py-1.5 text-xs"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
