# DECISIONS.md — EducAItors
> Log every time a design or code decision is made or overridden. This is the code review reference.

---

## Format

```
[Date] | [Decision] | [Rationale] | [Screen(s)] | [Who]
```

---

## Design Decisions (from Screen Spec)

| Date | Decision | Rationale | Screens |
|---|---|---|---|
| 2026-04-02 | Warning state uses binary choice — Fix it (heavier) vs Submit anyway (lighter) | Prevents decision paralysis. Visual weight nudges toward lower-risk path without blocking proceed. Serves Riya (prevents panic) and Arjun (prevents thoughtless proceed) | 3.4 |
| 2026-04-02 | Consent button label carries criterion name + weight + consequence | Generic "I understand" is legally indefensible. Full commitment in button label makes consent non-repudiable | 4.1 |
| 2026-04-02 | Fix it routes to targeted fix — only failing element requires action | Validated elements preserved. Resubmission = single element replacement, not full restart. Architecture-dependent (flagged) | 5.1 |
| 2026-04-02 | AI-instructor chain statement persistent on every post-submission screen until grade ready | Trust in AI evaluation is primary adoption bottleneck in Indian market. Built through repetition, not a dismissed tooltip | 3.3, 3.4, 3.5, 4.1, 6.1 |
| 2026-04-02 | One decision at a time — sequential disclosure across all screens | Core cognitive load principle. Every screen surfaces exactly one decision | All |
| 2026-04-02 | Fix instruction expanded by default on blocker state | Student is in high-urgency state — cannot afford extra tap | 3.5, 5.1 |
| 2026-04-02 | Validation loading shows no percentage or list of checks | List of checks being validated creates anxiety. Student needs outcome, not process visibility | 3.2, 5.2 |
| 2026-04-02 | Reconsideration window is 5 minutes — passive, non-blocking | Gives Riya an exit without creating urgency for Arjun. Submission completes automatically | 4.2 |

---

## Architecture Decisions Pending Phani Approval

| # | Feature | Design Assumption | Flag |
|---|---|---|---|
| 01 | Pre-submission self-check | Validation engine can run before final submit click | Requires Phani's architecture decision |
| 08 | Server-stored consent record | Consent text, criterion, weight, timestamp stored server-side | Requires Phani's architecture decision |
| 12 | Preserved validation state on resubmission | Session state persists validated elements between attempts | Requires Phani's architecture decision |

---

## Code Decisions

| Date | Decision | Rationale | File(s) |
|---|---|---|---|
| 2026-04-02 | Using React Router state for inter-screen data passing | No global store needed for prototype scope. Keeps it simple | App.jsx |
| 2026-04-02 | All data from mock JSON files in /src/data/ | No API calls in prototype. Claude must use mock data consistently | /src/data/ |
| 2026-04-02 | HeroUI components used as base, extended with Tailwind | HeroUI provides accessible base components. Tailwind applies design tokens | All components |
| 2026-04-02 | Inter font only (Google Fonts CDN) | Team decision. Revisable if needed | index.css |
| 2026-04-02 | ~~Using `@nextui-org/react@2.6.11`~~ — **SUPERSEDED** | See upgrade decision below | — |
| 2026-04-02 | **Upgraded to `@heroui/react` v3.0.1 + React 19 + Tailwind v4** | Akash confirmed the stack upgrade. `@heroui/react` v3 requires React 19 and Tailwind v4. `tailwind.config.js` is replaced by CSS-first `@theme {}` in `src/index.css`. Import pattern changed from `@nextui-org/react` to `@heroui/react`. Named sub-component imports replace dot notation (`CardContent` not `Card.Content`). Button prop changes: `isDisabled` (not `disabled`), `onPress` (not `onClick`). | package.json, main.jsx, src/index.css, all components |
| 2026-04-02 | No `tailwind.config.js` in project | Tailwind v4 is CSS-first. All tokens defined in `src/index.css` under `@theme {}`. The old config file from the initial setup is obsolete. | src/index.css |
| 2026-04-02 | `@heroui/styles` imported in `src/index.css` instead of separate Tailwind import | `@heroui/styles` bundles `@import "tailwindcss"` internally. Adding a separate Tailwind import causes conflicts. | src/index.css |
| 2026-04-02 | PageShell is a pure layout wrapper — no data coupling | PageShell removed all mock data imports and countdown hook. It is now a clean layout shell only: 390px frame on bg-soft canvas. Pages own their own data. | components/PageShell.jsx |
| 2026-04-02 | UI components cleared for fresh build | All `src/components/ui/` components deleted. Being rebuilt from scratch per updated spec and HeroUI v3 patterns. | src/components/ui/ |
| 2026-04-02 | Added `@gravity-ui/icons` v2.18 alongside `lucide-react` | Gravity UI has a richer icon set for domain-specific needs (files, AI, academic). Both libraries used together — lucide for standard UI icons, Gravity UI for specialized ones. Browse at https://preview.gravity-ui.com/icons/ | package.json, all components |

---

## Overrides Log
> If Claude suggests something and Akash overrides it, log it here.

| Date | Claude Suggested | Akash Override | Reason |
|---|---|---|---|
| 2026-04-02 | Keep static Airbnb list panel for OrientationPanel | Revert to swipeable 3-panel carousel | User spec requires carousel with progress dots, back/next arrows, disabled CTA on panels 1–2 |
| 2026-04-02 | Airbnb flat layout with no cards (hr dividers, no shadows) | Restore card-based layout with shadow-sm, rounded-xl, gap-4 | Regression — card system is the correct production pattern |
| 2026-04-02 | Keep HeroUI Chip for "Not started" status | Custom inline dot + label pill | Spec explicitly defines: `rounded-full bg-gray-100 text-text-secondary` with gray dot |
