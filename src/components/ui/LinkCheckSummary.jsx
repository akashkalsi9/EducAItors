/**
 * LinkCheckSummary
 *
 * Transparency card for Jordan — shows every checked link's result
 * in one scannable place. Visible as soon as any link has been checked.
 *
 * Props:
 *   links — array of { id, name, status }
 *           status: 'checking' | 'accessible' | 'empty-link' |
 *                   'acknowledged' | 'permission-blocked' | 'broken' |
 *                   'format-error'
 */

import { motion } from 'framer-motion'
import { Shield, CheckCircle2, AlertTriangle, XCircle, Loader } from 'lucide-react'

// ─── Status display config ─────────────────────────────────────────────────────
const STATUS_CONFIG = {
  checking: {
    label:     'Checking…',
    color:     'text-accent',
    IconEl:    () => (
      <motion.div
        className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent shrink-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    ),
  },
  accessible: {
    label:  'Accessible',
    color:  'text-success',
    IconEl: () => (
      <CheckCircle2 className="w-4 h-4 text-success shrink-0" strokeWidth={2} aria-hidden="true" />
    ),
  },
  'empty-link': {
    label:  'Empty',
    color:  'text-warning',
    IconEl: () => (
      <AlertTriangle className="w-4 h-4 text-warning shrink-0" strokeWidth={2} aria-hidden="true" />
    ),
  },
  acknowledged: {
    label:  'Kept with warning',
    color:  'text-warning',
    IconEl: () => (
      <AlertTriangle className="w-4 h-4 text-warning shrink-0" strokeWidth={2} aria-hidden="true" />
    ),
  },
  'permission-blocked': {
    label:  'Blocked',
    color:  'text-danger',
    IconEl: () => (
      <XCircle className="w-4 h-4 text-danger shrink-0" strokeWidth={2} aria-hidden="true" />
    ),
  },
  broken: {
    label:  'Unreachable',
    color:  'text-danger',
    IconEl: () => (
      <XCircle className="w-4 h-4 text-danger shrink-0" strokeWidth={2} aria-hidden="true" />
    ),
  },
  'format-error': {
    label:  'Invalid URL',
    color:  'text-danger',
    IconEl: () => (
      <XCircle className="w-4 h-4 text-danger shrink-0" strokeWidth={2} aria-hidden="true" />
    ),
  },
}

// ─── LinkCheckSummary ─────────────────────────────────────────────────────────
export default function LinkCheckSummary({ links = [] }) {
  if (links.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-xl border border-border bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex items-center gap-2">
        <Shield
          className="w-4 h-4 text-teal shrink-0"
          strokeWidth={2}
          aria-hidden="true"
        />
        <p className="text-[13px] font-bold text-foreground">
          Link check summary
        </p>
      </div>

      {/* Results list */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {links.map((link) => {
          const config = STATUS_CONFIG[link.status]
          if (!config) return null
          const { label, color, IconEl } = config

          return (
            <div key={link.id} className="flex items-center gap-2.5">
              <IconEl />
              <p className="flex-1 min-w-0 text-[12px] font-medium text-foreground truncate">
                {link.name}
              </p>
              <span className={`text-[12px] font-semibold shrink-0 ${color}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
