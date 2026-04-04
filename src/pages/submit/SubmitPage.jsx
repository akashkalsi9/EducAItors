// Merged Submit Page — Upload + Artifacts + Links in one scrollable page
// Route: /submit

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardContent } from '@heroui/react'
import { Plus } from 'lucide-react'
import InnerPageBar from '../../components/ui/InnerPageBar'
// UploadZone removed — all files use ArtifactSlot
import ArtifactSlot from '../../components/ui/ArtifactSlot'
import RequiredCounter from '../../components/ui/RequiredCounter'
import LinkInputRow from '../../components/ui/LinkInputRow'
import LinkCheckSummary from '../../components/ui/LinkCheckSummary'
import ProgressRing from '../../components/ui/ProgressRing'
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

// ─── File size limits (bytes) — matches TYPE_INFO maxSize in ArtifactSlot ────
const MAX_SIZES = {
  pdf:         50  * 1024 * 1024,
  docx:        20  * 1024 * 1024,
  xlsx:        20  * 1024 * 1024,
  pptx:        100 * 1024 * 1024,
  image:       10  * 1024 * 1024,
  handwritten: 10  * 1024 * 1024,
}

const MAX_SIZE_LABELS = {
  pdf: '50MB', docx: '20MB', xlsx: '20MB', pptx: '100MB', image: '10MB', handwritten: '10MB',
}

// ─── Contextual error messages per type + condition ──────────────────────────
const ERROR_MESSAGES = {
  pdf: {
    format:  "This doesn't look like a PDF. Save your document as .pdf and try again.",
    size:    "This PDF is over 50MB. Try compressing images in the document or removing unused pages.",
    network: "Something went wrong uploading your PDF. Check your connection and try again.",
  },
  docx: {
    format:  "This doesn't look like a Word document. Export your file as .docx and try again.",
    size:    "This document is over 20MB. Try compressing images or splitting into smaller files.",
    network: "Something went wrong uploading your document. Check your connection and try again.",
  },
  xlsx: {
    format:  "This doesn't look like an Excel file. Export your spreadsheet as .xlsx and try again.",
    size:    "This spreadsheet is over 20MB. Try removing unused sheets or embedded images.",
    network: "Something went wrong uploading your spreadsheet. Check your connection and try again.",
  },
  pptx: {
    format:  "This doesn't look like a PowerPoint file. Export your slides as .pptx and try again.",
    size:    "This presentation is over 100MB. Try compressing images or removing unused slides.",
    network: "Something went wrong uploading your presentation. Check your connection and try again.",
  },
  image: {
    format:  "This doesn't look like an image. Please upload a JPG or PNG file.",
    size:    "This image is over 10MB. Try reducing the resolution or saving as JPG.",
    network: "Something went wrong uploading your image. Check your connection and try again.",
  },
  handwritten: {
    format:  "This doesn't look like a photo. Please upload a JPG or PNG image of your handwritten work.",
    size:    "This image is over 10MB. Try reducing the resolution or cropping to just your handwritten page.",
    network: "Something went wrong uploading your photo. Check your connection and try again.",
  },
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SubmitPage() {
  const navigate = useNavigate()

  const { title, courseName, deadline, requiredArtifacts, requiredLinks, optionalLinks } = mockAssignment
  const shortTitle = title.replace(/\s*—.*$/, '').trim()

  // ── Artifact state ─────────────────────────────────────────────────────────
  const initialSlotData = {}
  requiredArtifacts.forEach(a => {
    initialSlotData[a.id] = { state: 'empty', progress: 0, fileName: null, fileSize: null, errorMessage: null }
  })
  const [slotData, setSlotData] = useState(initialSlotData)

  // ── Link state (from LinkSubmission) ──────────────────────────────────────
  const [linkStatuses, setLinkStatuses] = useState({})

  // ── OCR tracking state ───────────────────────────────────────────────────
  const [ocrResults, setOcrResults] = useState({})

  function handleOcrComplete(artifactId, confidence) {
    setOcrResults(prev => ({ ...prev, [artifactId]: confidence }))
  }

  // ── Demo link overrides ──────────────────────────────────────────────────
  const [demoOverrides, setDemoOverrides] = useState({})

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
    const msgs = ERROR_MESSAGES[artifact.type] ?? ERROR_MESSAGES.image

    // 1. Format validation
    if (!validMimes.includes(file.type) && !validExts.includes(ext)) {
      updateSlot(artifact.id, {
        state: 'error',
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        errorMessage: msgs.format,
      })
      return
    }

    // 2. Size validation
    const maxBytes = MAX_SIZES[artifact.type]
    if (maxBytes && file.size > maxBytes) {
      updateSlot(artifact.id, {
        state: 'error',
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        errorMessage: msgs.size,
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

  const requiredLinksTotal = requiredLinks.length
  const requiredLinksCompleted = requiredLinks.filter(link => {
    const s = linkStatuses[link.id]
    return s === 'accessible' || s === 'acknowledged'
  }).length
  const allRequiredLinksResolved = requiredLinksCompleted === requiredLinksTotal

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

  // CTA enabled when: main file confirmed + all required artifacts done + all required links resolved + no OCR failures
  const hasOcrFailure = requiredArtifactsList.some(a =>
    a.requiresOCR && ocrResults[a.id] === 'low'
  )
  const canSubmit = requiredCompleted === requiredTotal && allRequiredLinksResolved && !hasOcrFailure

  // ── Demo: fill all fields instantly ──────────────────────────────────────
  function fillDemoData() {
    // All artifacts → confirmed
    const filled = {}
    requiredArtifacts.forEach(a => {
      filled[a.id] = { state: 'confirmed', progress: 100, fileName: `${a.name}.${a.type === 'handwritten' ? 'jpg' : a.type}`, fileSize: '1.2 MB', errorMessage: null }
    })
    setSlotData(filled)

    // OCR artifacts → high confidence
    const filledOcr = {}
    requiredArtifacts.forEach(a => {
      if (a.requiresOCR) filledOcr[a.id] = 'high'
    })
    setOcrResults(filledOcr)

    // All links → accessible (set both overrides and statuses)
    const filledLinks = {}
    const filledOverrides = {}
    ;[...requiredLinks, ...optionalLinks].forEach(l => {
      filledLinks[l.id] = 'accessible'
      filledOverrides[l.id] = 'accessible'
    })
    setLinkStatuses(filledLinks)
    setDemoOverrides(filledOverrides)
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

            {/* ── SECTION 1: Files to Submit ─────────────────────────────── */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-bold text-foreground">Files to Submit</h2>
                  <p className="text-[12px] text-muted mt-0.5">Upload all required documents for your submission</p>
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
                        onOcrComplete={handleOcrComplete}
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
                            onOcrComplete={handleOcrComplete}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
                {/* Demo controls — force file states */}
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-[10px] font-semibold text-muted/40 uppercase tracking-widest mb-2">Demo: Force file status</p>
                  <div className="flex flex-col gap-2">
                    {requiredArtifacts.map(artifact => {
                      const msgs = ERROR_MESSAGES[artifact.type] ?? ERROR_MESSAGES.image
                      const demoFileName = `${artifact.name}.${artifact.type === 'handwritten' ? 'jpg' : artifact.type}`
                      const FILE_DEMO_STATES = [
                        { key: 'empty',        label: 'Empty' },
                        { key: 'uploading',    label: 'Uploading' },
                        { key: 'confirmed',    label: 'Uploaded' },
                        { key: 'err-format',   label: 'Format Err' },
                        { key: 'err-size',     label: 'Size Err' },
                        { key: 'err-network',  label: 'Network Err' },
                      ]
                      const currentState = slotData[artifact.id]?.state
                      const currentMsg   = slotData[artifact.id]?.errorMessage
                      return (
                        <div key={artifact.id} className="flex items-center gap-2">
                          <span className="text-[11px] text-muted w-36 truncate shrink-0">{artifact.name}</span>
                          <div className="flex gap-1 flex-wrap">
                            {FILE_DEMO_STATES.map(({ key, label }) => {
                              const isErrorKey = key.startsWith('err-')
                              const errorType  = key.replace('err-', '')
                              const isActive   = isErrorKey
                                ? currentState === 'error' && currentMsg === msgs[errorType]
                                : currentState === key
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => {
                                    if (key === 'confirmed') {
                                      updateSlot(artifact.id, {
                                        state: 'confirmed', progress: 100,
                                        fileName: demoFileName, fileSize: '1.2 MB', errorMessage: null,
                                      })
                                      if (artifact.requiresOCR) handleOcrComplete(artifact.id, 'high')
                                    } else if (key === 'uploading') {
                                      updateSlot(artifact.id, {
                                        state: 'uploading', progress: 45,
                                        fileName: demoFileName, fileSize: '1.2 MB', errorMessage: null,
                                      })
                                    } else if (isErrorKey) {
                                      updateSlot(artifact.id, {
                                        state: 'error', progress: 0,
                                        fileName: demoFileName, fileSize: '1.2 MB',
                                        errorMessage: msgs[errorType],
                                      })
                                    } else {
                                      updateSlot(artifact.id, {
                                        state: 'empty', progress: 0,
                                        fileName: null, fileSize: null, errorMessage: null,
                                      })
                                      if (artifact.requiresOCR) handleOcrComplete(artifact.id, null)
                                    }
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                                    isActive
                                      ? 'bg-accent text-white'
                                      : 'bg-surface-secondary text-muted hover:text-foreground'
                                  }`}
                                >
                                  {label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── SECTION 3: External Links ────────────────────────────────── */}
            <Card className="rounded-xl border border-border p-0 gap-0">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-bold text-foreground">External Links</h2>
                  <p className="text-[12px] text-muted mt-0.5">Paste your links below — we'll check if they're accessible</p>
                </div>
                <RequiredCounter total={requiredLinksTotal} completed={requiredLinksCompleted} />
              </div>
              <CardContent className="p-6 gap-0">
                {/* Required links */}
                {requiredLinks.map(link => (
                  <LinkInputRow
                    key={link.id}
                    link={link}
                    resolveWith={link.simulatedResult}
                    forceStatus={demoOverrides[link.id] ?? null}
                    onStatusChange={(id, status) => setLinkStatuses(prev => ({ ...prev, [id]: status }))}
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
                        forceStatus={demoOverrides[link.id] ?? null}
                        onStatusChange={(id, status) => setLinkStatuses(prev => ({ ...prev, [id]: status }))}
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
                        onStatusChange={(id, status) => setLinkStatuses(prev => ({ ...prev, [id]: status }))}
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

                {/* Demo controls — force link statuses */}
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-[10px] font-semibold text-muted/40 uppercase tracking-widest mb-2">Demo: Force link status</p>
                  <div className="flex flex-col gap-2">
                    {[...requiredLinks, ...optionalLinks].map(link => (
                      <div key={link.id} className="flex items-center gap-2">
                        <span className="text-[11px] text-muted w-32 truncate shrink-0">{link.name}</span>
                        <div className="flex gap-1">
                          {['accessible', 'permission-blocked', 'broken', 'empty-link'].map(status => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setDemoOverrides(prev => ({ ...prev, [link.id]: status }))}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                                demoOverrides[link.id] === status
                                  ? 'bg-accent text-white'
                                  : 'bg-surface-secondary text-muted hover:text-foreground'
                              }`}
                            >
                              {status === 'accessible' ? 'OK' : status === 'permission-blocked' ? 'Blocked' : status === 'broken' ? 'Broken' : 'Empty'}
                            </button>
                          ))}
                          {demoOverrides[link.id] && (
                            <button
                              type="button"
                              onClick={() => setDemoOverrides(prev => { const n = {...prev}; delete n[link.id]; return n })}
                              className="px-2 py-0.5 rounded text-[10px] font-medium text-muted hover:text-foreground"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                <p className="text-[11px] text-muted/60">We'll do a quick check, then you can review before submitting.</p>
              </div>
              <div className="flex items-center gap-4">
                <ProgressRing
                  completed={requiredCompleted + requiredLinksCompleted}
                  total={requiredTotal + requiredLinksTotal}
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-lg px-6 font-semibold"
                  isDisabled={!canSubmit}
                  onPress={() => navigate('/submit/validating', {
                    state: { artifactData: slotData, linkStatuses }
                  })}
                >
                  Review & submit
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
