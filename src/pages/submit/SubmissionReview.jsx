// Screen 3.1 — Submission Review
// Route: /submit/review
// Persona: Vikram (meticulous, checks every line before committing)
//          + Riya (anxious, needs to see the green badge)
//          + Arjun (wants to find the Submit button fast, minimal friction)
//          + Priya (rubric-mapper, checks criteria coverage before submitting)
//
// This screen is a confirmation pause — not a step that requires action
// unless something is wrong. Its job: give the student a complete, honest
// picture of what they are about to commit.
// One decision: Submit or go back and fix.

import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardHeader, CardContent } from '@heroui/react'
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'
import PageShell from '../../components/PageShell'
import InnerPageBar from '../../components/ui/InnerPageBar'
import SubmissionStepper from '../../components/ui/SubmissionStepper'
import SubmissionItemRow from '../../components/ui/SubmissionItemRow'
import PreCheckBanner from '../../components/ui/PreCheckBanner'
import RubricMappingAccordion from '../../components/ui/RubricMappingAccordion'
import { mockAssignment } from '../../data/mock-assignment'
import { mockSubmission } from '../../data/mock-submission'
import { useCountdown } from '../../hooks/useCountdown'

// ─── Pre-check simulation: issues reflect the warning item ────────────────────
const PRECHECK_ISSUES = [
  {
    id:        'precheck-1',
    text:      'Supporting Document (Google Drive) appears to have no content',
    editRoute: '/submit/links',
  },
]

// ─── Date formatting ──────────────────────────────────────────────────────────
function formatTimestamp(dateStr) {
  const d = new Date(dateStr)
  const date = d.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
  return `${date} · ${time}`
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function SubmissionReview() {
  const navigate = useNavigate()
  const { state: routeState } = useLocation()
  const primaryFile  = routeState?.primaryFile  ?? null
  const artifactData = routeState?.artifactData ?? null
  const linkStatuses = routeState?.linkStatuses ?? {}

  const { title, courseName, deadline, rubric } = mockAssignment
  const { totalHours, expired } = useCountdown(deadline)
  const { studentName, studentId, items, submittedAt } = mockSubmission

  // ── Deadline value color in metadata ──────────────────────────────────────
  const deadlineValueColor = expired || totalHours < 2
    ? 'text-danger'
    : totalHours < 24
    ? 'text-warning'
    : 'text-foreground'

  // ── Pre-check state ────────────────────────────────────────────────────────
  const [preCheckState, setPreCheckState] = useState('idle')
  const preCheckRef = useRef(null)

  function handlePreCheck() {
    if (preCheckState === 'running') return
    setPreCheckState('running')
    preCheckRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    // Simulate: finds the warning about the empty link
    setTimeout(() => setPreCheckState('issues'), 2000)
  }

  // ── Submit state ───────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Derived: all required items present ───────────────────────────────────
  const allRequiredPresent = items
    .filter((i) => i.required)
    .every((i) => i.status === 'confirmed' || i.status === 'warning')

  // ── Navigation ─────────────────────────────────────────────────────────────
  function handleEdit(route) {
    navigate(route, { state: { primaryFile, artifactData, linkStatuses } })
  }

  function handleSubmit() {
    if (!allRequiredPresent || isSubmitting) return
    setIsSubmitting(true)
    setTimeout(() => {
      navigate('/submit/validating', {
        state: { primaryFile, artifactData, linkStatuses },
      })
    }, 1000)
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <InnerPageBar title="Review & Submit" deadline={deadline} />
      <PageShell noPadding>

      {/* ════════════════════════════════════════════════════════════════════
          SCROLLABLE AREA
          ════════════════════════════════════════════════════════════════════ */}
      <SubmissionStepper currentStep={4} />
      <div className="flex-1 bg-surface-secondary overflow-y-auto pb-0">
        <div className="px-8 lg:px-10 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

        {/* ════════════════════════════════════════════════════════════════
            SECTION 2 — PAGE HEADER + COMPLETION BADGE
            ════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
        >
        <Card className="rounded-xl border border-border p-0">
        <CardContent className="p-6 lg:p-8">
          <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-tight">
            Ready to submit?
          </h1>
          <p className="text-[14px] text-muted mt-1.5 leading-[1.5]">
            Review everything below before you commit. You can edit any item if needed.
          </p>

          {/* Completion / Incomplete badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.25 }}
            className={`mt-4 rounded-xl px-4 py-3 flex items-start gap-3 ${
              allRequiredPresent
                ? 'bg-success-soft border border-success-soft'
                : 'bg-danger-soft border border-danger-soft'
            }`}
          >
            {allRequiredPresent ? (
              <CheckCircle2
                className="w-5 h-5 text-success shrink-0 mt-[1px]"
                strokeWidth={2}
                aria-hidden="true"
              />
            ) : (
              <AlertCircle
                className="w-5 h-5 text-danger shrink-0 mt-[1px]"
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
            <div>
              <p className={`text-[14px] font-bold leading-snug ${
                allRequiredPresent ? 'text-success' : 'text-danger'
              }`}>
                {allRequiredPresent
                  ? 'All required items present'
                  : 'Missing required items'
                }
              </p>
              <p className={`text-sm mt-1 leading-snug ${
                allRequiredPresent ? 'text-success' : 'text-danger'
              }`}>
                {allRequiredPresent
                  ? 'Your submission is complete and ready to be evaluated.'
                  : 'Complete all required items before submitting.'
                }
              </p>
            </div>
          </motion.div>
        </CardContent>
        </Card>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 4 — SUBMISSION ITEMS LIST
            ════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
        <Card className="rounded-xl border border-border p-0">
          {/* Section label */}
          <CardHeader className="px-6 lg:px-8 flex-row items-center justify-between py-3 border-b border-surface-secondary">
            <span className="text-[13px] font-bold text-foreground">
              Your submission
            </span>
            <span className="text-[12px] text-muted">
              {items.length} items
            </span>
          </CardHeader>

          {/* Item rows — staggered in */}
          <CardContent className="p-0">
            {items.map((item, i) => (
              <SubmissionItemRow
                key={item.id}
                item={item}
                onEdit={() => handleEdit(item.editRoute)}
                delay={0.45 + i * 0.06}
              />
            ))}
          </CardContent>
        </Card>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 5 — RUBRIC MAPPING (Priya)
            ════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.65 }}
        >
          <RubricMappingAccordion items={items} rubric={rubric} />
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 6 — SUBMISSION METADATA (Vikram)
            ════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
        <Card className="rounded-xl border border-border p-0">
        <CardContent className="p-6 lg:p-8">
          <p className="text-[13px] font-semibold text-foreground mb-3">
            Submission details
          </p>

          {[
            {
              label: 'Submitting as',
              value: `${studentName} · Student ID ${studentId}`,
              color: 'text-foreground',
            },
            {
              label: 'Assignment',
              value: title,
              color: 'text-foreground',
            },
            {
              label: 'Submission time',
              value: formatTimestamp(submittedAt),
              color: 'text-foreground',
            },
            {
              label: 'Deadline',
              value: formatTimestamp(deadline),
              color: deadlineValueColor,
            },
          ].map(({ label, value, color }, i, arr) => (
            <div key={label}>
              <div className="flex items-start justify-between gap-3 py-2.5">
                <span className="text-[13px] text-muted shrink-0">
                  {label}
                </span>
                <span className={`text-[13px] font-semibold text-right flex-1 ${color}`}>
                  {value}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className="h-px bg-surface-secondary" aria-hidden="true" />
              )}
            </div>
          ))}
        </CardContent>
        </Card>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 7 — AI INSTRUCTOR STATEMENT
            The last thing the student reads before tapping Submit.
            ════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
        <Card className="rounded-xl border border-border p-0">
        <CardContent className="px-6 lg:px-8 py-5 flex flex-col items-center">
          <ShieldCheck
            className="w-5 h-5 text-success"
            strokeWidth={2}
            aria-hidden="true"
          />
          <p className="text-[15px] font-semibold text-foreground text-center mt-2 leading-snug">
            AI will process your work.
          </p>
          <p className="text-[14px] text-muted text-center mt-1 leading-[1.5]">
            Your instructor makes the final grade decision.
          </p>
        </CardContent>
        </Card>
        </motion.div>

      </div>
      </div>
      </div>
      {/* end scrollable area */}

      {/* ════════════════════════════════════════════════════════════════════
          STICKY BOTTOM CTA
          ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="sticky bottom-0 w-full z-40 shrink-0"
      >
        {/* Gradient fade */}
        <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white" />

        <div className="bg-white border-t border-border px-8 lg:px-10 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">

          {/* State-dependent helper text */}
          <AnimatePresence mode="wait">
            {!allRequiredPresent ? (
              <motion.p
                key="missing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[13px] text-danger"
              >
                Add missing required items to submit
              </motion.p>
            ) : (
              <motion.button
                key="precheck-link"
                type="button"
                onClick={handlePreCheck}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[13px] font-medium text-muted underline min-h-[44px] flex items-center"
                aria-label="Run pre-submission check"
              >
                Check before submitting
              </motion.button>
            )}
          </AnimatePresence>

          {/* Primary Submit button */}
          <motion.div
            whileTap={allRequiredPresent && !isSubmitting ? { scale: 0.97 } : {}}
            transition={{ duration: 0.1 }}
            className="ml-auto"
          >
            <Button
              variant="primary"
              size="lg"
              isDisabled={!allRequiredPresent || isSubmitting}
              className={`rounded-xl px-8 font-bold text-[15px] transition-all duration-300 ${
                allRequiredPresent && !isSubmitting ? 'font-bold' : 'font-semibold'
              }`}
              onPress={handleSubmit}
              aria-label={
                allRequiredPresent
                  ? 'Submit your assignment'
                  : 'Add missing required items before submitting'
              }
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    className="inline-block w-[18px] h-[18px] rounded-full border-2 border-white border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    aria-hidden="true"
                  />
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </Button>
          </motion.div>

          </div>
        </div>
      </motion.div>

    </PageShell>
    </>
  )
}
