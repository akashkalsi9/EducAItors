// Screen 2.2 — Supporting Artifact Upload
// Route: /submit/artifacts
// Persona: Sunita (needs to know what's required without reading) +
//          Arjun (wants to complete fast) + Riya (needs to know she hasn't missed anything)
//
// One job: collect required artifacts + optional ones.
// Visual weight gap between required and optional is the primary design decision.

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardContent } from '@heroui/react'
import PageShell from '../../components/PageShell'
import InnerPageBar from '../../components/ui/InnerPageBar'
import SubmissionStepper from '../../components/ui/SubmissionStepper'
import RequiredCounter from '../../components/ui/RequiredCounter'
import ArtifactSlot from '../../components/ui/ArtifactSlot'
import { mockAssignment } from '../../data/mock-assignment'
import { formatFileSize } from '../../utils/formatters'

// ─── File type validation ──────────────────────────────────────────────────────
const VALID_MIMES = {
  pdf:         ['application/pdf'],
  docx:        ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  xlsx:        ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  pptx:        ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  image:       ['image/jpeg', 'image/png'],
  handwritten: ['image/jpeg', 'image/png'],
}
const VALID_EXTS = {
  pdf:         ['.pdf'],
  docx:        ['.docx'],
  xlsx:        ['.xlsx'],
  pptx:        ['.pptx'],
  image:       ['.jpg', '.jpeg', '.png'],
  handwritten: ['.jpg', '.jpeg', '.png'],
}

// ─── Slot state initialiser ────────────────────────────────────────────────────
function initSlotData() {
  const map = {}
  mockAssignment.requiredArtifacts.forEach((a) => {
    map[a.id] = {
      state:        'empty',
      progress:     0,
      fileName:     null,
      fileSize:     null,
      errorMessage: null,
    }
  })
  return map
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ArtifactUpload() {
  const navigate  = useNavigate()
  const { state: routeState } = useLocation()
  const primaryFile = routeState?.primaryFile ?? null

  const { title, courseName, deadline } = mockAssignment

  // ── Slot state ─────────────────────────────────────────────────────────────
  const [slotData, setSlotData] = useState(initSlotData)

  function updateSlot(id, updates) {
    setSlotData((prev) => ({ ...prev, [id]: { ...prev[id], ...updates } }))
  }

  // ── Upload simulation ──────────────────────────────────────────────────────
  function handleFileSelect(artifact, file) {
    const ext        = '.' + file.name.split('.').pop().toLowerCase()
    const validMimes = VALID_MIMES[artifact.type] ?? []
    const validExts  = VALID_EXTS[artifact.type]  ?? []

    if (!validMimes.includes(file.type) && !validExts.includes(ext)) {
      updateSlot(artifact.id, {
        state:        'error',
        errorMessage: `Wrong file type. Please upload a ${artifact.type.toUpperCase()} file.`,
      })
      return
    }

    // Immediately set progress to 100 — framer-motion initial:'0%' drives the animation
    updateSlot(artifact.id, {
      state:    'uploading',
      progress: 100,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
    })

    // After 2.5 s (matching ProgressBar transition duration) → confirmed
    setTimeout(() => {
      updateSlot(artifact.id, { state: 'confirmed' })
    }, 2500)
  }

  function handleReplace(artifactId) {
    updateSlot(artifactId, {
      state:        'empty',
      progress:     0,
      fileName:     null,
      fileSize:     null,
      errorMessage: null,
    })
  }

  // ── Derived state ──────────────────────────────────────────────────────────
  const requiredArtifacts = mockAssignment.requiredArtifacts.filter((a) =>  a.required)
  const optionalArtifacts = mockAssignment.requiredArtifacts.filter((a) => !a.required)

  const requiredTotal     = requiredArtifacts.length
  const requiredCompleted = requiredArtifacts.filter(
    (a) => slotData[a.id]?.state === 'confirmed'
  ).length
  const allRequiredDone   = requiredCompleted === requiredTotal

  // ── Navigation ─────────────────────────────────────────────────────────────
  function handleContinue() {
    if (!allRequiredDone) return
    const ocrArtifact = mockAssignment.requiredArtifacts.find((a) => a.requiresOCR)
    if (ocrArtifact) {
      navigate('/submit/ocr-preview', {
        state: { primaryFile, artifactData: slotData, ocrTargetFile: ocrArtifact },
      })
    } else {
      navigate('/submit/links', {
        state: { primaryFile, artifactData: slotData },
      })
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <InnerPageBar title="Artifacts" deadline={deadline} />
      <PageShell noPadding>

      {/* ════════════════════════════════════════════════════════════════════
          SCROLLABLE AREA
          ════════════════════════════════════════════════════════════════════ */}
      <SubmissionStepper currentStep={2} />
      <div className="flex-1 bg-surface-secondary overflow-y-auto pb-20">
        <div className="px-8 lg:px-10 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

        {/* ── White block: header + required slots ───────────────────────── */}
        <Card className="rounded-xl border border-border p-0">
          <CardContent className="px-6 lg:px-8 py-6 lg:py-8 p-0">

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
            className="pb-0"
          >
            <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-tight">
              Add your supporting files
            </h1>
            <p className="text-[14px] text-muted mt-1.5 leading-[1.5]">
              These go alongside your main document.
            </p>

            <div className="mt-3">
              <RequiredCounter total={requiredTotal} completed={requiredCompleted} />
            </div>
          </motion.div>

          {/* Required slots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
            className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {requiredArtifacts.map((artifact) => {
              const slot = slotData[artifact.id]
              return (
                <ArtifactSlot
                  key={artifact.id}
                  artifact={artifact}
                  slotState={slot.state}
                  progress={slot.progress}
                  fileName={slot.fileName}
                  fileSize={slot.fileSize}
                  errorMessage={slot.errorMessage}
                  onFileSelect={(file) => handleFileSelect(artifact, file)}
                  onReplace={() => handleReplace(artifact.id)}
                />
              )
            })}
          </motion.div>

          {/* ── Optional section — inside the same card ─────────────────── */}
          {optionalArtifacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.35 }}
              className="mt-6"
            >
              {/* Divider with label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] font-semibold text-muted uppercase tracking-[0.06em] shrink-0">
                  Optional
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Optional slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optionalArtifacts.map((artifact) => {
                  const slot = slotData[artifact.id]
                  return (
                    <ArtifactSlot
                      key={artifact.id}
                      artifact={artifact}
                      slotState={slot.state}
                      progress={slot.progress}
                      fileName={slot.fileName}
                      fileSize={slot.fileSize}
                      errorMessage={slot.errorMessage}
                      onFileSelect={(file) => handleFileSelect(artifact, file)}
                      onReplace={() => handleReplace(artifact.id)}
                    />
                  )
                })}
              </div>
            </motion.div>
          )}

          </CardContent>
        </Card>
        {/* end white block */}

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

          {/* Helper text */}
          <AnimatePresence>
            {allRequiredDone && (
              <motion.p
                key="helper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-[13px] text-muted"
              >
                All required files added. You're good to go.
              </motion.p>
            )}
          </AnimatePresence>

          {/* CTA button */}
          <Button
            variant="primary"
            size="lg"
            isDisabled={!allRequiredDone}
            className={`ml-auto rounded-xl px-8 text-[15px] transition-all duration-300 ${
              allRequiredDone ? 'font-bold' : 'font-semibold'
            }`}
            onPress={handleContinue}
            aria-label={allRequiredDone
              ? 'Continue to links submission'
              : 'Upload required files to continue'}
          >
            Continue to links
          </Button>

          </div>
        </div>
      </div>

    </PageShell>
    </>
  )
}
