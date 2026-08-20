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
| Total document height | 10,307 vs production 12,344 — the gap is the redesigned How I think section |

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
| Calibration | −2,131 | **deliberate.** The 3D can was cut and the section rebuilt; it no longer pins for 320% of the viewport |
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

## How I think — the can

The 3D can is gone and so is the shelf sequence that briefly replaced it.
`CanScene.tsx`, `CanFallback.tsx` and `ShelfCalibration.tsx` are all deleted.
The section is now `CalibrationCan.tsx`: hand-drawn SVG, one mechanic.

**Why the shelf was cut.** It ran seven different mechanics — bracket, off-shelf
leader, re-sort, veil, narrowing rail, lift — so nothing accumulated and it read
as seven tricks. It also anchored on *"where it sits against everything beside
it"*, one row of seven, when the copy's thesis is its first line: *a product
isn't one big idea, it's dozens of small decisions.*

**The concept.** Open on five facings on a rail, all equal, nothing chosen. The
other four fade, the rail clears, and from the empty frame a single can **draws
itself, one part per row**. Nothing ever leaves; every beat adds. At Result the
label band turns amber and a ground line returns beneath it.

| Beat | Part drawn |
|---|---|
| 01 Audience | the shelf resolves to one, then the base curve |
| 02 Product | the body sides |
| 03 Positioning | the neck |
| 04 Price | the rolled rim |
| 05 Message | the lid, rivet and tab |
| 06 Channel | the label band |
| 07 Result | band turns amber, ground line returns |

The parts are deliberately **unlabelled**. The drawing accumulates as the
thinking accumulates; claiming "Audience *is* the base" would be a false
mapping.

**Drawing the can.** Depth is perspective alone — every horizontal shares one
viewing angle (minor/major 0.24), the base shows only its front curve because
the back is behind the body, and the neck is a short concave taper. Real 355ml
proportions: 1.9:1, necking in only over the top ~10%. An earlier pass used long
straight tapers top and bottom and read as an octagon.

**Mechanics.** One timeline pinned to duration 1 (the `GapDivergence` idiom),
scrubbed by a ScrollTrigger on the rows container at `top 20%` / `bottom 55%`.
Beat *k* fires at `k/7 + 0.015`. The lit row is read from `tl.progress()`, not
the trigger's, so copy and drawing cannot drift apart. Layout is two columns
with the can `position: sticky` in the left one — no pin, no spacer.

**Three traps, all hit while building this.**

1. **`vector-effect: non-scaling-stroke` breaks stroke-dashoffset drawing.** The
   browser measures the dash array in screen units while `getTotalLength()`
   returns user units, so at any SVG scale other than 1 the gap stops covering
   the path and undrawn segments leak fragments. It is removed here. Note
   `GapDivergence.tsx` still uses it — it gets away with it only because its
   viewBox renders at roughly 1:1.
2. **A round line-cap paints a dot on a zero-length dash**, which is exactly
   what an undrawn segment is. Caps are `butt`, the gap is `2 * len` (a tight
   margin lets the tail wrap back in, since `getTotalLength()` under-reports
   curves), and each part's group is held at `opacity: 0` until its beat.
3. **Below `lg` the can and the rows share a column**, so the sticky can needs
   its own `bg-ink` and its own noise overlay for rows to pass behind it, and it
   must pin to `top-0` or rows reappear above it. The wrapper uses `contents
   lg:block` so the sticky element gets a tall containing block at every width.

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
