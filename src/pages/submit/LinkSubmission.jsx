// Screen 2.3 — External Link Submission with Real-Time Check
// Route: /submit/links
// Persona: Karan (deadline pressure) + Riya (anxious, needs to know links work)
//          + Jordan (transparency-seeker) + Tyler (consent-risk, must not claim ignorance)
//
// One job: paste links, know immediately if they work, fix before moving on.
// The real-time check is the entire value of this screen.

import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardContent } from '@heroui/react'
import { Plus } from 'lucide-react'
import PageShell from '../../components/PageShell'
import InnerPageBar from '../../components/ui/InnerPageBar'
import SubmissionStepper from '../../components/ui/SubmissionStepper'
import LinkInputRow from '../../components/ui/LinkInputRow'
import LinkCheckSummary from '../../components/ui/LinkCheckSummary'
import { mockAssignment } from '../../data/mock-assignment'

// ─── Demo control status options ───────────────────────────────────────────────
const DEMO_STATUSES = [
  { value: null,                 label: 'Reset' },
  { value: 'accessible',         label: '✓ Accessible' },
  { value: 'empty-link',         label: '⚠ Empty' },
  { value: 'acknowledged',       label: '⚠ Kept' },
  { value: 'permission-blocked', label: '✕ Blocked' },
  { value: 'broken',             label: '✕ Broken' },
]

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LinkSubmission() {
  const navigate  = useNavigate()
  const { state: routeState } = useLocation()
  const primaryFile  = routeState?.primaryFile   ?? null
  const artifactData = routeState?.artifactData  ?? null

  const { title, courseName, deadline } = mockAssignment

  // ── Link status tracking (id → status string) ──────────────────────────────
  const [linkStatuses, setLinkStatuses] = useState({})

  function handleStatusChange(id, status) {
    setLinkStatuses((prev) => ({ ...prev, [id]: status }))
  }

  // ── Demo force-status overrides ────────────────────────────────────────────
  const [demoOverrides, setDemoOverrides] = useState({})

  function setDemoStatus(id, status) {
    setDemoOverrides((prev) => ({ ...prev, [id]: status }))
  }

  // ── User-added optional links ──────────────────────────────────────────────
  const addedLinkCounter = useRef(10)
  const [userLinks, setUserLinks] = useState([])

  function handleAddLink() {
    addedLinkCounter.current += 1
    setUserLinks((prev) => [
      ...prev,
      {
        id:          `u${addedLinkCounter.current}`,
        name:        'Additional Link',
        platform:    'Generic',
        required:    false,
        placeholder: 'Paste a link (optional)',
        simulatedResult: 'accessible',
      },
    ])
  }

  // ── Derived state ──────────────────────────────────────────────────────────
  const allLinks = [
    ...mockAssignment.requiredLinks,
    ...mockAssignment.optionalLinks,
    ...userLinks,
  ]

  const allRequiredResolved = mockAssignment.requiredLinks.every((link) => {
    const s = linkStatuses[link.id] ?? 'idle'
    return s === 'accessible' || s === 'acknowledged'
  })

  // Summary: show once any link has a non-idle status
  const summaryLinks = allLinks
    .filter((link) => {
      const s = linkStatuses[link.id] ?? 'idle'
      return s !== 'idle'
    })
    .map((link) => ({
      id:     link.id,
      name:   link.name,
      status: linkStatuses[link.id],
    }))

  const showSummary = summaryLinks.length > 0

  // ── Navigation ─────────────────────────────────────────────────────────────
  function handleContinue() {
    if (!allRequiredResolved) return
    navigate('/submit/review', {
      state: { primaryFile, artifactData, linkStatuses },
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <InnerPageBar title="External Links" deadline={deadline} />
      <PageShell noPadding>

      {/* ════════════════════════════════════════════════════════════════════
          SCROLLABLE AREA
          ════════════════════════════════════════════════════════════════════ */}
      <SubmissionStepper currentStep={4} />
      <div className="flex-1 bg-surface-secondary overflow-y-auto pb-20">
        <div className="px-8 lg:px-10 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

        {/* ── SECTION 2: Page header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
        >
        <Card className="rounded-xl border border-border p-0">
        <CardContent className="px-6 lg:px-8 pt-6 lg:pt-8 pb-5">
          <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-tight">
            Add your external links
          </h1>
          <p className="text-[14px] text-muted mt-1.5 leading-[1.5]">
            Links are checked the moment you paste them. Fix any issues before moving on.
          </p>
        </CardContent>
        </Card>
        </motion.div>

        {/* ── SECTION 3: Required link rows ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
        >
        <Card className="rounded-xl border border-border p-0">
        <CardContent className="px-6 lg:px-8 pt-4 pb-2">
          {/* Required label */}
          <p className="text-xs font-bold text-danger uppercase tracking-[0.08em] mb-3">
            Required links
          </p>

          {/* Required link rows — staggered in */}
          {mockAssignment.requiredLinks.map((link, i) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.25 + i * 0.08 }}
            >
              <LinkInputRow
                link={link}
                resolveWith={link.simulatedResult}
                forceStatus={demoOverrides[link.id] ?? null}
                onStatusChange={handleStatusChange}
              />
            </motion.div>
          ))}
        </CardContent>
        </Card>
        </motion.div>

        {/* ── SECTION 4: Divider ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.45 }}
          className="px-6 lg:px-8 py-4 flex items-center gap-3"
        >
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-semibold text-muted uppercase tracking-[0.06em] shrink-0">
            Optional links
          </span>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        {/* Optional helper text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="text-center text-xs text-muted px-6 lg:px-8 pb-3"
        >
          These links aren't required but may provide additional evidence.
        </motion.p>

        {/* ── SECTION 5: Optional link rows ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.5 }}
        >
        <Card className="rounded-xl border border-border p-0">
        <CardContent className="px-6 lg:px-8 pt-3 pb-2">
          {/* Seeded optional links from mock data */}
          {mockAssignment.optionalLinks.map((link, i) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.55 + i * 0.08 }}
            >
              <LinkInputRow
                link={link}
                resolveWith={link.simulatedResult}
                forceStatus={demoOverrides[link.id] ?? null}
                onStatusChange={handleStatusChange}
              />
            </motion.div>
          ))}

          {/* User-added links */}
          <AnimatePresence>
            {userLinks.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <LinkInputRow
                  link={link}
                  resolveWith={link.simulatedResult}
                  forceStatus={demoOverrides[link.id] ?? null}
                  onStatusChange={handleStatusChange}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add another link */}
          <Button
            variant="ghost"
            size="sm"
            onPress={handleAddLink}
            className="flex items-center gap-1.5 font-medium text-accent min-h-11 mb-2"
            aria-label="Add another optional link"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add another link
          </Button>
        </CardContent>
        </Card>
        </motion.div>

        {/* ── SECTION 6: Link check summary ──────────────────────────────── */}
        <AnimatePresence>
          {showSummary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <LinkCheckSummary links={summaryLinks} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── DEMO CONTROLS ──────────────────────────────────────────────── */}
        <div className="mt-6 px-6 lg:px-8 pb-2">
          <p className="text-xs font-bold text-muted/60 uppercase tracking-[0.1em] mb-2">
            Demo controls
          </p>
          {allLinks.map((link) => (
            <div key={link.id} className="mb-2">
              <p className="text-xs text-muted/60 mb-1">{link.name}</p>
              <div className="flex flex-wrap gap-1">
                {DEMO_STATUSES.map(({ value, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDemoStatus(link.id, value)}
                    className={`text-xs px-2 py-1 rounded border ${
                      (demoOverrides[link.id] ?? null) === value
                        ? 'border-border text-muted'
                        : 'border-border text-muted/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
      </div>
      </div>
      {/* end scrollable area */}

      {/* ════════════════════════════════════════════════════════════════════
          STICKY BOTTOM CTA
          ════════════════════════════════════════════════════════════════════ */}
      <div className="sticky bottom-0 w-full z-40 relative shrink-0">

        {/* Gradient fade */}
        <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white" />

        <div className="bg-white border-t border-border px-8 lg:px-10 pb-5 pt-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">

          {/* Helper text — blocked state */}
          <AnimatePresence>
            {!allRequiredResolved && (
              <motion.p
                key="blocked-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[13px] text-muted"
              >
                Check your required links before continuing
              </motion.p>
            )}
          </AnimatePresence>

          {/* Helper text — ready state */}
          <AnimatePresence>
            {allRequiredResolved && (
              <motion.p
                key="ready-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="text-[13px] text-muted"
              >
                All required links verified. You're good to go.
              </motion.p>
            )}
          </AnimatePresence>

          {/* CTA button */}
          <Button
            variant="primary"
            size="lg"
            isDisabled={!allRequiredResolved}
            className={`ml-auto rounded-xl px-8 text-[15px] transition-all duration-300 ${
              allRequiredResolved ? 'font-bold' : 'font-semibold'
            }`}
            onPress={handleContinue}
            aria-label={allRequiredResolved
              ? 'Continue to submission review'
              : 'Check your required links before continuing'}
          >
            Continue to review
          </Button>

          </div>
        </div>
      </div>

    </PageShell>
    </>
  )
}
