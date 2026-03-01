import Link from 'next/link'
import { BookOpen, Download, FileText, Star } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'
import { SimpleAreaChart } from '@/components/charts/Charts'
import { createServerSupabaseClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

interface DashboardStats {
  totalBooks: number
  totalDownloads: number
  featuredCount: number
  pendingRequests: number
  unreadMessages: number
  trendData: Array<{ date: string; downloads: number }>
  recentBooks: Array<{ id: number; title: string; created_at: string; download_count: number }>
}

async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServerSupabaseClient()

  try {
    const since = new Date(Date.now() - 30 * 86_400_000).toISOString()

    const [pdfsRes, downloadsRes, requestsRes, messagesRes] = await Promise.all([
      supabase
        .from('pdfs')
        .select('id, title, download_count, created_at, is_featured')
        .order('created_at', { ascending: false }),
      supabase
        .from('download_events')
        .select('id, created_at')
        .gte('created_at', since),
      supabase.from('pdf_requests').select('id, status'),
      supabase.from('contact_messages').select('id').eq('status', false),
    ])

    const pdfs = pdfsRes.data ?? []
    const downloads = downloadsRes.data ?? []
    const requests = requestsRes.data ?? []

    const totalDownloads = pdfs.reduce((sum, row) => sum + (row.download_count ?? 0), 0)
    const featuredCount = pdfs.filter((row) => row.is_featured).length

    const trend: Record<string, number> = {}
    downloads.forEach((row) => {
      const day = row.created_at.split('T')[0]
      trend[day] = (trend[day] ?? 0) + 1
    })

    const trendData = Array.from({ length: 14 }, (_, idx) => {
      const date = new Date()
      date.setDate(date.getDate() - (13 - idx))
      const key = date.toISOString().split('T')[0]
      return { date: key.slice(5), downloads: trend[key] ?? 0 }
    })

    const recentBooks = pdfs.slice(0, 5).map((book) => ({
      id: book.id,
      title: book.title,
      created_at: formatDate(book.created_at, 'relative'),
      download_count: book.download_count ?? 0,
    }))

    return {
      totalBooks: pdfs.length,
      totalDownloads,
      featuredCount,
      pendingRequests: requests.filter((row) => row.status === 'reviewing').length,
      unreadMessages: messagesRes.data?.length ?? 0,
      trendData,
      recentBooks,
    }
  } catch {
    return {
      totalBooks: 0,
      totalDownloads: 0,
      featuredCount: 0,
      pendingRequests: 0,
      unreadMessages: 0,
      trendData: Array.from({ length: 14 }, (_, idx) => ({
        date: `${idx + 1}`,
        downloads: 0,
      })),
      recentBooks: [],
    }
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="animate-fade-in">
      <Header title="Dashboard" subtitle="Overview of your PDF Lovers platform" />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            change={4.2}
            icon={BookOpen}
            iconColor="text-accent-purple"
          />
          <StatCard
            title="Total Downloads"
            value={stats.totalDownloads}
            change={12.5}
            icon={Download}
            iconColor="text-accent-blue"
          />
          <StatCard
            title="Featured Books"
            value={stats.featuredCount}
            icon={Star}
            iconColor="text-accent-amber"
          />
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={FileText}
            iconColor="text-accent-emerald"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="glass-card p-5 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-text-primary">Downloads (14d)</h2>
                <p className="mt-0.5 text-xs text-text-muted">Daily download events</p>
              </div>
              <span className="badge border-accent-emerald/20 bg-accent-emerald/10 text-accent-emerald">
                Live
              </span>
            </div>
            <SimpleAreaChart
              data={stats.trendData}
              dataKey="downloads"
              xKey="date"
              color="#a78bfa"
              height={180}
            />
          </div>

          <div className="glass-card p-5">
            <h2 className="mb-1 text-sm font-medium text-text-primary">Quick Stats</h2>
            <p className="mb-4 text-xs text-text-muted">Platform health</p>

            <div className="space-y-3">
              {[
                {
                  label: 'Unread Messages',
                  value: stats.unreadMessages,
                  color: 'bg-accent-red',
                },
                {
                  label: 'Pending Requests',
                  value: stats.pendingRequests,
                  color: 'bg-accent-amber',
                },
                {
                  label: 'Featured Books',
                  value: stats.featuredCount,
                  color: 'bg-accent-purple',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-xs text-text-secondary">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-text-primary">Recent Uploads</h2>
            <Link
              href="/books"
              className="text-xs text-accent-purple transition-colors hover:text-accent-purple/80"
            >
              View all
            </Link>
          </div>

          {stats.recentBooks.length === 0 ? (
            <p className="text-sm text-text-muted">No recent uploads found.</p>
          ) : (
            <div className="space-y-2">
              {stats.recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-bg-elevated/50"
                >
                  <div className="flex h-10 w-8 flex-shrink-0 items-center justify-center rounded-md border border-border-subtle bg-gradient-to-br from-accent-purple/20 to-accent-blue/10">
                    <BookOpen size={12} className="text-accent-purple" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-text-primary">{book.title || `Book #${book.id}`}</p>
                    <p className="text-xs text-text-muted">{book.created_at}</p>
                  </div>

                  <div className="text-xs text-text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Download size={11} />
                      {book.download_count.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
