/**
 * ConsequenceCard
 *
 * Warning detail card — left-border amber accent per DESIGN_SYSTEM.md.
 * Uses flex-strip pattern for reliable left border (avoids Tailwind v4
 * border cascade conflicts).
 *
 * Visual flow within card (top to bottom):
 *   1. "Criterion at risk" pill + optional issue numbering
 *   2. Criterion name + weight badge (bold, scannable)
 *   3. Affected element (label + value inline)
 *   4. Divider
 *   5. Consequence statement — this is the most important line
 *      (AlertTriangle + amber text — reads last, remembered longest)
 *
 * Props:
 *   warning  — { id, criterionName, weight, element, issue, consequence }
 *   index    — 0-based position (for numbering in multiple-warning view)
 *   total    — total warning count (shows numbering when > 1)
 */

import { AlertTriangle } from 'lucide-react'

export default function ConsequenceCard({ warning, index = 0, total = 1 }) {
  const showNumbering = total > 1

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="flex">

        {/* Left accent strip — state-warning amber */}
        <div className="w-1 bg-warning shrink-0 self-stretch" />

        {/* Card content */}
        <div className="flex-1 p-5">

          {/* ROW 1: "Criterion at risk" pill + issue numbering */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-warning-soft text-xs font-semibold text-warning">
              Criterion at risk
            </span>
            {showNumbering && (
              <span className="text-xs font-medium text-muted shrink-0">
                Issue {index + 1} of {total}
              </span>
            )}
          </div>

          {/* ROW 2: Criterion name + weight badge */}
          <div className="flex items-start justify-between gap-4 mt-2.5">
            <p className="text-base font-bold text-foreground flex-1 leading-snug">
              {warning.criterionName}
            </p>
            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full bg-warning-soft text-sm font-bold text-warning mt-0.5">
              {warning.weight}
            </span>
          </div>

          {/* ROW 3: Affected element */}
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-xs font-medium text-muted">
              Affected:
            </span>
            <span className="text-xs font-semibold text-foreground">
              {warning.element}
            </span>
          </div>

          {/* Divider */}
          <div className="mt-4 border-t border-border" />

          {/* ROW 4: Consequence statement — reads last, remembered longest */}
          <div className="flex items-start gap-2 pt-3 pb-4">
            <AlertTriangle
              className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-warning leading-relaxed">
              {warning.consequence}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
