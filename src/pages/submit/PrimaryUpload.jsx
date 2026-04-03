// Screen 2.1 — Primary File Upload
// Route: /submit/upload
// Persona: Arjun (4G, speed) + Sunita (low digital literacy) + Riya (anxious)
//
// One job: get the main file uploaded and confirmed.
// Nothing else is visible until that happens.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Button, Card, CardContent } from '@heroui/react'
import { Info } from 'lucide-react'
import PageShell from '../../components/PageShell'
import InnerPageBar from '../../components/ui/InnerPageBar'
import SubmissionStepper from '../../components/ui/SubmissionStepper'
import UploadZone from '../../components/ui/UploadZone'
import { mockAssignment } from '../../data/mock-assignment'

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PrimaryUpload() {
  const navigate = useNavigate()

  const { title, courseName, deadline } = mockAssignment

  // CTA state
  const [confirmedFile, setConfirmedFile] = useState(null)
  const [zoneState,     setZoneState]     = useState('empty')
  const isFileConfirmed = confirmedFile !== null

  // CTA unlock animation
  const ctaControls = useAnimation()

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleFileConfirmed(fileInfo) {
    setConfirmedFile(fileInfo)
    ctaControls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.4, ease: 'easeInOut' },
    })
  }

  function handleFileCleared() {
    setConfirmedFile(null)
  }

  function handleContinue() {
    if (!isFileConfirmed) return
    navigate('/submit/artifacts', {
      state: { primaryFile: confirmedFile },
    })
  }

  // ── Show info cards only in empty state ────────────────────────────────────
  const showInfoCards = zoneState === 'empty'

  return (
    <>
      <InnerPageBar title="Upload Files" deadline={deadline} />
      <PageShell noPadding>

      {/* ════════════════════════════════════════════════════════════════════
          SCROLLABLE AREA
          ════════════════════════════════════════════════════════════════════ */}
      <SubmissionStepper currentStep={1} />
      <div className="flex-1 bg-surface-secondary overflow-y-auto">
        <div className="px-8 lg:px-10 py-8">
        <div className="max-w-4xl mx-auto">

        {/* ── White content block ────────────────────────────────────────── */}
        <Card className="rounded-xl border border-border p-0">
          <CardContent className="px-6 lg:px-8 py-6 lg:py-8 p-0">

          {/* ── SECTION 2: Page header ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
            className="pb-0"
          >
            <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-tight">
              Upload your main file
            </h1>
            <p className="text-[14px] text-muted mt-1.5 leading-[1.5]">
              This is your primary assignment document. Supporting files come next.
            </p>
          </motion.div>

          {/* ── SECTION 3: Upload zone ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.25 }}
            className="pt-5"
          >
            <UploadZone
              onFileConfirmed={handleFileConfirmed}
              onFileCleared={handleFileCleared}
              onZoneChange={setZoneState}
            />
          </motion.div>

          </CardContent>
        </Card>
        {/* end white block */}

        {/* ── SECTION 4 + 5: Info cards — empty state only ──────────────── */}
        <AnimatePresence>
          {showInfoCards && (
            <motion.div
              key="info-cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-4 flex flex-col md:flex-row gap-4"
            >

              {/* SECTION 4 — Format guidance card */}
              <Card className="rounded-xl border border-border p-0 gap-0 flex-1 min-w-0">
                <CardContent className="px-5 py-3 gap-0">
                  <div className="flex items-center gap-5">

                    {/* Left: Accepted formats */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-foreground uppercase tracking-[0.05em]">
                        Accepted formats
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {['PDF', 'DOCX', 'JPG', 'PNG'].map((fmt) => (
                          <span
                            key={fmt}
                            className="rounded-full bg-surface-secondary border border-border px-[10px] py-1 text-[12px] font-medium text-muted"
                          >
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Vertical divider */}
                    <div className="w-px bg-border self-stretch shrink-0" />

                    {/* Right: Max size */}
                    <div className="shrink-0 flex flex-col justify-center">
                      <p className="text-[12px] font-semibold text-foreground uppercase tracking-[0.05em]">
                        Max size
                      </p>
                      <p className="text-[20px] font-bold text-accent mt-1 leading-none">
                        50MB
                      </p>
                      <p className="text-[12px] text-muted mt-0.5">
                        per file
                      </p>
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* SECTION 5 — What happens next card */}
              <Card className="rounded-xl border border-border p-0 gap-0 flex-1 min-w-0">
                <CardContent className="px-5 py-3 gap-0">
                  <div className="flex items-center gap-2">
                    <Info
                      className="w-4 h-4 text-info shrink-0"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <p className="text-[13px] font-semibold text-foreground">
                      What happens after upload?
                    </p>
                  </div>
                  <p className="text-[13px] text-muted mt-2 leading-[1.5]">
                    Your file is checked for readability. You'll see the result before anything is submitted.
                  </p>
                </CardContent>
              </Card>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
      </div>
      </div>
      {/* end scrollable area */}

      {/* ════════════════════════════════════════════════════════════════════
          STICKY BOTTOM CTA
          ════════════════════════════════════════════════════════════════════ */}
      <div className="sticky bottom-0 w-full z-40 relative shrink-0">

        {/* Gradient fade */}
        <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white" />

        <div className="bg-white border-t border-border px-8 lg:px-10 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">

          {/* Helper text — fades in after file confirmed */}
          <AnimatePresence>
            {isFileConfirmed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-[13px] text-muted"
              >
                Your file is saved. You can come back to this step if needed.
              </motion.p>
            )}
          </AnimatePresence>

          {/* CTA button */}
          <motion.div
            animate={ctaControls}
            whileTap={isFileConfirmed ? { scale: 0.97 } : {}}
            className="ml-auto"
          >
            <Button
              variant="primary"
              size="lg"
              isDisabled={!isFileConfirmed}
              className={`rounded-xl px-8 text-[15px] transition-all duration-300 ${
                isFileConfirmed ? 'font-bold' : 'font-semibold'
              }`}
              onPress={handleContinue}
              aria-label={isFileConfirmed
                ? 'Continue to artifacts upload'
                : 'Upload a file to continue'}
            >
              Continue to artifacts
            </Button>
          </motion.div>

          </div>
        </div>
      </div>

    </PageShell>
    </>
  )
}
