/**
 * AnalysisDashboard — Review & Analyse
 *
 * Single-column validation results screen.
 * Sections: Status banner → Submission details → Issues → Rubric evaluation.
 * Replaces the old three-panel layout.
 */

import { useNavigate, useLocation } from 'react-router-dom'
import {
  Button, Card, CardContent, Chip,
  Accordion, AccordionItem, AccordionHeading, AccordionTrigger,
  AccordionPanel, AccordionBody, AccordionIndicator,
  ProgressBar, ProgressBarTrack, ProgressBarFill,
} from '@heroui/react'
import { AlertTriangle, CheckCircle2, XCircle, Layers, ChevronDown, TrendingUp, FileText, Table2, Link2, Monitor, Camera } from 'lucide-react'
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
    title: 'References section incomplete',
    description: 'The references section on page 8 contains only 3 citations. The rubric expects evidence-based analysis with properly cited external sources.',
    file: 'Business Case PDF',
    page: 8,
    impact: '+10 marks',
    recommendation: 'Add at least 5 more academic or industry references to support your strategic analysis. Ensure all claims in the body are backed by citations.',
    fixAction: 'Add more references',
  },
]

// ─── Mock submission items ────────────────────────────────────────────────────
const MOCK_SUBMISSION_ITEMS = [
  { name: 'Business Case Analysis.pdf', detail: 'PDF · 2.4 MB', Icon: FileText, iconBg: 'bg-accent-soft', iconColor: 'text-accent', status: 'ready' },
  { name: 'Financial Model.xlsx', detail: 'XLSX · 840 KB', Icon: Table2, iconBg: 'bg-teal-soft', iconColor: 'text-teal', status: 'ready' },
  { name: 'Supporting Document', detail: 'Google Drive link', Icon: Link2, iconBg: 'bg-teal-soft', iconColor: 'text-teal', status: 'warning' },
  { name: 'Presentation Deck.pptx', detail: 'PPTX · 4.1 MB', Icon: Monitor, iconBg: 'bg-pink-soft', iconColor: 'text-pink', status: 'ready' },
  { name: 'Handwritten Response.jpg', detail: 'JPG · 1.2 MB', Icon: Camera, iconBg: 'bg-purple-soft', iconColor: 'text-purple', status: 'ready' },
]

// ─── Mock rubric evaluation ───────────────────────────────────────────────────
const MOCK_RUBRIC_EVAL = [
  {
    criterionId: 'c1', name: 'Problem Framing & Analysis', weight: 20,
    feedback: 'Problem is clearly framed and well-evidenced. Frameworks are applied correctly and the root cause is identified with logical reasoning.',
    improvements: ['Include more supporting evidence from external sources', 'Strengthen the root cause analysis with quantitative data'],
  },
  {
    criterionId: 'c2', name: 'Strategic Framework Application', weight: 20,
    feedback: 'Two frameworks applied correctly with good supporting evidence. Insights are clearly linked to the recommendation.',
    improvements: ['Synthesise insights across frameworks for a more cohesive strategic picture', 'Add PESTEL analysis to complement existing frameworks'],
  },
  {
    criterionId: 'c3', name: 'Quality of Recommendation', weight: 20,
    feedback: 'Clear recommendation with sound rationale. Three alternatives evaluated with financial impact estimated.',
    improvements: ['Strengthen counter-argument anticipation', 'Add more explicit decision criteria for alternative comparison'],
  },
  {
    criterionId: 'c4', name: 'Financial Grounding', weight: 15,
    feedback: 'Financial model covers cost-benefit and 3-year projection. Assumptions are documented.',
    improvements: ['Add scenario analysis (base / optimistic / pessimistic)', 'Include sensitivity analysis on key assumptions'],
  },
  {
    criterionId: 'c5', name: 'Completeness', weight: 15,
    feedback: 'Most required sections present and adequately developed. Some supplementary content could add value.',
    improvements: ['Add appendices with supporting data tables', 'Include AI usage disclosure appendix'],
  },
  {
    criterionId: 'c6', name: 'Clarity & Attention to Detail', weight: 10,
    feedback: 'Writing is clear and well-organised. Referencing is mostly complete with minor formatting inconsistencies.',
    improvements: ['Standardise citation format throughout', 'Proofread for minor grammatical inconsistencies'],
  },
]

// ─── Banner config ────────────────────────────────────────────────────────────
const BANNER_CONFIG = {
  ready:   { bg: 'bg-success-soft', border: 'border-success', Icon: CheckCircle2, iconColor: 'text-success', headline: 'Your submission looks good', sub: 'All checks passed. You can submit with confidence.' },
  warning: { bg: 'bg-warning-soft', border: 'border-warning', Icon: AlertTriangle, iconColor: 'text-warning', headline: 'You can submit, but there are risks' },
  blocker: { bg: 'bg-danger-soft',  border: 'border-danger',  Icon: XCircle,       iconColor: 'text-danger',  headline: 'Some issues need to be fixed', sub: 'These issues must be resolved before your work can be evaluated.' },
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

  const banner = BANNER_CONFIG[readiness] ?? BANNER_CONFIG.warning
  const bannerSub = banner.sub ?? `${issues.length} issue${issues.length !== 1 ? 's' : ''} may affect your marks. Review them carefully before submitting.`

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

            {/* ═══ 1. STATUS BANNER ═══ */}
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

            {/* ═══ 2. SUBMISSION DETAILS ═══ */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-foreground">Your submission</h2>
                <span className="text-[13px] text-muted">{MOCK_SUBMISSION_ITEMS.length} items</span>
              </div>

              {/* File rows */}
              {MOCK_SUBMISSION_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-6 py-3.5 ${i < MOCK_SUBMISSION_ITEMS.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`} aria-hidden="true">
                    <item.Icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-foreground">{item.name}</p>
                    <p className="text-[12px] text-muted">{item.detail}</p>
                  </div>
                  <Chip variant="soft" color={item.status === 'ready' ? 'success' : 'warning'} size="sm">
                    {item.status === 'ready' ? 'Ready' : 'Warning'}
                  </Chip>
                </div>
              ))}

              {/* Student metadata */}
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

            {/* ═══ 3. ISSUES (conditional) ═══ */}
            {issues.length > 0 && (
              <Card className="rounded-xl border border-border p-0 gap-0">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-[15px] font-bold text-foreground">Issues Requiring Attention</h2>
                  <span className="text-[13px] text-muted">{issues.length} issues</span>
                </div>
                {issues.map((issue, i) => (
                  <div key={issue.id} className={`px-6 py-5 ${i < issues.length - 1 ? 'border-b border-border' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        issue.type === 'blocker' ? 'bg-danger-soft' : 'bg-warning-soft'
                      }`}>
                        <AlertTriangle className={`w-4 h-4 ${issue.type === 'blocker' ? 'text-danger' : 'text-warning'}`} aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[14px] font-semibold text-foreground">{issue.title}</p>
                          <Chip variant="soft" color={issue.type === 'blocker' ? 'danger' : 'warning'} size="sm">
                            {issue.type === 'blocker' ? 'Blocker' : 'Warning'}
                          </Chip>
                        </div>
                        <p className="text-[13px] text-muted mt-1 leading-relaxed">{issue.description}</p>
                        <div className="mt-3 flex items-center gap-4 text-[12px] text-muted">
                          <span>File: {issue.file}</span>
                          {issue.page && <span>Page {issue.page}</span>}
                          <span className="font-semibold text-success">{issue.impact}</span>
                        </div>
                        <div className="mt-3 p-3 rounded-lg bg-surface-secondary">
                          <p className="text-[12px] font-semibold text-foreground">Recommendation</p>
                          <p className="text-[12px] text-muted mt-1 leading-relaxed">{issue.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            )}

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
                  onPress={() => readiness === 'ready' ? navigate('/status') : navigate('/fix', { state: { warning: issues[0], warnings: issues, deadline } })}
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
