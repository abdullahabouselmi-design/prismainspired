# Handoff — current state and next task

Written so a fresh session can resume without prior conversation.
Read `CLAUDE.md` first for the non-negotiables.

Repo: `/Users/abdullahabouselmi/Downloads/PrismaInspired`
Production: `https://prismainspired.vercel.app` (Vercel project `prismainspired`,
team `abdullah-as-elmi`)

---

## State: the foundation has been restored

The repo's visual layer now matches production. The unapproved typography pass
(Fontshare faces, one oversized scale, a single 1600px grid) is gone; Almarai +
Instrument Serif, the measured type scale, the per-section containers and the
section rhythm are back. Phase 0's motion infrastructure and The Gap SVG were
kept — they sit on top of production's look rather than replacing it.

Production's source was never in version control, so this was a reconstruction
from measurement. Two artefacts made that reliable and are worth reusing:

- Production's built CSS and its live DOM are the real specification. Fetch
  `https://prismainspired.vercel.app/assets/index-*.css` and read computed
  styles off the live page; do not trust the repo or this file over that.
- Production carries **no type-scale classes at all** — it uses inline Tailwind
  utilities plus one global `* { font-family: Almarai … }` rule. The repo keeps
  its six scale classes, tuned so they resolve to production's exact values at
  every breakpoint.

## Verified against production (1440 × 900, both loaded and settled)

| Check | Result |
|---|---|
| Registered font faces | identical |
| Body type | Almarai 16px/400, identical |
| Section `padY` (all 10) | identical |
| Container `max-width` / padding (all 10) | identical |
| `h2` size / weight / line-height (all 9) | identical |
| Eyebrow 12px/400/1.2px uppercase, no square | identical |
| Horizontal overflow at 1440/1024/768/375 | none |
| `reducedMotion: 'reduce'` | no Three.js request, no hidden text, no stranded `data-reveal` |
| Total document height | 10,699 vs production 12,344 — see below; the gap is now the redesigned How I think section |

`npx tsc -b --noEmit` and `npm run build` are clean.

**Measure production with the preloader and fonts settled** (~4s, then await
`document.fonts.ready`). Measured too early it reports ~11,588px, not 12,344.

## Known deviations, and why

The +90px is the sum of section-height differences that are **structural, not
typographic**. Production's markup differs from the repo's, and the repo keeps
its Phase 0 component architecture by instruction:

| Section | Δ | Cause |
|---|---|---|
| Manifesto | −84 | production centres the copy in a `rounded-2xl bg-panel` card; repo uses a left-aligned grid |
| The Gap | +89 | repo adds the GapDivergence layer and splits the copy differently |
| Services | +104 | production has an intro paragraph the repo does not, and a different card grid |
| Calibration | −1,847 | **deliberate.** The 3D can was cut and the section rebuilt around the shelf; it no longer pins for 320% of the viewport |
| Work / Who / Contact | +88 / +96 / −95 | markup structure |

Three items were left alone deliberately — each needs a decision, not a fix:

1. **Hero nav.** Production is 14px sentence case; the repo's nav uses the
   shared `.label` class, so it renders 12px uppercase tracked. Closing this
   needs one token changed in `Hero.tsx` (`label` → `text-sm`), and `Hero.tsx`
   is frozen, so it was not touched. Everything else in Hero matches
   production exactly: section box, scroll-button box, and the `h1` at
   79.2px/800, leading 68.112px, tracking −2.376px, glyph width 427.7px.
2. ~~Calibration pin geometry~~ — resolved. The pin is gone entirely; the
   shelf is `position: sticky` and the rows scroll beneath it, so there is no
   pin spacer and no `+=320%` to reconcile against production.
3. **About portrait width.** Production's image column is `45vw` (648px); the
   repo's 12-column grid gives 590px. Both bleed to `x: 0`. Matching exactly
   means replacing About's grid with production's `lg:grid-cols-[45vw_1fr]`.

## Commit history

| Commit | What it is |
|---|---|
| *(this one)* | Restore production as the visual foundation |
| `a255402` | The Gap: scroll-driven divergence→resolution SVG |
| `c8d9ee7` | Phase 0: motion foundation hardening |
| `88678dc` | Empty checkpoint before Phase 0 |
| `02f718a` | Root commit — contains the whole project **including the unapproved typography pass**, so it cannot be reverted |

## The type scale (`src/index.css`)

Sizes are Tailwind's own steps, so each class carries Tailwind's paired
line-height and resolves identically to production at every breakpoint.
Headlines are weight 400 — preflight sets `h1–h6 { font-weight: inherit }`.

| Class | Resolves to (1440) | Used by |
|---|---|---|
| `display-hero` | 5.5vw / 800 / 0.86 / −0.03em | Hero only |
| `display-1` | 48/400 | Services, Process, Calibration, Work |
| `display-2` | 24/700 | Services `h3` |
| `body-lg` | 18/400 | Gap closing line, Calibration result |
| `body-base` | 16/400 | body copy everywhere |
| `label` | 12/400/1.2px uppercase | eyebrows and small labels |

Production renders four headline sizes, so sections needing 72/60/36 add the
step explicitly: About `lg:text-6xl`, Manifesto `lg:text-6xl xl:text-7xl`,
The Gap `lg:text-6xl` + `tracking-[-0.02em]`, Contact and Who I work with set
their own ladders.

`Grid` takes `width`: `sm` 1024 · `md` 1152 · `lg` 1280 (default) · `full`
(no max-width, About only). Gutters are 24px at every breakpoint, which
`--bleed` mirrors for `.full-bleed`.

## How I think — the shelf

The 3D can is gone. `CanScene.tsx` and `CanFallback.tsx` are deleted, and with
them the 814KB lazy chunk; the section is now `ShelfCalibration.tsx`, hand-drawn
SVG driven by GSAP.

**The concept.** Nine pack outlines on a rail. Nothing is chosen at the start —
all nine at equal weight, no annotation. Each row then performs one *relation*,
never a measurement: rulers and dimension lines were rejected deliberately
because they read as packaging design rather than strategy.

| Beat | What the shelf does |
|---|---|
| 01 Audience | a bracket groups the set that was ever in play; the rest drop to 0.15 |
| 02 Product | ours resolves to full weight and gains its cap detail |
| 03 Positioning | a dashed outline appears **off** the shelf, joined by an amber-deep leader — the habit isn't on this shelf |
| 04 Price | the shelf re-sorts along the rail; ours holds slot 4 and everything moves around it |
| 05 Message | an ink veil erases everything below the top third — the first three seconds |
| 06 Channel | the rail scales to 0.58 and the outlying facings drop; the stage recentres on ours |
| 07 Result | ours turns amber, lifts off the rail, is restocked, lifts again, and **ends present** |

**Mechanics.** One timeline pinned to duration 1 (the `GapDivergence` idiom),
scrubbed by a ScrollTrigger on the rows container at `top 50%` / `bottom 72%`.
Beat *k* fires at `k/7 + 0.015` and runs for 0.085. The lit row is read from
`tl.progress()`, **not** from the trigger's progress, so the copy and the shelf
can never be a beat apart while the scrub catches up — verified sample by
sample. Below `md` the viewBox crops to the middle five facings.

**Two traps, both hit during the build.** Placement must live on an outer `<g>`:
writing GSAP `x`/`y` onto a group that already carries a `transform="translate()"`
attribute *replaces* the placement and collapses every facing onto one spot.
And the sticky shelf shares a wrapper with the rows — sticky is bounded by its
parent, so without the wrapper it lingers over the section's bottom padding
after the last row has gone.

**Known nit:** on mobile the active row's label can sit behind the sticky shelf
as it scrolls through. Transient, but worth a look if the section gets revisited.

## The Gap animation

`GapDivergence.tsx`'s `STAGES` were re-measured after the restoration — the
section is shorter now, so the copy runs progress **0.40→0.78**, not the old
0.32→0.60. Anchors: 0.420 first paragraph · 0.477 "Six people approve" ·
0.537 "So before you brief" · 0.738 closing line. All four stages were
re-captured and confirmed: deck holds at 0.40, full divergence at 0.53,
converging at 0.66, diamond complete at 0.80.

**Re-measure these whenever the Gap section's height changes.**

## Verifying

`.claude/launch.json` has a `preview` config (`vite preview`, port 4173).
The in-app browser pane pauses rAF when hidden, which stalls Lenis and leaves
reveals unplayed — drive scroll-dependent checks with Playwright instead
(it is already in `node_modules`). Lenis lerps toward an accumulated target,
so wheel the whole remaining delta once and wait ~700ms rather than nudging.

## Known state and risks

- **Assets:** `hero-poster.png` is 29.7MB and sits in the critical path as the
  video poster — frozen by instruction, but it dominates load time.
  `portrait.webp` is 0.9MB. `public/` totals ~42MB, so deploys are slow.
- **GSAP registers ~117 of its own resize listeners**, one per ScrollTrigger.
  That is by design, not a leak. Our own bus is exactly one listener.
- **Vite dev duplicates `src/lib/motion.ts`**, so the dev server shows 2 bus
  listeners where production correctly shows 1. Dev-only artifact.
- Preview deployments are SSO-gated; only the production alias is public.
- Placeholder copy still marked `// TODO:` in Services, Process, Work,
  Who I work with, and Contact (email + LinkedIn).
- Nothing has been deployed. The restoration and the shelf are committed but
  not shipped.
- `ProcessIcons.tsx`'s `IconLocate` has no `data-fade` element, so
  `Process.tsx:81` tweens an empty array and GSAP logs one "target not found"
  warning per load. Cosmetic, pre-existing, unfixed.
