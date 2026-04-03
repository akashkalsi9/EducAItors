/**
 * AppShell — outermost SPA layout wrapper.
 *
 * ┌──────────────┬──────────────────────────────────────┐
 * │  AppSidebar  │  Page content                        │
 * │  ZONE 1 Logo │                                      │
 * │  ZONE 2 Nav  │                                      │
 * │  ZONE 3 Prof │                                      │
 * └──────────────┴──────────────────────────────────────┘
 *
 * Desktop  ≥1024px: 240px sidebar (logo + nav + profile)
 * Tablet  768-1023px: 48px icon-only sidebar
 * Mobile   <768px:  sticky top bar (hamburger + logo) + bottom tab bar
 *                   sidebar slides in as overlay on hamburger tap
 */

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, LayoutDashboard, BookOpen, FolderOpen, BarChart2 } from 'lucide-react'
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'

// ─── Mobile bottom tab bar items ─────────────────────────────────────────────
const BOTTOM_TABS = [
  { id: 'dashboard',   label: 'Dashboard',   Icon: LayoutDashboard, route: '/',             isActive: () => false                    },
  { id: 'modules',     label: 'Modules',      Icon: FolderOpen,      route: '/status',       isActive: (p) => p.startsWith('/status') },
  { id: 'assignments', label: 'Assignments',  Icon: BookOpen,        route: '/',             isActive: (p) => p === '/' || p.startsWith('/submit') || p.startsWith('/result') || p.startsWith('/consent') || p.startsWith('/fix') || p === '/orientation' },
  { id: 'results',     label: 'Results',      Icon: BarChart2,       route: '/result/ready', isActive: (p) => p.startsWith('/result') },
]

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate     = useNavigate()

  return (
    <div className="min-h-screen bg-surface-secondary">

      {/* ── Fixed top header (all breakpoints) ───────────────────────────── */}
      <AppHeader onMenuClick={() => setSidebarOpen(true)} />

      {/* ── Sidebar — sits below header on md+, full overlay on mobile ─── */}
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main content ───────────────────────────────────────────────────
           pt-16  clears the fixed 64px header.
           md:pl-[48px] / lg:pl-[240px]  clears the sidebar.
           pb-[56px] md:pb-0  clears the mobile bottom tab bar.           ── */}
      <div className="pt-16 md:pl-12 lg:pl-60 pb-14 md:pb-0">
        {children}
      </div>

      {/* ── Mobile bottom tab bar ────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-border h-14 flex"
        aria-label="Main navigation"
      >
        {BOTTOM_TABS.map((tab) => {
          const active = tab.isActive(pathname)
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.route)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? 'text-accent' : 'text-muted'
              }`}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              <tab.Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </nav>

    </div>
  )
}
