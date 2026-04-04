/**
 * NotificationPopup
 *
 * Categorized notification dropdown anchored to the header bell icon.
 * Categories: Deadlines, Submissions, Announcements.
 * Read/unread states with blue dot indicator.
 *
 * Props:
 *   isOpen        — boolean
 *   onClose       — () => void
 *   notifications — array from mock-dashboard.js
 *   onMarkAllRead — () => void
 */

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, FileText, Megaphone } from 'lucide-react'

const CATEGORY_CONFIG = {
  deadlines:     { label: 'Deadlines',     Icon: Clock,     color: 'text-warning' },
  submissions:   { label: 'Submissions',   Icon: FileText,  color: 'text-success' },
  announcements: { label: 'Announcements', Icon: Megaphone, color: 'text-info'    },
}

const CATEGORY_ORDER = ['deadlines', 'submissions', 'announcements']

export default function NotificationPopup({ isOpen, onClose, notifications = [], onMarkAllRead }) {
  const ref = useRef(null)

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, onClose])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Group by category
  const grouped = {}
  CATEGORY_ORDER.forEach(cat => { grouped[cat] = [] })
  notifications.forEach(n => {
    if (grouped[n.category]) grouped[n.category].push(n)
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute right-0 top-full mt-2 w-[360px] max-h-[480px] overflow-y-auto rounded-xl border border-border bg-white shadow-lg z-50"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="text-[14px] font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[12px] font-medium text-accent hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification list by category */}
          <div className="py-1">
            {CATEGORY_ORDER.map(cat => {
              const items = grouped[cat]
              if (!items || items.length === 0) return null
              const { label, Icon, color } = CATEGORY_CONFIG[cat]
              return (
                <div key={cat}>
                  {/* Category header */}
                  <div className="px-4 py-2 flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${color}`} strokeWidth={2} aria-hidden="true" />
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-widest">
                      {label}
                    </span>
                  </div>

                  {/* Items */}
                  {items.map(item => (
                    <div
                      key={item.id}
                      className={`px-4 py-2.5 flex items-start gap-3 hover:bg-surface-secondary transition-colors cursor-pointer ${
                        !item.read ? 'bg-accent-soft/30' : ''
                      }`}
                    >
                      {/* Unread dot */}
                      <div className="w-2 mt-1.5 shrink-0">
                        {!item.read && (
                          <div className="w-2 h-2 rounded-full bg-accent" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] leading-snug ${!item.read ? 'font-semibold text-foreground' : 'text-muted'}`}>
                          {item.text}
                        </p>
                        <p className="text-[11px] text-muted/60 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border text-center">
            <button type="button" className="text-[12px] font-medium text-accent hover:underline">
              View all notifications
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
