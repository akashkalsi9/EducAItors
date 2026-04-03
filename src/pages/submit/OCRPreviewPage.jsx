// Screen 2.4 — Handwritten and Image Content Preview
// Route: /submit/ocr-preview
// Persona: Sunita (plain language, no jargon) + Riya (needs confidence before moving on)
//          + Arjun (wants this to be fast)
//
// Critical rule: The word "OCR" must NEVER appear on this screen.
// Sunita does not know what OCR means. Design for understanding, not for terminology.
//
// The signature design moment: the confidence border drawing itself green
// is the moment she exhales. Design for that exhale.

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardContent } from '@heroui/react'
import PageShell from '../../components/PageShell'
import InnerPageBar from '../../components/ui/InnerPageBar'
import SubmissionStepper from '../../components/ui/SubmissionStepper'
import OCRProcessingAnimation from '../../components/ui/OCRProcessingAnimation'
import ConfidenceMessage from '../../components/ui/ConfidenceMessage'
import ExtractedTextAccordion from '../../components/ui/ExtractedTextAccordion'
import PhotoTips from '../../components/ui/PhotoTips'
import { mockAssignment } from '../../data/mock-assignment'

// ─── Demo confidence levels ────────────────────────────────────────────────────
const DEMO_LEVELS = ['high', 'medium', 'low']

// ─── Mock extracted text per confidence level ──────────────────────────────────
const MOCK_EXTRACTED = {
  high: [
    { word: 'The',        conf: 'high'   },
    { word: 'revenue',    conf: 'high'   },
    { word: 'projection', conf: 'high'   },
    { word: 'for',        conf: 'high'   },
    { word: 'Q3',         conf: 'high'   },
    { word: 'assumes',    conf: 'high'   },
    { word: '12%',        conf: 'high'   },
    { word: 'growth',     conf: 'high'   },
    { word: 'driven',     conf: 'high'   },
    { word: 'by',         conf: 'high'   },
    { word: 'market',     conf: 'high'   },
    { word: 'expansion.', conf: 'high'   },
  ],
  medium: [
    { word: 'The',        conf: 'high'   },
    { word: 'revenue',    conf: 'high'   },
    { word: 'projection', conf: 'medium' },
    { word: 'for',        conf: 'high'   },
    { word: 'Q3',         conf: 'high'   },
    { word: 'assymes',    conf: 'medium' },
    { word: '12%',        conf: 'high'   },
    { word: 'grovvth',    conf: 'low'    },
    { word: 'drivn',      conf: 'medium' },
    { word: 'by',         conf: 'high'   },
    { word: 'markct',     conf: 'medium' },
    { word: 'expansion.', conf: 'high'   },
  ],
  low: [
    { word: 'Th3',        conf: 'low'    },
    { word: 'rev3nue',    conf: 'low'    },
    { word: 'proj3ction', conf: 'low'    },
    { word: 'f0r',        conf: 'high'   },
    { word: 'Q3',         conf: 'high'   },
    { word: '???',        conf: 'low'    },
    { word: '12%',        conf: 'medium' },
    { word: 'gr0wth',     conf: 'low'    },
    { word: 'dr1vn',      conf: 'low'    },
    { word: 'by',         conf: 'high'   },
    { word: 'm@rk3t',     conf: 'low'    },
    { word: '???',        conf: 'low'    },
  ],
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function OCRPreviewPage() {
  const navigate  = useNavigate()
  const { state: routeState } = useLocation()
  const primaryFile    = routeState?.primaryFile    ?? null
  const artifactData   = routeState?.artifactData   ?? null
  const linkStatuses   = routeState?.linkStatuses   ?? {}
  const ocrTargetFile  = routeState?.ocrTargetFile  ?? null

  const { title, courseName, deadline } = mockAssignment

  // ── Phase & confidence state ───────────────────────────────────────────────
  const [phase,      setPhase]      = useState('processing') // 'processing' | 'result'
  const [confidence, setConfidence] = useState('high')       // 'high' | 'medium' | 'low'

  // Auto-transition processing → result after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setPhase('result'), 2000)
    return () => clearTimeout(t)
  }, [])

  // ── Navigation ─────────────────────────────────────────────────────────────
  function handleContinue() {
    navigate('/submit/links', { state: { primaryFile, artifactData, linkStatuses: {}, ocrTargetFile } })
  }

  function handleReupload() {
    navigate('/submit/artifacts', { state: { primaryFile, artifactData, ocrTargetFile } })
  }

  // ── Demo: set confidence and jump to result ────────────────────────────────
  function handleDemoLevel(level) {
    setConfidence(level)
    setPhase('result')
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <InnerPageBar title="Review Handwriting" deadline={deadline} />
      <PageShell noPadding>

      {/* ════════════════════════════════════════════════════════════════════
          SCROLLABLE AREA
          ════════════════════════════════════════════════════════════════════ */}
      <SubmissionStepper currentStep={3} />
      <div className="flex-1 bg-surface-secondary overflow-y-auto pb-20">
        <div className="px-8 lg:px-10 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

        {/* ── Processing / Result panels — animated swap ── */}
        <AnimatePresence mode="wait">

          {/* ── PROCESSING PHASE ─────────────────────────────────────────── */}
          {phase === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-2xl mx-auto rounded-xl border border-border p-0">
              <CardContent className="px-6 lg:px-8 pt-10 pb-10 flex flex-col items-center">

                {/* Scanning animation */}
                <OCRProcessingAnimation
                  fileName={primaryFile?.name ?? 'handwriting.jpg'}
                  phase="processing"
                />

                {/* Copy */}
                <h1 className="text-[20px] font-bold text-foreground text-center mt-5 leading-tight">
                  Reviewing your handwriting…
                </h1>
                <p className="text-[14px] text-muted text-center mt-2">
                  This only takes a moment.
                </p>

                {/* Pulsing dots */}
                <div className="flex justify-center gap-2 mt-5" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-default"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                    />
                  ))}
                </div>

              </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── RESULT PHASE ─────────────────────────────────────────────── */}
          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >

              {/* Page header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Card className="rounded-xl border border-border p-0">
                <CardContent className="p-6 lg:p-8">
                <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-tight">
                  Here's what we found
                </h1>
                <p className="text-[14px] text-muted mt-1.5 leading-[1.5]">
                  Check the text below. If it looks wrong, re-upload a clearer photo.
                </p>
                </CardContent>
                </Card>
              </motion.div>

              {/* Confidence message — the signature exhale moment */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
                className="mt-4"
              >
                <ConfidenceMessage confidence={confidence} />
              </motion.div>

              {/* Extracted text accordion */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
                className="mt-3"
              >
                <ExtractedTextAccordion
                  confidence={confidence}
                  extractedText={MOCK_EXTRACTED[confidence]}
                />
              </motion.div>

              {/* Photo tips — only for medium / low */}
              <AnimatePresence>
                {confidence !== 'high' && (
                  <motion.div
                    key="photoTips"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut', delay: 0.25 }}
                    className="mt-3"
                  >
                    <PhotoTips />
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

        </AnimatePresence>

        {/* ── DEMO CONTROLS ──────────────────────────────────────────────── */}
        <div className="mt-6 px-6 lg:px-8 pb-2">
          <p className="text-[10px] font-bold text-muted/60 uppercase tracking-[0.1em] mb-2">
            Demo controls
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DEMO_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleDemoLevel(level)}
                className={`text-[10px] px-3 py-1.5 rounded border capitalize min-h-[36px] ${
                  phase === 'result' && confidence === level
                    ? 'border-border text-muted font-medium'
                    : 'border-border text-muted/60'
                }`}
              >
                {level}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPhase('processing')}
              className={`text-[10px] px-3 py-1.5 rounded border min-h-[36px] ${
                phase === 'processing'
                  ? 'border-border text-muted font-medium'
                  : 'border-border text-muted/60'
              }`}
            >
              Reset
            </button>
          </div>
        </div>

      </div>
      </div>
      </div>
      {/* end scrollable area */}

      {/* ════════════════════════════════════════════════════════════════════
          STICKY BOTTOM CTA
          ════════════════════════════════════════════════════════════════════ */}
      <div className="sticky bottom-0 w-full z-40 shrink-0">

        {/* Gradient fade */}
        <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white" />

        <div className="bg-white border-t border-border px-8 lg:px-10 pb-5 pt-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">

          {/* ── Processing: disabled pulse ── */}
          {phase === 'processing' && (
            <motion.div
              animate={{ opacity: [1, 0.55, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="ml-auto"
            >
              <Button
                variant="primary"
                size="lg"
                isDisabled
                className="rounded-xl px-8 text-[15px] font-semibold"
                aria-label="Waiting for handwriting review to complete"
              >
                Reviewing…
              </Button>
            </motion.div>
          )}

          {/* ── Result: CTAs per confidence ── */}
          {phase === 'result' && (
            <AnimatePresence mode="wait">
              <motion.div
                key={confidence}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-between w-full"
              >

                {/* HIGH — single continue CTA, no helper text */}
                {confidence === 'high' && (
                  <div className="ml-auto">
                    <Button
                      variant="primary"
                      size="lg"
                      className="rounded-xl px-8 text-[15px] font-bold"
                      onPress={handleContinue}
                      aria-label="Handwriting looks good, continue to review"
                    >
                      Looks good — continue
                    </Button>
                  </div>
                )}

                {/* MEDIUM — helper text left, buttons right */}
                {confidence === 'medium' && (
                  <>
                    <AnimatePresence>
                      <motion.p
                        key="reassurance"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-[13px] text-muted"
                      >
                        Your other files are saved — only this one will be replaced.
                      </motion.p>
                    </AnimatePresence>
                    <div className="ml-auto flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="rounded-xl px-8 text-[15px] font-semibold border-2 border-warning text-warning bg-warning-soft"
                        onPress={handleReupload}
                        aria-label="Re-upload a clearer photo of your handwriting"
                      >
                        Re-upload a clearer photo
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        className="rounded-xl px-8 text-[15px] font-bold"
                        onPress={handleContinue}
                        aria-label="Continue to review despite uncertain handwriting"
                      >
                        Continue anyway
                      </Button>
                    </div>
                  </>
                )}

                {/* LOW — helper text left, buttons right */}
                {confidence === 'low' && (
                  <>
                    <AnimatePresence>
                      <motion.p
                        key="reassurance"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-[13px] text-muted"
                      >
                        Your other files are saved — only this one will be replaced.
                      </motion.p>
                    </AnimatePresence>
                    <div className="ml-auto flex items-center gap-3">
                      <Button
                        variant="primary"
                        size="lg"
                        isDisabled
                        className="rounded-xl px-8 text-[15px] font-semibold"
                        aria-label="Cannot continue — handwriting is unreadable"
                      >
                        Continue anyway
                      </Button>
                      <Button
                        variant="danger"
                        size="lg"
                        className="rounded-xl px-8 text-[15px] font-bold"
                        onPress={handleReupload}
                        aria-label="Re-upload a clearer photo of your handwriting"
                      >
                        Re-upload a clearer photo
                      </Button>
                    </div>
                  </>
                )}

              </motion.div>
            </AnimatePresence>
          )}

          </div>
        </div>
      </div>

    </PageShell>
    </>
  )
}
