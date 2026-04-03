/**
 * PhotoTips
 *
 * Expandable card with 3 practical tips for getting a clearer photo.
 * Shown only for medium/low confidence results on Screen 2.4.
 * Collapsed by default — Arjun doesn't need it, Sunita can open it.
 *
 * No props — content is static.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, ChevronDown, ChevronUp, Sun, ZoomIn, Eye } from 'lucide-react'

const TIPS = [
  {
    Icon:  Sun,
    text:  'Move to a brighter spot or use a window',
  },
  {
    Icon:  ZoomIn,
    text:  'Hold your phone 20–30 cm from the page',
  },
  {
    Icon:  Eye,
    text:  'Make sure all text is within the frame',
  },
]

export default function PhotoTips() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">

      {/* ── Header — tap to toggle ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full min-h-[44px] flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Collapse photo tips' : 'Expand photo tips'}
      >
        <div className="flex items-center gap-2">
          <Camera
            className="w-4 h-4 text-info shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="text-[13px] font-bold text-foreground">
            Tips for a clearer photo
          </span>
        </div>
        {isOpen
          ? <ChevronUp  className="w-4 h-4 text-muted shrink-0" strokeWidth={2} aria-hidden="true" />
          : <ChevronDown className="w-4 h-4 text-muted shrink-0" strokeWidth={2} aria-hidden="true" />
        }
      </button>

      {/* ── Body ── */}
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
            <div className="border-t border-border px-4 pt-3 pb-4 flex flex-col gap-3">
              {TIPS.map(({ Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Icon
                    className="w-4 h-4 text-info shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <p className="text-[13px] text-foreground leading-[1.4]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
