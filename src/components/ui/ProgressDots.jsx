/**
 * ProgressDots
 *
 * Step indicator for carousel / multi-panel flows.
 * Active dot morphs from 6×6 circle to 20×6 pill via framer-motion width animation.
 * aria-hidden — purely decorative; parent must communicate panel state to a11y tree.
 *
 * Props:
 *   total    — number of steps (default 3)
 *   current  — 0-based active index (default 0)
 */

import { motion } from 'framer-motion'

export default function ProgressDots({ total = 3, current = 0 }) {
  return (
    <div className="flex items-center justify-center gap-[6px]" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-[6px] rounded-full ${
            i === current ? 'bg-accent' : 'bg-default'
          }`}
          animate={{ width: i === current ? 20 : 6 }}
          initial={false}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
