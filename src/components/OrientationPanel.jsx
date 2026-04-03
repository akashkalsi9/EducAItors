/**
 * OrientationPanel — v4 (single-page, no carousel)
 *
 * All three sections visible at once in a scrollable view.
 * Used inside the Getting Started modal on Dashboard.
 *
 * Props:
 *   onDismiss — callback — parent closes modal on call
 */

import { Button } from '@heroui/react'
import { ShieldCheck, ScanSearch, ListChecks, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

// ─── Outcome row ──────────────────────────────────────────────────────────────
function OutcomeRow({ Icon, iconBg, iconColor, label, desc }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-border">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={2} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-foreground leading-snug">{label}</p>
        <p className="text-[13px] text-muted mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ─── Section block ────────────────────────────────────────────────────────────
function Section({ Icon, iconBg, iconColor, title, children }) {
  return (
    <div className="flex gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.75} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-bold text-foreground leading-snug">{title}</h3>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function OrientationPanel({ onDismiss }) {

  function dismiss() {
    localStorage.setItem('educaitors_orientation_seen', 'true')
    onDismiss()
  }

  return (
    <div className="flex flex-col">

      {/* ── All sections ──────────────────────────────────────────────────── */}
      <div className="px-6 lg:px-8 py-6 flex flex-col gap-6">

        {/* Section 1 — What gets checked */}
        <Section
          Icon={ScanSearch}
          iconBg="bg-purple-soft"
          iconColor="text-purple"
          title="What gets checked"
        >
          <p className="text-[13px] text-muted leading-relaxed">
            Your files, links, and handwritten content are checked for readability
            and completeness — before they reach your instructor.
          </p>
        </Section>

        <div className="h-px bg-border" />

        {/* Section 2 — Three possible results */}
        <Section
          Icon={ListChecks}
          iconBg="bg-success-soft"
          iconColor="text-success"
          title="Three possible results"
        >
          <div className="flex flex-col gap-2">
            <OutcomeRow
              Icon={CheckCircle2}
              iconBg="bg-success-soft"
              iconColor="text-success"
              label="Ready"
              desc="Safe to submit — good to go"
            />
            <OutcomeRow
              Icon={AlertTriangle}
              iconBg="bg-warning-soft"
              iconColor="text-warning"
              label="Ready with warnings"
              desc="You can proceed — but there's a risk to review"
            />
            <OutcomeRow
              Icon={XCircle}
              iconBg="bg-danger-soft"
              iconColor="text-danger"
              label="Needs fixing"
              desc="Something must be resolved before grading"
            />
          </div>
        </Section>

        <div className="h-px bg-border" />

        {/* Section 3 — Your instructor decides */}
        <Section
          Icon={ShieldCheck}
          iconBg="bg-success-soft"
          iconColor="text-success"
          title="Your instructor decides"
        >
          <p className="text-[13px] text-muted leading-relaxed">
            AI processes your submission. Your instructor makes the final grade
            decision — always.
          </p>
          <div className="flex items-start gap-2.5 p-3 mt-3 rounded-lg bg-success-soft">
            <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" />
            <p className="text-[13px] font-semibold text-success leading-snug">
              This system is a tool. Your instructor is the authority.
            </p>
          </div>
        </Section>

      </div>

      {/* ── Footer CTA ────────────────────────────────────────────────────── */}
      <div className="border-t border-border px-6 lg:px-8 py-4 flex items-center justify-end">
        <Button
          variant="primary"
          size="sm"
          className="rounded-lg px-6 font-semibold"
          onPress={dismiss}
        >
          Got it
        </Button>
      </div>

    </div>
  )
}
