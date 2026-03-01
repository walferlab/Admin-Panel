import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  CircleDollarSign,
  Database,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/books', label: 'Books', icon: BookOpen },
  { href: '/data-imports', label: 'Imports', icon: Database },
  { href: '/workers', label: 'Workers', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/revenue', label: 'Revenue', icon: CircleDollarSign },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/approvals', label: 'Approvals', icon: CheckCircle2 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function getNavLabel(pathname: string): string {
  const match = NAV_ITEMS.find((item) => pathname.startsWith(item.href))
  return match?.label ?? 'Panel'
}
