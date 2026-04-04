/**
 * ExtractedTextAccordion
 *
 * Jordan/Sunita's transparency panel — shows the text we read from the
 * uploaded image with word-level confidence highlighting.
 *
 * Amber highlight = uncertain word. Red highlight = very uncertain.
 * Default open for medium/low confidence so the problem is immediately visible.
 *
 * Props:
 *   confidence    — 'high' | 'medium' | 'low'
 *   extractedText — array of { word: string, conf: 'high' | 'medium' | 'low' }
 *   forceOpen     — boolean, when true keeps accordion always open and hides toggle
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, ChevronDown, ChevronUp } from 'lucide-react'

// ─── Word highlight classes ────────────────────────────────────────────────────
const WORD_BG = {
  high:   '',
  medium: 'bg-warning-soft rounded px-[3px]',
  low:    'bg-danger-soft rounded px-[3px]',
}

// ─── ExtractedTextAccordion ───────────────────────────────────────────────────
export default function ExtractedTextAccordion({
  confidence    = 'high',
  extractedText = [],
  forceOpen     = false,
}) {
  // Medium/low start expanded so the problem is immediately visible
  const [isOpen, setIsOpen] = useState(forceOpen || confidence !== 'high')

  // Sync open state when confidence changes (e.g. via demo controls)
  useEffect(() => {
    setIsOpen(forceOpen || confidence !== 'high')
  }, [confidence, forceOpen])

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">

      {/* ── Header — tap to toggle (hidden when forceOpen) ── */}
      {!forceOpen && (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full min-h-[44px] flex items-center justify-between px-4 py-3 text-left"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse extracted text' : 'Expand extracted text'}
        >
          <div className="flex items-center gap-2">
            <Eye
              className="w-4 h-4 text-purple shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="text-[13px] font-bold text-foreground">
              What we extracted
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 0 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen
              ? <ChevronUp  className="w-4 h-4 text-muted" strokeWidth={2} aria-hidden="true" />
              : <ChevronDown className="w-4 h-4 text-muted" strokeWidth={2} aria-hidden="true" />
            }
          </motion.div>
        </button>
      )}

      {/* ── Body — extracted text with word highlights ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className={`${forceOpen ? '' : 'border-t border-border'} px-4 pt-3 pb-4`}>
              {extractedText.length === 0 ? (
                <p className="text-[13px] text-muted italic">
                  No text could be extracted.
                </p>
              ) : (
                <p className="text-[13px] text-foreground leading-[1.8] flex flex-wrap gap-x-1 gap-y-0">
                  {extractedText.map((item, i) => (
                    <span
                      key={i}
                      className={`${WORD_BG[item.conf] ?? ''}`}
                    >
                      {item.word}
                    </span>
                  ))}
                </p>
              )}

              {/* Legend for medium/low */}
              {confidence !== 'high' && (
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-warning-soft shrink-0" aria-hidden="true" />
                    <span className="text-[11px] text-muted">Uncertain word</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-danger-soft shrink-0" aria-hidden="true" />
                    <span className="text-[11px] text-muted">Very uncertain</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
