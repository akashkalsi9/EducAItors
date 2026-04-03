/**
 * PulseRingAnimation
 *
 * Calm pulse rings that radiate outward from a center element.
 * Used on Screen 3.2 (Validation Running) to make the wait feel
 * alive and safe — not mechanical, not alarming.
 *
 * Three staggered rings create a continuous breathing effect,
 * like a heartbeat. Slows down during the resolving phase.
 *
 * Props:
 *   ringCount — number of rings (default 3)
 *   interval  — delay between rings in seconds (default 0.7)
 *   slow      — boolean — slows ring duration from 2s to 3s (resolving phase)
 *   children  — center element (circle + icon)
 */

import { motion } from 'framer-motion'

export default function PulseRingAnimation({
  ringCount = 3,
  interval  = 0.7,
  slow      = false,
  children,
}) {
  return (
    <div className="relative w-[72px] h-[72px] flex items-center justify-center">

      {/* Pulse rings — behind center content */}
      {Array.from({ length: ringCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[72px] h-[72px] rounded-full border-2 border-purple"
          animate={{
            scale:   [1, 1.8],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: slow ? 3 : 2,
            delay:    i * interval,
            repeat:   Infinity,
            ease:     'easeOut',
          }}
          aria-hidden="true"
        />
      ))}

      {/* Center element */}
      {children}

    </div>
  )
}
