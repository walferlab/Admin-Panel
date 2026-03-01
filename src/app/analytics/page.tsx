import { BarChart2, BookOpen, Download, TrendingUp } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/ui/StatCard'
import { ActivityHeatmap } from '@/components/ui/ActivityHeatmap'
import {
  MultiLineChart,
  SimpleAreaChart,
  SimpleBarChart,
} from '@/components/charts/Charts'
import { createServerSupabaseClient } from '@/lib/supabase'
import { generateActivityHeatmap } from '@/lib/utils'

async function getAnalytics() {
  const supabase = createServerSupabaseClient()

  try {
    const [pdfsRes, downloadsRes] = await Promise.all([
      supabase
        .from('pdfs')
        .select('id, title, category, download_count, created_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('download_events')
        .select('id, created_at, click_stage')
        .order('created_at', { ascending: false })
        .limit(1000),
    ])

    const pdfs = pdfsRes.data ?? []
    const downloads = downloadsRes.data ?? []

    const dlByDay: Record<string, { smart: number; direct: number }> = {}
    downloads.forEach((row) => {
      const day = row.created_at.split('T')[0]
      if (!dlByDay[day]) {
        dlByDay[day] = { smart: 0, direct: 0 }
      }
      dlByDay[day][row.click_stage as 'smart' | 'direct'] += 1
    })

    const last30 = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const key = date.toISOString().split('T')[0]
      return {
        date: key.slice(5),
        smart: dlByDay[key]?.smart ?? 0,
        direct: dlByDay[key]?.direct ?? 0,
      }
    })

    const uploadsByDay: Record<string, number> = {}
    pdfs.forEach((row) => {
      const day = row.created_at.split('T')[0]
      uploadsByDay[day] = (uploadsByDay[day] ?? 0) + 1
    })

    const uploadTrend = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const key = date.toISOString().split('T')[0]
      return { date: key.slice(5), uploads: uploadsByDay[key] ?? 0 }
    })

    const categoryCount: Record<string, number> = {}
    pdfs.forEach((row) => {
      const category = row.category ?? 'Other'
      categoryCount[category] = (categoryCount[category] ?? 0) + 1
    })

    const categoryData = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }))

    const topBooks = [...pdfs]
      .sort((a, b) => b.download_count - a.download_count)
      .slice(0, 8)
      .map((row) => ({
        name: row.title.length > 18 ? `${row.title.slice(0, 18)}...` : row.title,
        downloads: row.download_count,
      }))

    return {
      totalDownloads: downloads.length,
      totalBooks: pdfs.length,
      smartDownloads: downloads.filter((row) => row.click_stage === 'smart').length,
      directDownloads: downloads.filter((row) => row.click_stage === 'direct').length,
      last30,
      uploadTrend,
      categoryData,
      topBooks,
      heatmap: generateActivityHeatmap(downloads.map((row) => ({ created_at: row.created_at }))),
    }
  } catch {
    return {
      totalDownloads: 0,
      totalBooks: 0,
      smartDownloads: 0,
      directDownloads: 0,
      last30: [] as Array<{ date: string; smart: number; direct: number }>,
      uploadTrend: [] as Array<{ date: string; uploads: number }>,
      categoryData: [] as Array<{ name: string; count: number }>,
      topBooks: [] as Array<{ name: string; downloads: number }>,
      heatmap: generateActivityHeatmap([]),
    }
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalytics()

  return (
    <div className="animate-fade-in">
      <Header title="Analytics" subtitle="Platform performance and trends" />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Downloads (30d)"
            value={data.totalDownloads}
            icon={Download}
            iconColor="text-accent-purple"
            change={8.3}
          />
          <StatCard
            title="Total Books"
            value={data.totalBooks}
            icon={BookOpen}
            iconColor="text-accent-blue"
            change={3.1}
          />
          <StatCard
            title="Smart Link Clicks"
            value={data.smartDownloads}
            icon={TrendingUp}
            iconColor="text-accent-emerald"
          />
          <StatCard
            title="Direct Clicks"
            value={data.directDownloads}
            icon={BarChart2}
            iconColor="text-accent-amber"
          />
        </div>

        <div className="glass-card p-5">
          <h2 className="mb-1 text-sm font-medium text-text-primary">Download Events (30 days)</h2>
          <p className="mb-4 text-xs text-text-muted">
            Smart link vs direct link completions
          </p>
          <MultiLineChart
            data={data.last30}
            lines={[
              { dataKey: 'smart', color: '#a78bfa', label: 'Smart Link' },
              { dataKey: 'direct', color: '#60a5fa', label: 'Direct Link' },
            ]}
            height={220}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="glass-card p-5">
            <h2 className="mb-4 text-sm font-medium text-text-primary">Upload Trend (30d)</h2>
            <SimpleAreaChart
              data={data.uploadTrend}
              dataKey="uploads"
              xKey="date"
              color="#34d399"
              height={180}
            />
          </div>

          <div className="glass-card p-5">
            <h2 className="mb-4 text-sm font-medium text-text-primary">Books by Category</h2>
            <SimpleBarChart
              data={data.categoryData}
              dataKey="count"
              xKey="name"
              color="#f472b6"
              label="Books"
              height={180}
            />
          </div>
        </div>

        <div className="glass-card p-5">
          <h2 className="mb-4 text-sm font-medium text-text-primary">Top Books by Downloads</h2>
          <SimpleBarChart
            data={data.topBooks}
            dataKey="downloads"
            xKey="name"
            color="#a78bfa"
            label="Downloads"
            height={180}
          />
        </div>

        <div className="glass-card p-5">
          <h2 className="mb-4 text-sm font-medium text-text-primary">Download Activity (52 weeks)</h2>
          <ActivityHeatmap data={data.heatmap} />
        </div>
      </div>
    </div>
  )
}
