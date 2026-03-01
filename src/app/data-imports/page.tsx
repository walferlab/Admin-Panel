import { Header } from '@/components/layout/Header'
import { createServerSupabaseClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

async function getImportedData() {
  const supabase = createServerSupabaseClient()

  const [pdfsRes, requestsRes, messagesRes, downloadsRes] = await Promise.all([
    supabase.from('pdfs').select('id, title, created_at, download_count').order('created_at', { ascending: false }).limit(12),
    supabase.from('pdf_requests').select('id, name, email, status, created_at').order('created_at', { ascending: false }).limit(12),
    supabase.from('contact_messages').select('id, name, email, status, created_at').order('created_at', { ascending: false }).limit(12),
    supabase.from('download_events').select('id, pdf_id, click_stage, created_at').order('created_at', { ascending: false }).limit(20),
  ])

  return {
    pdfs: pdfsRes.data ?? [],
    requests: requestsRes.data ?? [],
    messages: messagesRes.data ?? [],
    downloads: downloadsRes.data ?? [],
  }
}

export default async function DataImportsPage() {
  const data = await getImportedData()

  return (
    <div className="animate-fade-in">
      <Header
        title="Data Imports"
        subtitle="Live Supabase data for PDFs, requests, messages, and downloads"
      />

      <div className="space-y-6">
        <section id="pdfs">
          <h2 className="mb-3 text-xs uppercase tracking-[0.12em] text-text-muted">PDF Library</h2>
          <div className="overflow-x-auto border border-border-subtle">
            <table className="admin-table min-w-[720px]">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Downloads</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {data.pdfs.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td className="max-w-[420px] truncate text-text-primary">{row.title}</td>
                    <td>{row.download_count}</td>
                    <td>{formatDate(row.created_at, 'relative')}</td>
                  </tr>
                ))}
                {data.pdfs.length === 0 && (
                  <tr><td colSpan={4}><div className="py-10 text-center text-sm text-text-muted">No PDFs found</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="requests">
          <h2 className="mb-3 text-xs uppercase tracking-[0.12em] text-text-muted">PDF Requests</h2>
          <div className="overflow-x-auto border border-border-subtle">
            <table className="admin-table min-w-[720px]">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {data.requests.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td className="text-text-primary">{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.status}</td>
                    <td>{formatDate(row.created_at, 'relative')}</td>
                  </tr>
                ))}
                {data.requests.length === 0 && (
                  <tr><td colSpan={5}><div className="py-10 text-center text-sm text-text-muted">No requests found</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="messages">
          <h2 className="mb-3 text-xs uppercase tracking-[0.12em] text-text-muted">Contact Messages</h2>
          <div className="overflow-x-auto border border-border-subtle">
            <table className="admin-table min-w-[720px]">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Read</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {data.messages.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td className="text-text-primary">{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.status ? 'Yes' : 'No'}</td>
                    <td>{formatDate(row.created_at, 'relative')}</td>
                  </tr>
                ))}
                {data.messages.length === 0 && (
                  <tr><td colSpan={5}><div className="py-10 text-center text-sm text-text-muted">No messages found</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="downloads">
          <h2 className="mb-3 text-xs uppercase tracking-[0.12em] text-text-muted">Download Events</h2>
          <div className="overflow-x-auto border border-border-subtle">
            <table className="admin-table min-w-[720px]">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>PDF ID</th>
                  <th>Stage</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {data.downloads.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.pdf_id}</td>
                    <td>{row.click_stage}</td>
                    <td>{formatDate(row.created_at, 'relative')}</td>
                  </tr>
                ))}
                {data.downloads.length === 0 && (
                  <tr><td colSpan={4}><div className="py-10 text-center text-sm text-text-muted">No download events found</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
