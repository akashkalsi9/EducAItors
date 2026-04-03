# DESIGN_SYSTEM.md — EducAItors
> Single source of truth for all visual tokens and patterns.
> Claude must never invent values not listed here.

---

## Typography

**Font Family:** Inter (Google Fonts)
**Import in `src/index.css`:** `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');`

| Role | Size | Weight | Class |
|---|---|---|---|
| Page headline | 24px | 700 | `text-[24px] font-bold` |
| Screen heading | 22px | 700 | `text-[22px] font-bold` |
| Section heading | 18–20px | 700 | `text-[18px] font-bold` |
| Card title | 15–17px | 600 | `text-[16px] font-semibold` |
| Body primary | 15px | 400 | `text-[15px]` |
| Body secondary | 14px | 400 | `text-[14px]` |
| Label / caption | 12px | 500 | `text-xs font-medium` |
| Overline (course label) | 11px | 700 uppercase | `text-[11px] font-bold uppercase tracking-[0.14em]` |
| Button label | 15px | 600 | `text-[15px] font-semibold` |
| Commitment button | 15px | 700 | `text-[15px] font-bold` |

---

## Color Tokens

> ⚠️ Tailwind v4 — tokens are defined in `src/index.css` under `@theme {}`. There is NO `tailwind.config.js`.
> Use these as Tailwind classes directly: `text-brand-blue`, `bg-bg-soft`, etc.

### Defined in `src/index.css @theme {}`

```css
/* Brand */
--color-brand-blue:  #1F4E8C;   /* Deep Trust Blue — primary actions, headings */
--color-brand-green: #22C55E;   /* AI Green — success, AI labels */

/* System States */
--color-state-ready:   #10B981; /* Validation passed */
--color-state-warning: #F59E0B; /* Risky but acceptable */
--color-state-blocker: #EF4444; /* Cannot proceed */
--color-state-info:    #3B82F6; /* OCR confidence, system signals */

/* Accent */
--color-accent-purple: #7C3AED; /* Focus states, advanced AI insights — use sparingly */

/* Text */
--color-text-primary:   #111827;
--color-text-secondary: #6B7280;

/* Backgrounds */
--color-bg-soft: #F5F7FA;       /* Page canvas, soft card fills */

/* Borders */
--color-border-base: #E5E7EB;

/* Gradient */
--background-image-ai-gradient: linear-gradient(135deg, #1F4E8C 0%, #22C55E 100%);
```

### HeroUI Accent Override (also in `src/index.css`)
```css
:root {
  --accent: #1F4E8C;            /* maps HeroUI's accent color to brand-blue */
  --accent-foreground: #ffffff;
}
```

### System Feedback Colors
| State | Hex | Tailwind class | Use |
|---|---|---|---|
| Ready / Success | `#10B981` | `text-state-ready` | All validation pass states |
| Warning | `#F59E0B` | `text-state-warning` | Risky but acceptable submissions |
| Blocker / Error | `#EF4444` | `text-state-blocker` | Cannot proceed to grading |
| Info / Confidence | `#3B82F6` | `text-state-info` | OCR confidence, system signals |
| Brand Blue | `#1F4E8C` | `text-brand-blue` | Primary actions, headings |
| Brand Green | `#22C55E` | `text-brand-green` | AI labels, success |

> **Rule:** Never use colour alone. Always pair state colour with icon AND label text.

---

## Spacing Scale

```
4px  → p-1,  gap-1
8px  → p-2,  gap-2
12px → p-3,  gap-3
16px → p-4,  gap-4   ← standard card padding
20px → p-5,  gap-5
24px → p-6,  gap-6
32px → p-8,  gap-8
48px → p-12
```

**Page layout:**
```
Page horizontal padding:  px-4
Page top padding:         pt-2 – pt-4
Page bottom padding:      pb-28  (clearance for sticky CTA)
Section gap:              gap-4  (flex-col gap between cards)
Card padding:             p-4
```

---

## Border Radius

| Use | Value | Tailwind |
|---|---|---|
| Cards | 12px | `rounded-xl` |
| Buttons (primary CTA) | 12px | `rounded-xl` |
| Buttons (pill style) | 9999px | `rounded-full` |
| Pills / Tags / Chips | 9999px | `rounded-full` |
| Input fields | 8px | `rounded-lg` |
| Upload zones | 12px | `rounded-xl` |

---

## Elevation / Shadow

| Level | Use | Tailwind |
|---|---|---|
| 0 | Flat — background sections | `shadow-none` |
| 1 | Default card | `shadow-sm` |
| 2 | Active / focused card | `shadow-md` |
| 3 | Modals — avoid, use inline | `shadow-xl` |

---

## Left-Border Accent System
> Used to communicate state on cards without heavy color fills. Required for all state/status cards.

| State | Class | Background |
|---|---|---|
| Ready | `border-l-4 border-state-ready` | `bg-green-50` |
| Warning | `border-l-4 border-state-warning` | `bg-amber-50` |
| Blocker | `border-l-4 border-state-blocker` | `bg-red-50` |
| Info | `border-l-4 border-state-info` | `bg-blue-50` |
| Brand (required items) | `border-l-4 border-brand-blue` | `bg-white` |
| Neutral (optional items) | `border-l-4 border-border-base` | `bg-white` |

**Combined example:**
```jsx
<div className="border-l-4 border-state-warning bg-amber-50 rounded-xl p-4 shadow-sm">
```

---

## Button Hierarchy (HeroUI v3)

All buttons use `@heroui/react` `Button` component. Never build buttons from scratch.

```jsx
import { Button } from '@heroui/react'

// Primary CTA — one per screen, fixed/sticky bottom
<Button variant="primary" fullWidth size="lg" className="rounded-xl h-[52px] font-semibold" onPress={fn}>
  Action label →
</Button>

// Primary CTA — pill style (non-full-width)
<Button variant="primary" size="lg" className="rounded-full px-6 font-semibold" onPress={fn}>
  Action
</Button>

// Secondary / outline
<Button variant="outline" size="md" className="rounded-full" onPress={fn}>
  Cancel
</Button>

// Ghost / link-style
<Button variant="ghost" size="sm" onPress={fn}>
  Skip for now
</Button>

// Commitment button (consent screen only)
<Button variant="primary" fullWidth size="lg" className="rounded-xl font-bold" onPress={fn}>
  I understand — submit Criterion 3 (30%) with this risk
</Button>
```

> **Rule:** Primary CTA is always the heaviest visual element on the screen.
> **Rule:** Fix it button always heavier than Submit anyway. Stack vertically, never side by side.
> **Rule:** Use `isDisabled` not `disabled`. Use `onPress` not `onClick`.

---

## Chip / Status Pills (HeroUI v3)

```jsx
import { Chip } from '@heroui/react'

<Chip variant="soft" color="success" size="sm">Submitted</Chip>
<Chip variant="soft" color="warning" size="sm">In progress</Chip>
<Chip variant="soft" color="danger" size="sm">Needs fixing</Chip>
<Chip variant="secondary" color="default" size="sm">Not started</Chip>
```

**Custom inline pill (no HeroUI — for dot + label pattern):**
```jsx
<span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-text-secondary text-xs font-medium px-2.5 py-1">
  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" aria-hidden="true" />
  Not started
</span>
```

---

## Card Patterns (HeroUI v3)

```jsx
import { Card, CardContent, CardHeader, CardFooter } from '@heroui/react'

// HeroUI Card
<Card>
  <CardContent className="p-4">…</CardContent>
</Card>

// Plain div card (preferred for custom state cards)
<div className="bg-white rounded-xl shadow-sm p-4">…</div>

// Left-border state card
<div className="border-l-4 border-state-warning bg-amber-50 rounded-xl p-4 shadow-sm">…</div>
```

---

## Upload Zone States

| State | Visual |
|---|---|
| Empty | `border-2 border-dashed border-border-base bg-bg-soft rounded-xl` |
| Active / Drag-over | `border-2 border-dashed border-brand-blue bg-blue-50` |
| Uploading | Progress bar replaces zone |
| Confirmed | `border-2 border-solid border-state-ready bg-green-50` + file card inside |
| Error | `border-2 border-solid border-state-blocker bg-red-50` |
| Required slot | `border-2 border-solid border-border-base` |
| Optional slot | `border-2 border-dashed border-border-base opacity-75` |

---

## Bottom Sticky CTA

```jsx
// Standard sticky bottom bar
<div className="sticky bottom-0 w-full px-4 pb-5 pt-3 bg-white border-t border-border-base z-40">
  <Button variant="primary" fullWidth size="lg" className="rounded-xl h-[52px] font-semibold" onPress={fn}>
    Open submission →
  </Button>
</div>
```

---

## Layout Rules

- **Mobile-first always.** All screens designed at 390px width first
- **Max content width:** 480px — centered
- **Single column only** — no multi-column layouts on student screens
- **CTA pinned to bottom:** `sticky bottom-0` pattern (see above)
- **No sticky mini-header** — PageShell is a clean layout wrapper only
- **Page padding:** `px-4 pt-2 pb-28` — sections use `gap-4`

---

## Animation

All transitions via **framer-motion v11**.

```jsx
// Standard page mount
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -12 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
/>

// Panel/carousel slide
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 48 : -48, opacity: 0 }),
}
```

---

## Icons

Two icon libraries are available. Use whichever has the best fit for the context.

### lucide-react v1.7 — primary set

```jsx
import { ShieldCheck, ScanSearch, Layers, ChevronRight } from 'lucide-react'

// Standard
<Icon className="w-5 h-5 text-text-secondary" strokeWidth={1.75} aria-hidden="true" />

// Large accent
<Icon className="w-6 h-6 text-brand-blue" strokeWidth={1.5} aria-hidden="true" />
```

### @gravity-ui/icons v2.18 — extended set

Use when lucide doesn't have the right icon. Browse all icons at: **https://preview.gravity-ui.com/icons/**

```jsx
// Named import
import { Cloud, SquareCheck, FileText } from '@gravity-ui/icons'

// Direct import (tree-shaking safe alternative)
import Cloud from '@gravity-ui/icons/Cloud'

// Usage — Gravity UI icons are SVG components, size via width/height class
<Cloud className="w-5 h-5 text-text-secondary" aria-hidden="true" />
<SquareCheck className="w-5 h-5 text-state-ready" aria-hidden="true" />
```

> **Rule:** Both libraries can be used in the same component. Prefer lucide-react for standard UI icons (arrows, close, check, menu). Prefer Gravity UI for specialized icons not in lucide (domain-specific, file types, AI-related).

---

## AI Gradient

```css
/* Use ONLY on: logo AI letters, key AI feature callouts */
background: linear-gradient(135deg, #1F4E8C 0%, #22C55E 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```
Not on buttons. Not on body text. Not on backgrounds.

---

## Copy Register
> Use these exact phrases. Never paraphrase.

| Context | Exact Copy |
|---|---|
| Validation loading | "Checking your submission…" |
| Ready headline | "Your submission is in." |
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

## What NOT to Do

| ❌ Wrong | ✅ Correct |
|---|---|
| `tailwind.config.js` custom colors | Tokens in `src/index.css @theme {}` |
| `<Card.Content>` dot notation | `<CardContent>` named import |
| `disabled={true}` on Button | `isDisabled={true}` |
| `onClick` on HeroUI Button | `onPress` |
| `!p-0`, `!rounded-xl` (important overrides) | Plain Tailwind classes |
| Flat colored boxes for states | Left-border accent cards |
| Placeholder / lorem copy | Human, supportive copy from Copy Register |
| Unstyled HeroUI defaults | Always pass `variant`, `size`, `className` |
| `@import "tailwindcss"` in CSS | `@import "@heroui/styles"` only |
| `@nextui-org/react` | `@heroui/react` |
