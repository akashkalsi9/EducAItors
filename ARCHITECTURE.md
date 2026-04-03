# ARCHITECTURE.md — EducAItors
> Folder structure, routing conventions, and state management decisions.

---

## Project Structure

```
EducAItors/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx                  ← App entry point
│   ├── App.jsx                   ← Router setup
│   ├── index.css                 ← Tailwind v4 tokens (@theme) + Inter font + HeroUI styles
│   │
│   ├── pages/                    ← One file per screen
│   │   ├── Dashboard.jsx                     (Screen 1.1 — Assignment Entry)
│   │   ├── Orientation.jsx                   (Screen 1.2 — First Submission Walkthrough)
│   │   ├── submit/
│   │   │   ├── PrimaryUpload.jsx             (Screen 2.1)
│   │   │   ├── ArtifactUpload.jsx            (Screen 2.2)
│   │   │   ├── LinkSubmission.jsx            (Screen 2.3)
│   │   │   ├── OCRPreviewPage.jsx            (Screen 2.4)
│   │   │   └── SubmissionReview.jsx          (Screen 3.1)
│   │   ├── validation/
│   │   │   ├── Validating.jsx                (Screen 3.2)
│   │   │   ├── ValidationReady.jsx           (Screen 3.3)
│   │   │   ├── ValidationWarning.jsx         (Screen 3.4)
│   │   │   └── ValidationBlocker.jsx         (Screen 3.5)
│   │   ├── consent/
│   │   │   ├── ConsentScreen.jsx             (Screen 4.1)
│   │   │   └── ReconsiderationWindow.jsx     (Screen 4.2)
│   │   ├── fix/
│   │   │   ├── TargetedFix.jsx               (Screen 5.1)
│   │   │   └── ResubmitValidating.jsx        (Screen 5.2)
│   │   └── StatusDashboard.jsx               (Screen 6.1)
│   │
│   ├── components/
│   │   ├── PageShell.jsx                     ← Layout wrapper (390px frame, bg-soft canvas)
│   │   ├── PhoneFrame.jsx                    ← Decorative phone bezel (pitch mode)
│   │   └── ui/                               ← Shared atomic components (built per screen)
│   │
│   ├── data/
│   │   ├── mock-submission.js               ← Mock submission state
│   │   ├── mock-assignment.js               ← Assignment metadata
│   │   ├── mock-validation-results.js       ← Ready / Warning / Blocker results
│   │   └── mock-personas.js                 ← Persona quick reference
│   │
│   ├── hooks/
│   │   ├── useCountdown.js                  ← Deadline + reconsideration timer
│   │   └── useUploadProgress.js             ← Simulated upload progress
│   │
│   └── utils/
│       └── formatters.js                    ← Date, time, file size formatting
│
├── CLAUDE.md                                ← Rules, stack, component inventory
├── DESIGN_SYSTEM.md                         ← Tokens, patterns, copy register
├── ARCHITECTURE.md                          ← This file
├── DECISIONS.md                             ← Decision log
├── vite.config.js
└── package.json

⚠️  NO tailwind.config.js — Tailwind v4 is CSS-first. All tokens in src/index.css @theme {}
```

---

## Screen Inventory (Full)

| # | Screen Name | Route | Phase | Priority |
|---|---|---|---|---|
| 1.1 | Assignment Entry | `/` | Entry & Orientation | P0 |
| 1.2 | First-Submission Orientation | `/orientation` | Entry & Orientation | P1 |
| 2.1 | Primary File Upload | `/submit/upload` | Submission Building | P1 |
| 2.2 | Supporting Artifact Upload | `/submit/artifacts` | Submission Building | P1 |
| 2.3 | External Link Submission | `/submit/links` | Submission Building | P1 |
| 2.4 | OCR Preview | `/submit/ocr-preview` | Submission Building | P2 |
| 3.1 | Submission Review | `/submit/review` | Validation & Decision | P1 |
| 3.2 | Validation Running | `/submit/validating` | Validation & Decision | P0 |
| 3.3 | Validation Result — Ready | `/result/ready` | Validation & Decision | **P0** |
| 3.4 | Validation Result — Warning | `/result/warning` | Validation & Decision | **P0** |
| 3.5 | Validation Result — Blocker | `/result/blocker` | Validation & Decision | **P0** |
| 4.1 | Consent Screen | `/consent` | Consent Flow | **P0** |
| 4.2 | Reconsideration Window | `/consent/reconsideration` | Consent Flow | P1 |
| 5.1 | Targeted Fix Path | `/fix` | Resubmission | **P0** |
| 5.2 | Resubmission Validation | `/fix/validating` | Resubmission | P1 |
| 6.1 | Post-Submission Status | `/status` | Post-Submission | P1 |

> **P0 = Must be in prototype demo.** P1 = Build if time allows. P2 = Future scope.

---

## Routing Setup (App.jsx)

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// All routes defined in App.jsx
// Use React Router state to pass submission data between screens
// Example: navigate('/result/warning', { state: { warnings: [...] } })
```

---

## State Passing Between Screens

Use React Router `state` — not a global store.

```js
// Navigating with data
navigate('/result/warning', {
  state: {
    warnings: [
      {
        criterionName: 'Criterion 3: Completeness',
        weight: '30%',
        consequence: 'The AI may not be able to score this criterion.'
      }
    ],
    submissionId: 'SUB-2026-001',
    deadline: '2026-04-03T23:59:00'
  }
})

// Reading on the destination screen
const { state } = useLocation()
const { warnings } = state
```

---

## Mock Data Schema

### mock-assignment.js
```js
export const mockAssignment = {
  id: 'ASSIGN-001',
  firstSubmission: true,
  title: 'Business Case Analysis — Module 3',
  courseName: 'MBA Strategic Management',
  instructorName: 'Dr. Prasad Sharma',
  deadline: '2026-04-03T23:59:00',
  submissionStatus: 'not-started', // not-started | in-progress | submitted | resubmission-needed
  requiredArtifacts: [
    { id: 'a1', name: 'Business Case PDF', type: 'pdf', required: true },
    { id: 'a2', name: 'Financial Model', type: 'xlsx', required: true },
    { id: 'a3', name: 'Presentation Deck', type: 'pptx', required: false },
  ],
  rubric: [
    { id: 'c1', name: 'Problem Framing', weight: 25 },
    { id: 'c2', name: 'Evidence Quality', weight: 35 },
    { id: 'c3', name: 'Completeness', weight: 30 },
    { id: 'c4', name: 'Clarity of Argument', weight: 10 },
  ]
}
```

### mock-validation-results.js
```js
export const mockReadyResult = {
  state: 'ready',
  submissionId: 'SUB-2026-001',
  timestamp: '2026-04-02T14:32:00',
  instructorReviewEstimate: '48 hours'
}

export const mockWarningResult = {
  state: 'warning',
  warnings: [
    {
      id: 'w1',
      criterionName: 'Criterion 3: Completeness',
      weight: '30%',
      element: 'Google Drive Link',
      issue: 'accessible-but-empty',
      consequence: 'The AI may not be able to score this criterion.'
    }
  ]
}

export const mockBlockerResult = {
  state: 'blocker',
  blockers: [
    {
      id: 'b1',
      element: 'Business Case PDF',
      errorType: 'unreadable-file',
      description: 'Your PDF could not be read. It may be password protected or corrupted.',
      fixInstruction: 'Export a new PDF from your original document. Make sure it is not password protected.'
    }
  ]
}
```

---

## Architectural Decisions Flagged for Phani

| # | Feature | Dependency |
|---|---|---|
| 01 | Pre-submission self-check | Requires validation engine to run before final submit |
| 08 | Server-stored consent record | Requires server-side consent storage with timestamp |
| 12 | Preserved validation state on resubmission | Requires session-persisted element state |

> These are flagged in DECISIONS.md. Design assumes they exist. Architecture sign-off needed.
