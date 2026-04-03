/**
 * AnimatedDots
 *
 * Three sequentially pulsing dots that signal "processing" without
 * implying progress or completion. Used on Screen 3.2 (Validation Running).
 *
 * Feels alive without being alarming.
 * Gives Riya something to watch. Tells Arjun the system is working.
 *
 * Props:
 *   count    — number of dots (default 3)
 *   interval — stagger delay between dots in seconds (default 0.4)
 */

import { motion } from 'framer-motion'

export default function AnimatedDots({
  count    = 3,
  interval = 0.4,
}) {
  return (
    <div
      className="flex items-center gap-2"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-purple"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            delay:    i * interval,
            repeat:   Infinity,
            ease:     'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
