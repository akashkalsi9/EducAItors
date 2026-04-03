/**
 * UploadZone
 *
 * Screen 2.1 — Primary File Upload zone.
 * Handles all 7 states internally. Prototypes the full upload simulation.
 *
 * States:
 *   empty       → default drop zone, cloud icon
 *   drag-over   → blue tinted, accepting drop
 *   format-error → wrong file type
 *   size-error   → file too large
 *   uploading   → animated progress bar
 *   paused      → amber bar, Arjun's 4G safety net
 *   confirmed   → green card, Riya's moment of relief
 *
 * Upload simulation sequence:
 *   0% → 60% over 1.8s → PAUSE 1.5s → 60% → 100% over 1.2s → confirmed
 *
 * Props:
 *   onFileConfirmed(fileInfo) — called when upload simulation completes
 *   onFileCleared()           — called when Replace file resets the zone
 *   onZoneChange(state)       — called on every state change (for parent UI)
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { UploadCloud, XCircle, WifiOff, Check } from 'lucide-react'
import { Button } from '@heroui/react'
import FileTypeIcon from './FileTypeIcon'
import ProgressBar from './ProgressBar'
import { formatFileSize } from '../../utils/formatters'

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCEPTED_MIME = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
])
const ACCEPTED_EXT  = /\.(pdf|docx|jpg|jpeg|png|gif|webp)$/i
const MAX_BYTES     = 50 * 1024 * 1024 // 50 MB

// ─── Helpers ──────────────────────────────────────────────────────────────────
function validateFile(file) {
  const typeOk = ACCEPTED_MIME.has(file.type) || ACCEPTED_EXT.test(file.name)
  if (!typeOk)           return 'format-error'
  if (file.size > MAX_BYTES) return 'size-error'
  return 'valid'
}

function detectFileType(file) {
  if (file.type === 'application/pdf'   || /\.pdf$/i.test(file.name))  return 'pdf'
  if (file.type.includes('wordprocessingml') || /\.docx$/i.test(file.name)) return 'docx'
  if (file.type.startsWith('image/'))                                  return 'image'
  return 'pdf'
}

// Zone border + bg per state
const ZONE_STYLE = {
  'empty':        'border-2 border-dashed border-border bg-white cursor-pointer',
  'drag-over':    'border-2 border-dashed border-accent bg-accent-soft cursor-copy',
  'format-error': 'border-2 border-dashed border-danger bg-danger-soft cursor-pointer',
  'size-error':   'border-2 border-dashed border-danger bg-danger-soft cursor-pointer',
  'uploading':    'border-2 border-solid border-border bg-white cursor-default',
  'paused':       'border-2 border-solid border-border bg-white cursor-default',
  'confirmed':    'border-2 border-solid border-success bg-success-soft cursor-default',
}

// Content slide variants
const contentVariants = {
  initial: { opacity: 0, y:  6 },
  animate: { opacity: 1, y:  0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15, ease: 'easeIn'  } },
}

// ─── UploadZone ───────────────────────────────────────────────────────────────
export default function UploadZone({ onFileConfirmed, onFileCleared, onZoneChange }) {
  const [zone,     setZone]     = useState('empty')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [fileType, setFileType] = useState('pdf')
  const [progress, setProgress] = useState(0)
  const [progressTransition, setProgressTransition] = useState({ duration: 0 })

  const inputRef      = useRef(null)
  const timerRefs     = useRef([])
  const dragCounter   = useRef(0)
  const fileDataRef   = useRef(null)

  const shakeControls = useAnimation()
  const pulseControls = useAnimation()

  // Cleanup timers on unmount
  useEffect(() => () => timerRefs.current.forEach(clearTimeout), [])

  // Notify parent on every state change
  function changeZone(next) {
    setZone(next)
    onZoneChange?.(next)
  }

  // ── Upload simulation ──────────────────────────────────────────────────────
  function simulateUpload() {
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []

    setProgress(0)
    setProgressTransition({ duration: 0 })
    changeZone('uploading')

    const t1 = setTimeout(() => {
      setProgressTransition({ duration: 1.8, ease: 'linear' })
      setProgress(60)
    }, 50)

    const t2 = setTimeout(() => {
      changeZone('paused')
    }, 50 + 1800) // phase 1 complete

    const t3 = setTimeout(() => {
      changeZone('uploading')
      setProgressTransition({ duration: 1.2, ease: 'linear' })
      setProgress(100)
    }, 50 + 1800 + 1500) // pause done

    const t4 = setTimeout(() => {
      changeZone('confirmed')
      pulseControls.start({
        scale:   [1, 1.5],
        opacity: [0.5, 0],
        transition: { duration: 0.6, ease: 'easeOut' },
      })
      onFileConfirmed?.(fileDataRef.current)
    }, 50 + 1800 + 1500 + 1200) // phase 2 complete

    timerRefs.current = [t1, t2, t3, t4]
  }

  // Demo: manually trigger paused state from current progress
  function handleForcePause() {
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []
    changeZone('paused')

    const t1 = setTimeout(() => {
      changeZone('uploading')
      setProgressTransition({ duration: 1.2, ease: 'linear' })
      setProgress(100)
    }, 1500)

    const t2 = setTimeout(() => {
      changeZone('confirmed')
      pulseControls.start({
        scale: [1, 1.5], opacity: [0.5, 0],
        transition: { duration: 0.6, ease: 'easeOut' },
      })
      onFileConfirmed?.(fileDataRef.current)
    }, 1500 + 1200)

    timerRefs.current = [t1, t2]
  }

  // ── File handling ──────────────────────────────────────────────────────────
  function handleFileSelected(file) {
    const validation = validateFile(file)
    if (validation !== 'valid') {
      changeZone(validation)
      shakeControls.start({
        x: [0, -8, 8, -6, 6, -4, 4, 0],
        transition: { duration: 0.4 },
      })
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    const type = detectFileType(file)
    const sizeStr = formatFileSize(file.size)

    fileDataRef.current = { name: file.name, formattedSize: sizeStr, type }
    setFileName(file.name)
    setFileSize(sizeStr)
    setFileType(type)
    simulateUpload()
  }

  function handleReplace() {
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []
    fileDataRef.current = null
    setProgress(0)
    setProgressTransition({ duration: 0 })
    changeZone('empty')
    onFileCleared?.()
    // Small delay so state settles before reopening picker
    setTimeout(() => inputRef.current?.click(), 50)
  }

  // ── Drag events ────────────────────────────────────────────────────────────
  function handleDragEnter(e) {
    e.preventDefault()
    dragCounter.current++
    if (zone === 'empty') changeZone('drag-over')
  }

  function handleDragLeave() {
    dragCounter.current--
    if (dragCounter.current === 0 && zone === 'drag-over') changeZone('empty')
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e) {
    e.preventDefault()
    dragCounter.current = 0
    const file = e.dataTransfer?.files?.[0]
    if (file) handleFileSelected(file)
    else if (zone === 'drag-over') changeZone('empty')
  }

  // ── Zone tap — opens file picker in tappable states ────────────────────────
  function handleZoneTap() {
    if (['empty', 'drag-over', 'format-error', 'size-error'].includes(zone)) {
      inputRef.current?.click()
    }
  }

  // ── Progress bar color ─────────────────────────────────────────────────────
  const progressColor = zone === 'paused' ? 'bg-warning' : 'bg-accent'

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <motion.div
      animate={shakeControls}
      className={`relative rounded-xl overflow-hidden transition-colors duration-200 ${ZONE_STYLE[zone]}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleZoneTap}
      role={['empty', 'format-error', 'size-error'].includes(zone) ? 'button' : undefined}
      tabIndex={['empty', 'format-error', 'size-error'].includes(zone) ? 0 : undefined}
      aria-label={['empty', 'format-error', 'size-error'].includes(zone)
        ? 'Tap to select a file to upload'
        : undefined}
    >

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.jpg,.jpeg,.png,.gif,.webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelected(file)
        }}
      />

      {/* ── State content ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* EMPTY */}
        {zone === 'empty' && (
          <motion.div
            key="empty"
            {...contentVariants}
            className="flex flex-col items-center justify-center gap-3 px-6 py-8 min-h-48"
          >
            <UploadCloud
              className="w-10 h-10 text-muted"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="flex flex-col items-center gap-1">
              <p className="text-[15px] font-semibold text-foreground text-center">
                Tap to upload or drag your file here
              </p>
              <p className="text-[13px] text-muted text-center">
                PDF, DOCX, or image files accepted
              </p>
            </div>
            <span className="rounded-full px-3 py-1 bg-surface-secondary border border-border text-[12px] font-medium text-muted mt-1">
              Max file size: 50MB
            </span>
          </motion.div>
        )}

        {/* DRAG OVER */}
        {zone === 'drag-over' && (
          <motion.div
            key="drag-over"
            {...contentVariants}
            className="flex flex-col items-center justify-center gap-3 px-6 py-8 min-h-48"
          >
            <UploadCloud
              className="w-10 h-10 text-accent"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="text-[15px] font-semibold text-accent text-center">
              Drop your file here
            </p>
          </motion.div>
        )}

        {/* FORMAT ERROR */}
        {zone === 'format-error' && (
          <motion.div
            key="format-error"
            {...contentVariants}
            className="flex flex-col items-center justify-center gap-3 px-6 py-8 min-h-48"
          >
            <XCircle
              className="w-10 h-10 text-danger"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="flex flex-col items-center gap-1">
              <p className="text-[15px] font-semibold text-danger text-center">
                That file type isn't accepted
              </p>
              <p className="text-[13px] text-muted text-center">
                Please upload a PDF, DOCX, or image file
              </p>
            </div>
            <span className="text-[12px] font-medium text-muted mt-1">
              Tap to try again
            </span>
          </motion.div>
        )}

        {/* SIZE ERROR */}
        {zone === 'size-error' && (
          <motion.div
            key="size-error"
            {...contentVariants}
            className="flex flex-col items-center justify-center gap-3 px-6 py-8 min-h-48"
          >
            <XCircle
              className="w-10 h-10 text-danger"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="flex flex-col items-center gap-1">
              <p className="text-[15px] font-semibold text-danger text-center">
                That file is too large
              </p>
              <p className="text-[13px] text-muted text-center leading-relaxed">
                Maximum file size is 50MB. Try compressing your PDF first.
              </p>
            </div>
            <span className="text-[12px] font-medium text-muted mt-1">
              Tap to try again
            </span>
          </motion.div>
        )}

        {/* UPLOADING / PAUSED */}
        {(zone === 'uploading' || zone === 'paused') && (
          <motion.div
            key="uploading"
            {...contentVariants}
            className="px-6 py-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* File info row */}
            <div className="flex items-center gap-3">
              <FileTypeIcon type={fileType} size={32} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-foreground truncate">
                  {fileName}
                </p>
                <p className="text-[12px] text-muted mt-0.5">{fileSize}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <ProgressBar
                progress={progress}
                colorClass={progressColor}
                transition={progressTransition}
              />
            </div>

            {/* Percentage */}
            <p className="text-right text-[12px] font-semibold text-accent mt-1">
              {Math.round(progress)}%
            </p>

            {/* Status text */}
            {zone === 'uploading' && (
              <p className="text-[13px] text-muted text-center mt-1">
                Uploading your file…
              </p>
            )}

            {/* Paused state — Arjun's safety net */}
            {zone === 'paused' && (
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="flex items-center gap-1.5 justify-center">
                  <WifiOff
                    className="w-3.5 h-3.5 text-warning shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <p className="text-[13px] font-medium text-warning">
                    Upload paused — waiting for connection
                  </p>
                </div>
                <p className="text-[12px] text-muted text-center leading-relaxed max-w-[240px] mx-auto">
                  Your progress is saved. It will resume automatically when you're back online.
                </p>
              </div>
            )}

            {/* Demo toggle — shown in uploading state */}
            {zone === 'uploading' && (
              <div className="flex justify-center mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={handleForcePause}
                  className="text-muted min-h-11"
                  aria-label="Demo: simulate connection drop"
                >
                  Simulate connection drop
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* CONFIRMED — Riya's moment of relief */}
        {zone === 'confirmed' && (
          <motion.div
            key="confirmed"
            {...contentVariants}
            className="px-5 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top row: file icon + name + green check */}
            <div className="flex items-center gap-3">
              <FileTypeIcon type={fileType} size={40} />

              {/* File details */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-foreground truncate">{fileName}</p>
                <p className="text-[13px] text-muted mt-0.5">{fileSize}</p>
              </div>

              {/* Green checkmark with one-time pulse ring */}
              <div className="relative flex items-center justify-center shrink-0">
                {/* Pulse ring — plays once on mount */}
                <motion.div
                  className="absolute w-8 h-8 rounded-full bg-success"
                  animate={pulseControls}
                  initial={{ scale: 1, opacity: 0 }}
                />
                {/* Static circle */}
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center relative z-10">
                  <Check
                    className="w-4 h-4 text-white"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-4 border-t border-success-soft" />

            {/* Bottom row: readability confirmation + replace button */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                <Check
                  className="w-3.5 h-3.5 text-success shrink-0"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-success">
                  File readable and accessible
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onPress={handleReplace}
                className="text-muted underline underline-offset-2 min-h-11 shrink-0"
                aria-label="Replace the uploaded file"
              >
                Replace file
              </Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  )
}
