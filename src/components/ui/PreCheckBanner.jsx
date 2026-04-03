/**
 * PreCheckBanner
 *
 * Screen 3.1 — Optional self-check before submitting.
 * Vikram uses it to verify. Arjun skips it.
 *
 * States:
 *   idle    → "Want extra confidence?" + "Check now" pill
 *   running → spinner + "Checking..."  (2s simulation)
 *   clear   → green, "Everything looks good — ready to submit"
 *   issues  → amber, inline list of issues found
 *
 * Props:
 *   checkState — 'idle' | 'running' | 'clear' | 'issues'
 *   issues     — array of { id, text, editRoute }
 *   onCheck    — called when "Check now" is tapped
 *   onFix      — (editRoute) called when "Fix it" is tapped
 */

import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react'

// ─── PreCheckBanner ───────────────────────────────────────────────────────────
export default function PreCheckBanner({
  checkState = 'idle',
  issues     = [],
  onCheck,
  onFix,
}) {
  // ── Idle ────────────────────────────────────────────────────────────────────
  if (checkState === 'idle') {
    return (
      <div className="bg-white border-t border-border px-4 py-[14px] flex items-center justify-between gap-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Shield
            className="w-[18px] h-[18px] text-info shrink-0 mt-[1px]"
            strokeWidth={2}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-foreground leading-snug">
              Want extra confidence?
            </p>
            <p className="text-[13px] text-muted mt-0.5">
              Run a quick check before submitting.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCheck}
          className="rounded-full bg-info-soft border border-info-soft text-info text-[13px] font-semibold px-4 py-2 min-h-[44px] shrink-0 flex items-center"
          aria-label="Run pre-submission check"
        >
          Check now
        </button>
      </div>
    )
  }

  // ── Running ─────────────────────────────────────────────────────────────────
  if (checkState === 'running') {
    return (
      <div className="bg-white border-t border-border px-4 py-[14px] flex items-center justify-between gap-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Shield
            className="w-[18px] h-[18px] text-info shrink-0 mt-[1px]"
            strokeWidth={2}
            aria-hidden="true"
          />
          <div>
            <p className="text-[14px] font-semibold text-foreground leading-snug">
              Want extra confidence?
            </p>
            <p className="text-[13px] text-muted mt-0.5">
              Run a quick check before submitting.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <motion.div
            className="w-4 h-4 rounded-full border-2 border-info border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          />
          <span className="text-[13px] font-medium text-info">
            Checking...
          </span>
        </div>
      </div>
    )
  }

  // ── Clear ───────────────────────────────────────────────────────────────────
  if (checkState === 'clear') {
    return (
      <motion.div
        initial={{ backgroundColor: 'rgb(255,255,255)' }}
        animate={{ backgroundColor: 'rgb(240,253,244)' }}
        transition={{ duration: 0.4 }}
        className="border-t border-success-soft px-4 py-[14px]"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2
            className="w-5 h-5 text-success shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
          <p className="text-[14px] font-semibold text-success">
            Everything looks good — ready to submit
          </p>
        </div>
      </motion.div>
    )
  }

  // ── Issues found ────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ backgroundColor: 'rgb(255,255,255)' }}
      animate={{ backgroundColor: 'rgb(255,251,235)' }}
      transition={{ duration: 0.4 }}
      className="border-t border-warning-soft px-4 py-[14px]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle
          className="w-5 h-5 text-warning shrink-0"
          strokeWidth={2}
          aria-hidden="true"
        />
        <p className="text-[14px] font-semibold text-warning">
          One thing to review before submitting
        </p>
      </div>

      {/* Issues list */}
      <AnimatePresence>
        <motion.div
          key="issues"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="flex flex-col gap-2">
            {issues.map((issue) => (
              <div key={issue.id} className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-warning shrink-0 mt-[5px]"
                    aria-hidden="true"
                  />
                  <p className="text-[13px] text-warning leading-[1.45] flex-1">
                    {issue.text}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onFix?.(issue.editRoute)}
                  className="text-[13px] font-semibold text-accent shrink-0 min-h-[44px] flex items-center"
                  aria-label={`Fix: ${issue.text}`}
                >
                  Fix it
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
