/**
 * RubricMappingAccordion
 *
 * Priya's pre-submit confidence check — shows how uploaded files map
 * to rubric criteria. Collapsed by default so Arjun isn't slowed down.
 *
 * Props:
 *   items  — submission items array (from mockSubmission.items)
 *   rubric — criteria array (from mockAssignment.rubric)
 *            Each criterion: { id, name, weight }
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, ChevronDown } from 'lucide-react'

export default function RubricMappingAccordion({ items = [], rubric = [] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white border-t border-border">

      {/* ── Header trigger ── */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="w-full min-h-[48px] flex items-center justify-between px-4 py-[14px] text-left"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Collapse rubric mapping' : 'Expand rubric mapping'}
      >
        <div className="flex items-center gap-2">
          <Layers
            className="w-4 h-4 text-info shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="text-[14px] font-medium text-foreground">
            How your files map to criteria
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[12px] text-muted">
            {rubric.length} criteria
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown
              className="w-4 h-4 text-muted"
              strokeWidth={2}
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </button>

      {/* ── Expanded content ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-surface-secondary border-t border-border px-4 py-4 flex flex-col gap-4">
              {rubric.map((criterion) => {
                // Find items that map to this criterion
                const mappedItems = items.filter(
                  (item) => item.mapsTo?.includes(criterion.id)
                )

                return (
                  <div key={criterion.id}>
                    {/* Criterion header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[13px] font-semibold text-foreground flex-1">
                        {criterion.name}
                      </span>
                      <span className="rounded-full bg-white border border-border text-muted text-[11px] font-medium px-2 py-0.5">
                        {criterion.weight}%
                      </span>
                    </div>

                    {/* Mapped file pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {mappedItems.length > 0 ? (
                        mappedItems.map((item) => (
                          <span
                            key={item.id}
                            className="inline-flex items-center rounded-full bg-white border border-border text-foreground text-[12px] font-medium px-2.5 py-1 max-w-[200px] truncate"
                          >
                            {item.name}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-warning-soft border border-warning-soft text-warning text-[12px] font-medium px-2.5 py-1">
                          No file mapped
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
