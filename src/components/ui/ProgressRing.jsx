/**
 * ProgressRing
 *
 * SVG circular progress indicator with animated fill and center label.
 * Color-coded: red (0) → amber (partial) → green (complete).
 *
 * Props:
 *   completed  — number of completed items
 *   total      — total required items
 *   size       — diameter in px (default 44)
 *   strokeWidth — ring thickness (default 3.5)
 */

import { motion } from 'framer-motion'

const COLOR_MAP = {
  zero:    { stroke: 'stroke-danger',  text: 'text-danger'  },
  partial: { stroke: 'stroke-warning', text: 'text-warning' },
  full:    { stroke: 'stroke-success', text: 'text-success' },
}

export default function ProgressRing({
  completed = 0,
  total     = 1,
  size      = 44,
  strokeWidth = 3.5,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 ? completed / total : 0
  const offset = circumference * (1 - progress)

  const tier = completed === 0 ? 'zero' : completed >= total ? 'full' : 'partial'
  const { stroke, text } = COLOR_MAP[tier]

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      aria-label={`${completed} of ${total} required items complete`}
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-border"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Center label */}
      <span className={`absolute text-[11px] font-bold ${text}`}>
        {completed}/{total}
      </span>
    </div>
  )
}
