import type { BookRevenue, RevenueConfig } from '@/types'

export const DEFAULT_REVENUE_CONFIG: RevenueConfig = {
  base_pay: 2,
  click_pay: 6,
  pv_rate: 1,
  cap_pv: 5,
  min_pv_threshold: 30,
  min_click_threshold: 1,
}

export function calculateBookPayout(
  book: Omit<BookRevenue, 'gross_pay' | 'net_pay'>,
  config: RevenueConfig = DEFAULT_REVENUE_CONFIG,
): { gross_pay: number; net_pay: number } {
  const { base_pay: B, click_pay: C, pv_rate: V, cap_pv } = config
  const { dl2_count, page_views, quality_score, retention_score, fraud_factor } = book

  const clickPay = Math.min(dl2_count, 2) * C
  const pvPay = Math.min((page_views / 100) * V, cap_pv)
  const basePart = B + clickPay + pvPay

  const qualityMultiplier = 0.7 + 0.3 * quality_score
  const retentionMultiplier = 0.8 + 0.2 * retention_score

  const gross_pay = basePart * qualityMultiplier * retentionMultiplier
  const net_pay = gross_pay * fraud_factor

  return {
    gross_pay: Math.round(gross_pay * 100) / 100,
    net_pay: Math.round(net_pay * 100) / 100,
  }
}

export function calculateQualityScore(book: {
  title?: string | null
  author?: string | null
  category?: string | null
  tags?: string[] | null
  summary?: string | null
  cover_image_url?: string | null
  download_url?: string | null
}): number {
  const checks = [
    Boolean(book.title),
    Boolean(book.author),
    Boolean(book.category),
    (book.tags?.length ?? 0) >= 3,
    (book.summary?.length ?? 0) >= 200,
    Boolean(book.cover_image_url),
    Boolean(book.download_url),
  ]

  const passed = checks.filter(Boolean).length
  return Math.round((passed / checks.length) * 1000) / 1000
}

export function inrToUsd(inr: number): number {
  const rate = 0.012
  return Math.round(inr * rate * 100) / 100
}

export function formatCurrency(
  amount: number,
  currency: 'INR' | 'USD' = 'INR',
): string {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US'
  return `${currency} ${amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
