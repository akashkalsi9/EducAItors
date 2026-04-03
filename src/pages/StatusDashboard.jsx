import { useNavigate } from 'react-router-dom'
import { Button, Card, CardContent, Chip } from '@heroui/react'
import { CheckCircle2, FileText, Table2, Link2, Monitor, Camera, Download, Layers } from 'lucide-react'
import InnerPageBar from '../components/ui/InnerPageBar'
import { mockAssignment } from '../data/mock-assignment'

const SUBMITTED_ITEMS = [
  { name: 'Business Case Analysis.pdf', detail: 'PDF · 2.4 MB', Icon: FileText, iconBg: 'bg-accent-soft', iconColor: 'text-accent' },
  { name: 'Financial Model.xlsx', detail: 'XLSX · 840 KB', Icon: Table2, iconBg: 'bg-teal-soft', iconColor: 'text-teal' },
  { name: 'Supporting Document', detail: 'Google Drive link', Icon: Link2, iconBg: 'bg-teal-soft', iconColor: 'text-teal' },
  { name: 'Presentation Deck.pptx', detail: 'PPTX · 4.1 MB', Icon: Monitor, iconBg: 'bg-pink-soft', iconColor: 'text-pink' },
  { name: 'Handwritten Response.jpg', detail: 'JPG · 1.2 MB', Icon: Camera, iconBg: 'bg-purple-soft', iconColor: 'text-purple' },
]

const NEXT_STEPS = [
  'Your instructor will review your submission',
  'AI-assisted evaluation provides initial feedback',
  'Your instructor makes the final grade decision',
]

export default function StatusDashboard() {
  const navigate = useNavigate()
  const { title, courseName, deadline } = mockAssignment

  const submissionTime = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })

  const deadlineFormatted = new Date(deadline).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })

  return (
    <>
      <InnerPageBar
        title="Submission Confirmed"
        deadline={deadline}
        breadcrumbItems={[
          { label: 'Assignments', href: '/' },
          { label: 'Submission Confirmed' },
        ]}
      />

      <div className="min-h-screen bg-surface-secondary">
        <div className="px-8 lg:px-10 py-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* 1. SUCCESS BANNER */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <CardContent className="p-6 lg:p-8 gap-0 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-success-soft flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-success" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-[22px] font-bold text-foreground">Your submission is in</h1>
                  <p className="text-[14px] text-muted mt-1.5 leading-relaxed">
                    Your work has been submitted for evaluation. Your instructor will review it and provide feedback.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. WHAT WAS SUBMITTED */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-foreground">What was submitted</h2>
                <span className="text-[13px] text-muted">{SUBMITTED_ITEMS.length} items</span>
              </div>
              {SUBMITTED_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-6 py-3.5 ${i < SUBMITTED_ITEMS.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`} aria-hidden="true">
                    <item.Icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-foreground">{item.name}</p>
                    <p className="text-[12px] text-muted">{item.detail}</p>
                  </div>
                  <span className="text-[12px] font-medium text-success flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Submitted
                  </span>
                </div>
              ))}
            </Card>

            {/* 3. SUBMISSION DETAILS */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-[15px] font-bold text-foreground">Submission details</h2>
              </div>
              <CardContent className="p-0 gap-0">
                <div className="flex flex-col divide-y divide-border">
                  {[
                    { label: 'Submitted by', value: 'Riya Sharma · Student ID 2024MBA089' },
                    { label: 'Assignment', value: title },
                    { label: 'Course', value: courseName },
                    { label: 'Submitted at', value: submissionTime },
                    { label: 'Deadline', value: deadlineFormatted },
                    { label: 'Status', value: 'Submitted — awaiting evaluation', highlight: true },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-3.5">
                      <span className="text-[13px] text-muted">{row.label}</span>
                      <span className={`text-[13px] font-medium ${row.highlight ? 'text-success' : 'text-foreground'}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 4. WHAT HAPPENS NEXT */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-[15px] font-bold text-foreground">What happens next</h2>
              </div>
              <CardContent className="p-6 gap-0">
                <div className="flex flex-col gap-3">
                  {NEXT_STEPS.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent-soft flex items-center justify-center shrink-0 text-[11px] font-bold text-accent">{i + 1}</span>
                      <p className="text-[14px] text-muted leading-snug pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-[12px] text-purple text-center">
                    AI processes your work. Your instructor makes the final grade decision.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* STICKY BOTTOM CTA */}
        <div className="sticky bottom-0 w-full z-40">
          <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-surface-secondary" aria-hidden="true" />
          <div className="bg-white border-t border-border px-8 lg:px-10 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" aria-hidden="true" />
                <span className="text-[13px] text-success font-medium">Submission confirmed</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg gap-2"
                  onPress={() => {}}
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Download receipt
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-lg px-6 font-semibold"
                  onPress={() => navigate('/')}
                >
                  Return to dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
