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
import { useState } from 'react'
import { LayoutDashboard, BookOpen, FolderOpen, BarChart2, Ticket, User, HelpCircle, LogOut } from 'lucide-react'

// ─── Nav definitions ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',       Icon: LayoutDashboard, route: '/',             isActive: (p) => p === '/' || p === '/assignment' || p.startsWith('/submit') || p.startsWith('/result') || p.startsWith('/consent') || p.startsWith('/fix') || p === '/orientation' || p.startsWith('/status')  },
  { id: 'modules',     label: 'Modules',          Icon: FolderOpen,      route: '/status',       isActive: () => false  },
  { id: 'assignments', label: 'Assignments',      Icon: BookOpen,        route: '/assignment',   isActive: () => false },
  { id: 'results',     label: 'Results',          Icon: BarChart2,       route: '/result/ready', isActive: () => false  },
  { id: 'tickets',     label: 'Support Tickets',  Icon: Ticket,          route: '/tickets',      isActive: (p) => p.startsWith('/tickets') },
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
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  function handleLogout() {
    localStorage.removeItem('educaitors_auth')
    navigate('/login')
  }

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

          {/* Profile & Settings */}
          <button
            type="button"
            className="h-10 w-full flex items-center rounded-lg transition-colors duration-150 text-muted hover:bg-surface-secondary hover:text-foreground justify-center px-0 lg:justify-start lg:gap-2.5 lg:px-3"
            aria-label="Profile and settings"
          >
            <User className="w-4.5 h-4.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            <span className="text-sm font-medium hidden lg:block">Profile &amp; Settings</span>
          </button>

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
            onClick={() => setShowLogoutConfirm(true)}
            className="h-10 w-full flex items-center rounded-lg transition-colors duration-150 text-danger hover:bg-danger-soft justify-center px-0 lg:justify-start lg:gap-2.5 lg:px-3"
            aria-label="Log out"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            <span className="text-sm font-medium hidden lg:block">Log out</span>
          </button>

        </div>
      </aside>

      {/* ── Logout confirmation modal ──────────────────────────────────── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowLogoutConfirm(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl border border-border p-6 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-danger-soft flex items-center justify-center mb-4">
                <LogOut className="w-6 h-6 text-danger" strokeWidth={2} aria-hidden="true" />
              </div>
              <h3 className="text-[16px] font-bold text-foreground">Sign out?</h3>
              <p className="text-[13px] text-muted mt-1.5 leading-relaxed">
                You'll need to sign in again to access your submissions.
              </p>
              <div className="flex gap-3 mt-5 w-full">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 h-11 rounded-lg border border-border text-[14px] font-medium text-foreground hover:bg-surface-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 h-11 rounded-lg bg-danger text-white text-[14px] font-semibold hover:bg-danger/90 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
