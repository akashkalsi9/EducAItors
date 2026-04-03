/**
 * ProgressBar
 *
 * Animated 6px upload progress bar.
 * Width driven by framer-motion animate — not inline styles.
 * Color class is passed in as a Tailwind bg-* token so Tailwind can scan it.
 *
 * Props:
 *   progress    — 0–100
 *   colorClass  — Tailwind bg class, e.g. 'bg-accent' | 'bg-warning'
 *   transition  — framer-motion transition object { duration, ease }
 */

import { motion } from 'framer-motion'

export default function ProgressBar({
  progress    = 0,
  colorClass  = 'bg-accent',
  heightClass = 'h-[6px]',
  transition  = { duration: 1, ease: 'linear' },
}) {
  return (
    <div className={`w-full ${heightClass} bg-border rounded-full overflow-hidden`}>
      <motion.div
        className={`h-full rounded-full transition-colors duration-[400ms] ${colorClass}`}
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={transition}
      />
    </div>
  )
}
