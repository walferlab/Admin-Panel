'use client'

import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import { BookOpen, DollarSign, Download, TrendingUp } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'
import { SimpleBarChart } from '@/components/charts/Charts'
import { supabase } from '@/lib/supabase'
import {
  calculateBookPayout,
  DEFAULT_REVENUE_CONFIG,
  formatCurrency,
  inrToUsd,
} from '@/lib/revenue'
import type { PDF, RevenueConfig } from '@/types'
import toast from 'react-hot-toast'

interface BookWithRevenue extends PDF {
  estimated_revenue_inr: number
  estimated_revenue_usd: number
}

const REVENUE_DEFAULTS_KEY = 'pdflovers.revenue.defaults'

function buildRevenueRows(pdfs: PDF[], config: RevenueConfig): BookWithRevenue[] {
  return pdfs.map((pdf) => {
    const dl2 = Math.round(pdf.download_count * 0.3)
    const pageViews = pdf.download_count * 5

    const { net_pay } = calculateBookPayout(
      {
        pdf_id: pdf.id,
        pdf_title: pdf.title,
        worker_id: 'unknown',
        worker_name: 'Unknown',
        dl2_count: dl2,
        page_views: pageViews,
        quality_score: 0.75,
        retention_score: 0.5,
        fraud_factor: 1,
      },
      config,
    )

    return {
      ...pdf,
      estimated_revenue_inr: net_pay,
      estimated_revenue_usd: inrToUsd(net_pay),
    }
  })
}

export default function RevenuePage() {
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [books, setBooks] = useState<BookWithRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<RevenueConfig>(DEFAULT_REVENUE_CONFIG)

  useEffect(() => {
    const stored = localStorage.getItem(REVENUE_DEFAULTS_KEY)
    if (!stored) {
      return
    }

    try {
      const parsed = JSON.parse(stored) as Partial<RevenueConfig>
      setConfig((prev) => ({ ...prev, ...parsed }))
    } catch {}
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const { data, error } = await supabase
        .from('pdfs')
        .select('*')
        .order('download_count', { ascending: false })
        .limit(300)

      if (error) {
        toast.error('Failed to load books for revenue calculation')
        setPdfs([])
        setBooks([])
        setLoading(false)
        return
      }

      const rows = (data ?? []) as PDF[]
      setPdfs(rows)
      setBooks(buildRevenueRows(rows, DEFAULT_REVENUE_CONFIG))
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    setBooks(buildRevenueRows(pdfs, config))
  }, [config, pdfs])

  const totalINR = useMemo(
    () => books.reduce((sum, row) => sum + row.estimated_revenue_inr, 0),
    [books],
  )

  const totalUSD = useMemo(() => inrToUsd(totalINR), [totalINR])
  const totalDownloads = useMemo(
    () => books.reduce((sum, row) => sum + row.download_count, 0),
    [books],
  )

  const chartData = useMemo(
    () =>
      books.slice(0, 10).map((row) => ({
        name: row.title.length > 18 ? `${row.title.slice(0, 18)}...` : row.title,
        revenue: row.estimated_revenue_usd,
        downloads: row.download_count,
      })),
    [books],
  )

  function exportCSV() {
    if (!books.length) {
      toast.error('No revenue rows to export')
      return
    }

    const csv = Papa.unparse(
      books.map((row) => ({
        id: row.id,
        title: row.title,
        author: row.author,
        download_count: row.download_count,
        estimated_inr: row.estimated_revenue_inr.toFixed(2),
        estimated_usd: row.estimated_revenue_usd.toFixed(2),
      })),
    )

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `pdflovers-revenue-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)

    toast.success('CSV exported')
  }

  return (
    <div className="animate-fade-in">
      <Header title="Revenue" subtitle="Estimated earnings from downloads and clicks" />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Est. Revenue (INR)"
            value={formatCurrency(totalINR)}
            icon={DollarSign}
            iconColor="text-accent-emerald"
          />
          <StatCard
            title="Total Est. Revenue (USD)"
            value={formatCurrency(totalUSD, 'USD')}
            icon={TrendingUp}
            iconColor="text-accent-purple"
          />
          <StatCard
            title="Total Downloads"
            value={totalDownloads.toLocaleString()}
            icon={Download}
            iconColor="text-accent-blue"
          />
          <StatCard
            title="Books Tracked"
            value={books.length}
            icon={BookOpen}
            iconColor="text-accent-amber"
          />
        </div>

        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium text-text-primary">Revenue Configuration</h2>
              <p className="mt-0.5 text-xs text-text-muted">Adjust payout parameters live</p>
            </div>
            <button onClick={exportCSV} className="btn-secondary text-xs" type="button">
              Export CSV
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {[
              { key: 'base_pay' as const, label: 'Base Pay (INR)' },
              { key: 'click_pay' as const, label: 'Click Pay (INR)' },
              { key: 'pv_rate' as const, label: 'PV Rate (INR)' },
              { key: 'cap_pv' as const, label: 'PV Cap (INR)' },
              { key: 'min_pv_threshold' as const, label: 'Min PV Threshold' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="mb-1 block text-xs text-text-muted">{label}</label>
                <input
                  type="number"
                  className="admin-input text-center"
                  value={config[key]}
                  onChange={(event) =>
                    setConfig((prev) => ({
                      ...prev,
                      [key]: Number(event.target.value) || 0,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="glass-card p-5">
            <h2 className="mb-4 text-sm font-medium text-text-primary">Revenue by Book (Top 10)</h2>
            <SimpleBarChart
              data={chartData}
              dataKey="revenue"
              xKey="name"
              color="#34d399"
              label="USD"
              height={220}
            />
          </div>

          <div className="glass-card p-5">
            <h2 className="mb-4 text-sm font-medium text-text-primary">Downloads by Book (Top 10)</h2>
            <SimpleBarChart
              data={chartData}
              dataKey="downloads"
              xKey="name"
              color="#60a5fa"
              label="Downloads"
              height={220}
            />
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Downloads</th>
                <th>Est. Revenue (INR)</th>
                <th>Est. Revenue (USD)</th>
                <th>Revenue / Download</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 8 }).map((_, index) => (
                  <tr key={`loading-${index}`}>
                    <td colSpan={5}>
                      <div className="skeleton h-8 rounded" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                books.slice(0, 20).map((book) => {
                  const perDownload =
                    book.download_count > 0
                      ? book.estimated_revenue_usd / book.download_count
                      : 0

                  return (
                    <tr key={book.id}>
                      <td>
                        <p className="max-w-[280px] truncate font-medium text-text-primary">
                          {book.title}
                        </p>
                        <p className="text-xs text-text-muted">{book.author ?? '-'}</p>
                      </td>
                      <td>{book.download_count.toLocaleString()}</td>
                      <td className="font-mono text-accent-emerald">
                        {formatCurrency(book.estimated_revenue_inr)}
                      </td>
                      <td className="font-mono text-accent-purple">
                        {formatCurrency(book.estimated_revenue_usd, 'USD')}
                      </td>
                      <td className="text-xs text-text-muted">
                        {formatCurrency(perDownload, 'USD')}
                      </td>
                    </tr>
                  )
                })}

              {!loading && books.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="py-12 text-center text-sm text-text-muted">
                      No books available for revenue estimation.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
