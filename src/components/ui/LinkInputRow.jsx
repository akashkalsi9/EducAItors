/**
 * LinkInputRow
 *
 * Single external link row with real-time check simulation.
 * 8 internal states: idle | checking | accessible | empty-link |
 *   acknowledged | permission-blocked | broken | format-error
 *
 * The check triggers on paste (and on blur if a URL is present).
 * Result is driven by `resolveWith` prop — set per-link in the parent
 * to control the prototype demo scenario.
 *
 * Props:
 *   link            — { id, name, platform, required, placeholder }
 *   resolveWith     — status to resolve to after 1.5s check simulation
 *   forceStatus     — demo override — directly sets display status
 *   onStatusChange  — (id, status) => void
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch,
  HardDrive,
  Pen,
  Link2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import { Button } from '@heroui/react'
import FixInstructionCard from './FixInstructionCard'

// ─── Platform icon config ──────────────────────────────────────────────────────
const PLATFORM_CONFIG = {
  'GitHub':       { Icon: GitBranch, iconBg: 'bg-purple-soft',  iconColor: 'text-purple'       },
  'Google Drive': { Icon: HardDrive, iconBg: 'bg-teal-soft',    iconColor: 'text-teal'         },
  'Figma':        { Icon: Pen,       iconBg: 'bg-pink-soft',    iconColor: 'text-pink'         },
  'Generic':      { Icon: Link2,     iconBg: 'bg-info-soft',    iconColor: 'text-info'         },
}

// ─── URL validation ────────────────────────────────────────────────────────────
function isValidUrl(str) {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// ─── Inline spinner ────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <motion.div
      className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent shrink-0"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      aria-hidden="true"
    />
  )
}

// ─── Status row content variants ──────────────────────────────────────────────
const rowVariants = {
  initial:  { opacity: 0, y: 6 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -4 },
}

// ─── LinkInputRow ─────────────────────────────────────────────────────────────
export default function LinkInputRow({
  link,
  resolveWith     = 'accessible',
  forceStatus     = null,
  onStatusChange,
}) {
  const { id, name, platform, required, placeholder } = link

  const [status,     setStatus]     = useState('idle')
  const [inputValue, setInputValue] = useState('')
  const [isEditable, setIsEditable] = useState(true)

  const checkTimerRef = useRef(null)

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (checkTimerRef.current) clearTimeout(checkTimerRef.current) }
  }, [])

  // ── Demo override ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!forceStatus) return
    if (checkTimerRef.current) clearTimeout(checkTimerRef.current)
    setStatus(forceStatus)
    setIsEditable(forceStatus === 'idle')
    setInputValue(forceStatus === 'idle' ? '' : 'https://example.com/demo-link')
    onStatusChange?.(id, forceStatus)
  }, [forceStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Status change helper ───────────────────────────────────────────────────
  function changeStatus(next) {
    setStatus(next)
    onStatusChange?.(id, next)
  }

  // ── Check runner ───────────────────────────────────────────────────────────
  function runCheck(value) {
    if (!isValidUrl(value)) {
      changeStatus('format-error')
      return
    }
    changeStatus('checking')
    setIsEditable(false)
    if (checkTimerRef.current) clearTimeout(checkTimerRef.current)
    checkTimerRef.current = setTimeout(() => {
      changeStatus(resolveWith)
    }, 1500)
  }

  // ── Event handlers ─────────────────────────────────────────────────────────
  function handlePaste(e) {
    const pasted = e.clipboardData?.getData('text/plain')?.trim() ?? ''
    if (!pasted) return
    e.preventDefault()
    setInputValue(pasted)
    runCheck(pasted)
  }

  function handleBlur() {
    if (status === 'idle' && inputValue.trim() && isEditable) {
      runCheck(inputValue.trim())
    }
    if (status === 'idle' && inputValue.trim() && !isValidUrl(inputValue.trim())) {
      changeStatus('format-error')
    }
  }

  function handleFixLink() {
    if (checkTimerRef.current) clearTimeout(checkTimerRef.current)
    setIsEditable(true)
    setInputValue('')
    changeStatus('idle')
  }

  function handleKeepAnyway() {
    changeStatus('acknowledged')
  }

  function handleChange() {
    if (checkTimerRef.current) clearTimeout(checkTimerRef.current)
    setIsEditable(true)
    setInputValue('')
    changeStatus('idle')
  }

  // ── Visual state ──────────────────────────────────────────────────────────
  const containerClass = (() => {
    if (status === 'checking')           return 'border border-accent bg-accent-soft'
    if (status === 'accessible')         return 'border border-success bg-success-soft'
    if (status === 'empty-link')         return 'border border-warning bg-warning-soft'
    if (status === 'acknowledged')       return 'border border-warning bg-white'
    if (status === 'permission-blocked') return 'border border-danger bg-danger-soft'
    if (status === 'broken')             return 'border border-danger bg-danger-soft'
    if (status === 'format-error')       return 'border border-danger bg-white'
    return 'border border-border bg-white' // idle
  })()

  const inputClass = (() => {
    if (status === 'checking')           return 'border-accent bg-accent-soft'
    if (status === 'accessible')         return 'border-success-soft bg-surface-secondary'
    if (status === 'empty-link')         return 'border-amber-300 bg-surface-secondary'
    if (status === 'acknowledged')       return 'border-amber-300 bg-surface-secondary'
    if (status === 'permission-blocked') return 'border-danger-soft bg-surface-secondary'
    if (status === 'broken')             return 'border-danger-soft bg-surface-secondary'
    if (status === 'format-error')       return 'border-danger-soft bg-surface-secondary'
    return 'border-border bg-surface-secondary' // idle
  })()

  // ── Platform icon ──────────────────────────────────────────────────────────
  const { Icon, iconBg, iconColor } = PLATFORM_CONFIG[platform] ?? PLATFORM_CONFIG.Generic

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`rounded-xl px-4 py-3.5 mb-3 transition-colors duration-200 ${containerClass}`}
    >

      {/* ── TOP ROW: icon + name/platform + badge ──────────────────────── */}
      <div className="flex items-start gap-3">
        {/* Platform icon circle */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon
            className={`w-4 h-4 ${iconColor}`}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>

        {/* Name + platform + badge */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-foreground leading-tight">{name}</p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-[12px] text-muted">{platform}</span>
            {required ? (
              <span className="rounded-full bg-accent-soft text-accent text-xs font-semibold px-2 py-0.5">
                Required
              </span>
            ) : (
              <span className="rounded-full bg-surface-secondary text-muted text-xs font-medium px-2 py-0.5">
                Optional
              </span>
            )}
          </div>
        </div>

        {/* Acknowledged pill (top-right) */}
        {status === 'acknowledged' && (
          <span className="rounded-full bg-warning-soft text-warning text-xs font-semibold px-2 py-0.5 shrink-0 self-start">
            Kept with warning
          </span>
        )}
      </div>

      {/* ── INPUT FIELD ────────────────────────────────────────────────────── */}
      <input
        type="url"
        value={inputValue}
        onChange={isEditable ? (e) => setInputValue(e.target.value) : undefined}
        onPaste={isEditable ? handlePaste : undefined}
        onBlur={handleBlur}
        readOnly={!isEditable}
        placeholder={isEditable ? placeholder : undefined}
        className={`mt-2.5 w-full h-11 rounded-lg border px-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-200 ${inputClass} ${!isEditable ? 'cursor-default' : ''}`}
        aria-label={`${name} link input`}
      />

      {/* ── STATUS ROW ─────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* CHECKING */}
        {status === 'checking' && (
          <motion.div
            key="checking"
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center gap-2"
          >
            <Spinner />
            <span className="text-sm font-medium text-accent">
              Checking your link…
            </span>
          </motion.div>
        )}

        {/* ACCESSIBLE */}
        {status === 'accessible' && (
          <motion.div
            key="accessible"
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="mt-2 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2
                className="w-4 h-4 text-success shrink-0"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span className="text-[13px] font-semibold text-success">
                Accessible and has content — good to go
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleChange}
              className="text-muted underline underline-offset-2 shrink-0 min-h-11"
              aria-label="Change this link"
            >
              Change
            </Button>
          </motion.div>
        )}

        {/* EMPTY-LINK — Tyler's accountability moment */}
        {status === 'empty-link' && (
          <motion.div
            key="empty-link"
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {/* Status row */}
            <div className="mt-2 flex items-center gap-2">
              <AlertTriangle
                className="w-4 h-4 text-warning shrink-0"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-warning">
                This link is accessible but appears empty
              </span>
            </div>

            {/* Consequence card — the most important UI element on this screen */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-lg border border-warning-soft bg-warning-soft overflow-hidden">
                <div className="flex">
                  <div className="w-1 bg-warning shrink-0 self-stretch" aria-hidden="true" />
                  <div className="flex-1 px-3 py-2.5">
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium text-warning leading-snug">
                        This document appears to have no content. If the AI cannot find evidence here, this criterion may score zero.
                      </p>
                    </div>

                    {/* Action buttons — Tyler must choose explicitly */}
                    <div className="mt-3 flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={handleFixLink}
                        className="font-semibold text-accent min-h-11"
                        aria-label="Fix this link"
                      >
                        Fix the link
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={handleKeepAnyway}
                        className="font-normal text-muted min-h-11"
                        aria-label="Keep this empty link anyway"
                      >
                        Keep it anyway
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ACKNOWLEDGED — Tyler made his choice */}
        {status === 'acknowledged' && (
          <motion.div
            key="acknowledged"
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="mt-2 flex items-center justify-between gap-2"
          >
            <p className="text-xs text-warning leading-relaxed flex-1">
              You've chosen to keep this link. This criterion may score zero.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleChange}
              className="text-muted underline underline-offset-2 shrink-0 min-h-11"
              aria-label="Change this link"
            >
              Change
            </Button>
          </motion.div>
        )}

        {/* PERMISSION BLOCKED — Riya's rescue flow */}
        {status === 'permission-blocked' && (
          <motion.div
            key="permission-blocked"
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <div className="mt-2 flex items-center gap-2">
              <XCircle
                className="w-4 h-4 text-danger shrink-0"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span className="text-[13px] font-semibold text-danger">
                Permission blocked — we can't access this file
              </span>
            </div>
            <FixInstructionCard
              platform={platform}
              type="permission-blocked"
              onRetry={handleFixLink}
            />
          </motion.div>
        )}

        {/* BROKEN */}
        {status === 'broken' && (
          <motion.div
            key="broken"
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <div className="mt-2 flex items-center gap-2">
              <XCircle
                className="w-4 h-4 text-danger shrink-0"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span className="text-[13px] font-semibold text-danger">
                This link doesn't seem to work
              </span>
            </div>
            <FixInstructionCard
              platform={platform}
              type="broken"
              onRetry={handleFixLink}
            />
          </motion.div>
        )}

        {/* FORMAT ERROR */}
        {status === 'format-error' && (
          <motion.div
            key="format-error"
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center gap-2"
          >
            <XCircle
              className="w-4 h-4 text-danger shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="text-[13px] font-medium text-danger">
              That doesn't look like a valid link. Make sure it starts with https://
            </span>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
