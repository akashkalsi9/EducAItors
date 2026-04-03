// Screen 3.3 — Validation Result: Ready State
// Route: /result/ready
// Persona: Riya — anxious first-timer. This is her emotional payoff.

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Card, CardContent } from '@heroui/react'
import { Clock, Download, Bell, Info } from 'lucide-react'
import PageShell from '../../components/PageShell'
import InnerPageBar from '../../components/ui/InnerPageBar'
import { mockReadyResult } from '../../data/mock-validation-results'
import { mockAssignment } from '../../data/mock-assignment'

// ─── Notification channels ────────────────────────────────────────────────────
const CHANNELS = [
  { id: 'push',      label: 'Push'      },
  { id: 'email',     label: 'Email'     },
  { id: 'whatsapp',  label: 'WhatsApp'  },
]

// ─── Composed success icon ────────────────────────────────────────────────────
// Three-layer: soft outer aura → mid ring → solid circle → white checkmark
function SuccessIcon() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="36" cy="36" r="36" fill="#10B981" fillOpacity="0.08" />
      <circle cx="36" cy="36" r="30" fill="#10B981" fillOpacity="0.15" />
      <circle cx="36" cy="36" r="24" fill="#10B981" />
      <path
        d="M25 36l8 8 14-15"
        stroke="white"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ValidationReady() {
  const navigate        = useNavigate()
  const { state }       = useLocation()
  const isResubmission  = state?.isResubmission ?? false
  const result          = mockReadyResult
  const deadline        = state?.deadline ?? mockAssignment.deadline
  const [notifyVia, setNotifyVia] = useState('push')

  // Copy register — exact phrases, toggled by resubmission flag
  const headline       = isResubmission ? 'Your resubmission is in.'            : 'Your submission is in.'
  const timelineTitle  = isResubmission ? 'Your updated work is under review.'  : `Typically reviewed within ${result.instructorReviewEstimate}`

  return (
    <>
      <InnerPageBar
        breadcrumbItems={[
          { label: 'Assignments', href: '/' },
          { label: 'Validation Results' },
          { label: 'Submission Ready' },
        ]}
        deadline={deadline}
      />
      <PageShell noPadding>

      {/* ── FIX 9: bg-soft outer, white content block ──────────────────────── */}
      <div className="bg-surface-secondary">
        <div className="px-8 lg:px-10 py-8">
        <div className="max-w-2xl mx-auto">
        <Card className="rounded-xl border border-border p-0">
        <CardContent className="p-6 lg:p-10 flex flex-col items-center">

          {/* ── FIX 1: Success icon — static ring + pulse animation ─────────── */}
          <div className="relative flex items-center justify-center">

            {/* Pulse ring — scale out + fade, infinite heartbeat */}
            <motion.div
              className="absolute rounded-full bg-success w-[72px] h-[72px]"
              initial={{ scale: 1,    opacity: 0.3 }}
              animate={{ scale: 1.55, opacity: 0   }}
              transition={{
                duration: 1.5,
                repeat:   Infinity,
                ease:     'easeOut',
                delay:    0.5,
              }}
            />

            {/* Icon with static soft ring halo */}
            <motion.div
              className="relative ring-4 ring-offset-4 ring-success-soft rounded-full"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
              aria-label="Submission confirmed"
            >
              <SuccessIcon />
            </motion.div>

          </div>

          {/* ── FIX 2: Headline — tracking-tight ───────────────────────────── */}
          <motion.h1
            className="text-[24px] font-bold text-foreground text-center mt-6 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.5 }}
          >
            {headline}
          </motion.h1>

          {/* ── FIX 3: "How grading works" badge + AI statement (no bold) ───── */}
          <motion.div
            className="mt-3 flex flex-col items-center gap-2 w-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.7 }}
          >
            {/* Pill badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-secondary border border-border text-[11px] font-medium text-muted">
              <Info className="w-3 h-3 shrink-0" strokeWidth={2} aria-hidden="true" />
              How grading works
            </span>

            {/* Statement — 14px/400 only, NO bold anywhere on this screen */}
            <p className="text-[14px] text-muted text-center leading-relaxed">
              AI will process your work. Your instructor makes the final grade decision.
            </p>
          </motion.div>

          {/* ── FIX 4: Timeline card — left-border accent + two-row layout ──── */}
          <motion.div
            className="w-full mt-8 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.9 }}
          >
            {/* Border + left accent via flex strip pattern */}
            <div className="border border-border rounded-xl overflow-hidden flex">
              {/* Left accent strip — success green */}
              <div className="w-[4px] bg-success shrink-0 self-stretch" />
              {/* Card content */}
              <div className="flex-1 bg-surface-secondary px-4 py-4">
                {/* Row 1: clock + title */}
                <div className="flex items-center gap-2">
                  <Clock
                    className="w-4 h-4 text-success shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <p className="text-[14px] font-semibold text-foreground leading-snug">
                    {timelineTitle}
                  </p>
                </div>
                {/* Row 2: supporting text — indented under title text */}
                <p className="text-[13px] text-muted mt-1.5 ml-6 leading-relaxed">
                  You'll be notified when your grade is ready.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── FIX 5: Notification preference row ─────────────────────────── */}
          <motion.div
            className="w-full mt-3 flex flex-wrap items-center gap-x-2 gap-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 1.0 }}
          >
            <Bell
              className="w-3.5 h-3.5 text-muted shrink-0"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="text-[12px] font-medium text-muted">
              Notify me via
            </span>
            <div className="flex gap-1.5" role="group" aria-label="Notification preference">
              {CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setNotifyVia(ch.id)}
                  className={`rounded-full px-3 py-1 min-h-[28px] text-[12px] font-medium transition-colors ${
                    notifyVia === ch.id
                      ? 'bg-accent text-white'
                      : 'bg-surface-secondary border border-border text-muted'
                  }`}
                  aria-pressed={notifyVia === ch.id}
                  aria-label={`Notify via ${ch.label}`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── FIX 6: Download receipt — rounded-lg, 1.5px border, press scale ── */}
          <motion.div
            className="w-full mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 1.1 }}
          >
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                fullWidth
                size="lg"
                className="rounded-lg h-12 text-sm font-semibold text-accent border-2 border-accent gap-2 hover:bg-accent-soft"
                onPress={() => { /* prototype: no-op */ }}
                aria-label="Download submission receipt"
              >
                <Download className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                Download submission receipt
              </Button>
            </motion.div>
          </motion.div>

        </CardContent>
        </Card>
        </div>
        </div>
      </div>

      {/* ── FIX 8: Sticky CTA with gradient fade above it ──────────────────── */}
      <div className="sticky bottom-0 w-full z-40 relative">

        {/* Gradient fade — signals scrollable content, no hard edge */}
        <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white" />

        {/* CTA bar */}
        <div className="bg-white border-t border-border px-8 lg:px-10 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-end">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              variant="primary"
              size="lg"
              className="rounded-xl px-8 font-bold text-[15px]"
              onPress={() => navigate('/')}
              aria-label="Return to dashboard"
            >
              Return to dashboard
            </Button>
          </motion.div>
          </div>
        </div>

      </div>

    </PageShell>
    </>
  )
}
