/**
 * AppHeader — fixed top bar spanning the content area (right of sidebar).
 *
 * Left:  Hamburger (mobile only) + "EducAItors" logo (mobile only)
 * Right: Bell notification badge · separator · student avatar + name
 */

import { useState } from 'react'
import { Menu, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, Button } from '@heroui/react'
import NotificationPopup from './ui/NotificationPopup'
import { mockNotifications } from '../data/mock-dashboard'

export default function AppHeader({ onMenuClick }) {
  const [notifOpen, setNotifOpen]         = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  function handleMarkAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <header className="fixed top-0 right-0 z-50 h-16 bg-white border-b border-border flex items-center px-5 left-0 md:left-[48px] lg:left-[240px]">

      {/* ── Left: hamburger (mobile only) + logo (mobile only) ─────────── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          onPress={onMenuClick}
          className="md:hidden -ml-2"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </Button>

        {/* Logo — mobile only (sidebar handles desktop/tablet) */}
        <span className="md:hidden text-[20px] font-extrabold tracking-tight select-none">
          <span className="text-foreground">Educ</span>
          <span className="ai-gradient-text">AI</span>
          <span className="text-foreground">tors</span>
        </span>
      </div>

      {/* ── Right: notification bell + separator + profile ───────────────── */}
      <div className="flex items-center gap-4 shrink-0">

        {/* Bell with notification popup */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center w-10 h-10 rounded-lg text-muted hover:bg-surface-secondary hover:text-foreground transition-colors"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-danger flex items-center justify-center px-1">
                <span className="text-[10px] font-bold text-white leading-none">{unreadCount}</span>
              </span>
            )}
          </button>

          <NotificationPopup
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
          />
        </div>

        {/* Vertical separator */}
        <div className="hidden sm:block w-px h-7 bg-border" aria-hidden="true" />

        {/* Student profile */}
        <div className="flex items-center gap-2.5">
          <Avatar size="sm" variant="soft" color="accent">
            <AvatarFallback className="text-xs font-bold">RS</AvatarFallback>
          </Avatar>

          <div className="hidden sm:flex flex-col leading-none gap-1">
            <span className="text-[13px] font-semibold text-foreground whitespace-nowrap">
              Riya Sharma
            </span>
            <span className="text-[11px] font-normal text-muted whitespace-nowrap">
              MBA Strategic Management
            </span>
          </div>
        </div>

      </div>
    </header>
  )
}
