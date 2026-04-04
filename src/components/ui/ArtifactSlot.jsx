/**
 * ArtifactSlot
 *
 * A single artifact upload card with 4 states: empty, uploading, confirmed, error.
 * Required slots are visually heavy (solid 2px border, bold text, inner drop zone).
 * Optional slots are light (dashed border, medium text, muted CTA).
 *
 * Props:
 *   artifact      — { id, name, type, required }
 *   slotState     — 'empty' | 'uploading' | 'confirmed' | 'error'
 *   progress      — 0–100 (uploading state only)
 *   fileName      — string | null
 *   fileSize      — string | null (pre-formatted, e.g. "1.4 MB")
 *   errorMessage  — string | null
 *   onFileSelect  — (file: File) => void
 *   onReplace     — () => void
 */

import { useRef, useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { UploadCloud, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { Button, Chip } from '@heroui/react'
import FileTypeIcon from './FileTypeIcon'
import ProgressBar from './ProgressBar'
import OcrResultsModal from './OcrResultsModal'

// ─── Format + size info per type (shown in empty drop zone) ──────────────────
const TYPE_INFO = {
  pdf:         { formats: ['PDF'],        maxSize: '50MB'  },
  docx:        { formats: ['DOCX'],       maxSize: '20MB'  },
  xlsx:        { formats: ['XLSX'],       maxSize: '20MB'  },
  pptx:        { formats: ['PPTX'],       maxSize: '100MB' },
  image:       { formats: ['JPG', 'PNG'], maxSize: '10MB'  },
  handwritten: { formats: ['JPG', 'PNG'], maxSize: '10MB'  },
}

// ─── File type validation ──────────────────────────────────────────────────────
const VALID_TYPES = {
  pdf:   { exts: ['.pdf'],             mimes: ['application/pdf'] },
  docx:  { exts: ['.docx'],            mimes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] },
  xlsx:  { exts: ['.xlsx'],            mimes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] },
  pptx:  { exts: ['.pptx'],            mimes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'] },
  image:       { exts: ['.jpg','.jpeg','.png'], mimes: ['image/jpeg','image/png'] },
  handwritten: { exts: ['.jpg','.jpeg','.png'], mimes: ['image/jpeg','image/png'] },
}

function isFileValid(file, type) {
  const rules = VALID_TYPES[type]
  if (!rules) return true // unknown type — allow
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  return rules.mimes.includes(file.type) || rules.exts.includes(ext)
}

// ─── ArtifactSlot ─────────────────────────────────────────────────────────────
export default function ArtifactSlot({
  artifact,
  slotState    = 'empty',
  progress     = 0,
  fileName     = null,
  fileSize     = null,
  errorMessage = null,
  onFileSelect,
  onReplace,
  onOcrComplete,
}) {
  const { name, type, required } = artifact

  const inputRef     = useRef(null)
  const dragCounter  = useRef(0)
  const shakeControls = useAnimation()

  const [isDragOver, setIsDragOver] = useState(false)

  // ── OCR state (for handwritten/image artifacts with requiresOCR) ──────────
  const [ocrState, setOcrState] = useState('idle')
  const [ocrConfidence, setOcrConfidence] = useState(null)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrElapsed, setOcrElapsed] = useState(0)
  const [showOcrModal, setShowOcrModal] = useState(false)

  useEffect(() => {
    if (slotState === 'confirmed' && artifact.requiresOCR) {
      setOcrState('processing')
      setOcrProgress(0)
      setOcrElapsed(0)

      // Elapsed time counter (every second)
      const elapsedInterval = setInterval(() => {
        setOcrElapsed(prev => prev + 1)
      }, 1000)

      // Progress simulation (~8 seconds)
      let progress = 0
      const progressInterval = setInterval(() => {
        progress += Math.random() * 4 + 1
        if (progress >= 100) {
          progress = 100
          clearInterval(progressInterval)
          clearInterval(elapsedInterval)
          setOcrState('complete')
          setOcrConfidence('high')
          onOcrComplete?.(artifact.id, 'high')
        }
        setOcrProgress(Math.round(progress))
      }, 200)

      return () => {
        clearInterval(progressInterval)
        clearInterval(elapsedInterval)
      }
    }
    if (slotState !== 'confirmed') {
      setOcrState('idle')
      setOcrConfidence(null)
      setOcrProgress(0)
      setShowOcrModal(false)
      onOcrComplete?.(artifact.id, null)
    }
  }, [slotState, artifact.requiresOCR])

  // ── File picked via input ──────────────────────────────────────────────────
  function handleInputChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    onFileSelect?.(file)
  }

  // ── Drag handlers ─────────────────────────────────────────────────────────
  function handleDragEnter(e) {
    e.preventDefault()
    dragCounter.current += 1
    if (dragCounter.current === 1) setIsDragOver(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current === 0) setIsDragOver(false)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e) {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    onFileSelect?.(file)
  }

  // ── Trigger hidden input ───────────────────────────────────────────────────
  function openPicker() {
    inputRef.current?.click()
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Visual state helpers
  // ─────────────────────────────────────────────────────────────────────────

  // Card border + bg
  const cardClass = (() => {
    if (slotState === 'uploading')  return 'rounded-xl bg-white border border-accent'
    if (slotState === 'confirmed')  return 'rounded-xl bg-white border border-border'
    if (slotState === 'error')      return 'rounded-xl bg-white border border-danger'
    // empty
    if (required) {
      return isDragOver
        ? 'rounded-xl bg-accent-soft border border-accent'
        : 'rounded-xl bg-white border border-border'
    }
    return isDragOver
      ? 'rounded-xl bg-accent-soft border border-accent'
      : 'rounded-xl bg-white border border-dashed border-border'
  })()

  // ─────────────────────────────────────────────────────────────────────────
  // Sub-renderers
  // ─────────────────────────────────────────────────────────────────────────

  function renderHeader() {
    const nameClass = required
      ? 'text-[15px] font-bold text-foreground leading-tight'
      : 'text-[14px] font-medium text-foreground leading-tight opacity-[0.85]'

    const tagEl = required
      ? (
        <Chip
          variant="soft"
          color="warning"
          size="sm"
          className="shrink-0 text-xs font-semibold"
        >
          Required
        </Chip>
      ) : (
        <Chip
          variant="soft"
          color="default"
          size="sm"
          className="shrink-0 text-xs font-medium"
        >
          Optional
        </Chip>
      )

    return (
      <div className="flex items-center gap-3">
        <FileTypeIcon type={type} size={32} />
        <div className="flex-1 min-w-0">
          <p className={nameClass}>{name}</p>
          {type === 'handwritten' && (
            <p className="text-[11px] text-muted mt-0.5">Photo or scan only</p>
          )}
        </div>
        {tagEl}
      </div>
    )
  }

  // ── EMPTY state ───────────────────────────────────────────────────────────
  function renderEmpty() {
    if (required) {
      return (
        <div
          className={`${cardClass} p-4 cursor-pointer`}
          onClick={openPicker}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${name}`}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPicker() }}
        >
          {renderHeader()}

          {/* Inner drop zone — matches PrimaryUpload style */}
          {(() => {
            const info = TYPE_INFO[type] ?? { formats: [], maxSize: null }
            return (
              <div className="mt-3 rounded-xl border border-dashed border-border bg-surface-secondary py-6 flex flex-col items-center gap-2 pointer-events-none">
                <UploadCloud className="w-8 h-8 text-muted" strokeWidth={1.5} aria-hidden="true" />
                <div className="flex flex-col items-center gap-0.5">
                  <p className="text-[13px] font-semibold text-foreground text-center">Tap to upload or drag your file here</p>
                  {info.formats.length > 0 && (
                    <p className="text-[12px] text-muted text-center">
                      {info.formats.join(', ')} accepted
                    </p>
                  )}
                </div>
                {info.maxSize && (
                  <span className="rounded-full px-3 py-1 bg-white border border-border text-[11px] font-medium text-muted mt-0.5">
                    Max file size: {info.maxSize}
                  </span>
                )}
              </div>
            )
          })()}

          {/* OCR hint for handwritten artifacts */}
          {artifact.requiresOCR && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[11px] text-purple">Your handwriting will be checked for readability after upload</span>
            </div>
          )}
        </div>
      )
    }

    // Optional
    return (
      <div
        className={`${cardClass} p-4`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {renderHeader()}

        <div className="mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 text-muted"
            onPress={openPicker}
            aria-label={`Add ${name}`}
          >
            <UploadCloud className="w-4 h-4" aria-hidden="true" />
            Add file
          </Button>
        </div>
      </div>
    )
  }

  // ── UPLOADING state ───────────────────────────────────────────────────────
  function renderUploading() {
    return (
      <div className={`${cardClass} p-4`}>
        {/* Same header as empty state */}
        {renderHeader()}

        {/* Uploading file details */}
        <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-surface-secondary">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate leading-tight">
              {fileName}
            </p>
          </div>
          <span className="rounded-full bg-accent-soft text-accent text-[11px] font-bold px-2 py-0.5 shrink-0 leading-none">
            Uploading…
          </span>
        </div>

        <div className="mt-2">
          <ProgressBar
            progress={progress}
            colorClass="bg-accent"
            heightClass="h-1"
            transition={{ duration: 2.5, ease: 'linear' }}
          />
        </div>
      </div>
    )
  }

  // ── CONFIRMED state ───────────────────────────────────────────────────────
  function renderConfirmed() {
    return (
      <div className={`${cardClass} p-4`}>
        {/* Same header as empty state — artifact name stays consistent */}
        {renderHeader()}

        {/* Uploaded file details */}
        <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-surface-secondary">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate leading-tight">
              {fileName}
            </p>
            {fileSize && (
              <p className="text-[11px] text-muted mt-0.5">{fileSize}</p>
            )}
          </div>
          <CheckCircle2
            className="w-4 h-4 text-success shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        {/* Replace button */}
        <div className="mt-1">
          <Button
            variant="ghost"
            size="sm"
            onPress={onReplace}
            className="text-muted underline underline-offset-2 min-h-11"
            aria-label={`Replace ${name}`}
          >
            Replace file
          </Button>
        </div>

        {/* Inline OCR feedback for requiresOCR artifacts */}
        {artifact.requiresOCR && ocrState === 'processing' && (
          <div className="mt-3 p-3 rounded-lg bg-purple-soft">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-semibold text-purple">Reading handwriting...</span>
              <span className="text-[11px] text-muted">{ocrProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-purple rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${ocrProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-purple/70">This may take up to 5 minutes</span>
              <span className="text-[11px] text-purple/70">{ocrElapsed}s elapsed</span>
            </div>
          </div>
        )}

        {/* OCR complete — inline status + "View extracted text" modal trigger */}
        {artifact.requiresOCR && ocrState === 'complete' && ocrConfidence === 'high' && (
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                <span className="text-[12px] font-semibold text-success">Handwriting is clear — good to go</span>
              </div>
              <span className="text-[11px] font-medium text-success">Confidence: 94%</span>
            </div>
            <button
              type="button"
              onClick={() => setShowOcrModal(true)}
              className="mt-2 text-[12px] font-medium text-purple hover:underline flex items-center gap-1 min-h-[44px]"
            >
              View extracted text
            </button>
          </div>
        )}

        {artifact.requiresOCR && ocrState === 'complete' && ocrConfidence === 'medium' && (
          <div className="mt-3">
            <div className="rounded-lg border border-warning p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning" aria-hidden="true" />
                  <span className="text-[12px] font-semibold text-warning">Some words were unclear</span>
                </div>
                <span className="text-[11px] font-medium text-warning">Confidence: 62%</span>
              </div>
              <p className="text-[11px] text-muted mt-1.5 leading-snug">
                We could read most of your handwriting, but some words were unclear.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowOcrModal(true)}
              className="mt-2 text-[12px] font-medium text-purple hover:underline flex items-center gap-1 min-h-[44px]"
            >
              View extracted text
            </button>
            <button type="button" onClick={onReplace} className="mt-1 text-[12px] font-semibold text-warning hover:underline min-h-11">
              Re-upload a clearer photo
            </button>
          </div>
        )}

        {artifact.requiresOCR && ocrState === 'complete' && ocrConfidence === 'low' && (
          <div className="mt-3">
            {artifact.required && (
              <div className="rounded-lg border border-warning bg-warning-soft p-3 mb-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-[12px] font-semibold text-foreground">This file is required for your submission</p>
                    <p className="text-[11px] text-muted mt-0.5">Please re-upload a clearer photo to continue.</p>
                  </div>
                </div>
              </div>
            )}
            <div className="rounded-lg border border-danger p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-danger" aria-hidden="true" />
                  <span className="text-[12px] font-semibold text-danger">Text is difficult to read</span>
                </div>
                <span className="text-[11px] font-medium text-danger">Confidence: 28%</span>
              </div>
              <p className="text-[11px] text-muted mt-1.5 leading-snug">
                We couldn't clearly read the text in this document. Please upload a clearer image so we can process your submission.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowOcrModal(true)}
              className="mt-2 text-[12px] font-medium text-purple hover:underline flex items-center gap-1 min-h-[44px]"
            >
              View what we found
            </button>
            <button type="button" onClick={onReplace} className="mt-1 text-[12px] font-semibold text-danger hover:underline min-h-11">
              Re-upload a clearer photo
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── ERROR state ───────────────────────────────────────────────────────────
  function renderError() {
    return (
      <motion.div
        animate={shakeControls}
        className={`${cardClass} p-4 cursor-pointer`}
        onClick={openPicker}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={`Retry upload for ${name}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openPicker() }}
      >
        {renderHeader()}

        {/* Error message row — split into problem + fix suggestion */}
        <div className="mt-2 flex items-start gap-2">
          <XCircle
            className="w-4 h-4 text-danger shrink-0 mt-[1px]"
            strokeWidth={2}
            aria-hidden="true"
          />
          <div className="text-[12px] leading-relaxed">
            {(() => {
              const dotIdx = errorMessage?.indexOf('. ')
              if (dotIdx > 0) {
                return (
                  <>
                    <p className="font-semibold text-danger">{errorMessage.slice(0, dotIdx + 1)}</p>
                    <p className="text-muted mt-0.5">{errorMessage.slice(dotIdx + 2)}</p>
                  </>
                )
              }
              return <p className="text-danger">{errorMessage}</p>
            })()}
          </div>
        </div>

        {/* Retry drop zone */}
        <div className="mt-2 rounded-lg border border-dashed border-border bg-surface-secondary py-4 flex flex-col items-center gap-1.5 pointer-events-none">
          <UploadCloud className="w-5 h-5 text-muted" aria-hidden="true" />
          <p className="text-[12px] font-medium text-muted">Try again</p>
        </div>

        {/* Demo bypass — handwritten slot only */}
        {type === 'handwritten' && (
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              const fakeFile = new File(['demo'], 'handwritten-demo.png', { type: 'image/png' })
              onFileSelect?.(fakeFile)
            }}
            className="mt-2 w-full text-xs text-muted min-h-11"
            aria-label="Use demo file to bypass validation"
          >
            Demo: use sample image →
          </Button>
        )}
      </motion.div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Trigger shake on error mount
  // ─────────────────────────────────────────────────────────────────────────
  // (driven by parent setting slotState → 'error')
  // We use a key trick: parent re-mounts this with a new key on each error
  // — OR we just expose the animation. Here we fire it when errorMessage changes.
  // We rely on ArtifactSlot being re-used (not remounted) so we fire programmatically.

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleInputChange}
      />

      {slotState === 'empty'     && renderEmpty()}
      {slotState === 'uploading' && renderUploading()}
      {slotState === 'confirmed' && renderConfirmed()}
      {slotState === 'error'     && renderError()}

      {/* OCR Results Modal */}
      {artifact.requiresOCR && (
        <OcrResultsModal
          isOpen={showOcrModal}
          onClose={() => setShowOcrModal(false)}
          confidence={ocrConfidence}
          onConfidenceChange={(level) => {
            setOcrConfidence(level)
            onOcrComplete?.(artifact.id, level)
          }}
          fileName={fileName}
        />
      )}
    </>
  )
}
