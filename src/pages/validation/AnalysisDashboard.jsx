/**
 * AnalysisDashboard — Review & Analyse
 *
 * Single-column validation results screen with inline fix capability.
 * Sections: Banner → Issues (with inline fix) → Submission details → Rubric.
 */

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button, Card, CardContent, Chip,
  Accordion, AccordionItem, AccordionHeading, AccordionTrigger,
  AccordionPanel, AccordionBody, AccordionIndicator,
  ProgressBar, ProgressBarTrack, ProgressBarFill,
} from '@heroui/react'
import {
  AlertTriangle, CheckCircle2, XCircle, Layers, ChevronDown, TrendingUp,
  FileText, Table2, Link2, Monitor, Camera, Upload, Clock, Info,
} from 'lucide-react'
import InnerPageBar from '../../components/ui/InnerPageBar'
import { mockAssignment } from '../../data/mock-assignment'
import { useCountdown } from '../../hooks/useCountdown'

// ─── Mock issues ───────────────────────────────────────────────────────────────
const MOCK_ISSUES = [
  {
    id: 'i1',
    type: 'warning',
    title: 'No supporting document found',
    description: 'Your analysis lacks supporting evidence documents. This may result in 0 marks for the Research Evidence criterion.',
    file: 'Business Case PDF',
    page: null,
    impact: 'High impact on score',
    recommendation: 'Upload a supporting evidence document that references your key claims. This has the highest impact on your score.',
    fixAction: 'Upload supporting evidence',
    why: 'Your instructor cannot evaluate research evidence without supporting documents.',
    impactDetail: 'The Research Evidence criterion may score zero.',
    steps: [
      'Prepare your supporting evidence document (PDF, DOCX, or image)',
      'Upload it using the button below',
      'We\'ll re-check only this item',
    ],
  },
  {
    id: 'i2',
    type: 'warning',
    title: 'References section incomplete',
    description: 'The references section on page 8 contains only 3 citations. The rubric expects evidence-based analysis with properly cited external sources.',
    file: 'Business Case PDF',
    page: 8,
    impact: 'Fixing this may improve your score',
    recommendation: 'Add at least 5 more academic or industry references to support your strategic analysis.',
    fixAction: 'Add more references',
    why: 'The rubric requires evidence-based analysis with properly cited external sources.',
    impactDetail: 'The references section is incomplete and may affect your Clarity & Attention to Detail score.',
    steps: [
      'Open your Business Case PDF',
      'Add at least 5 more academic or industry references',
      'Re-upload the updated PDF below',
    ],
  },
]

// ─── Mock submission items ────────────────────────────────────────────────────
const MOCK_SUBMISSION_ITEMS = [
  { name: 'Business Case Analysis.pdf', detail: 'PDF · 2.4 MB', Icon: FileText, iconBg: 'bg-accent-soft', iconColor: 'text-accent', status: 'ready', lastChecked: '2 min ago' },
  { name: 'Financial Model.xlsx', detail: 'XLSX · 840 KB', Icon: Table2, iconBg: 'bg-teal-soft', iconColor: 'text-teal', status: 'ready', lastChecked: '2 min ago' },
  { name: 'Supporting Document', detail: 'Google Drive link', Icon: Link2, iconBg: 'bg-teal-soft', iconColor: 'text-teal', status: 'warning', lastChecked: null },
  { name: 'Presentation Deck.pptx', detail: 'PPTX · 4.1 MB', Icon: Monitor, iconBg: 'bg-pink-soft', iconColor: 'text-pink', status: 'ready', lastChecked: '2 min ago' },
  { name: 'Handwritten Response.jpg', detail: 'JPG · 1.2 MB', Icon: Camera, iconBg: 'bg-purple-soft', iconColor: 'text-purple', status: 'ready', lastChecked: '1 min ago' },
]

// ─── Mock rubric evaluation ───────────────────────────────────────────────────
const MOCK_RUBRIC_EVAL = [
  { criterionId: 'c1', name: 'Problem Framing & Analysis', weight: 20,
    feedback: 'Problem is clearly framed and well-evidenced. Frameworks are applied correctly and the root cause is identified with logical reasoning.',
    improvements: ['Include more supporting evidence from external sources', 'Strengthen the root cause analysis with quantitative data'] },
  { criterionId: 'c2', name: 'Strategic Framework Application', weight: 20,
    feedback: 'Two frameworks applied correctly with good supporting evidence. Insights are clearly linked to the recommendation.',
    improvements: ['Synthesise insights across frameworks for a more cohesive strategic picture', 'Add PESTEL analysis to complement existing frameworks'] },
  { criterionId: 'c3', name: 'Quality of Recommendation', weight: 20,
    feedback: 'Clear recommendation with sound rationale. Three alternatives evaluated with financial impact estimated.',
    improvements: ['Strengthen counter-argument anticipation', 'Add more explicit decision criteria for alternative comparison'] },
  { criterionId: 'c4', name: 'Financial Grounding', weight: 15,
    feedback: 'Financial model covers cost-benefit and 3-year projection. Assumptions are documented.',
    improvements: ['Add scenario analysis (base / optimistic / pessimistic)', 'Include sensitivity analysis on key assumptions'] },
  { criterionId: 'c5', name: 'Completeness', weight: 15,
    feedback: 'Most required sections present and adequately developed. Some supplementary content could add value.',
    improvements: ['Add appendices with supporting data tables', 'Include AI usage disclosure appendix'] },
  { criterionId: 'c6', name: 'Clarity & Attention to Detail', weight: 10,
    feedback: 'Writing is clear and well-organised. Referencing is mostly complete with minor formatting inconsistencies.',
    improvements: ['Standardise citation format throughout', 'Proofread for minor grammatical inconsistencies'] },
]

// ─── Impact mapping for consent modal ────────────────────────────────────
const IMPACT_MAP = [
  {
    criterion: 'Research Evidence',
    weight: '20%',
    issue: 'No supporting document found',
    consequence: 'This criterion may receive low or zero score if evidence is not detected.',
  },
  {
    criterion: 'Clarity & Attention to Detail',
    weight: '10%',
    issue: 'References section incomplete',
    consequence: 'Incomplete references may affect your score for this criterion.',
  },
]

// ─── Banner config ────────────────────────────────────────────────────────────
const BANNER_CONFIG = {
  ready:   { bg: 'bg-white', border: 'border-border', Icon: CheckCircle2, iconColor: 'text-success', headline: "You're all set — looking good", sub: 'Everything checks out. You can submit with confidence.' },
  warning: { bg: 'bg-white',  border: 'border-border',  Icon: CheckCircle2,  iconColor: 'text-accent',  headline: "You're almost there" },
  blocker: { bg: 'bg-warning-soft', border: 'border-warning',  Icon: AlertTriangle, iconColor: 'text-warning', headline: "Almost ready — a few things to review", sub: 'Your work is safe. Fix these quickly and you\'re ready to go.' },
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AnalysisDashboard() {
  const navigate = useNavigate()
  const { state: routeState } = useLocation()

  const issues = routeState?.warnings ?? MOCK_ISSUES
  const readiness = routeState?.readiness ?? (
    MOCK_ISSUES.some(i => i.type === 'blocker') ? 'blocker'
    : MOCK_ISSUES.length > 0 ? 'warning' : 'ready'
  )
  const deadline = routeState?.deadline ?? mockAssignment.deadline

  const { expired } = useCountdown(deadline)

  // ── Inline fix state ──────────────────────────────────────────────────────
  const [expandedIssue, setExpandedIssue] = useState(issues[0]?.id ?? null)
  const [fixedIssues, setFixedIssues] = useState(new Set())
  const [showValidated, setShowValidated] = useState(false)

  // ── Consent modal state ─────────────────────────────────────────────────
  const [showConsent, setShowConsent] = useState(false)
  const [consentStep, setConsentStep] = useState(1)
  const [ctaReady, setCtaReady] = useState(false)

  useEffect(() => {
    if (showConsent && consentStep === 1) {
      setCtaReady(false)
      const timer = setTimeout(() => setCtaReady(true), 300)
      return () => clearTimeout(timer)
    }
  }, [showConsent, consentStep])

  const unresolvedCount = issues.length - fixedIssues.size
  const allFixed = fixedIssues.size >= issues.length
  const validatedCount = MOCK_SUBMISSION_ITEMS.filter(i => i.status === 'ready').length

  function handleFixClick(issueId) {
    setExpandedIssue(expandedIssue === issueId ? null : issueId)
  }

  function handleFixApplied(issueId) {
    setFixedIssues(prev => new Set([...prev, issueId]))
    setExpandedIssue(null)
  }

  const banner = expired
    ? { bg: 'bg-warning-soft', border: 'border-warning', Icon: AlertTriangle, iconColor: 'text-warning', headline: 'You can still submit' }
    : allFixed
    ? BANNER_CONFIG.ready
    : (BANNER_CONFIG[readiness] ?? BANNER_CONFIG.warning)
  const bannerSub = expired
    ? 'The deadline has passed. Late submission policy may apply.'
    : allFixed
    ? "Everything checks out. You're ready to submit."
    : (banner.sub ?? `Your work is safe. Just ${unresolvedCount} quick ${unresolvedCount === 1 ? 'fix' : 'fixes'} and you're ready to go.`)

  // Progress: 80% when issues exist, 100% when all fixed
  const progressPercent = allFixed ? 100 : (issues.length > 0 ? 80 : 100)

  const submissionTime = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })

  return (
    <>
      <InnerPageBar
        title="Review & Analyse"
        deadline={deadline}
        breadcrumbItems={[
          { label: 'Assignments', href: '/' },
          { label: 'Review & Analyse' },
        ]}
      />

      <div className="min-h-screen bg-surface-secondary">
        <div className="px-8 lg:px-10 py-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* ═══ 1. STATUS BANNER + PROGRESS ═══ */}
            <div className={`rounded-xl p-5 ${banner.bg} border ${banner.border}`}>
              <div className="flex items-start gap-4">
                <banner.Icon className={`w-6 h-6 ${banner.iconColor} shrink-0 mt-0.5`} aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-foreground">{banner.headline}</p>
                  <p className="text-[13px] text-muted mt-1">{bannerSub}</p>
                </div>
                <Chip
                  variant="soft"
                  color={progressPercent === 100 ? 'success' : 'accent'}
                  size="sm"
                  className="shrink-0"
                >
                  {progressPercent === 100 ? 'Ready' : `${progressPercent}% complete`}
                </Chip>
              </div>
              {/* Progress bar */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${progressPercent === 100 ? 'bg-success' : 'bg-accent'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                {unresolvedCount > 0 && (
                  <span className="text-[12px] text-muted shrink-0">{unresolvedCount} quick {unresolvedCount === 1 ? 'fix' : 'fixes'} remaining</span>
                )}
              </div>
            </div>

            {/* ═══ 2. ISSUES WITH INLINE FIX (moved to top) ═══ */}
            {issues.length > 0 && (
              <Card className="rounded-xl border border-border p-0 gap-0">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-[15px] font-bold text-foreground">Quick fixes to strengthen your submission</h2>
                  <span className="text-[13px] text-muted">
                    {fixedIssues.size > 0
                      ? `${fixedIssues.size} of ${issues.length} done`
                      : `${issues.length} ${issues.length === 1 ? 'thing' : 'things'} to review`
                    }
                  </span>
                </div>
                {issues.map((issue, i) => {
                  const isFixed = fixedIssues.has(issue.id)
                  const isExpanded = expandedIssue === issue.id

                  return (
                    <div key={issue.id} className={`${i < issues.length - 1 ? 'border-b border-border' : ''}`}>
                      {/* Issue header row */}
                      <div className={`px-6 py-4 ${isFixed ? 'bg-success-soft' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isFixed ? 'bg-success-soft' : issue.type === 'blocker' ? 'bg-warning-soft' : 'bg-info-soft'
                          }`}>
                            {isFixed
                              ? <CheckCircle2 className="w-4 h-4 text-success" aria-hidden="true" />
                              : issue.type === 'blocker'
                                ? <AlertTriangle className="w-4 h-4 text-warning" aria-hidden="true" />
                                : <TrendingUp className="w-4 h-4 text-info" aria-hidden="true" />
                            }
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className={`text-[14px] font-semibold ${isFixed ? 'text-success line-through' : 'text-foreground'}`}>{issue.title}</p>
                              {isFixed ? (
                                <Chip variant="soft" color="success" size="sm">Done</Chip>
                              ) : (
                                <Chip variant="soft" color={issue.type === 'blocker' ? 'warning' : 'accent'} size="sm">
                                  {issue.type === 'blocker' ? 'Needs attention' : 'Quick fix'}
                                </Chip>
                              )}
                            </div>
                            {!isFixed && (
                              <>
                                <p className="text-[13px] text-muted mt-1 leading-relaxed">{issue.description}</p>
                                <div className="mt-3 flex items-center gap-4">
                                  <div className="flex items-center gap-4 text-[12px] text-muted flex-1">
                                    <span>File: {issue.file}</span>
                                    {issue.page && <span>Page {issue.page}</span>}
                                    <span className="font-medium text-info">{issue.impact}</span>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-[11px] text-muted flex items-center gap-1">
                                      <Clock className="w-3 h-3" aria-hidden="true" />
                                      ~30s to fix
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="rounded-lg px-4"
                                      onPress={() => handleFixClick(issue.id)}
                                    >
                                      {isExpanded ? 'Close' : 'Fix now'}
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                            {isFixed && (
                              <p className="text-[12px] text-success mt-1">Your updated file has been received.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded inline fix area */}
                      <AnimatePresence>
                        {isExpanded && !isFixed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 pt-1">
                              {/* Why + Impact */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-surface-secondary">
                                  <p className="text-[11px] font-semibold text-foreground mb-1">Why it matters</p>
                                  <p className="text-[12px] text-muted leading-relaxed">{issue.why}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-surface-secondary">
                                  <p className="text-[11px] font-semibold text-foreground mb-1">Impact if not fixed</p>
                                  <p className="text-[12px] text-muted leading-relaxed">{issue.impactDetail}</p>
                                </div>
                              </div>

                              {/* Steps */}
                              <div className="mt-4">
                                <p className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-2">How to fix</p>
                                <div className="flex flex-col gap-1.5">
                                  {issue.steps.map((step, si) => (
                                    <div key={si} className="flex items-start gap-2.5">
                                      <span className="w-5 h-5 rounded-full bg-accent-soft flex items-center justify-center shrink-0 text-[10px] font-bold text-accent">{si + 1}</span>
                                      <p className="text-[13px] text-muted leading-snug pt-0.5">{step}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Upload zone */}
                              <div
                                className="mt-4 rounded-xl border-2 border-dashed border-border bg-surface-secondary p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-accent transition-colors"
                                onClick={() => handleFixApplied(issue.id)}
                                role="button"
                                tabIndex={0}
                              >
                                <Upload className="w-7 h-7 text-muted" strokeWidth={1.5} aria-hidden="true" />
                                <p className="text-[13px] font-semibold text-foreground">Drop your file here or click to upload</p>
                                <p className="text-[11px] text-muted">PDF, DOCX, or image files accepted</p>
                              </div>

                              {/* Estimated time */}
                              <div className="mt-2 flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-muted" aria-hidden="true" />
                                <span className="text-[11px] text-muted">Estimated fix time: ~30 seconds</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </Card>
            )}

            {/* ═══ 3. SUBMISSION DETAILS ═══ */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-foreground">Your submission</h2>
                <button
                  type="button"
                  onClick={() => setShowValidated(!showValidated)}
                  className="text-[12px] font-medium text-accent hover:underline"
                >
                  {showValidated ? 'Show issues only' : 'Show all items'}
                </button>
              </div>

              {/* Warning items — status updates when all fixed */}
              {MOCK_SUBMISSION_ITEMS.filter(i => i.status !== 'ready').map((item, i) => (
                <div
                  key={`w-${i}`}
                  className="flex items-center gap-4 px-6 py-3.5 border-b border-border"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`} aria-hidden="true">
                    <item.Icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-foreground">{item.name}</p>
                    <p className="text-[12px] text-muted">{item.detail}</p>
                  </div>
                  {allFixed ? (
                    <span className="text-[12px] font-medium text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Validated
                    </span>
                  ) : (
                    <Chip variant="soft" color="warning" size="sm">Needs review</Chip>
                  )}
                </div>
              ))}

              {/* Validated items — collapsed by default */}
              {showValidated ? (
                MOCK_SUBMISSION_ITEMS.filter(i => i.status === 'ready').map((item, i, arr) => (
                  <div
                    key={`v-${i}`}
                    className={`flex items-center gap-4 px-6 py-3.5 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`} aria-hidden="true">
                      <item.Icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-foreground">{item.name}</p>
                      <p className="text-[12px] text-muted">{item.detail}</p>
                      {item.lastChecked && (
                        <p className="text-[11px] text-muted mt-0.5">Checked {item.lastChecked}</p>
                      )}
                    </div>
                    <span className="text-[12px] font-medium text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Validated
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-6 py-3 flex items-center gap-2 text-[12px] text-success">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{validatedCount} items already validated</span>
                </div>
              )}
              <div className="px-6 py-4 border-t border-border bg-surface-secondary rounded-b-xl">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-muted">Submitting as</span>
                    <span className="text-[13px] font-medium text-foreground">Riya Sharma · Student ID 2024MBA089</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-muted">Assignment</span>
                    <span className="text-[13px] font-medium text-foreground">{mockAssignment.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-muted">Submission time</span>
                    <span className="text-[13px] font-medium text-foreground">{submissionTime}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* ═══ 4. RUBRIC EVALUATION ═══ */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
                  <Layers className="w-4 h-4 text-purple" strokeWidth={2} aria-hidden="true" />
                </div>
                <h2 className="text-[16px] font-bold text-foreground">Rubric-Based Evaluation</h2>
              </div>
              <div className="px-6 py-3 bg-purple-soft border-b border-border">
                <p className="text-[13px] text-purple leading-relaxed">
                  <span className="font-semibold">AI Instructor Evaluation:</span> Your submission has been evaluated against the assignment rubric. Your instructor makes the final grade decision.
                </p>
              </div>
              <Accordion>
                {MOCK_RUBRIC_EVAL.map((criterion) => (
                  <AccordionItem key={criterion.criterionId} value={criterion.criterionId}>
                    <AccordionHeading>
                      <AccordionTrigger className="px-6 py-4 w-full hover:bg-surface-secondary">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-semibold text-foreground">{criterion.name}</span>
                            <span className="text-[13px] text-muted">({criterion.weight}%)</span>
                          </div>
                          <div className="mt-2 w-full">
                            <ProgressBar value={criterion.weight} min={0} max={100} size="sm" color="accent" aria-label={`${criterion.name} weight`} className="w-full">
                              <ProgressBarTrack><ProgressBarFill /></ProgressBarTrack>
                            </ProgressBar>
                          </div>
                        </div>
                        <AccordionIndicator>
                          <ChevronDown className="w-4 h-4 text-muted" strokeWidth={2} aria-hidden="true" />
                        </AccordionIndicator>
                      </AccordionTrigger>
                    </AccordionHeading>
                    <AccordionPanel>
                      <AccordionBody className="px-6 pb-5 pt-0">
                        <div className="mb-4">
                          <p className="text-[12px] font-semibold text-muted uppercase tracking-widest mb-1">Feedback</p>
                          <p className="text-[14px] text-muted leading-relaxed">{criterion.feedback}</p>
                        </div>
                        {criterion.improvements.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <TrendingUp className="w-3.5 h-3.5 text-info" strokeWidth={2} aria-hidden="true" />
                              <p className="text-[12px] font-semibold text-info uppercase tracking-widest">Areas for Improvement</p>
                            </div>
                            <ul className="flex flex-col gap-1.5">
                              {criterion.improvements.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-muted mt-1.5 text-[8px]" aria-hidden="true">●</span>
                                  <span className="text-[13px] text-muted leading-snug">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AccordionBody>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

          </div>
        </div>

        {/* ═══ STICKY BOTTOM ═══ */}
        <div className="sticky bottom-0 w-full z-40">
          <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-surface-secondary" aria-hidden="true" />
          <div className="bg-white border-t border-border px-8 lg:px-10 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" aria-hidden="true" />
                  <span className="text-[13px] text-muted">Your progress is saved automatically</span>
                </div>
                <p className="text-[11px] text-muted/60">AI will check your work. Your instructor decides the grade.</p>
              </div>
              <div className="flex items-center gap-3">
                {!allFixed && readiness !== 'ready' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg text-muted"
                    onPress={() => { setShowConsent(true); setConsentStep(1); setCtaReady(false) }}
                  >
                    Submit as is
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-lg px-6 font-semibold"
                  isDisabled={!allFixed && readiness !== 'ready' && fixedIssues.size === 0}
                  onPress={() => navigate('/status')}
                >
                  {allFixed || readiness === 'ready' ? 'Submit' : 'Submit for review'}
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ═══ CONSENT MODAL ═══ */}
      {showConsent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowConsent(false)}
            aria-hidden="true"
          />
          {/* Dialog */}
          <Card className="relative z-10 max-w-lg w-full mx-4 rounded-2xl border border-border p-0 gap-0 max-h-[85vh] overflow-y-auto">
            <CardContent className="p-6 lg:p-8 gap-0">

              {consentStep === 1 && (
                <>
                  <h2 className="text-[20px] font-bold text-foreground">Before you submit</h2>
                  <p className="text-[14px] text-muted mt-2 leading-relaxed">
                    Some parts of your submission may affect how your work is evaluated.
                  </p>

                  <div className="mt-5 p-4 rounded-xl bg-surface-secondary flex items-center gap-3">
                    <Info className="w-5 h-5 text-info shrink-0" aria-hidden="true" />
                    <p className="text-[14px] font-medium text-foreground">
                      {issues.filter(i => !fixedIssues.has(i.id)).length} areas may be impacted
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-3">
                    <Button variant="ghost" size="sm" className="rounded-lg" onPress={() => setShowConsent(false)}>
                      Go back
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-lg px-5 font-semibold"
                      isDisabled={!ctaReady}
                      onPress={() => setConsentStep(2)}
                    >
                      Review impact →
                    </Button>
                  </div>
                </>
              )}

              {consentStep === 2 && (
                <>
                  <h2 className="text-[20px] font-bold text-foreground">What this means for your evaluation</h2>

                  <div className="mt-5 flex flex-col gap-3">
                    {IMPACT_MAP.map((impact, i) => (
                      <div key={i} className="p-4 rounded-xl border border-border bg-white">
                        <div className="flex items-center justify-between">
                          <p className="text-[14px] font-semibold text-foreground">{impact.criterion}</p>
                          <span className="text-[12px] font-medium text-muted">{impact.weight}</span>
                        </div>
                        <p className="text-[13px] text-muted mt-1">{impact.issue}</p>
                        <p className="text-[13px] text-foreground mt-2 leading-relaxed bg-surface-secondary p-3 rounded-lg">
                          "{impact.consequence}"
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-3">
                    <Button variant="ghost" size="sm" className="rounded-lg" onPress={() => { setShowConsent(false) }}>
                      Go back and fix
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-lg px-5 font-semibold"
                      onPress={() => setConsentStep(3)}
                    >
                      I understand, continue
                    </Button>
                  </div>
                </>
              )}

              {consentStep === 3 && (
                <>
                  <h2 className="text-[20px] font-bold text-foreground">You're submitting with these considerations</h2>

                  <div className="mt-5 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground" aria-hidden="true" />
                      <p className="text-[14px] text-foreground">{IMPACT_MAP.length} criteria may be impacted</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground" aria-hidden="true" />
                      <p className="text-[14px] text-foreground">Up to {IMPACT_MAP.reduce((sum, i) => sum + parseInt(i.weight), 0)}% of your evaluation may be affected</p>
                    </div>
                  </div>

                  <p className="text-[14px] text-muted mt-5 leading-relaxed">
                    You understand that some parts of your work may not be evaluated fully.
                  </p>

                  <p className="text-[12px] text-muted/60 mt-3">
                    Your decision will be recorded with this submission.
                  </p>

                  <div className="mt-6 flex items-center justify-end gap-3">
                    <Button variant="ghost" size="sm" className="rounded-lg" onPress={() => setConsentStep(2)}>
                      Review once more
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-lg px-5 font-semibold"
                      onPress={() => {
                        setShowConsent(false)
                        navigate('/consent/reconsideration', { state: { warnings: issues, deadline } })
                      }}
                    >
                      Submit now
                    </Button>
                  </div>
                </>
              )}

            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
