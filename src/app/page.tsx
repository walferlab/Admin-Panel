import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ALLOWED_ROUTES = new Set(['/dashboard', '/books', '/data-imports'])

export default async function HomePage() {
  const cookieStore = await cookies()
  const preferred = cookieStore.get('pdflovers_default_page')?.value ?? '/dashboard'

  if (ALLOWED_ROUTES.has(preferred)) {
    redirect(preferred)
  }

  redirect('/dashboard')
}
