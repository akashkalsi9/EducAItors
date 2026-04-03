/**
 * ValidationRunning
 *
 * Screen 3.2 / 5.2 — Validation Running
 * Shared implementation for /submit/validating and /fix/validating.
 *
 * Persona: ALL personas see this screen.
 * Riya (anxious — needs calm not alarm)
 * Arjun (impatient — needs forward motion)
 * Sunita (confused — needs simple reassurance)
 * Karan (deadline pressure — needs to know it's working)
 *
 * This screen's only job: make the 4.4-second wait feel safe.
 * Not fast. Not detailed. Not informative. Safe.
 *
 * Props:
 *   isResubmission — boolean. Shows amber resubmission note above main copy.
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import PulseRingAnimation from './ui/PulseRingAnimation'
import AnimatedDots from './ui/AnimatedDots'
import { mockAssignment } from '../data/mock-assignment'

// ─── Result route map ──────────────────────────────────────────────────────────
const RESULT_ROUTES = {
  ready:   '/result/ready',
  warning: '/result/warning',
  blocker: '/result/blocker',
}

// ─── Result icon config ────────────────────────────────────────────────────────
const RESULT_ICONS = {
  ready: {
    Icon:  CheckCircle2,
    color: 'text-success',
    size:  'w-7 h-7',
  },
  warning: {
    Icon:  AlertCircle,
    color: 'text-warning',
    size:  'w-7 h-7',
  },
  blocker: {
    Icon:  XCircle,
    color: 'text-danger',
    size:  'w-7 h-7',
  },
}

// ─── Default demo result (most interesting for pitch) ─────────────────────────
const DEFAULT_DEMO_RESULT = 'warning'

// ─────────────────────────────────────────────────────────────────────────────
export default function ValidationRunning({ isResubmission: isResubmissionProp = false }) {
  const navigate = useNavigate()
  const { state: routeState } = useLocation()

  // Support both prop and route state for isResubmission
  const isResubmission = isResubmissionProp || (routeState?.isResubmission ?? false)

  // Pass submission state forward through the navigation chain
  const primaryFile  = routeState?.primaryFile  ?? null
  const artifactData = routeState?.artifactData ?? null
  const linkStatuses = routeState?.linkStatuses ?? {}

  const { title } = mockAssignment

  // ── Phase state ────────────────────────────────────────────────────────────
  // 'active'    — waiting, pulse rings running, everything breathing
  // 'resolving' — icon swap, rings slow, result revealed
  // 'leaving'   — page fades out
  const [phase, setPhase] = useState('active')

  // ── Result icon shown at resolve moment ───────────────────────────────────
  const [resultIcon, setResultIcon] = useState(null)

  // ── Demo control state ────────────────────────────────────────────────────
  const demoResultRef   = useRef(DEFAULT_DEMO_RESULT)
  const tapCountRef     = useRef({ left: 0, center: 0, right: 0 })
  const tapTimerRef     = useRef({ left: null, center: null, right: null })
  const [demoIndicator, setDemoIndicator] = useState(null)
  const demoIndicatorTimerRef = useRef(null)

  // ── Main timer sequence ────────────────────────────────────────────────────
  useEffect(() => {
    // 3000ms — shield fades out, result icon fades in, rings slow
    const t1 = setTimeout(() => {
      setPhase('resolving')
      setResultIcon(demoResultRef.current)
    }, 3000)

    // 4100ms — page begins fading out
    const t2 = setTimeout(() => {
      setPhase('leaving')
    }, 4100)

    // 4400ms — navigate to result screen
    const t3 = setTimeout(() => {
      navigate(
        RESULT_ROUTES[demoResultRef.current] ?? RESULT_ROUTES.warning,
        { state: { primaryFile, artifactData, linkStatuses, isResubmission } }
      )
    }, 4400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Hidden demo triple-tap handler ────────────────────────────────────────
  function handleDemoTap(zone) {
    tapCountRef.current[zone] = (tapCountRef.current[zone] || 0) + 1

    clearTimeout(tapTimerRef.current[zone])
    tapTimerRef.current[zone] = setTimeout(() => {
      tapCountRef.current[zone] = 0
    }, 1000)

    if (tapCountRef.current[zone] >= 3) {
      tapCountRef.current[zone] = 0
      const mapping = { left: 'ready', center: 'warning', right: 'blocker' }
      demoResultRef.current = mapping[zone]

      // Show brief indicator
      setDemoIndicator(mapping[zone])
      clearTimeout(demoIndicatorTimerRef.current)
      demoIndicatorTimerRef.current = setTimeout(() => setDemoIndicator(null), 2000)
    }
  }

  // ── Determine center icon ──────────────────────────────────────────────────
  const iconKey = phase === 'resolving' ? (resultIcon ?? 'shield') : 'shield'
  const resultConfig = resultIcon ? RESULT_ICONS[resultIcon] : null

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-secondary">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'leaving' ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full bg-white min-h-screen flex flex-col items-center justify-center px-8 lg:px-10 py-8 max-w-2xl mx-auto"
      >

        {/* ── ELEMENT 1: Assignment context (absolute top) ── */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
          className="absolute top-0 left-0 right-0 text-[13px] font-medium text-muted text-center px-6 pt-5"
          aria-label={`Validating: ${title}`}
        >
          {title}
        </motion.p>

        {/* ── MAIN CONTENT (centered) ── */}
        <div className="flex flex-col items-center">

          {/* ── Resubmission note (amber, left-border flex-strip) ── */}
          {isResubmission && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.5 }}
              className="mb-8 w-full max-w-[320px] rounded-xl bg-white border border-border overflow-hidden"
            >
              <div className="flex">
                <div
                  className="w-[3px] bg-warning shrink-0 self-stretch"
                  aria-hidden="true"
                />
                <p className="flex-1 px-4 py-3 text-[13px] font-medium text-warning leading-[1.5]">
                  We'll check everything again — your other elements should still pass.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── ELEMENT 2: Pulse ring animation + icon ── */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Soft radial glow behind animation */}
            <div
              className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(31,78,140,0.05) 0%, transparent 70%)' }}
              aria-hidden="true"
            />

            {/* Pulse rings + center circle */}
            <PulseRingAnimation
              ringCount={3}
              interval={0.7}
              slow={phase === 'resolving'}
            >
              {/* Center circle */}
              <div className="w-[72px] h-[72px] rounded-full bg-white border-2 border-border flex items-center justify-center relative z-10">
                <AnimatePresence mode="wait" initial={false}>
                  {phase !== 'resolving' ? (
                    /* Shield — stable, confident, checking */
                    <motion.div
                      key="shield"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ShieldCheck
                        className="w-7 h-7 text-purple"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </motion.div>
                  ) : (
                    /* Result icon — the emotional reveal */
                    <motion.div
                      key={resultIcon ?? 'shield'}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      {resultConfig && (
                        <resultConfig.Icon
                          className={`${resultConfig.size} ${resultConfig.color}`}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </PulseRingAnimation>
          </motion.div>

          {/* ── ELEMENT 3: Primary copy ── */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.6 }}
            className="text-[20px] font-semibold text-foreground text-center tracking-[-0.2px] mt-10"
          >
            Checking your submission…
          </motion.h1>

          {/* ── ELEMENT 4: Secondary copy ── */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.75 }}
            className="text-[14px] text-muted text-center mt-2.5"
          >
            This usually takes a few seconds.
          </motion.p>

          {/* ── ELEMENT 5: Animated dots ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="mt-8"
          >
            <AnimatedDots count={3} interval={0.4} />
          </motion.div>

        </div>
        {/* end main content */}

        {/* ── Demo indicator (brief, fades away) ── */}
        <AnimatePresence>
          {demoIndicator && (
            <motion.p
              key={demoIndicator}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-[80px] left-0 right-0 text-[10px] font-normal text-muted/60 text-center pointer-events-none"
            >
              → {demoIndicator.charAt(0).toUpperCase() + demoIndicator.slice(1)}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── ELEMENT 6: Reassurance (absolute bottom) ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 1.1 }}
          className="absolute bottom-0 left-0 right-0 px-6 pb-12 flex flex-col items-center"
        >
          <p className="text-[13px] font-medium text-muted text-center">
            Your work has been received.
          </p>
          <p className="text-[12px] text-muted text-center mt-1">
            Do not close this screen.
          </p>
        </motion.div>

        {/* ── Hidden demo triple-tap zones ── */}
        {/* Invisible — bottom third of screen, three zones */}
        <div
          className="absolute bottom-0 left-0 right-0 flex"
          style={{ height: '80px' }}
          aria-hidden="true"
        >
          <button
            type="button"
            className="flex-1 opacity-0 cursor-default"
            onClick={() => handleDemoTap('left')}
            tabIndex={-1}
            aria-hidden="true"
          />
          <button
            type="button"
            className="flex-1 opacity-0 cursor-default"
            onClick={() => handleDemoTap('center')}
            tabIndex={-1}
            aria-hidden="true"
          />
          <button
            type="button"
            className="flex-1 opacity-0 cursor-default"
            onClick={() => handleDemoTap('right')}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

      </motion.div>
    </div>
  )
}
