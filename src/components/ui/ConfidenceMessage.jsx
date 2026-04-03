/**
 * ConfidenceMessage
 *
 * The signature design moment for Screen 2.4.
 * Uses HeroUI Alert with a top border that draws itself left-to-right on mount.
 * High confidence = the moment she exhales.
 *
 * Props:
 *   confidence — 'high' | 'medium' | 'low'
 */

import { motion } from 'framer-motion'
import { Alert, AlertTitle, AlertDescription } from '@heroui/react'

// ─── Config ───────────────────────────────────────────────────────────────────
const CONFIDENCE_CONFIG = {
  high: {
    status:    'success',
    borderBg:  'bg-success',
    headline:  'Your handwriting looks clear — good to go.',
    subtext:   'We were able to read your work. Continue when you\'re ready.',
  },
  medium: {
    status:    'warning',
    borderBg:  'bg-warning',
    headline:  'Some parts may be hard to read.',
    subtext:   'Check what we extracted below and confirm it looks right.',
  },
  low: {
    status:    'danger',
    borderBg:  'bg-danger',
    headline:  'Parts of your submission may be unreadable.',
    subtext:   'Try a clearer photo in better lighting.',
  },
}

// ─── ConfidenceMessage ────────────────────────────────────────────────────────
export default function ConfidenceMessage({ confidence = 'high' }) {
  const config = CONFIDENCE_CONFIG[confidence] ?? CONFIDENCE_CONFIG.high

  return (
    <div className="rounded-xl overflow-hidden border border-border">

      {/* ── Signature border animation — draws left-to-right ── */}
      <motion.div
        key={confidence}
        className={`h-[3px] origin-left ${config.borderBg}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        aria-hidden="true"
      />

      {/* ── HeroUI Alert ── */}
      <Alert
        status={config.status}
        className="rounded-none border-0 shadow-none items-center [&_[data-slot=alert-content]]:flex-row [&_[data-slot=alert-content]]:items-center [&_[data-slot=alert-content]]:gap-3"
      >
        <AlertTitle>{config.headline}</AlertTitle>
        <AlertDescription>{config.subtext}</AlertDescription>
      </Alert>

    </div>
  )
}
