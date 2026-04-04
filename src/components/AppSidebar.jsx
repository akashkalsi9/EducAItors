/**
 * AppSidebar — persistent left navigation.
 *
 * ZONE 1 — Logo (h-16, border-b)
 * ZONE 2 — Nav items (flex-1)
 * ZONE 3 — Bottom: Help + Log out
 *
 * Responsive:
 *   Desktop ≥1024px  → w-[240px], full logo + labels + profile
 *   Tablet  768-1023px → w-[48px], AI mark + icons only
 *   Mobile  <768px    → hidden; slides in as overlay when isOpen=true
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, FolderOpen, BarChart2, Ticket, HelpCircle, LogOut } from 'lucide-react'

// ─── Nav definitions ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',   Icon: LayoutDashboard, route: '/',             isActive: () => false                     },
  { id: 'modules',     label: 'Modules',      Icon: FolderOpen,      route: '/status',       isActive: (p) => p.startsWith('/status')  },
  { id: 'assignments', label: 'Assignments',  Icon: BookOpen,        route: '/',             isActive: (p) => p === '/' || p.startsWith('/submit') || p.startsWith('/result') || p.startsWith('/consent') || p.startsWith('/fix') || p === '/orientation' },
  { id: 'results',     label: 'Results',      Icon: BarChart2,       route: '/result/ready', isActive: () => false  },
  { id: 'tickets',     label: 'Support Tickets', Icon: Ticket,     route: '/tickets',      isActive: (p) => p.startsWith('/tickets') },
]

// ─── Single nav item ──────────────────────────────────────────────────────────
function NavItem({ item, onClose }) {
  const navigate     = useNavigate()
  const { pathname } = useLocation()
  const active       = item.isActive(pathname)

  return (
    <button
      type="button"
      onClick={() => { navigate(item.route); onClose?.() }}
      className={[
        'h-10 w-full flex items-center rounded-lg transition-colors duration-150',
        'justify-center px-0 lg:justify-start lg:gap-2.5 lg:px-3',
        active
          ? 'bg-accent-soft text-accent'
          : 'text-muted hover:bg-surface-secondary hover:text-foreground',
      ].join(' ')}
      aria-current={active ? 'page' : undefined}
    >
      <item.Icon
        className="w-4.5 h-4.5 shrink-0"
        strokeWidth={active ? 2.5 : 2}
        aria-hidden="true"
      />
      <span className={`text-sm hidden lg:block ${active ? 'font-semibold' : 'font-medium'}`}>
        {item.label}
      </span>
    </button>
  )
}

// ─── AppSidebar ───────────────────────────────────────────────────────────────
export default function AppSidebar({ isOpen = false, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed left-0 z-40 flex flex-col bg-white border-r border-border',
          'top-0 h-screen',
          'w-[240px] md:w-12 lg:w-[240px]',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
        ].join(' ')}
        aria-label="Main navigation"
      >

        {/* ── ZONE 1: Logo ────────────────────────────────────────────────── */}
        <div className="h-16 border-b border-border flex items-center shrink-0 justify-start px-5 md:justify-center md:px-0 lg:justify-start lg:px-5">

          {/* Full logo: mobile overlay + desktop */}
          <span className="block md:hidden lg:block text-xl font-extrabold tracking-tight select-none">
            <span className="text-foreground">Educ</span>
            <span className="ai-gradient-text">AI</span>
            <span className="text-foreground">tors</span>
          </span>

          {/* AI mark only: tablet (48px sidebar) */}
          <span className="hidden md:block lg:hidden text-lg font-extrabold tracking-tight select-none">
            <span className="ai-gradient-text">AI</span>
          </span>

        </div>

        {/* ── ZONE 2: Nav items ───────────────────────────────────────────── */}
        <nav
          className="flex-1 py-4 px-3 md:px-2 lg:px-3 flex flex-col gap-1 overflow-y-auto"
          aria-label="Main menu"
        >
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.id} item={item} onClose={onClose} />
          ))}
        </nav>

        {/* ── ZONE 3: Bottom utilities ────────────────────────────────────── */}
        <div className="border-t border-border pt-3 pb-4 px-3 md:px-2 lg:px-3 flex flex-col gap-1 shrink-0">

          {/* Help */}
          <button
            type="button"
            className="h-10 w-full flex items-center rounded-lg transition-colors duration-150 text-muted hover:bg-surface-secondary hover:text-foreground justify-center px-0 lg:justify-start lg:gap-2.5 lg:px-3"
            aria-label="Help and information"
          >
            <HelpCircle className="w-4.5 h-4.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            <span className="text-sm font-medium hidden lg:block">Help &amp; Information</span>
          </button>

          {/* Log out */}
          <button
            type="button"
            className="h-10 w-full flex items-center rounded-lg transition-colors duration-150 text-danger hover:bg-danger-soft justify-center px-0 lg:justify-start lg:gap-2.5 lg:px-3"
            aria-label="Log out"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            <span className="text-sm font-medium hidden lg:block">Log out</span>
          </button>

        </div>
      </aside>
    </>
  )
}
