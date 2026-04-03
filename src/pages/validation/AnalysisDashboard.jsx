/**
 * AnalysisDashboard
 *
 * Unified validation results screen — replaces Ready/Warning/Blocker.
 * Three-panel layout: Issues (left), Document Preview (center), Issue Details (right).
 * Top banner shows risk level. Sticky bottom bar with CTAs.
 */

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, Chip } from '@heroui/react'
import { AlertTriangle, CheckCircle2, XCircle, Eye, ShieldCheck, Image } from 'lucide-react'
import InnerPageBar from '../../components/ui/InnerPageBar'
import { mockAssignment } from '../../data/mock-assignment'

// ─── Mock issues ───────────────────────────────────────────────────────────────
const MOCK_ISSUES = [
  {
    id: 'i1',
    type: 'warning',
    title: 'No supporting document found',
    description: 'Your analysis lacks supporting evidence documents. This may result in 0 marks for the Research Evidence criterion.',
    file: 'Business Case PDF',
    page: null,
    impact: '+15 marks',
    recommendation: 'Upload a supporting evidence document that references your key claims. This has the highest impact on your score.',
    fixAction: 'Upload supporting evidence',
  },
  {
    id: 'i2',
    type: 'warning',
    title: 'Chart image is partially unreadable',
    description: 'The data visualization chart on page 4 has low OCR confidence. The evaluator may not be able to read this section properly.',
    file: 'Business Case PDF',
    page: 4,
    impact: '+10 marks',
    confidence: '38%',
    recommendation: 'Re-upload a clearer version of the chart, or export it at higher resolution. Ensure text labels are legible.',
    fixAction: 'Re-upload clearer chart',
  },
]

// ─── Passing checks shown when "Show all" is toggled ───────────────────────────
const MOCK_PASSING = [
  { id: 'p1', label: 'Business Case PDF', note: 'Readable — no issues found' },
  { id: 'p2', label: 'Financial Model', note: 'File is accessible' },
  { id: 'p3', label: 'Figma Prototype', note: 'Link accessible and has content' },
  { id: 'p4', label: 'Problem Statement', note: 'Handwriting is clear — good to go' },
]

// ─── Skeleton document lines for preview ───────────────────────────────────────
const DOC_LINES = [
  { width: '85%', highlighted: false },
  { width: '70%', highlighted: false },
  { width: '90%', highlighted: false },
  { width: '60%', highlighted: false },
  { width: '95%', highlighted: false },
  { width: '75%', highlighted: false },
  { width: '40%', highlighted: 'warning' },
  { width: '88%', highlighted: false },
  { width: '92%', highlighted: false },
  { width: '65%', highlighted: false },
  { width: 'chart', highlighted: 'danger' },
  { width: '80%', highlighted: false },
  { width: '70%', highlighted: false },
  { width: '55%', highlighted: false },
  { width: '90%', highlighted: false },
]

// ─── Banner config per readiness state ─────────────────────────────────────────
const BANNER_CONFIG = {
  ready: {
    bg: 'bg-success-soft',
    border: 'border-success',
    Icon: CheckCircle2,
    iconColor: 'text-success',
    headline: 'Your submission looks good',
    sub: 'All checks passed. You can submit with confidence.',
  },
  warning: {
    bg: 'bg-warning-soft',
    border: 'border-warning',
    Icon: AlertTriangle,
    iconColor: 'text-warning',
    headline: 'You can submit, but there are risks',
  },
  blocker: {
    bg: 'bg-danger-soft',
    border: 'border-danger',
    Icon: XCircle,
    iconColor: 'text-danger',
    headline: 'Some issues need to be fixed',
    sub: 'These issues must be resolved before your work can be evaluated.',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AnalysisDashboard() {
  const navigate = useNavigate()
  const { state: routeState } = useLocation()

  const issues = routeState?.warnings ?? MOCK_ISSUES
  const readiness = routeState?.readiness ?? (
    MOCK_ISSUES.some(i => i.type === 'blocker')
      ? 'blocker'
      : MOCK_ISSUES.length > 0
        ? 'warning'
        : 'ready'
  )
  const deadline = routeState?.deadline ?? mockAssignment.deadline

  const [selectedIssue, setSelectedIssue] = useState(issues[0] ?? null)
  const [showAll, setShowAll] = useState(false)

  const banner = BANNER_CONFIG[readiness] ?? BANNER_CONFIG.warning
  const bannerSub = banner.sub ?? `${issues.length} issue${issues.length !== 1 ? 's' : ''} may affect your marks. Review them carefully before submitting.`

  return (
    <>
      <InnerPageBar
        title="Analysis Results"
        deadline={deadline}
        breadcrumbItems={[
          { label: 'Assignments', href: '/' },
          { label: 'Validation Results' },
          { label: 'Analysis' },
        ]}
      />

      <div className="flex flex-col min-h-screen bg-surface-secondary">

        {/* ── TOP BANNER ── */}
        <div className="px-8 lg:px-10">
          <div className="max-w-7xl mx-auto py-4">
            {/* Alert banner */}
            <div className={`rounded-xl p-5 flex items-start gap-4 ${banner.bg} border ${banner.border}`}>
              <banner.Icon className={`w-6 h-6 ${banner.iconColor} shrink-0 mt-0.5`} aria-hidden="true" />
              <div className="flex-1">
                <p className="text-[16px] font-bold text-foreground">{banner.headline}</p>
                <p className="text-[13px] text-muted mt-1">{bannerSub}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Chip
                  variant="soft"
                  color={readiness === 'ready' ? 'success' : readiness === 'warning' ? 'warning' : 'danger'}
                  size="sm"
                >
                  {readiness === 'ready' ? 'Low Risk' : readiness === 'warning' ? 'Medium Risk' : 'High Risk'}
                </Chip>
                {issues.length > 0 && (
                  <span className="text-sm text-muted">{issues.length} issues</span>
                )}
              </div>
            </div>

            {/* Next Best Action */}
            {issues.length > 0 && (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[13px] text-muted">
                  <span className="font-semibold text-foreground">Next Best Action: </span>
                  Fix &ldquo;{issues[0].title}&rdquo; &rarr; {issues[0].impact} (highest impact)
                </p>
                <Button variant="primary" size="sm" className="rounded-lg px-4" onPress={() => setSelectedIssue(issues[0])}>
                  Review Now
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ── THREE PANEL LAYOUT ── */}
        <div className="flex-1 px-8 lg:px-10 pb-24">
          <div className="max-w-7xl mx-auto flex gap-6 items-start">

            {/* LEFT: Issues List */}
            <div className="w-80 shrink-0">
              <Card className="rounded-xl border border-border p-0 gap-0 sticky top-[180px]">
                <CardContent className="p-0 gap-0">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <p className="text-[13px] font-bold text-foreground">Issues Requiring Attention</p>
                    <button onClick={() => setShowAll(!showAll)} className="text-[12px] font-medium text-accent">
                      {showAll ? 'Issues only' : 'Show all'}
                    </button>
                  </div>

                  {/* Issue cards */}
                  {issues.map(issue => (
                    <button
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`w-full text-left px-4 py-3 border-b border-border hover:bg-surface-secondary transition-colors ${
                        selectedIssue?.id === issue.id ? 'bg-surface-secondary' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle
                          className={`w-4 h-4 shrink-0 mt-0.5 ${issue.type === 'blocker' ? 'text-danger' : 'text-warning'}`}
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-foreground leading-snug">{issue.title}</p>
                          <p className="text-[12px] text-muted mt-0.5 line-clamp-2">{issue.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Chip variant="soft" color={issue.type === 'blocker' ? 'danger' : 'warning'} size="sm">
                              {issue.type === 'blocker' ? 'Blocker' : 'Warning'}
                            </Chip>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Passing checks (when showAll toggled) */}
                  {showAll && MOCK_PASSING.map(check => (
                    <div key={check.id} className="px-4 py-3 border-b border-border flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{check.label}</p>
                        <p className="text-[12px] text-muted mt-0.5">{check.note}</p>
                      </div>
                    </div>
                  ))}

                  {/* Ready state — no issues */}
                  {issues.length === 0 && (
                    <div className="px-4 py-6 text-center">
                      <CheckCircle2 className="w-8 h-8 text-success mx-auto" aria-hidden="true" />
                      <p className="text-[14px] font-semibold text-foreground mt-2">All checks passed</p>
                      <p className="text-[12px] text-muted mt-1">Your submission is ready.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* CENTER: Document Preview */}
            <div className="flex-1 min-w-0">
              <Card className="rounded-xl border border-border p-0 gap-0">
                <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                  <p className="text-[13px] font-bold text-foreground">Document Preview</p>
                  <button className="flex items-center gap-1.5 text-[12px] font-medium text-accent">
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    Full View
                  </button>
                </div>
                <CardContent className="p-6 gap-0">
                  <div className="bg-white border border-border rounded-lg p-8 min-h-[500px]">
                    <div className="flex flex-col gap-3">
                      {DOC_LINES.map((line, i) => {
                        if (line.width === 'chart') {
                          return (
                            <div
                              key={i}
                              className={`w-full h-40 rounded-lg border-2 border-dashed flex items-center justify-center ${
                                line.highlighted === 'danger' ? 'border-danger bg-danger-soft' : 'border-border bg-surface-secondary'
                              }`}
                            >
                              <div className="text-center">
                                <Image
                                  className={`w-8 h-8 mx-auto ${line.highlighted === 'danger' ? 'text-danger' : 'text-muted'}`}
                                  aria-hidden="true"
                                />
                                <p className={`text-xs mt-1 ${line.highlighted === 'danger' ? 'text-danger font-semibold' : 'text-muted'}`}>
                                  {line.highlighted === 'danger' ? 'OCR Confidence: 38%' : 'Chart area'}
                                </p>
                              </div>
                            </div>
                          )
                        }
                        return (
                          <div
                            key={i}
                            className={`h-3 rounded-full ${
                              line.highlighted === 'warning' ? 'bg-warning-soft border border-warning' :
                              line.highlighted === 'danger' ? 'bg-danger-soft border border-danger' :
                              'bg-default'
                            }`}
                            style={{ width: line.width }}
                          />
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT: Issue Details */}
            <div className="w-80 shrink-0">
              <Card className="rounded-xl border border-border p-0 gap-0 sticky top-[180px]">
                <CardContent className="p-5 gap-0">
                  {selectedIssue ? (
                    <>
                      {/* Issue icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedIssue.type === 'blocker' ? 'bg-danger-soft' : 'bg-warning-soft'
                      }`}>
                        <AlertTriangle
                          className={`w-5 h-5 ${selectedIssue.type === 'blocker' ? 'text-danger' : 'text-warning'}`}
                          aria-hidden="true"
                        />
                      </div>

                      <p className="text-[15px] font-bold text-foreground mt-3">{selectedIssue.title}</p>
                      <p className="text-[13px] text-muted mt-2 leading-relaxed">{selectedIssue.description}</p>

                      {/* Metadata */}
                      <div className="mt-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-muted">File</span>
                          <span className="text-[12px] font-medium text-foreground">{selectedIssue.file}</span>
                        </div>
                        {selectedIssue.page && (
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-muted">Page</span>
                            <span className="text-[12px] font-medium text-foreground">{selectedIssue.page}</span>
                          </div>
                        )}
                        {selectedIssue.confidence && (
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-muted">OCR Confidence</span>
                            <span className="text-[12px] font-semibold text-danger">{selectedIssue.confidence}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-muted">Potential impact</span>
                          <span className="text-[12px] font-semibold text-success">{selectedIssue.impact}</span>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="mt-4 p-3 rounded-lg bg-surface-secondary">
                        <p className="text-[12px] font-semibold text-foreground">Recommendation</p>
                        <p className="text-[12px] text-muted mt-1 leading-relaxed">{selectedIssue.recommendation}</p>
                      </div>

                      {/* Fix button */}
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        className="mt-4 rounded-lg"
                        onPress={() => {}}
                      >
                        {selectedIssue.fixAction}
                      </Button>
                    </>
                  ) : (
                    /* No issue selected — show summary */
                    <div className="text-center py-4">
                      <ShieldCheck className="w-10 h-10 text-success mx-auto" aria-hidden="true" />
                      <p className="text-[15px] font-bold text-foreground mt-3">Your submission is ready</p>
                      <p className="text-[13px] text-muted mt-1">All checks passed. You can submit with confidence.</p>
                      <p className="text-[12px] font-semibold text-purple mt-4">
                        AI processes your work. Your instructor makes the final grade decision.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>
        </div>

        {/* ── STICKY BOTTOM BAR ── */}
        <div className="sticky bottom-0 w-full z-40">
          <div
            className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-surface-secondary"
            aria-hidden="true"
          />
          <div className="bg-white border-t border-border px-8 lg:px-10 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" aria-hidden="true" />
                <span className="text-[13px] text-muted">Your progress is saved automatically</span>
              </div>
              <div className="flex items-center gap-3">
                {readiness !== 'ready' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg text-muted"
                    onPress={() => navigate('/consent', { state: { warnings: issues, deadline } })}
                  >
                    Submit with {issues.length} Known Risk{issues.length !== 1 ? 's' : ''}
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-lg px-6 font-semibold"
                  onPress={() =>
                    readiness === 'ready'
                      ? navigate('/status')
                      : navigate('/fix', { state: { warning: issues[0], warnings: issues, deadline } })
                  }
                >
                  {readiness === 'ready' ? 'Submit' : 'Fix Issues'}
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
