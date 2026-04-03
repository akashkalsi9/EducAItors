/**
 * SubmissionStepper
 *
 * 5-step horizontal progress stepper for the submission flow.
 * Each step is a unified column: label on top, circle below — perfectly aligned.
 * Connector line runs through the circles with filled progress up to current step.
 * Sticky below InnerPageBar (top-16 breadcrumb bar = ~52px below AppHeader 64px ≈ 116px).
 *
 * Props:
 *   currentStep — 1 | 2 | 3 | 4 | 5  (active step; steps below are completed)
 *   stepNote    — optional { stepId: number, text: string, color: string }
 *                 renders a small animated sub-label below the matching step
 */

import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  { id: 1, label: 'Upload'    },
  { id: 2, label: 'Artifacts' },
  { id: 3, label: 'Preview'   },
  { id: 4, label: 'Links'     },
  { id: 5, label: 'Review'    },
]

export default function SubmissionStepper({ currentStep = 1, stepNote = null }) {
  function stepStatus(stepId) {
    if (stepId < currentStep)  return 'completed'
    if (stepId === currentStep) return 'active'
    return 'upcoming'
  }

  // Progress fill width: 0% at step 1, 100% at step 5
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="sticky top-[129px] z-30 bg-white border-b border-border px-8 lg:px-10 py-4">
      <div className="max-w-4xl mx-auto">

        {/* Wrapper — positions the connector line behind the circles */}
        <div className="relative">

          {/* ── Connector line — sits behind circles vertically centered on them ── */}
          {/* Circle row starts after labels. Circles are 12–16px tall, centered at ~8px from their row top. */}
          {/* We position the line at the vertical center of the circle row using bottom offset. */}
          <div className="absolute left-0 right-0 bottom-[5.5px] h-[3px] bg-border rounded-full" />

          {/* Filled progress track */}
          {currentStep > 1 && (
            <div
              className="absolute left-0 bottom-[5.5px] h-[3px] bg-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          )}

          {/* ── Step columns — label + circle unified ─────────────────────── */}
          <div className="relative flex items-end justify-between">
            {STEPS.map((step) => {
              const status = stepStatus(step.id)
              const hasNote = stepNote && stepNote.stepId === step.id

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center gap-2"
                >
                  {/* Label */}
                  <span className={`text-[13px] leading-none ${
                    status === 'completed' ? 'font-medium text-foreground'
                    : status === 'active'  ? 'font-semibold text-accent'
                    : 'font-normal text-muted'
                  }`}>
                    {step.label}
                  </span>

                  {/* Optional step note */}
                  <AnimatePresence>
                    {hasNote && (
                      <motion.span
                        key="stepNote"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`text-[11px] font-medium leading-none -mt-1 ${stepNote.color}`}
                      >
                        {stepNote.text}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Circle — all same size (14px) for perfect line alignment */}
                  <div className="relative z-10">
                    {status === 'completed' ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-accent" />
                    ) : status === 'active' ? (
                      <div className="w-3.5 h-3.5 rounded-full border-[3px] border-accent bg-white" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-border bg-white" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </div>
  )
}
