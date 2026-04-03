// Merged Submit Page — Upload + Artifacts + Links in one scrollable page
// Route: /submit

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardContent } from '@heroui/react'
import { Plus } from 'lucide-react'
import InnerPageBar from '../../components/ui/InnerPageBar'
import UploadZone from '../../components/ui/UploadZone'
import ArtifactSlot from '../../components/ui/ArtifactSlot'
import RequiredCounter from '../../components/ui/RequiredCounter'
import LinkInputRow from '../../components/ui/LinkInputRow'
import LinkCheckSummary from '../../components/ui/LinkCheckSummary'
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

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SubmitPage() {
  const navigate = useNavigate()

  const { title, courseName, deadline, requiredArtifacts, requiredLinks, optionalLinks } = mockAssignment

  // ── Main file state (from PrimaryUpload) ──────────────────────────────────
  const [confirmedFile, setConfirmedFile] = useState(null)
  const [zoneState, setZoneState] = useState('empty')

  // ── Artifact state (from ArtifactUpload) ──────────────────────────────────
  const initialSlotData = {}
  requiredArtifacts.forEach(a => {
    initialSlotData[a.id] = { state: 'empty', progress: 0, fileName: null, fileSize: null, errorMessage: null }
  })
  const [slotData, setSlotData] = useState(initialSlotData)

  // ── Link state (from LinkSubmission) ──────────────────────────────────────
  const [linkStatuses, setLinkStatuses] = useState({})

  // ── User-added optional links ─────────────────────────────────────────────
  const addedLinkCounter = useRef(10)
  const [userLinks, setUserLinks] = useState([])

  function handleAddLink() {
    addedLinkCounter.current += 1
    setUserLinks(prev => [
      ...prev,
      {
        id: `u${addedLinkCounter.current}`,
        name: 'Additional Link',
        platform: 'Generic',
        required: false,
        placeholder: 'Paste a link (optional)',
        simulatedResult: 'accessible',
      },
    ])
  }

  // ── Artifact helpers ──────────────────────────────────────────────────────
  function updateSlot(id, updates) {
    setSlotData(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }))
  }

  function handleFileSelect(artifact, file) {
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    const validMimes = VALID_MIMES[artifact.type] ?? []
    const validExts = VALID_EXTS[artifact.type] ?? []

    if (!validMimes.includes(file.type) && !validExts.includes(ext)) {
      updateSlot(artifact.id, {
        state: 'error',
        errorMessage: `Wrong file type. Please upload a ${artifact.type.toUpperCase()} file.`,
      })
      return
    }

    // Immediately set progress to 100 — framer-motion initial:'0%' drives the animation
    updateSlot(artifact.id, {
      state: 'uploading',
      progress: 100,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
    })

    // After 2.5s (matching ProgressBar transition duration) → confirmed
    setTimeout(() => {
      updateSlot(artifact.id, { state: 'confirmed' })
    }, 2500)
  }

  function handleReplace(artifactId) {
    updateSlot(artifactId, {
      state: 'empty',
      progress: 0,
      fileName: null,
      fileSize: null,
      errorMessage: null,
    })
  }

  // ── Derived state ─────────────────────────────────────────────────────────
  const requiredArtifactsList = requiredArtifacts.filter(a => a.required)
  const optionalArtifactsList = requiredArtifacts.filter(a => !a.required)
  const requiredTotal = requiredArtifactsList.length
  const requiredCompleted = requiredArtifactsList.filter(a => slotData[a.id]?.state === 'confirmed').length

  const allRequiredLinksResolved = requiredLinks.every(link => {
    const s = linkStatuses[link.id]
    return s === 'accessible' || s === 'acknowledged'
  })

  const allLinks = [...requiredLinks, ...optionalLinks, ...userLinks]

  // Summary: show once any link has a non-idle status
  const summaryLinks = allLinks
    .filter(link => {
      const s = linkStatuses[link.id] ?? 'idle'
      return s !== 'idle'
    })
    .map(link => ({
      id: link.id,
      name: link.name,
      status: linkStatuses[link.id],
    }))

  const showSummary = summaryLinks.length > 0

  // CTA enabled when: main file confirmed + all required artifacts done + all required links resolved
  const canSubmit = confirmedFile !== null && requiredCompleted === requiredTotal && allRequiredLinksResolved

  // ── Demo: fill all fields instantly ──────────────────────────────────────
  function fillDemoData() {
    // Main file
    setConfirmedFile({ name: 'Business_Case_Analysis.pdf', size: 2457600, type: 'application/pdf' })
    setZoneState('confirmed')

    // All artifacts → confirmed
    const filled = {}
    requiredArtifacts.forEach(a => {
      filled[a.id] = { state: 'confirmed', progress: 100, fileName: `${a.name}.${a.type === 'handwritten' ? 'jpg' : a.type}`, fileSize: '1.2 MB', errorMessage: null }
    })
    setSlotData(filled)

    // All links → accessible
    const filledLinks = {}
    ;[...requiredLinks, ...optionalLinks].forEach(l => {
      filledLinks[l.id] = 'accessible'
    })
    setLinkStatuses(filledLinks)
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <InnerPageBar title="Submit" deadline={deadline} />

      <div className="min-h-screen bg-surface-secondary">
        <div className="px-8 lg:px-10 py-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[24px] font-bold text-foreground tracking-tight">Submit your work</h1>
                <p className="text-[14px] text-muted mt-1">Upload your files and links below. We'll check them as you go.</p>
              </div>
              <button
                type="button"
                onClick={fillDemoData}
                className="text-[11px] font-medium text-muted/50 hover:text-muted border border-border/50 hover:border-border rounded-lg px-3 py-1.5 transition-colors shrink-0"
              >
                Fill demo data
              </button>
            </div>

            {/* ── SECTION 1: Main File ──────────────────────────────────────── */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-[15px] font-bold text-foreground">Main File</h2>
                <p className="text-[12px] text-muted mt-0.5">Your primary submission document</p>
              </div>
              <CardContent className="p-6 gap-0">
                <UploadZone
                  onFileConfirmed={(fileInfo) => setConfirmedFile(fileInfo)}
                  onFileCleared={() => setConfirmedFile(null)}
                  onZoneChange={setZoneState}
                />
              </CardContent>
            </Card>

            {/* ── SECTION 2: Supporting Files ──────────────────────────────── */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-bold text-foreground">Supporting Files</h2>
                  <p className="text-[12px] text-muted mt-0.5">Additional documents for your submission</p>
                </div>
                <RequiredCounter total={requiredTotal} completed={requiredCompleted} />
              </div>
              <CardContent className="p-6 gap-0">
                {/* Required artifacts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requiredArtifactsList.map(artifact => {
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

                {/* Optional divider + artifacts */}
                {optionalArtifactsList.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-[11px] font-semibold text-muted uppercase tracking-[0.06em] shrink-0">Optional</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {optionalArtifactsList.map(artifact => {
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
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ── SECTION 3: External Links ────────────────────────────────── */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-[15px] font-bold text-foreground">External Links</h2>
                <p className="text-[12px] text-muted mt-0.5">Paste your links below — we'll check if they're accessible</p>
              </div>
              <CardContent className="p-6 gap-0">
                {/* Required links */}
                {requiredLinks.map(link => (
                  <LinkInputRow
                    key={link.id}
                    link={link}
                    resolveWith={link.simulatedResult}
                    onStatusChange={(status) => setLinkStatuses(prev => ({ ...prev, [link.id]: status }))}
                  />
                ))}

                {/* Optional divider + links */}
                {optionalLinks.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-[11px] font-semibold text-muted uppercase tracking-[0.06em] shrink-0">Optional</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    {optionalLinks.map(link => (
                      <LinkInputRow
                        key={link.id}
                        link={link}
                        resolveWith={link.simulatedResult}
                        onStatusChange={(status) => setLinkStatuses(prev => ({ ...prev, [link.id]: status }))}
                      />
                    ))}
                  </div>
                )}

                {/* User-added links */}
                <AnimatePresence>
                  {userLinks.map(link => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <LinkInputRow
                        link={link}
                        resolveWith={link.simulatedResult}
                        onStatusChange={(status) => setLinkStatuses(prev => ({ ...prev, [link.id]: status }))}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add another link */}
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={handleAddLink}
                  className="flex items-center gap-1.5 font-medium text-accent min-h-11 mt-2"
                  aria-label="Add another optional link"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Add another link
                </Button>

                {/* Link check summary */}
                {showSummary && (
                  <div className="mt-4">
                    <LinkCheckSummary links={summaryLinks} />
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>

        {/* ── STICKY BOTTOM CTA ──────────────────────────────────────────── */}
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
              <Button
                variant="primary"
                size="sm"
                className="rounded-lg px-6 font-semibold"
                isDisabled={!canSubmit}
                onPress={() => navigate('/submit/validating', {
                  state: { primaryFile: confirmedFile, artifactData: slotData, linkStatuses }
                })}
              >
                Submit for analysis
              </Button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
