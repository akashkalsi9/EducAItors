/**
 * ValidationRunning — v2
 *
 * Screen 3.2 / 5.2 — Step-by-step validation progress.
 * Shows a checklist of what the system is doing: checking files, OCR, links, rubric mapping.
 * Each step completes sequentially with staggered timing.
 * Auto-navigates to /result/analysis after all steps complete.
 *
 * Demo: triple-tap bottom zones to set result type (ready/warning/blocker).
 *
 * Props:
 *   isResubmission — boolean. Shows amber note if true.
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, FileSearch, Link2, Layers, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@heroui/react'
import { mockAssignment } from '../data/mock-assignment'

// ─── Validation steps ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 'files',    label: 'Checking uploaded files',  Icon: FileSearch, completeAt: 1000  },
  { id: 'links',    label: 'Verifying links',          Icon: Link2,      completeAt: 2500  },
  { id: 'rubric',   label: 'Mapping to rubric',        Icon: Layers,     completeAt: 4000  },
  { id: 'analysis', label: 'Generating analysis',      Icon: Sparkles,   completeAt: 5500  },
]

const RESUBMIT_STEPS = [
  { id: 'recheck',  label: 'Re-checking updated item', Icon: FileSearch, completeAt: 1500  },
  { id: 'analysis', label: 'Updating analysis',        Icon: Sparkles,   completeAt: 3000  },
]

const RESUBMIT_NAVIGATE_AT = 3800

const NAVIGATE_AT = 6300 // ms — navigate after brief pause post-completion

// ─── Result route ─────────────────────────────────────────────────────────────
const DEFAULT_DEMO_RESULT = 'warning'

// ─────────────────────────────────────────────────────────────────────────────
export default function ValidationRunning({ isResubmission: isResubmissionProp = false }) {
  const navigate = useNavigate()
  const { state: routeState } = useLocation()

  const isResubmission = isResubmissionProp || (routeState?.isResubmission ?? false)
  const steps = isResubmission ? RESUBMIT_STEPS : STEPS
  const navigateAt = isResubmission ? RESUBMIT_NAVIGATE_AT : NAVIGATE_AT
  const primaryFile  = routeState?.primaryFile  ?? null
  const artifactData = routeState?.artifactData ?? null
  const linkStatuses = routeState?.linkStatuses ?? {}
  const { title } = mockAssignment

  // ── Step completion tracking ──────────────────────────────────────────────
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  // ── Demo control ──────────────────────────────────────────────────────────
  const demoResultRef   = useRef(DEFAULT_DEMO_RESULT)
  const tapCountRef     = useRef({ left: 0, center: 0, right: 0 })
  const tapTimerRef     = useRef({ left: null, center: null, right: null })
  const [demoIndicator, setDemoIndicator] = useState(null)
  const demoIndicatorTimerRef = useRef(null)

  // ── Progress percentage ───────────────────────────────────────────────────
  const progress = useMemo(() => {
    if (completedSteps.size === 0) return 5 // show a sliver immediately
    return Math.round((completedSteps.size / steps.length) * 100)
  }, [completedSteps, steps])

  // ── Timer sequence ────────────────────────────────────────────────────────
  useEffect(() => {
    const timers = []

    // Schedule each step completion
    steps.forEach((step, index) => {
      // Activate step slightly before completion
      const activateAt = index === 0 ? 100 : steps[index - 1].completeAt + 200
      timers.push(setTimeout(() => setActiveStepIndex(index), activateAt))

      // Complete step
      timers.push(setTimeout(() => {
        setCompletedSteps(prev => new Set([...prev, step.id]))
      }, step.completeAt))
    })

    // Navigate after all steps complete
    timers.push(setTimeout(() => {
      navigate('/result/analysis', {
        state: { primaryFile, artifactData, linkStatuses, isResubmission, readiness: demoResultRef.current },
      })
    }, navigateAt))

    return () => timers.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Demo triple-tap handler ───────────────────────────────────────────────
  function handleDemoTap(zone) {
    tapCountRef.current[zone] = (tapCountRef.current[zone] || 0) + 1
    clearTimeout(tapTimerRef.current[zone])
    tapTimerRef.current[zone] = setTimeout(() => { tapCountRef.current[zone] = 0 }, 1000)

    if (tapCountRef.current[zone] >= 3) {
      tapCountRef.current[zone] = 0
      const mapping = { left: 'ready', center: 'warning', right: 'blocker' }
      demoResultRef.current = mapping[zone]
      setDemoIndicator(mapping[zone])
      clearTimeout(demoIndicatorTimerRef.current)
      demoIndicatorTimerRef.current = setTimeout(() => setDemoIndicator(null), 2000)
    }
  }

  // ── Step status ───────────────────────────────────────────────────────────
  function getStepStatus(step, index) {
    if (completedSteps.has(step.id)) return 'completed'
    if (index === activeStepIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center px-8 lg:px-10 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl border border-border p-0 gap-0">
          {/* ── Assignment context ──────────────────────────────────────── */}
          <div className="px-8 pt-5 pb-0">
            <p className="text-[12px] font-medium text-muted text-center truncate">{title}</p>
          </div>

          <CardContent className="px-8 pt-4 pb-8 gap-0">

            {/* ── Spinner icon ──────────────────────────────────────────── */}
            <div className="flex justify-center mb-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14 rounded-full bg-accent flex items-center justify-center"
              >
                <Loader2 className="w-7 h-7 text-white" strokeWidth={2.5} aria-hidden="true" />
              </motion.div>
            </div>

            {/* ── Headline ──────────────────────────────────────────────── */}
            <h1 className="text-[20px] font-bold text-foreground text-center tracking-tight">
              {isResubmission ? 'Checking your update...' : 'Validating your submission...'}
            </h1>
            <p className="text-[14px] text-muted text-center mt-1.5">
              {isResubmission ? "We're only re-checking what you changed" : 'This usually takes a few seconds'}
            </p>

            {/* ── Resubmission note ─────────────────────────────────────── */}
            {isResubmission && (
              <div className="mt-4 p-3 rounded-lg bg-warning-soft">
                <p className="text-[13px] text-warning font-medium text-center">
                  We'll check everything again — your other elements should still pass.
                </p>
              </div>
            )}

            {/* ── Step checklist ─────────────────────────────────────────── */}
            <div className="mt-6 flex flex-col gap-0.5">
              {steps.map((step, index) => {
                const status = getStepStatus(step, index)
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.15 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-300 ${
                      status === 'active' ? 'bg-surface-secondary' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      {status === 'completed' ? (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={2} aria-hidden="true" />
                        </motion.div>
                      ) : status === 'active' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 className="w-5 h-5 text-purple" strokeWidth={2} aria-hidden="true" />
                        </motion.div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-border" />
                      )}
                    </div>

                    {/* Label */}
                    <span className={`text-[14px] flex-1 transition-colors duration-300 ${
                      status === 'completed' ? 'text-foreground font-medium'
                      : status === 'active'  ? 'text-purple font-semibold'
                      : 'text-muted font-normal'
                    }`}>
                      {step.label}
                    </span>

                    {/* Check mark on right */}
                    {status === 'completed' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-success text-sm font-semibold"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* ── Progress bar ───────────────────────────────────────────── */}
            <div className="mt-6">
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* ── Reassurance ────────────────────────────────────────────── */}
            <div className="mt-5 text-center">
              <p className="text-[13px] text-muted">
                Nothing is submitted yet — you can still make changes.
              </p>
              <p className="text-[12px] text-muted/60 mt-1.5">
                We check first. Your instructor reviews next.
              </p>
            </div>

          </CardContent>
        </Card>

        {/* ── Demo indicator ──────────────────────────────────────────── */}
        <AnimatePresence>
          {demoIndicator && (
            <motion.p
              key={demoIndicator}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-muted/60 text-center mt-3"
            >
              → {demoIndicator.charAt(0).toUpperCase() + demoIndicator.slice(1)}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Hidden demo triple-tap zones ───────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 flex h-20" aria-hidden="true">
        <button type="button" className="flex-1 opacity-0" onClick={() => handleDemoTap('left')} tabIndex={-1} />
        <button type="button" className="flex-1 opacity-0" onClick={() => handleDemoTap('center')} tabIndex={-1} />
        <button type="button" className="flex-1 opacity-0" onClick={() => handleDemoTap('right')} tabIndex={-1} />
      </div>
    </div>
  )
}
