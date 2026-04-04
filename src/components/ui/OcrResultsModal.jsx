/**
 * OcrResultsModal
 *
 * Two-panel modal for reviewing OCR extraction results.
 * Left: uploaded image preview (placeholder). Right: extracted text with
 * word-level confidence highlights.
 *
 * Props:
 *   isOpen              — boolean
 *   onClose             — () => void
 *   confidence          — 'high' | 'medium' | 'low'
 *   onConfidenceChange  — (level) => void  (demo control callback)
 *   fileName            — string
 */

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { Card, Button } from '@heroui/react'
import ExtractedTextAccordion from './ExtractedTextAccordion'
import PhotoTips from './PhotoTips'
import OCRProcessingAnimation from './OCRProcessingAnimation'
import { MOCK_EXTRACTED } from '../../data/mock-ocr-extracted'

// ─── Confidence score + label config ──────────────────────────────────────────
const CONFIDENCE_META = {
  high:   { score: '94%', headline: 'Handwriting is clear — good to go',          color: 'text-success', pillBg: 'bg-success-soft', Icon: CheckCircle2 },
  medium: { score: '62%', headline: 'Some parts may be hard to read',             color: 'text-warning', pillBg: 'bg-warning-soft', Icon: AlertTriangle },
  low:    { score: '28%', headline: 'Parts of your submission may be unreadable',  color: 'text-danger',  pillBg: 'bg-danger-soft',  Icon: XCircle },
}

// ─── OcrResultsModal ─────────────────────────────────────────────────────────
export default function OcrResultsModal({
  isOpen,
  onClose,
  confidence = 'high',
  onConfidenceChange,
  fileName = '',
}) {
  const closeRef = useRef(null)

  // ── Escape key closes modal ─────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // ── Body scroll lock ────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Focus close button on mount ─────────────────────────────────────────
  useEffect(() => {
    if (isOpen && closeRef.current) {
      closeRef.current.focus()
    }
  }, [isOpen])

  const meta = CONFIDENCE_META[confidence] ?? CONFIDENCE_META.high
  const { Icon: ConfIcon } = meta

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            className="relative z-10 w-full max-w-4xl mx-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Card className="rounded-2xl border border-border p-0 gap-0 max-h-[85vh] flex flex-col overflow-hidden">

              {/* ── HEADER ─────────────────────────────────────────────── */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <h2 className="text-[15px] font-bold text-foreground shrink-0">
                    Extracted Text Preview
                  </h2>
                  {fileName && (
                    <span className="text-[11px] font-medium text-muted bg-surface-secondary rounded-full px-2.5 py-0.5 truncate max-w-[200px]">
                      {fileName}
                    </span>
                  )}
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-muted hover:bg-surface-secondary hover:text-foreground transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* ── BODY ───────────────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto">

                {/* Confidence status — single inline row */}
                <div className="px-6 pt-5 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ConfIcon className={`w-4 h-4 ${meta.color} shrink-0`} strokeWidth={2} aria-hidden="true" />
                    <span className={`text-[13px] font-semibold ${meta.color} truncate`}>
                      {meta.headline}
                    </span>
                  </div>
                  <span className={`text-[12px] font-bold ${meta.color} ${meta.pillBg} rounded-full px-2.5 py-0.5 ml-auto shrink-0`}>
                    Readability: {meta.score}
                  </span>
                </div>

                {/* Photo tips — only for medium/low, placed above columns */}
                {confidence !== 'high' && (
                  <div className="px-6 pt-3">
                    <PhotoTips />
                  </div>
                )}

                {/* Two-column layout */}
                <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-2 gap-5">

                  {/* LEFT — Image preview placeholder */}
                  <div className="rounded-xl border border-border bg-surface-secondary p-4 flex flex-col items-center">
                    <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">
                      Uploaded Image
                    </p>
                    <div className="w-full aspect-[4/3] flex items-center justify-center">
                      <OCRProcessingAnimation fileName={fileName} phase="result" />
                    </div>
                  </div>

                  {/* RIGHT — Extracted text */}
                  <div className="rounded-xl border border-border bg-surface-secondary p-4 flex flex-col">
                    <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">
                      Extracted Text
                    </p>
                    <ExtractedTextAccordion
                      confidence={confidence}
                      extractedText={MOCK_EXTRACTED[confidence] ?? []}
                      forceOpen
                    />
                  </div>
                </div>
              </div>

              {/* ── FOOTER ─────────────────────────────────────────────── */}
              <div className="border-t border-border px-6 py-4 shrink-0 flex items-center justify-between gap-4">
                {/* Demo controls */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-muted/40 uppercase tracking-widest shrink-0">
                    Demo:
                  </span>
                  {['high', 'medium', 'low'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => onConfidenceChange?.(level)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        confidence === level
                          ? 'bg-accent text-white'
                          : 'bg-surface-secondary text-muted hover:text-foreground'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onPress={onClose}
                  className="min-h-11 shrink-0"
                >
                  Close
                </Button>
              </div>

            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
