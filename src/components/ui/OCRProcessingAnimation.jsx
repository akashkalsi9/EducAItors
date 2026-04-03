/**
 * OCRProcessingAnimation
 *
 * Scanning rectangle with an animated blue scan line — used during the
 * 'processing' phase of Screen 2.4 (Handwritten Content Preview).
 *
 * Never mention "OCR" — this is purely visual. Sunita sees a document
 * being carefully read, not a technical process.
 *
 * Props:
 *   fileName — string  (file name shown above the frame)
 *   phase    — 'processing' | 'result'
 */

import { motion, AnimatePresence } from 'framer-motion'

// Pre-computed width classes — avoids inline styles
const LINE_WIDTHS = ['w-[60%]', 'w-[90%]', 'w-[70%]']

export default function OCRProcessingAnimation({ fileName = '', phase }) {
  return (
    <div className="flex flex-col items-center gap-3 py-2">

      {/* File name label */}
      {fileName && (
        <p className="text-[13px] font-medium text-muted truncate max-w-[240px]">
          {fileName}
        </p>
      )}

      {/* Document frame */}
      <div className="relative w-[200px] h-[160px] rounded-xl border-2 border-border bg-surface-secondary overflow-hidden">

        {/* Simulated document lines */}
        <div className="absolute inset-0 flex flex-col justify-center gap-4 px-6">
          {LINE_WIDTHS.map((widthClass, i) => (
            <div
              key={i}
              className={`h-[6px] rounded-full bg-default ${widthClass}`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Scan line — only visible during processing */}
        <AnimatePresence>
          {phase === 'processing' && (
            <motion.div
              key="scanLine"
              className="absolute top-0 left-0 right-0 h-[2px] bg-[linear-gradient(to_right,transparent,#6846A8,transparent)]"
              animate={{ y: [0, 130] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
