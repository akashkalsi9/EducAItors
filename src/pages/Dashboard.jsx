// Dashboard — Academic overview + current assignment card
// Route: /

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, Chip } from '@heroui/react'
import {
  Clock, BookOpen, ArrowRight, ExternalLink,
  FileText, Award, MessageSquare, Calendar,
} from 'lucide-react'
import InnerPageBar from '../components/ui/InnerPageBar'
import { mockAssignment } from '../data/mock-assignment'
import { mockStudent, mockCourse, mockGrades, mockActivity, mockQuickLinks } from '../data/mock-dashboard'
import { useCountdown } from '../hooks/useCountdown'

// ─── Grade band colors ──────────────────────────────────────────────────────
const GRADE_COLOR = {
  graded:  'text-success',
  pending: 'text-muted',
}

const ACTIVITY_ICON = {
  announcement: MessageSquare,
  content:      BookOpen,
  grade:        Award,
  deadline:     Clock,
}

// ─── Status chip config ─────────────────────────────────────────────────────
const STATUS_CHIP = {
  'not-started':         { color: 'default', variant: 'secondary', label: 'Not started'         },
  'in-progress':         { color: 'warning', variant: 'soft',      label: 'In progress'         },
  'submitted':           { color: 'success', variant: 'soft',      label: 'Submitted'           },
  'resubmission-needed': { color: 'danger',  variant: 'soft',      label: 'Resubmission needed' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { title, deadline, submissionStatus, instructorName } = mockAssignment
  const { days, hours, minutes, totalHours, expired } = useCountdown(deadline)

  const countdownColorClass = (expired || totalHours < 2)
    ? 'text-danger'
    : totalHours < 24 ? 'text-warning' : 'text-accent'

  const countdownLabel = expired ? 'Overdue'
    : days > 0 ? `${days}d ${hours}h left`
    : `${totalHours}h ${minutes}m left`

  const sc = STATUS_CHIP[submissionStatus] ?? STATUS_CHIP['not-started']
  const shortTitle = title.replace(/\s*—.*$/, '').trim()

  return (
    <>
      <InnerPageBar
        title="Dashboard"
        breadcrumbItems={[{ label: 'Dashboard' }]}
      />

      <div className="min-h-screen bg-surface-secondary px-8 lg:px-10 py-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ── TWO-COLUMN LAYOUT ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ══ LEFT COLUMN (2/3) ════════════════════════════════════ */}
            <div className="lg:col-span-2 space-y-6">

              {/* Current Assignment Card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="rounded-xl border border-border p-0 gap-0 hover:shadow-md transition-shadow">
                  <CardContent className="p-6 gap-0">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Current Assignment</p>
                      <Chip variant={sc.variant} color={sc.color} size="sm">{sc.label}</Chip>
                    </div>

                    <h2 className="text-[18px] font-bold text-foreground leading-snug">{title}</h2>
                    <p className="text-[13px] text-muted mt-1.5 leading-relaxed">
                      Analyse a real-world strategic challenge using Module 3 frameworks and recommend a course of action.
                    </p>

                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-4 h-4 ${countdownColorClass}`} strokeWidth={2} aria-hidden="true" />
                        <span className={`text-[13px] font-semibold ${countdownColorClass}`}>{countdownLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Chip variant="soft" color="accent" size="sm">Prof</Chip>
                        <span className="text-[13px] text-muted">{instructorName}</span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <Button
                        variant="primary"
                        size="sm"
                        className="rounded-lg px-5 gap-2 font-semibold"
                        onPress={() => navigate('/assignment')}
                      >
                        View assignment
                        <ArrowRight className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className="rounded-xl border border-border p-0 gap-0">
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-[15px] font-bold text-foreground">Recent Activity</h2>
                  </div>
                  {mockActivity.map((item, i) => {
                    const Icon = ACTIVITY_ICON[item.type] ?? MessageSquare
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 px-6 py-3.5 ${i < mockActivity.length - 1 ? 'border-b border-border' : ''}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
                        </div>
                        <p className="text-[13px] text-foreground flex-1">{item.text}</p>
                        <span className="text-[11px] text-muted shrink-0">{item.time}</span>
                      </div>
                    )
                  })}
                </Card>
              </motion.div>
            </div>

            {/* ══ RIGHT COLUMN (1/3) ═══════════════════════════════════ */}
            <div className="space-y-6">

              {/* Academic Overview */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <Card className="rounded-xl border border-border p-0 gap-0">
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-[15px] font-bold text-foreground">Academic Overview</h2>
                  </div>
                  <CardContent className="p-0 gap-0">
                    <div className="flex flex-col divide-y divide-border">
                      {[
                        { label: 'Course', value: mockCourse.name },
                        { label: 'Code', value: mockCourse.code },
                        { label: 'Semester', value: mockCourse.semester },
                        { label: 'Module', value: mockCourse.currentModule },
                        { label: 'Credits', value: String(mockCourse.credits) },
                        { label: 'Instructor', value: mockCourse.instructor },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between px-6 py-3">
                          <span className="text-[12px] text-muted">{row.label}</span>
                          <span className="text-[13px] font-medium text-foreground text-right">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Grade Summary */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className="rounded-xl border border-border p-0 gap-0">
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-[15px] font-bold text-foreground">Grade Summary</h2>
                  </div>
                  {mockGrades.map((grade, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-6 py-3.5 ${i < mockGrades.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{grade.module}</p>
                        <p className="text-[11px] text-muted">{grade.title}</p>
                      </div>
                      {grade.status === 'graded' ? (
                        <div className="text-right">
                          <p className="text-[15px] font-bold text-success">{grade.score}%</p>
                          <p className="text-[11px] text-muted">{grade.band}</p>
                        </div>
                      ) : (
                        <Chip variant="secondary" color="default" size="sm">Pending</Chip>
                      )}
                    </div>
                  ))}
                </Card>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
