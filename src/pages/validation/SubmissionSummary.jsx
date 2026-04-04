/**
 * SubmissionSummary
 *
 * Post-validation summary screen. Shows what was submitted and, if optional
 * items are missing, asks for consent before proceeding.
 *
 * Route: /result/summary
 *
 * Scenario A (all complete):  Green banner + item list + "Submit to instructor"
 * Scenario B (optional missing): Amber banner + consent checkbox + CTAs
 */

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Card, CardContent } from '@heroui/react'
import {
  CheckCircle2, AlertTriangle, ArrowLeft,
  FileText, Table2, Monitor, Camera, Link2, LinkIcon,
} from 'lucide-react'
import InnerPageBar from '../../components/ui/InnerPageBar'
import { mockAssignment } from '../../data/mock-assignment'

// ─── Icon + color config per artifact type ────────────────────────────────────
const TYPE_ICON_CONFIG = {
  pdf:         { Icon: FileText, iconBg: 'bg-accent-soft',  iconColor: 'text-accent'  },
  docx:        { Icon: FileText, iconBg: 'bg-accent-soft',  iconColor: 'text-accent'  },
  xlsx:        { Icon: Table2,   iconBg: 'bg-teal-soft',    iconColor: 'text-teal'    },
  pptx:        { Icon: Monitor,  iconBg: 'bg-pink-soft',    iconColor: 'text-pink'    },
  image:       { Icon: Camera,   iconBg: 'bg-purple-soft',  iconColor: 'text-purple'  },
  handwritten: { Icon: Camera,   iconBg: 'bg-purple-soft',  iconColor: 'text-purple'  },
}

const LINK_ICON_CONFIG = { Icon: Link2, iconBg: 'bg-teal-soft', iconColor: 'text-teal' }

// ─── SubmissionSummary ───────────────────────────────────────────────────────
export default function SubmissionSummary() {
  const navigate = useNavigate()
  const { state: routeState } = useLocation()

  const artifactData = routeState?.artifactData ?? {}
  const linkStatuses = routeState?.linkStatuses ?? {}

  const { deadline, requiredArtifacts, requiredLinks, optionalLinks } = mockAssignment

  const [consentChecked, setConsentChecked] = useState(false)

  // ── Derive submitted vs missing items ──────────────────────────────────
  const allArtifacts = requiredArtifacts
  const allLinks = [...requiredLinks, ...optionalLinks]

  const submittedItems = []
  const missingOptionalItems = []

  const hasRouteState = Object.keys(artifactData).length > 0

  // Artifacts
  allArtifacts.forEach(artifact => {
    const slot = artifactData[artifact.id]
    const isConfirmed = hasRouteState ? slot?.state === 'confirmed' : artifact.required
    const config = TYPE_ICON_CONFIG[artifact.type] ?? TYPE_ICON_CONFIG.pdf
    const item = {
      id: artifact.id,
      name: slot?.fileName ?? artifact.name,
      detail: slot?.fileSize ? `${artifact.type.toUpperCase()} · ${slot.fileSize}` : artifact.type.toUpperCase(),
      ...config,
      required: artifact.required,
    }
    if (isConfirmed) {
      submittedItems.push(item)
    } else if (!artifact.required) {
      missingOptionalItems.push({ ...item, reason: 'Not uploaded' })
    }
  })

  // Links
  allLinks.forEach(link => {
    const status = linkStatuses[link.id]
    const isSubmitted = hasRouteState ? (status === 'accessible' || status === 'acknowledged') : link.required
    const item = {
      id: link.id,
      name: link.name,
      detail: `${link.platform} link`,
      ...LINK_ICON_CONFIG,
      required: link.required,
    }
    if (isSubmitted) {
      submittedItems.push(item)
    } else if (!link.required) {
      missingOptionalItems.push({ ...item, reason: 'Not provided' })
    }
  })

  const hasWarnings = missingOptionalItems.length > 0
  const canSubmit = hasWarnings ? consentChecked : true

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      <InnerPageBar title="Review Submission" deadline={deadline} />

      <div className="min-h-screen bg-surface-secondary">
        <div className="px-8 lg:px-10 py-8 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-3xl mx-auto space-y-6"
          >

            {/* ── STATUS BANNER ──────────────────────────────────────────── */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <CardContent className="px-6 py-4 gap-0 flex items-center gap-3">
                {hasWarnings ? (
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" aria-hidden="true" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[15px] font-bold text-foreground">
                    {hasWarnings
                      ? 'A few optional items weren\'t included'
                      : 'Your submission looks good'
                    }
                  </span>
                  <span className="text-[13px] text-muted ml-2">
                    {hasWarnings
                      ? '— you can still submit'
                      : '— ready to send to your instructor'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* ── SUBMITTED ITEMS ────────────────────────────────────────── */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-foreground">What you're submitting</h2>
                <span className="text-[13px] text-muted">{submittedItems.length} items</span>
              </div>
              {submittedItems.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 px-6 py-3.5 ${
                    i < submittedItems.length - 1 || hasWarnings ? 'border-b border-border' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`} aria-hidden="true">
                    <item.Icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-[12px] text-muted">{item.detail}</p>
                  </div>
                  <span className="text-[12px] font-medium text-success flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Ready
                  </span>
                </div>
              ))}

              {/* Missing optional items */}
              {hasWarnings && (
                <>
                  <div className="px-6 py-3 bg-surface-secondary">
                    <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">
                      Not included (optional)
                    </p>
                  </div>
                  {missingOptionalItems.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 px-6 py-3.5 ${
                        i < missingOptionalItems.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-surface-secondary`} aria-hidden="true">
                        <item.Icon className="w-5 h-5 text-muted" strokeWidth={1.75} aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-muted truncate">{item.name}</p>
                        <p className="text-[12px] text-muted/60">{item.reason}</p>
                      </div>
                      <span className="text-[12px] font-medium text-warning flex items-center gap-1 shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                        Skipped
                      </span>
                    </div>
                  ))}
                </>
              )}
            </Card>

            {/* ── CONSENT SECTION (warnings only) ───────────────────────── */}
            {hasWarnings && (
              <Card className="rounded-xl border border-warning p-0 gap-0">
                <CardContent className="p-6 gap-0">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-[14px] font-semibold text-foreground">
                        Submitting without optional items
                      </p>
                      <p className="text-[13px] text-muted mt-1 leading-relaxed">
                        Your instructor will evaluate your work based on what was submitted. Optional items that weren't included won't be considered in the evaluation.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={consentChecked}
                        onClick={() => setConsentChecked(!consentChecked)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          consentChecked
                            ? 'bg-accent border-accent'
                            : 'bg-white border-border hover:border-accent'
                        }`}
                      >
                        {consentChecked && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} aria-hidden="true" />
                        )}
                      </button>
                      <span
                        className="text-[13px] font-medium text-foreground select-none"
                        onClick={() => setConsentChecked(!consentChecked)}
                      >
                        I understand and want to submit without these items
                      </span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── AI STATEMENT ───────────────────────────────────────────── */}
            <p className="text-[12px] text-muted text-center">
              AI will process your work. Your instructor makes the final grade decision.
            </p>

          </motion.div>
        </div>

        {/* ── STICKY FOOTER ───────────────────────────────────────────── */}
        <div className="sticky bottom-0 w-full z-40">
          <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-surface-secondary" aria-hidden="true" />
          <div className="bg-white border-t border-border px-8 lg:px-10 py-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              {hasWarnings ? (
                <button
                  type="button"
                  onClick={() => navigate('/submit')}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  Go back and add them
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" aria-hidden="true" />
                  <span className="text-[13px] text-muted">All items verified</span>
                </div>
              )}

              <Button
                variant="primary"
                size="sm"
                className="rounded-lg px-6 font-semibold"
                isDisabled={!canSubmit}
                onPress={() => navigate('/consent/reconsideration', {
                  state: { deadline, artifactData, linkStatuses },
                })}
              >
                Submit to instructor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
