// Screen 1.1 — Assignment Entry (web-first, HeroUI-compliant)
// Route: /

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Button,
  Card, CardContent,
  Chip,
  Avatar, AvatarFallback,
  Tabs, Tab, TabList, TabListContainer, TabPanel, TabIndicator, TabSeparator,
  ProgressBar, ProgressBarTrack, ProgressBarFill,
} from '@heroui/react'
import {
  Clock, Calendar, Info, Download,
  FileText, Table2, Monitor, Camera,
  Link2, Pen, HardDrive, GitBranch,
} from 'lucide-react'
import OrientationPanel from '../components/OrientationPanel'
import PageBreadcrumb from '../components/ui/PageBreadcrumb'
import { mockAssignment } from '../data/mock-assignment'
import { useCountdown } from '../hooks/useCountdown'

// ─── File type config ─────────────────────────────────────────────────────────
const FILE_TYPE = {
  pdf:         { Icon: FileText, bg: 'bg-accent-soft',  color: 'text-accent',   label: 'PDF · Max 50MB'       },
  xlsx:        { Icon: Table2,   bg: 'bg-teal-soft',    color: 'text-teal',     label: 'XLSX · Max 20MB'      },
  pptx:        { Icon: Monitor,  bg: 'bg-pink-soft',    color: 'text-pink',     label: 'PPTX · Max 100MB'     },
  docx:        { Icon: FileText, bg: 'bg-info-soft',    color: 'text-info',     label: 'DOCX · Max 20MB'      },
  handwritten: { Icon: Camera,   bg: 'bg-purple-soft',  color: 'text-purple',   label: 'JPG / PNG · Max 10MB' },
}

// ─── Link platform config ────────────────────────────────────────────────────
const LINK_PLATFORM = {
  'Figma':        { Icon: Pen,        bg: 'bg-pink-soft',   color: 'text-pink'   },
  'Google Drive': { Icon: HardDrive,  bg: 'bg-teal-soft',   color: 'text-teal'   },
  'GitHub':       { Icon: GitBranch,  bg: 'bg-purple-soft', color: 'text-purple' },
  'Generic':      { Icon: Link2,      bg: 'bg-info-soft',   color: 'text-info'   },
}

// ─── Status chip config ───────────────────────────────────────────────────────
const STATUS_CHIP = {
  'not-started':         { color: 'default', variant: 'secondary', label: 'Not started'         },
  'in-progress':         { color: 'warning', variant: 'soft',      label: 'In progress'         },
  'submitted':           { color: 'success', variant: 'soft',      label: 'Submitted'           },
  'resubmission-needed': { color: 'danger',  variant: 'soft',      label: 'Resubmission needed' },
}

// ─── Instructor honorific prefixes ────────────────────────────────────────────
const PREFIXES = ['dr.', 'prof.', 'mr.', 'ms.', 'mrs.', 'sir']

export default function Dashboard() {
  const navigate = useNavigate()
  const [showOrientation, setShowOrientation] = useState(false)

  const {
    title, courseName, instructorName, deadline,
    submissionStatus, requiredArtifacts, requiredLinks, optionalLinks, rubric, brief,
  } = mockAssignment

  const { days, hours, minutes, totalHours, expired } = useCountdown(deadline)

  // Instructor initial — skip honorific
  const instructorInitial = instructorName
    .split(' ')
    .find((w) => !PREFIXES.includes(w.toLowerCase()))
    ?.charAt(0).toUpperCase() ?? instructorName.charAt(0)

  // Deadline countdown color class
  const countdownColorClass = (expired || totalHours < 2)
    ? 'text-danger'
    : totalHours < 24
    ? 'text-warning'
    : 'text-accent'

  // Deadline card top border
  const deadlineTopBorder = (expired || totalHours < 2)
    ? 'border-t-4 border-danger'
    : totalHours < 24
    ? 'border-t-4 border-warning'
    : 'border-t-4 border-accent'

  const countdownLabel = expired ? 'Overdue'
    : days > 0  ? `${days}d ${hours}h`
    :              `${totalHours}h ${minutes}m`

  const deadlineTime = new Date(deadline).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })

  const formattedDeadlineFull = new Date(deadline).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })

  const requiredCount  = requiredArtifacts.filter((a) =>  a.required).length
  const optionalCount  = requiredArtifacts.filter((a) => !a.required).length

  // Breadcrumb: shorten title to first segment
  const shortTitle = title.replace(/\s*—.*$/, '').trim()

  // Status chip config
  const sc = STATUS_CHIP[submissionStatus] ?? STATUS_CHIP['not-started']

  // Deadline urgency pill classes (meta row)
  const urgentPillClass = (expired || totalHours < 2)
    ? 'bg-danger-soft text-danger'
    : 'bg-warning-soft text-warning'

  return (
    <>
      {/* ── Full-width breadcrumb bar ──────────────────────────────────────── */}
      <div className="bg-white border-b border-border px-8 lg:px-10 py-4 flex items-center justify-between">
        <PageBreadcrumb
          items={[
            { label: 'Assignments', href: '/' },
            { label: shortTitle },
          ]}
        />
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-2 rounded-lg"
          onPress={() => {}}
          aria-label="Download assignment brief PDF"
        >
          <Download className="w-3.5 h-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          Download brief
        </Button>
      </div>

      {/* ── Page canvas ───────────────────────────────────────────────────── */}
      <div className="min-h-screen bg-surface-secondary px-8 lg:px-10 py-8">

        {/* Page header — hero card */}
        <Card className="rounded-xl border border-border p-0 gap-0 mb-6">
          <CardContent className="p-6 lg:p-8 gap-0">
          <h1 className="text-[28px] font-extrabold text-foreground tracking-tight leading-tight border-l-4 border-l-accent pl-4">
            {title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">

            {/* Instructor */}
            <div className="flex items-center gap-2">
              <Avatar size="sm" variant="soft" color="accent">
                <AvatarFallback className="text-xs font-bold">{instructorInitial}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-muted">{instructorName}</span>
            </div>

            <span className="text-border" aria-hidden="true">·</span>

            {/* Status chip */}
            <Chip variant={sc.variant} color={sc.color} size="sm">{sc.label}</Chip>

            <span className="text-border" aria-hidden="true">·</span>

            {/* Deadline */}
            {(expired || totalHours < 24) ? (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-semibold ${urgentPillClass}`}>
                <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                {expired ? 'Overdue' : `Due Apr 3 · ${deadlineTime}`}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted">
                <Clock className="w-3.5 h-3.5 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
                Due Apr 3 · {deadlineTime}
              </span>
            )}

            {/* View history — returning submitters only */}
            {(submissionStatus === 'submitted' || submissionStatus === 'resubmission-needed') && (
              <>
                <span className="text-border" aria-hidden="true">·</span>
                <Button variant="ghost" size="sm" className="px-0 text-accent font-medium">
                  View submission history →
                </Button>
              </>
            )}

          </div>
          </CardContent>
        </Card>

        {/* ── Two-column layout ─────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ══ LEFT COLUMN ══════════════════════════════════════════════════ */}
          <div className="flex-1 min-w-0">

            <Card className="rounded-xl border border-border p-0 gap-0">
              <Tabs defaultSelectedKey="brief" className="w-full">
                <div className="px-6 pt-4 pb-2">
                  <TabListContainer>
                    <TabList aria-label="Assignment sections">
                      <Tab id="brief">
                        Assignment Brief
                        <TabIndicator />
                      </Tab>
                      <Tab id="submit">
                        <TabSeparator />
                        What to Submit
                        <TabIndicator />
                      </Tab>
                      <Tab id="rubric">
                        <TabSeparator />
                        Grading Rubric
                        <TabIndicator />
                      </Tab>
                    </TabList>
                  </TabListContainer>
                </div>

                {/* ── Tab 1: Assignment Brief ────────────────────────────── */}
                <TabPanel id="brief" className="p-0 mt-0">
                  <CardContent className="px-6 py-6 flex flex-col gap-6">

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted bg-surface-secondary rounded-full px-3 py-1 border border-border">
                        {courseName}
                      </span>
                    </div>

                    <p className="text-sm text-muted leading-relaxed">
                      {brief.overview}
                    </p>

                    <p className="text-sm text-muted leading-relaxed border-l-4 border-border pl-4">
                      {brief.context}
                    </p>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-3">
                        Learning Objectives
                      </p>
                      <ul className="flex flex-col gap-2">
                        {brief.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-purple-soft flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                              <span className="text-[10px] font-bold text-purple">{i + 1}</span>
                            </span>
                            <span className="text-sm text-muted leading-snug">{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-3">
                        Deliverables
                      </p>
                      <div className="flex flex-col gap-3">
                        {brief.deliverables.map((d, i) => (
                          <div key={i} className="border-l-2 border-accent pl-3">
                            <p className="text-sm font-semibold text-foreground">{d.label}</p>
                            <p className="text-xs text-muted mt-0.5 leading-snug">{d.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-l-4 border-warning bg-warning-soft rounded-xl p-4">
                      <p className="text-xs text-warning leading-relaxed">
                        <span className="font-semibold">Note: </span>
                        {brief.notes}
                      </p>
                    </div>

                  </CardContent>
                </TabPanel>

                {/* ── Tab 2: What to Submit ──────────────────────────────── */}
                <TabPanel id="submit" className="p-0 mt-0">

                  {/* Files section */}
                  <div className="px-6 py-3 border-b border-border">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
                      Files
                    </span>
                  </div>
                  {requiredArtifacts.map((artifact, i) => {
                    const cfg    = FILE_TYPE[artifact.type] ?? FILE_TYPE.docx
                    const isReq  = artifact.required
                    const isLast = i === requiredArtifacts.length - 1
                    return (
                      <div
                        key={artifact.id}
                        className={`flex items-center gap-4 px-6 py-3.5 hover:bg-surface-secondary transition-colors ${!isLast ? 'border-b border-border' : ''} ${!isReq ? 'opacity-60' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${cfg.bg}`} aria-hidden="true">
                          <cfg.Icon className={`w-5 h-5 ${cfg.color}`} strokeWidth={1.75} aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[15px] leading-snug truncate ${isReq ? 'font-semibold text-foreground' : 'font-normal text-muted'}`}>
                            {artifact.name}
                          </p>
                          <p className="text-xs text-muted mt-0.5">{cfg.label}</p>
                        </div>
                        {isReq
                          ? <Chip variant="soft" color="warning" size="sm">Required</Chip>
                          : <Chip variant="soft" color="default" size="sm">Optional</Chip>
                        }
                      </div>
                    )
                  })}

                  {/* External links section */}
                  <div className="px-6 py-3 border-y border-border">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
                      External Links
                    </span>
                  </div>
                  {[...requiredLinks, ...optionalLinks].map((link, i, arr) => {
                    const cfg    = LINK_PLATFORM[link.platform] ?? LINK_PLATFORM.Generic
                    const isLast = i === arr.length - 1
                    return (
                      <div
                        key={link.id}
                        className={`flex items-center gap-4 px-6 py-3.5 hover:bg-surface-secondary transition-colors ${!isLast ? 'border-b border-border' : ''} ${!link.required ? 'opacity-60' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${cfg.bg}`} aria-hidden="true">
                          <cfg.Icon className={`w-5 h-5 ${cfg.color}`} strokeWidth={1.75} aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[15px] leading-snug truncate ${link.required ? 'font-semibold text-foreground' : 'font-normal text-muted'}`}>
                            {link.name}
                          </p>
                          <p className="text-xs text-muted mt-0.5">{link.platform}</p>
                        </div>
                        {link.required
                          ? <Chip variant="soft" color="warning" size="sm">Required</Chip>
                          : <Chip variant="soft" color="default" size="sm">Optional</Chip>
                        }
                      </div>
                    )
                  })}

                </TabPanel>

                {/* ── Tab 3: Grading Rubric ──────────────────────────────── */}
                <TabPanel id="rubric" className="p-0 mt-0">
                  {rubric.map((criterion, index) => (
                    <div
                      key={criterion.id}
                      className={`px-6 py-5 ${index < rubric.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-foreground">{criterion.name}</span>
                        <span className="text-sm font-bold text-accent">{criterion.weight}%</span>
                      </div>
                      <ProgressBar
                        value={criterion.weight}
                        min={0}
                        max={100}
                        size="sm"
                        color="accent"
                        aria-label={criterion.name}
                        className="w-full mb-4"
                      >
                        <ProgressBarTrack>
                          <ProgressBarFill />
                        </ProgressBarTrack>
                      </ProgressBar>
                      <div className="flex flex-col gap-1.5">
                        {criterion.levels.map((lvl) => (
                          <div key={lvl.score} className="flex items-start gap-3">
                            <span className="shrink-0 w-6 h-5 flex items-center justify-center rounded bg-surface-secondary text-[11px] font-bold text-muted mt-0.5">
                              {lvl.score}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-semibold text-foreground">{lvl.label} — </span>
                              <span className="text-xs text-muted">{lvl.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabPanel>

              </Tabs>
            </Card>

          </div>

          {/* ══ RIGHT COLUMN — responsive, sticky on large screens ═══════════ */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 lg:sticky lg:top-24">

            {/* Deadline + CTA combined card */}
            <Card className={`rounded-xl border border-border p-0 gap-0 ${deadlineTopBorder}`}>
              <CardContent className="p-5 gap-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
                  Submission Deadline
                </p>
                <div className="mt-2 mb-1">
                  <span className={`text-4xl font-extrabold leading-none tracking-tight ${countdownColorClass}`}>
                    {countdownLabel}
                  </span>
                </div>
                <p className="text-sm text-muted">remaining</p>
                <div className="h-px bg-border my-4" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <div>
                    <span className="text-xs font-medium text-muted">Due </span>
                    <span className="text-sm font-semibold text-foreground">{formattedDeadlineFull}</span>
                  </div>
                </div>
                <div className="h-px bg-border my-4" />
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    className="rounded-xl"
                    onPress={() => navigate('/submit/upload')}
                  >
                    Start submission
                  </Button>
                </motion.div>
                <p className="text-xs text-muted text-center mt-3">
                  Your work is saved between sessions.
                </p>
              </CardContent>
            </Card>

            {/* First-timer card */}
            {submissionStatus === 'not-started' && (
              <Card className="rounded-xl border border-border border-l-4 border-l-info p-0">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-info shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" />
                    <div>
                      <p className="text-sm font-bold text-foreground">First time submitting?</p>
                      <p className="text-xs text-muted mt-1 leading-snug">
                        Learn how AI validation works before you start.
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 px-0 text-info font-semibold"
                        onPress={() => setShowOrientation(true)}
                      >
                        Take the walkthrough →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>

      {/* ── Orientation modal ──────────────────────────────────────────────── */}
      {showOrientation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowOrientation(false)}
            aria-hidden="true"
          />
          {/* Dialog */}
          <Card className="relative z-10 max-w-2xl w-full mx-4 rounded-2xl border border-border p-0 gap-0 max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
              <h2 className="text-lg font-bold text-foreground">Getting Started</h2>
              <button
                type="button"
                onClick={() => setShowOrientation(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:bg-surface-secondary hover:text-foreground transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <CardContent className="p-0 gap-0 overflow-y-auto bg-surface-secondary">
              <OrientationPanel
                onDismiss={() => setShowOrientation(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
