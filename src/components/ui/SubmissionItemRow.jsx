/**
 * SubmissionItemRow
 *
 * One row in the submission items list on Screen 3.1.
 * Three states: confirmed (green ready), warning (amber expandable),
 * missing (red, Add now).
 *
 * Props:
 *   item     — { id, name, type, size?, platform?, status, required,
 *                slot?, consequence?, editRoute, mapsTo }
 *   onEdit   — () => void — called when user taps Edit / Fix it / Add now
 *   delay    — number (seconds) — stagger animation delay
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  Link2,
} from 'lucide-react'
import FileTypeIcon from './FileTypeIcon'

// ─── Type label helpers ────────────────────────────────────────────────────────
function typeLabel(item) {
  if (item.type === 'link') return `${item.platform ?? 'External'} link`
  const ext = item.type.toUpperCase()
  return item.size ? `${ext} · ${item.size}` : ext
}

// ─── Link icon (FileTypeIcon doesn't handle 'link') ───────────────────────────
function LinkIconCircle() {
  return (
    <div className="w-9 h-9 rounded-full bg-teal-soft flex items-center justify-center shrink-0">
      <Link2
        className="w-[17px] h-[17px] text-teal"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  )
}

// ─── SubmissionItemRow ─────────────────────────────────────────────────────────
export default function SubmissionItemRow({ item, onEdit, delay = 0 }) {
  const [expanded, setExpanded] = useState(false)

  // ── CONFIRMED ───────────────────────────────────────────────────────────────
  if (item.status === 'confirmed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut', delay }}
        className="flex items-center gap-3 px-4 py-3 border-b border-surface-secondary"
      >
        {/* Icon */}
        {item.type === 'link'
          ? <LinkIconCircle />
          : <FileTypeIcon type={item.type} size={32} />
        }

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-foreground truncate leading-snug">
            {item.name}
          </p>
          <p className="text-[12px] text-muted mt-0.5">
            {typeLabel(item)}
          </p>
        </div>

        {/* Status + Edit */}
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <div className="flex items-center gap-1">
            <CheckCircle2
              className="w-4 h-4 text-success shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="text-[12px] font-semibold text-success">
              Ready
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="text-[12px] font-medium text-muted underline min-h-[44px] flex items-center"
            aria-label={`Edit ${item.name}`}
          >
            Edit
          </button>
        </div>
      </motion.div>
    )
  }

  // ── WARNING (expandable) ────────────────────────────────────────────────────
  if (item.status === 'warning') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut', delay }}
        className="border-b border-surface-secondary"
      >
        {/* Main row — flex strip for left-border treatment */}
        <div className="flex">
          <div className="w-[3px] bg-warning shrink-0 self-stretch" aria-hidden="true" />
          <div
            className={`flex flex-1 items-center gap-3 pl-[13px] pr-4 py-3 transition-colors duration-300 ${
              expanded ? 'bg-warning-soft' : 'bg-white'
            }`}
          >
            {/* Icon */}
            {item.type === 'link'
              ? <LinkIconCircle />
              : <FileTypeIcon type={item.type} size={32} />
            }

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-foreground truncate leading-snug">
                {item.name}
              </p>
              <p className="text-[12px] text-muted mt-0.5">
                {typeLabel(item)}
              </p>
            </div>

            {/* Status + expand toggle */}
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <div className="flex items-center gap-1">
                <AlertTriangle
                  className="w-4 h-4 text-warning shrink-0"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="text-[12px] font-semibold text-warning">
                  Warning
                </span>
              </div>
              <button
                type="button"
                onClick={() => setExpanded((p) => !p)}
                className="min-h-[44px] flex items-center justify-end"
                aria-label={expanded ? 'Collapse warning detail' : 'Expand warning detail'}
                aria-expanded={expanded}
              >
                <motion.div
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown
                    className="w-4 h-4 text-muted"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* Expandable warning detail */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="flex">
                <div className="w-[3px] bg-warning shrink-0" aria-hidden="true" />
                <div className="flex-1 pl-[13px] pr-4 pb-3 pt-1 bg-warning-soft">
                  <p className="text-[13px] text-warning leading-[1.5]">
                    {item.consequence}
                  </p>
                  <button
                    type="button"
                    onClick={onEdit}
                    className="mt-2 text-[13px] font-semibold text-accent min-h-[44px] flex items-center"
                    aria-label={`Fix warning for ${item.name}`}
                  >
                    Fix it →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // ── MISSING ─────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay }}
      className="flex border-b border-surface-secondary"
    >
      <div className="w-[3px] bg-danger shrink-0 self-stretch" aria-hidden="true" />
      <div className="flex flex-1 items-center gap-3 pl-[13px] pr-4 py-3">
        {/* Red X circle */}
        <div className="w-9 h-9 rounded-full bg-danger-soft flex items-center justify-center shrink-0">
          <XCircle
            className="w-[17px] h-[17px] text-danger"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-danger truncate leading-snug">
            Missing — {item.slot ?? item.name}
          </p>
          <p className="text-[12px] font-semibold text-danger mt-0.5">
            Required · Not added
          </p>
        </div>

        {/* Add now pill */}
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full bg-danger-soft text-danger text-[12px] font-semibold px-3 py-1.5 min-h-[44px] flex items-center shrink-0"
          aria-label={`Add ${item.slot ?? item.name}`}
        >
          Add now
        </button>
      </div>
    </motion.div>
  )
}
