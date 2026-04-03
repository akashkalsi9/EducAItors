// Screen 3.4 — Validation Result: Warning State
// Route: /result/warning
// Persona: Riya (needs clarity, can't panic) + Arjun (wants to proceed fast)
// This is the highest-stakes screen in the prototype.
// Every element has one job. Design for that job.

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardContent } from '@heroui/react'
import { Clock, ChevronDown, ShieldCheck, Check, AlertTriangle } from 'lucide-react'
import PageShell from '../../components/PageShell'
import InnerPageBar from '../../components/ui/InnerPageBar'
import ValidationIndicator from '../../components/ui/ValidationIndicator'
import ConsequenceCard from '../../components/ui/ConsequenceCard'
import { mockWarningResult } from '../../data/mock-validation-results'
import { mockAssignment } from '../../data/mock-assignment'
import { useCountdown } from '../../hooks/useCountdown'

// ─── Full validation report — derived from warnings + passing items ───────────
function buildValidationReport(warnings) {
  const warnIds = new Set(warnings.map((w) => w.element))
  const passing = [
    { id: 'pdf',  label: 'Business Case PDF',   note: 'Readable — no issues found' },
    { id: 'xlsx', label: 'Financial Model',      note: 'File is accessible'         },
  ].filter((c) => !warnIds.has(c.label))

  const flagged = warnings.map((w) => ({
    id:     w.id,
    label:  w.element,
    note:   'Accessible but content appears empty',
    status: 'warning',
  }))

  return [
    ...passing.map((c) => ({ ...c, status: 'ready' })),
    ...flagged,
  ]
}

// ─── Single check row inside full report accordion ────────────────────────────
function ReportCheckRow({ item }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-b-0">
      {item.status === 'warning' ? (
        <AlertTriangle
          className="w-4 h-4 text-warning shrink-0 mt-[1px]"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        <Check
          className="w-4 h-4 text-success shrink-0 mt-[1px]"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground leading-snug">{item.label}</p>
        <p className="text-[12px] text-muted mt-0.5">{item.note}</p>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ValidationWarning() {
  const navigate = useNavigate()
  const { state: routeState } = useLocation()

  // Data — route state with mock fallback
  const warnings  = routeState?.warnings  ?? mockWarningResult.warnings
  const deadline  = routeState?.deadline  ?? mockAssignment.deadline

  // Countdown
  const { days, hours, totalHours, expired } = useCountdown(deadline)

  // Accordion state
  const [isReportOpen, setIsReportOpen] = useState(false)

  // Derived values
  const isMultiple       = warnings.length > 1
  const headline         = isMultiple ? 'A few things need your attention' : 'One thing needs your attention'
  const validationChecks = buildValidationReport(warnings)

  // Deadline display — Karan's lifeline
  const deadlineText = expired
    ? 'Deadline passed'
    : days > 0
    ? `${days}d ${hours}h remaining`
    : `${totalHours}h remaining`

  return (
    <>
      <InnerPageBar
        breadcrumbItems={[
          { label: 'Assignments', href: '/' },
          { label: 'Validation Results' },
          { label: 'Review Required' },
        ]}
        deadline={deadline}
      />
      <PageShell noPadding>

      {/* ── Page background: bg-soft canvas ──────────────────────────────── */}
      <div className="bg-surface-secondary">
        <div className="px-8 lg:px-10 py-8">
        <div className="max-w-2xl mx-auto">
        <Card className="rounded-xl border border-border p-0">
        <CardContent className="p-6 lg:p-10 flex flex-col">
          {/* ════════════════════════════════════════════════════════════════
              SECTION 1 — WARNING INDICATOR + HEADLINE
              ════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col items-center text-center">

            {/* Warning circle — static, no pulse (warning = still, not alarming) */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
            >
              <ValidationIndicator variant="warning" size={56} ringClassName="ring-8" />
            </motion.div>

            {/* Headline + sub-headline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.4 }}
              className="mt-5"
            >
              <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-tight">
                {headline}
              </h1>
              <p className="text-[14px] text-muted mt-2 leading-relaxed mx-auto">
                Your submission can still proceed — but there's a risk to review.
              </p>
            </motion.div>

          </div>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 2 — WARNING CARD(S)
              Subtle amber tint behind cards — subconscious warmth, not alarm
              ════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.6 }}
            className="mt-8"
          >
            {/* Amber-tinted zone — subconscious warmth, contained */}
            <div className="bg-warning-soft rounded-xl p-4">
              <div className="flex flex-col gap-3">
                {warnings.map((warning, i) => (
                  <ConsequenceCard
                    key={warning.id}
                    warning={warning}
                    index={i}
                    total={warnings.length}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 3 — FULL VALIDATION REPORT ACCORDION
              For Jordan (transparency) and Priya (rubric-mapper)
              Available without cluttering primary decision view
              ════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 1.0 }}
            className="mt-2"
          >
            {/* Section separator — divides decision area from detail area */}
            <div className="border-t border-border mt-2 mb-4" />

            {/* Ghost trigger — center aligned, info blue */}
            <button
              onClick={() => setIsReportOpen((prev) => !prev)}
              className="w-full flex items-center justify-center gap-2 py-3 min-h-[44px]"
              aria-expanded={isReportOpen}
              aria-controls="validation-report"
            >
              <span className="text-[13px] font-medium text-accent">
                See full validation report
              </span>
              <motion.span
                animate={{ rotate: isReportOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="flex items-center"
              >
                <ChevronDown
                  className="w-4 h-4 text-accent"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </motion.span>
            </button>

            {/* Expanded report */}
            <motion.div
              id="validation-report"
              initial={false}
              animate={{
                height:  isReportOpen ? 'auto' : 0,
                opacity: isReportOpen ? 1      : 0,
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="bg-surface-secondary border border-border rounded-xl p-4 mt-1">
                {validationChecks.map((item) => (
                  <ReportCheckRow key={item.id} item={item} />
                ))}
              </div>
            </motion.div>

          </motion.div>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 4 — AI-INSTRUCTOR STATEMENT
              For Riya — instructor is still in control even when something is wrong
              ════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 1.0 }}
            className="mt-5 pt-4 border-t border-border flex items-start justify-center gap-2"
          >
            <ShieldCheck
              className="w-3.5 h-3.5 text-success shrink-0 mt-[2px]"
              strokeWidth={2}
              aria-hidden="true"
            />
            <p className="text-[13px] text-muted text-center leading-relaxed">
              Your instructor will review the final grade decision.
            </p>
          </motion.div>

        </CardContent>
        </Card>
        </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          STICKY BOTTOM — PRIMARY ACTIONS
          ════════════════════════════════════════════════════════════════════ */}
      <div className="sticky bottom-0 w-full z-40 relative">
        <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white" />
        <div className="bg-white border-t border-border px-8 lg:px-10 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-end gap-4">
          <button
            className="h-11 text-sm font-medium text-muted bg-transparent border-none cursor-pointer hover:underline"
            onClick={() => navigate('/consent', { state: { warnings, deadline } })}
            aria-label="Submit anyway and accept the risk"
          >
            Submit anyway
          </button>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              variant="primary"
              size="lg"
              className="rounded-xl px-8 font-bold text-[15px]"
              onPress={() => navigate('/fix', { state: { warning: warnings[0], warnings, deadline } })}
              aria-label="Fix the issue with your submission"
            >
              Fix it
            </Button>
          </motion.div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          FIXED BOTTOM — DEADLINE ONLY (no button — actions are above)
          Karan's lifeline — deadline never disappears, never animated in
          ════════════════════════════════════════════════════════════════════ */}
      <div className="sticky bottom-0 w-full z-40 relative">

        {/* Gradient fade above bar */}
        <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white" />

        {/* Deadline bar */}
        <div className="bg-white border-t border-border px-8 lg:px-10 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-2">
          <Clock
            className="w-3.5 h-3.5 text-warning shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
          <p
            className="text-[13px] font-semibold text-warning"
            aria-live="off"
            aria-label={`Deadline: ${deadlineText}`}
          >
            Deadline: {deadlineText}
          </p>
          </div>
        </div>

      </div>

    </PageShell>
    </>
  )
}
