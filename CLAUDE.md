# CLAUDE.md — EducAItors
> This is your contract. Read this before every task. Never invent what is defined here.

---

## Project Identity

**Product:** EducAItors — AI-powered Student Submission & Readiness Module
**Persona Scope:** Student-facing only. No instructor UI. No admin UI.
**Prepared by:** Mehak's Team — Prototype by Akash
**Stack:** Vite + React 19 + HeroUI v3 + Tailwind CSS v4 + React Router v6

---

## Tech Stack (Pinned — do not upgrade without Akash's instruction)

| Package | Version | Notes |
|---|---|---|
| react | 19.2.4 | **React 19** — not 18 |
| react-dom | 19.2.4 | |
| react-router-dom | 6.30.0 | |
| **@heroui/react** | **3.0.1** | **HeroUI v3** — not NextUI, not v2 |
| framer-motion | 11.18.2 | |
| lucide-react | 1.7.0 | |
| @gravity-ui/icons | 2.18.0 | Secondary icon set — use alongside lucide-react |
| tailwind-merge | 3.5.0 | |
| tailwindcss | 4.2.2 | **Tailwind v4** — CSS-first config |
| @tailwindcss/vite | 4.2.2 | Vite plugin — replaces postcss plugin |
| vite | 8.0.3 | |

> ⚠️ `tailwind.config.js` does NOT exist in this project. Tailwind v4 is configured via `@theme {}` in `src/index.css`.
> ⚠️ `@heroui/styles` is imported in `src/index.css` — this bundles Tailwind v4 internally. Do NOT add a separate `@import "tailwindcss"`.

---

## HeroUI v3 — Critical Rules

### Import pattern
```js
// CORRECT — named sub-component imports
import { Button, Card, CardContent, CardHeader, CardFooter, Chip, Input } from '@heroui/react'

// WRONG — dot notation is NOT valid in HeroUI v3
<Card.Content />   // ❌ never
<Card.Header />    // ❌ never
```

### Card structure
```jsx
import { Card, CardHeader, CardContent, CardFooter } from '@heroui/react'

<Card>
  <CardHeader>…</CardHeader>
  <CardContent className="px-4 py-4">…</CardContent>
  <CardFooter>…</CardFooter>
</Card>
```

### Button — correct props
```jsx
<Button
  variant="primary"      // primary | secondary | tertiary | outline | ghost | danger
  size="lg"              // sm | md | lg
  isDisabled={bool}      // ← NOT disabled={bool}
  isPending={bool}
  fullWidth={bool}
  onPress={() => {}}     // ← NOT onClick for HeroUI Buttons
/>
```

### Chip — correct props
```jsx
<Chip
  variant="soft"         // primary | secondary | soft | tertiary
  color="accent"         // default | accent | success | warning | danger
  size="sm"              // sm | md | lg
/>
```

### Never use `!important` overrides
```jsx
// WRONG
<CardContent className="!p-0 !rounded-xl !bg-amber-50" />

// CORRECT — wrap in a div or use plain Tailwind
<CardContent className="p-0 rounded-xl" />
```

---

## Tailwind CSS v4 — Critical Rules

- Config is **CSS-first** — all tokens live in `src/index.css` under `@theme {}`
- **No `tailwind.config.js`** — do not create one
- `@heroui/styles` bundles Tailwind internally — never add `@import "tailwindcss"` separately
- Custom tokens are used as normal Tailwind classes: `text-brand-blue`, `bg-bg-soft`, `border-border-base`
- Opacity modifier syntax: `border-border-base/50` (not `opacity-50` on the element)

---

## React 19 — Notes

- Function components only — no class components
- `useNavigate` from `react-router-dom` for navigation
- `framer-motion` `AnimatePresence` for mount/unmount transitions
- HeroUI components use `onPress` — not `onClick`
- `useState`, `useEffect`, `useRef`, `useMemo` — all available as before

---

## NEVER

- Install new packages without confirming with Akash
- Use class components
- Use `useEffect` for data fetching — use mock data / static JSON only
- Add Redux, Zustand, or any global state library
- Use inline styles (`style={{}}`) — always use Tailwind classes
- Invent colors not in DESIGN_SYSTEM.md / `src/index.css @theme {}`
- Create new components without checking the Component Inventory below
- Use `@nextui-org/react` — project has migrated fully to `@heroui/react`
- Create a `tailwind.config.js` — Tailwind v4 does not use one
- Use `disabled` on HeroUI Button — use `isDisabled`
- Use dot notation `Card.Content` — use named imports `CardContent`
- Use `!important` Tailwind overrides (`!p-0`, `!rounded-xl`, etc.)
- Add animations not in DESIGN_SYSTEM.md

---

## File & Folder Naming Conventions

```
src/
  pages/          → PascalCase.jsx  (e.g., ValidationReady.jsx)
  components/     → PascalCase.jsx  (e.g., PageShell.jsx)
  components/ui/  → PascalCase.jsx  (shared atomic components)
  data/           → kebab-case.js   (e.g., mock-submission.js)
  hooks/          → camelCase.js    (e.g., useCountdown.js)
  utils/          → camelCase.js    (e.g., formatters.js)
```

---

## Routing (React Router v6)

```
/                         → Dashboard / Assignment Entry (Screen 1.1)
/orientation              → First-Submission Orientation (Screen 1.2)
/submit/upload            → Primary File Upload (Screen 2.1)
/submit/artifacts         → Supporting Artifact Upload (Screen 2.2)
/submit/links             → External Link Submission (Screen 2.3)
/submit/ocr-preview       → OCR Preview (Screen 2.4)
/submit/review            → Submission Review (Screen 3.1)
/submit/validating        → Validation Running (Screen 3.2)
/result/ready             → Validation Result — Ready (Screen 3.3)
/result/warning           → Validation Result — Warning (Screen 3.4)
/result/blocker           → Validation Result — Blocker (Screen 3.5)
/consent                  → Submit Despite Warnings (Screen 4.1)
/consent/reconsideration  → Reconsideration Window (Screen 4.2)
/fix                      → Targeted Fix Path (Screen 5.1)
/fix/validating           → Resubmission Validation (Screen 5.2)
/status                   → Post-Submission Dashboard (Screen 6.1)
```

---

## Component Inventory
> Before creating any component, check this list. Never duplicate.

| Component Name | Location | Responsibility |
|---|---|---|
| `PageShell` | `components/PageShell.jsx` | Layout wrapper — 390px frame, bg-soft canvas, noPadding prop |
| `AIInstructorStatement` | `components/ui/AIInstructorStatement.jsx` | Persistent "AI processes, instructor decides" statement. `centered` prop toggles alignment. Used on screens 3.3, 3.4, 3.5, 4.1, 6.1 |
| `ValidationIndicator` | `components/ui/ValidationIndicator.jsx` | Circle icon for validation state. Props: `variant` (`'ready'`\|`'warning'`\|`'blocker'`), `size` (default 56). Same shape family, only color + inner mark changes. |
| `ConsequenceCard` | `components/ui/ConsequenceCard.jsx` | Warning detail card with amber left-border accent (flex-strip pattern). Props: `warning`, `index`, `total`. Shows criterion, weight, affected element, consequence. |
| `ProgressDots` | `components/ui/ProgressDots.jsx` | Step indicator dots for carousel/multi-panel flows. Props: `total`, `current`. Active = 20×6 pill, inactive = 6×6 circle. framer-motion width morph. |
| `OrientationPanel` | `components/OrientationPanel.jsx` | 3-panel orientation carousel. Props: `startPanel` (0\|1), `onDismiss`. Slide transitions, localStorage dismiss flag, collapse-on-exit animation. Used on Screen 1.2. |
| `UploadZone` | `components/ui/UploadZone.jsx` | 7-state file upload zone. Props: `onFileConfirmed`, `onFileCleared`, `onZoneChange`. Handles empty/drag-over/format-error/size-error/uploading/paused/confirmed. Built-in upload simulation with 4G pause. |
| `ProgressBar` | `components/ui/ProgressBar.jsx` | Animated progress bar. Props: `progress` (0–100), `colorClass` (Tailwind bg-* token), `heightClass` (default `'h-[6px]'`), `transition`. initial width always 0 (framer-motion animates from 0). |
| `FileTypeIcon` | `components/ui/FileTypeIcon.jsx` | Colored icon circle by file type. Props: `type` (pdf\|docx\|image\|xlsx\|pptx), `size` (32\|40). Used in UploadZone uploading row and confirmed state. |
| `SubmissionStepper` | `components/ui/SubmissionStepper.jsx` | 4-step horizontal progress stepper for submission flow. Props: `currentStep` (1–4), `stepNote` (`{ stepId, text, color }`) optional animated sub-label below a step (e.g. 'Reviewing handwriting'). Steps below currentStep show green check; active = blue number; upcoming = gray number. |
| `RequiredCounter` | `components/ui/RequiredCounter.jsx` | Required files pill counter. Props: `total`, `completed`. Color: red (0) → amber (partial) → green (all). Scale pulse animation on number change. |
| `ArtifactSlot` | `components/ui/ArtifactSlot.jsx` | Single artifact upload card. Props: `artifact` `{id,name,type,required}`, `slotState` (`empty`\|`uploading`\|`confirmed`\|`error`), `progress`, `fileName`, `fileSize`, `errorMessage`, `onFileSelect`, `onReplace`. Required = solid 2px border + inner drop zone. Optional = dashed border + muted button. |
| `LinkInputRow` | `components/ui/LinkInputRow.jsx` | External link row with real-time check simulation. 8 states: idle, checking, accessible, empty-link, acknowledged, permission-blocked, broken, format-error. Props: `link`, `resolveWith`, `forceStatus` (demo override), `onStatusChange`. Check triggers on paste; also on blur if URL present. |
| `FixInstructionCard` | `components/ui/FixInstructionCard.jsx` | Operational fix instructions for failed link checks. Props: `platform`, `type` (`permission-blocked`\|`broken`), `onRetry`. Platform-specific numbered steps for permission-blocked; simple text + retry for broken. Left-border flex-strip pattern. |
| `LinkCheckSummary` | `components/ui/LinkCheckSummary.jsx` | Jordan's transparency card — summary of all checked link results. Props: `links` array `{id, name, status}`. Visible as soon as any link has a non-idle status. |
| `OCRProcessingAnimation` | `components/ui/OCRProcessingAnimation.jsx` | Scanning document rectangle with animated blue scan line (gradient). Props: `fileName` (string), `phase` ('processing'\|'result'). Scan line only visible during processing. Never label this as "OCR" to the user. |
| `ConfidenceMessage` | `components/ui/ConfidenceMessage.jsx` | Signature Screen 2.4 confidence card — top border draws left-to-right via scaleX 0→1 (the "exhale" moment). Props: `confidence` ('high'\|'medium'\|'low'). Green = good, amber = uncertain, red = unreadable. |
| `ExtractedTextAccordion` | `components/ui/ExtractedTextAccordion.jsx` | Collapsible extracted text panel with word-level amber/red highlights. Props: `confidence`, `extractedText` (array of `{word, conf}`). Auto-opens for medium/low confidence. |
| `PhotoTips` | `components/ui/PhotoTips.jsx` | Expandable tips card for getting a clearer photo. 3 tips (Sun/ZoomIn/Eye icons). No props — static content. Collapsed by default. Used only for medium/low confidence on Screen 2.4. |
| `SubmissionItemRow` | `components/ui/SubmissionItemRow.jsx` | Single row in the submission review list. Props: `item` `{id,name,type,size?,platform?,status,required,slot?,consequence?,editRoute,mapsTo}`, `onEdit` () => void, `delay` (stagger seconds). 3 states: confirmed (green Ready + Edit), warning (amber expandable + Fix it), missing (red Add now pill). Flex-strip left-border pattern. |
| `PreCheckBanner` | `components/ui/PreCheckBanner.jsx` | Optional self-check banner on Screen 3.1. Props: `checkState` ('idle'\|'running'\|'clear'\|'issues'), `issues` array `{id,text,editRoute}`, `onCheck`, `onFix`. Idle = "Want extra confidence?"; Running = spinner; Clear = green; Issues = amber list. |
| `RubricMappingAccordion` | `components/ui/RubricMappingAccordion.jsx` | Priya's criteria coverage accordion on Screen 3.1. Props: `items` (submission items), `rubric` (criteria array). Shows which uploaded files map to each criterion. Collapsed by default. |
| `PulseRingAnimation` | `components/ui/PulseRingAnimation.jsx` | Calm radiating pulse rings around a center element. Props: `ringCount` (default 3), `interval` (seconds between rings, default 0.7), `slow` (boolean — extends duration 2s→3s for resolving phase), `children` (center content). Used on Screens 3.2/5.2. |
| `AnimatedDots` | `components/ui/AnimatedDots.jsx` | Three sequentially pulsing dots signaling active processing. Props: `count` (default 3), `interval` (stagger seconds, default 0.4). Always brand-blue. Used on Screens 3.2/5.2. |
| `ValidationRunning` | `components/ValidationRunning.jsx` | Full-screen validation loading page used by both Screen 3.2 (/submit/validating) and Screen 5.2 (/fix/validating). Props: `isResubmission` (boolean, default false — shows amber "We'll check everything again" note). Auto-navigates after 4.4s with icon swap preview. Hidden demo triple-tap zones control result destination. |

> Add new entries here as components are created. Never duplicate.

---

## Before You Code — Checklist (Every Task)

1. ✅ Which screen number is this? (check Screen Inventory in ARCHITECTURE.md)
2. ✅ Which components already exist? (check Component Inventory above)
3. ✅ Are you using only tokens from DESIGN_SYSTEM.md?
4. ✅ Is this using `@heroui/react` named imports only? (no dot notation)
5. ✅ Are HeroUI Buttons using `onPress` and `isDisabled`?
6. ✅ Is the primary CTA the heaviest visual element?
7. ✅ Is the AI-instructor chain statement present where required?
8. ✅ Are all touch targets minimum 44px?

---

## Prompt Template (Use This Every Session)

```
Persona: [Student name from persona set]
Screen: [Screen number + name, e.g., Screen 3.4 — Validation Result Warning State]
Task: [One thing only, e.g., Build the Warning detail card component]
Use: [Component names from inventory]
Constraints: Follow CLAUDE.md. Follow DESIGN_SYSTEM.md. HeroUI v3 only.
```

---

## Copy Register (Critical Phrases — Use Exactly)

| Context | Copy |
|---|---|
| Validation loading | "Checking your submission…" |
| Ready state headline | "Your submission is in." |
| Warning headline (single) | "One thing needs your attention" |
| Warning headline (multiple) | "A few things need your attention" |
| Blocker headline | "Something needs to be fixed before your work can be evaluated" |
| AI-instructor statement | "AI will process your work. Your instructor makes the final grade decision." |
| Resubmission expectation | "We'll check everything again — your other elements should still pass." |
| Reconsideration framing | "You can still fix this — [MM:SS] remaining" |
| Validated elements label | "Already checked — good to go" |
| Empty link warning | "This document appears to have no content. If the AI cannot find evidence here, this criterion may score zero" |
| Consent headline | "You are submitting with a known risk" |
| OCR High confidence | "Your handwriting looks clear — good to go." |
| OCR Medium confidence | "Some parts may be hard to read — here is what we extracted, does this look right?" |
| OCR Low confidence | "Parts of your submission may be unreadable — try a clearer photo in better lighting" |
| Resubmission ready headline | "Your resubmission is in." |

---

## Persona Reference (Quick)

| Name | Type | Key Need |
|---|---|---|
| Riya | Anxious first-timer | Reassurance at every step |
| Arjun | Speed-focused, mobile, 4G | Fast, no friction, auto-resume |
| Sunita | Low digital literacy | Plain language, no jargon |
| Vikram | Audit-oriented, meticulous | Sees full detail, downloads receipt |
| Priya | Rubric-mapper | Sees criteria before submitting |
| Jordan | Transparency-seeker | Needs to understand AI decision |
| Tyler | Consent-risk persona | Must not be able to claim ignorance |
| Karan | Deadline-pressure persona | Deadline always visible |
| Marcus | First-time institutional | Orientation must land |

---

## State Management

- Use local `useState` for all UI state within a screen
- Use React Router `state` to pass submission data between routes
- Use mock data from `/src/data/` — no real API calls
- No Redux, no Zustand, no Context unless Akash explicitly approves

---

## Accessibility (Non-negotiable)

- All icons: `aria-hidden="true"`
- All interactive icon-only buttons: `aria-label="…"` required
- Minimum touch target: **44px × 44px** on all interactive elements
- Never use colour alone to communicate state — always pair with icon + label
- All status indicators: colour + icon + text label together
- Focus rings: `focus-visible:ring-2 focus-visible:ring-brand-blue`
