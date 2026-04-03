/**
 * FixInstructionCard
 *
 * Operational fix instructions shown when a link check fails.
 * Two modes:
 *   type='permission-blocked' — numbered step list, platform-specific
 *   type='broken'             — simple instruction, no steps
 *
 * Left-border flex-strip pattern per DESIGN_SYSTEM.md.
 *
 * Props:
 *   platform  — 'Google Drive' | 'GitHub' | 'Figma' | 'Generic'
 *   type      — 'permission-blocked' | 'broken'
 *   onRetry   — called when user taps the retry/re-paste button
 */

import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react'

// ─── Platform-specific steps ──────────────────────────────────────────────────
const PLATFORM_STEPS = {
  'Google Drive': [
    'Open your Google Drive file',
    'Tap Share (top right)',
    "Change access to 'Anyone with the link'",
    'Copy the link again and paste it here',
  ],
  'GitHub': [
    'Open your repository on GitHub',
    'Go to Settings → General',
    "Change visibility to 'Public' (or make sure the repo is not private)",
    'Copy the repository link again and paste it here',
  ],
  'Figma': [
    'Open your file in Figma',
    'Click Share (top right)',
    "Set link access to 'Anyone with the link can view'",
    'Copy the link again and paste it here',
  ],
}

const DEFAULT_STEPS = [
  'Make sure you are signed into the platform',
  'Find the sharing or access settings for your file',
  "Set access to 'Anyone with the link'",
  'Copy the link again and paste it here',
]

// ─── FixInstructionCard ───────────────────────────────────────────────────────
export default function FixInstructionCard({
  platform = 'Generic',
  type     = 'permission-blocked',
  onRetry,
}) {
  const steps = PLATFORM_STEPS[platform] ?? DEFAULT_STEPS

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-2 rounded-lg border border-danger-soft bg-white overflow-hidden">
        <div className="flex">

          {/* Left accent strip — state-blocker red */}
          <div className="w-[3px] bg-danger shrink-0 self-stretch" aria-hidden="true" />

          <div className="flex-1 px-3 py-3">

            {/* Header */}
            <div className="flex items-center gap-2">
              <Wrench
                className="w-[14px] h-[14px] text-danger shrink-0"
                strokeWidth={2}
                aria-hidden="true"
              />
              <p className="text-[13px] font-bold text-foreground leading-none">
                How to fix this
              </p>
            </div>

            {type === 'permission-blocked' ? (
              <>
                {/* Numbered steps */}
                <div className="mt-[10px] flex flex-col gap-[6px]">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-danger flex items-center justify-center shrink-0 mt-[1px]">
                        <span className="text-[11px] font-bold text-white leading-none">
                          {i + 1}
                        </span>
                      </div>
                      <p className="text-[13px] text-foreground leading-[1.45] flex-1">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Re-paste button */}
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-[10px] w-full rounded-full bg-accent-soft border border-accent-soft text-accent text-[13px] font-semibold py-2 px-4 min-h-[44px] flex items-center justify-center"
                  aria-label="Re-paste your corrected link"
                >
                  Re-paste your link
                </button>
              </>
            ) : (
              <>
                {/* Simple broken-link instruction */}
                <p className="mt-2 text-[13px] text-foreground leading-[1.45]">
                  Double-check the URL and paste it again. Make sure you're not missing any characters.
                </p>

                {/* Try again button */}
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-[10px] w-full rounded-full bg-accent-soft border border-accent-soft text-accent text-[13px] font-semibold py-2 px-4 min-h-[44px] flex items-center justify-center"
                  aria-label="Try pasting the link again"
                >
                  Try again
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </motion.div>
  )
}
