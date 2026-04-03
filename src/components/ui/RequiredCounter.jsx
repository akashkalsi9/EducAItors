/**
 * RequiredCounter
 *
 * Pill counter showing how many required artifacts have been uploaded.
 * Color transitions: red (0) → amber (partial) → green (all done).
 * The count number pulses with a scale animation each time it changes.
 *
 * Props:
 *   total      — total required artifact count
 *   completed  — how many have been confirmed
 */

import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

export default function RequiredCounter({ total = 0, completed = 0 }) {
  const controls = useAnimation()

  const isComplete = completed === total
  const hasStarted = completed > 0

  const pillBg  = isComplete ? 'bg-success-soft' : hasStarted ? 'bg-warning-soft' : 'bg-accent-soft'
  const textCol = isComplete ? 'text-success' : hasStarted ? 'text-warning' : 'text-accent'

  useEffect(() => {
    controls.start({
      scale: [1, 1.25, 1],
      transition: { duration: 0.3, ease: 'easeInOut' },
    })
  }, [completed])

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${pillBg}`}
      aria-label={`${completed} of ${total} required files uploaded`}
    >
      <motion.span animate={controls} className={`text-[13px] font-bold ${textCol}`}>
        {completed}
      </motion.span>
      <span className={`text-[13px] font-medium ${textCol}`}>
        / {total} required
      </span>
    </div>
  )
}
