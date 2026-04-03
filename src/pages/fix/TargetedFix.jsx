// Screen 5.1 — Targeted Fix Path
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, Chip } from '@heroui/react'
import {
  AlertTriangle, CheckCircle2, Upload, Clock,
  FileText, Table2, Link2, Monitor, Camera,
} from 'lucide-react'
import InnerPageBar from '../../components/ui/InnerPageBar'
import { mockAssignment } from '../../data/mock-assignment'

/* ── Mock data ── */

const FALLBACK_ISSUE = {
  id: 'i1',
  type: 'warning',
  title: 'No supporting document found',
  description:
    'Your analysis lacks supporting evidence documents. This may result in 0 marks for the Research Evidence criterion.',
  file: 'Business Case PDF',
  page: null,
  impact: '+15 marks',
  recommendation:
    'Upload a supporting evidence document that references your key claims.',
  fixAction: 'Upload supporting evidence',
}

const SUBMISSION_ITEMS = [
  { name: 'Business Case Analysis.pdf', detail: 'PDF \u00b7 2.4 MB', Icon: FileText, iconBg: 'bg-accent-soft', iconColor: 'text-accent', validated: true },
  { name: 'Financial Model.xlsx', detail: 'XLSX \u00b7 840 KB', Icon: Table2, iconBg: 'bg-teal-soft', iconColor: 'text-teal', validated: true },
  { name: 'Supporting Document', detail: 'Google Drive link', Icon: Link2, iconBg: 'bg-teal-soft', iconColor: 'text-teal', validated: false },
  { name: 'Presentation Deck.pptx', detail: 'PPTX \u00b7 4.1 MB', Icon: Monitor, iconBg: 'bg-pink-soft', iconColor: 'text-pink', validated: true },
  { name: 'Handwritten Response.jpg', detail: 'JPG \u00b7 1.2 MB', Icon: Camera, iconBg: 'bg-purple-soft', iconColor: 'text-purple', validated: true },
]

const FIX_GUIDES = {
  'Upload supporting evidence': {
    why: 'Your instructor cannot evaluate research evidence without supporting documents.',
    impact: 'The Research Evidence criterion may score zero.',
    steps: [
      'Prepare your supporting evidence document (PDF, DOCX, or image)',
      'Upload it using the button below',
      'We\u2019ll re-check only this item',
    ],
    fixType: 'upload',
  },
  'Add more references': {
    why: 'The rubric requires evidence-based analysis with properly cited external sources.',
    impact: 'The references section is incomplete and may affect your Clarity & Attention to Detail score.',
    steps: [
      'Open your Business Case PDF',
      'Add at least 5 more academic or industry references',
      'Re-upload the updated PDF below',
    ],
    fixType: 'upload',
  },
}

const DEFAULT_GUIDE = {
  why: 'This issue may affect your submission evaluation.',
  impact: 'Addressing this will improve your submission quality.',
  steps: [
    'Review the issue details above',
    'Make the necessary changes',
    'Upload or update below',
  ],
  fixType: 'upload',
}

/* ── Component ── */

export default function TargetedFix() {
  const navigate = useNavigate()
  const { state: routeState } = useLocation()

  const warning = routeState?.warning ?? FALLBACK_ISSUE
  const warnings = routeState?.warnings ?? [FALLBACK_ISSUE]
  const deadline = routeState?.deadline ?? mockAssignment.deadline

  const guide = FIX_GUIDES[warning.fixAction] ?? DEFAULT_GUIDE

  const [isFixed, setIsFixed] = useState(false)

  return (
    <>
      <InnerPageBar
        title="Fix Issue"
        deadline={deadline}
        breadcrumbItems={[
          { label: 'Assignments', href: '/' },
          { label: 'Review & Analyse', href: '/result/analysis' },
          { label: 'Fix Issue' },
        ]}
      />

      <div className="min-h-screen bg-surface-secondary">
        <div className="px-8 lg:px-10 py-8">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* 1. STATUS BANNER */}
            <div className="rounded-xl p-5 flex items-start gap-4 bg-warning-soft border border-warning">
              <AlertTriangle className="w-6 h-6 text-warning shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-[16px] font-bold text-foreground">
                  Your submission needs a few fixes
                </p>
                <p className="text-[13px] text-muted mt-1">
                  You can fix these and resubmit — your progress is safe.
                </p>
              </div>
              <Chip variant="soft" color="warning" size="sm">
                {warnings.length} issue{warnings.length !== 1 ? 's' : ''} to fix
              </Chip>
            </div>

            {/* 2. FIX CARD — primary focus */}
            <Card className="rounded-xl border-2 border-warning p-0 gap-0">
              <div className="px-6 py-3 bg-warning-soft border-b border-warning">
                <p className="text-[11px] font-bold text-warning uppercase tracking-widest">
                  Fix this to continue
                </p>
              </div>
              <CardContent className="p-6 gap-0">
                {/* Issue title */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning-soft flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-warning" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[18px] font-bold text-foreground">{warning.title}</p>
                    <p className="text-[13px] text-muted mt-1">{warning.description}</p>
                  </div>
                </div>

                {/* Why + Impact */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-surface-secondary">
                    <p className="text-[12px] font-semibold text-foreground mb-1">Why it matters</p>
                    <p className="text-[13px] text-muted leading-relaxed">{guide.why}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-secondary">
                    <p className="text-[12px] font-semibold text-foreground mb-1">Impact if not fixed</p>
                    <p className="text-[13px] text-muted leading-relaxed">{guide.impact}</p>
                  </div>
                </div>

                {/* How to fix — numbered steps */}
                <div className="mt-5">
                  <p className="text-[12px] font-bold text-foreground uppercase tracking-widest mb-3">
                    How to fix
                  </p>
                  <div className="flex flex-col gap-2">
                    {guide.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-accent-soft flex items-center justify-center shrink-0 text-[11px] font-bold text-accent">
                          {i + 1}
                        </span>
                        <p className="text-[14px] text-muted leading-snug pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inline fix interaction */}
                <div className="mt-5">
                  {!isFixed ? (
                    <div
                      className="rounded-xl border-2 border-dashed border-border bg-surface-secondary p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-accent transition-colors"
                      onClick={() => setIsFixed(true)}
                      role="button"
                      tabIndex={0}
                    >
                      <Upload className="w-8 h-8 text-muted" strokeWidth={1.5} aria-hidden="true" />
                      <p className="text-[14px] font-semibold text-foreground">
                        Drop your file here or click to upload
                      </p>
                      <p className="text-[12px] text-muted">PDF, DOCX, or image files accepted</p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl border border-success bg-success-soft p-5 flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-6 h-6 text-success shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-[14px] font-bold text-success">Fixed — ready to resubmit</p>
                        <p className="text-[12px] text-muted mt-0.5">Your updated file has been received.</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Estimated fix time */}
                <div className="mt-4 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
                  <span className="text-[11px] text-muted">Estimated fix time: ~30 seconds</span>
                </div>
              </CardContent>
            </Card>

            {/* 3. PRESERVED STATE */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-[15px] font-bold text-foreground">Your submission so far</h2>
                <p className="text-[12px] text-muted mt-0.5">
                  Previously uploaded work is intact and validated.
                </p>
              </div>
              {SUBMISSION_ITEMS.map((item, i) => {
                const needsFix = !item.validated
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 px-6 py-3 ${
                      i < SUBMISSION_ITEMS.length - 1 ? 'border-b border-border' : ''
                    } ${needsFix ? 'bg-warning-soft' : ''}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`}
                      aria-hidden="true"
                    >
                      <item.Icon className={`w-4 h-4 ${item.iconColor}`} strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-foreground">{item.name}</p>
                      <p className="text-[11px] text-muted">{item.detail}</p>
                    </div>
                    {needsFix ? (
                      <Chip variant="soft" color="warning" size="sm">Needs fix</Chip>
                    ) : (
                      <span className="text-[12px] font-medium text-success flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Already validated
                      </span>
                    )}
                  </div>
                )
              })}
            </Card>

          </div>
        </div>

        {/* STICKY BOTTOM */}
        <div className="sticky bottom-0 w-full z-40">
          <div
            className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-surface-secondary"
            aria-hidden="true"
          />
          <div className="bg-white border-t border-border px-8 lg:px-10 py-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" aria-hidden="true" />
                  <span className="text-[13px] text-muted">Your progress is saved automatically</span>
                </div>
                <p className="text-[11px] text-muted/60">
                  AI will check your work. Your instructor decides the grade.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg text-muted"
                  onPress={() => navigate('/consent', { state: { warnings, deadline } })}
                >
                  Skip — submit anyway
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-lg px-6 font-semibold"
                  isDisabled={!isFixed}
                  onPress={() =>
                    navigate('/fix/validating', {
                      state: { isResubmission: true, warnings, deadline },
                    })
                  }
                >
                  Resubmit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
