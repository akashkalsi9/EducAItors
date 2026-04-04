// InnerPageBar — Full-width sticky breadcrumb + deadline bar for all inner pages.
// Renders OUTSIDE PageShell at the AppShell content level.
// Matches Dashboard's breadcrumb section: bg-white, border-b, px-8/lg:px-10, py-4, flex justify-between.
// Sticky at top-16 (sits just below the fixed AppHeader h-16 = 64px).

import { Clock } from 'lucide-react'
import PageBreadcrumb from './PageBreadcrumb'
import { useCountdown } from '../../hooks/useCountdown'
import { mockAssignment } from '../../data/mock-assignment'

const assignmentShortTitle = mockAssignment.title.replace(/\s*—.*$/, '').trim()

export default function InnerPageBar({ title, deadline, breadcrumbItems }) {
  const { days, hours, minutes, totalHours, expired } = useCountdown(deadline ?? null)

  const pillBg = expired || totalHours < 2
    ? 'bg-danger-soft'
    : totalHours < 24
    ? 'bg-warning-soft'
    : 'bg-surface-secondary border border-border'

  const pillText = expired || totalHours < 2
    ? 'text-danger'
    : totalHours < 24
    ? 'text-warning'
    : 'text-muted'

  const pillLabel = expired
    ? 'Overdue'
    : days > 0
    ? `${days}d ${hours}h left`
    : totalHours > 0
    ? `${totalHours}h ${minutes}m left`
    : `${minutes}m left`

  const items = breadcrumbItems ?? [
    { label: 'Dashboard', href: '/' },
    { label: assignmentShortTitle, href: '/assignment' },
    { label: title ?? '' },
  ]

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-border px-8 lg:px-10 py-4 flex items-center justify-between">
      <PageBreadcrumb items={items} />
      {deadline && (
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 shrink-0 ${pillBg}`}
          aria-label={`Deadline: ${pillLabel}`}
        >
          <Clock
            className={`w-3.5 h-3.5 shrink-0 ${pillText}`}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className={`text-[13px] font-semibold ${pillText} whitespace-nowrap`}>
            {pillLabel}
          </span>
        </div>
      )}
    </div>
  )
}
