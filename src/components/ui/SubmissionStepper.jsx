/**
 * SubmissionStepper
 *
 * 5-step horizontal progress stepper for the submission flow.
 * Completed steps are clickable — navigate back to that step.
 * Active step shows current position. Upcoming steps are disabled.
 *
 * Props:
 *   currentStep — 1 | 2 | 3 | 4 | 5  (active step; steps below are completed)
 *   stepNote    — optional { stepId: number, text: string, color: string }
 */

import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  { id: 1, label: 'Upload',    route: '/submit/upload'    },
  { id: 2, label: 'Artifacts', route: '/submit/artifacts' },
  { id: 3, label: 'Links',     route: '/submit/links'     },
  { id: 4, label: 'Review',    route: '/submit/review'    },
]

export default function SubmissionStepper({ currentStep = 1, stepNote = null }) {
  const navigate = useNavigate()

  function stepStatus(stepId) {
    if (stepId < currentStep)  return 'completed'
    if (stepId === currentStep) return 'active'
    return 'upcoming'
  }

  function handleStepClick(step) {
    navigate(step.route)
  }

  // Progress fill width: 0% at step 1, 100% at step 5
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="sticky top-[129px] z-30 bg-white border-b border-border px-8 lg:px-10 py-4">
      <div className="max-w-4xl mx-auto">

        {/* Wrapper — positions the connector line behind the circles */}
        <div className="relative">

          {/* Connector line */}
          <div className="absolute left-0 right-0 bottom-[5.5px] h-[3px] bg-border rounded-full" />

          {/* Filled progress track */}
          {currentStep > 1 && (
            <div
              className="absolute left-0 bottom-[5.5px] h-[3px] bg-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          )}

          {/* Step columns */}
          <div className="relative flex items-end justify-between">
            {STEPS.map((step) => {
              const status = stepStatus(step.id)
              const isClickable = true // all steps clickable for demo
              const hasNote = stepNote && stepNote.stepId === step.id

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleStepClick(step)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center gap-2 bg-transparent border-none p-0 ${
                    isClickable ? 'cursor-pointer group' : 'cursor-default'
                  }`}
                  aria-label={isClickable ? `Go back to ${step.label}` : step.label}
                >
                  {/* Label */}
                  <span className={`text-[13px] leading-none transition-colors ${
                    status === 'completed' ? 'font-medium text-foreground group-hover:text-accent'
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

                  {/* Circle */}
                  <div className="relative z-10">
                    {status === 'completed' ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-accent transition-transform group-hover:scale-125" />
                    ) : status === 'active' ? (
                      <div className="w-3.5 h-3.5 rounded-full border-[3px] border-accent bg-white" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-border bg-white" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

        </div>

      </div>
    </div>
  )
}
