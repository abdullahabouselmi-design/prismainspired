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
| Total document height | **superseded** — see the compaction pass below. No longer a check against production. |

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
| The Gap | small | the repo splits the copy differently; the GapDivergence layer is gone |
| Services | +104 | production has an intro paragraph the repo does not, and a different card grid |
| Calibration | −2,000 approx | **deliberate.** The 3D can was cut and the section rebuilt; it no longer pins for 320% of the viewport |
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

Three versions of this section have now been cut: the original 3D can
(`CanScene.tsx`, 814KB of three.js), a shelf sequence, and an SVG can that drew
itself part by part. All three are gone. What is there now is a **2D canvas
point cloud** — the same technique as `abdullahabouselmi.vercel.app`, which is
the user's own other site, adapted to bone-on-ink.

**Why the earlier two were cut.** The shelf ran seven different mechanics, so
nothing accumulated and it read as seven tricks. The drawn SVG can was one
mechanic but too quiet. Both were rejected on sight; do not revive either
without a specific reason.

**The concept.** A can built from ~14,000 points on a surface of revolution.
It sits whole and unmarked, turning slowly. Each row peels one horizontal band
away from the stack — six bands for the six components — and the band being set
lights amber. At Result the bands reseat into one can carrying a single amber
band around its middle.

**Mechanics.** Not GSAP-tweened. A `ScrollTrigger` writes scroll progress into a
ref; a `requestAnimationFrame` loop eases the drawn value toward it and repaints.
The loop only runs while the trigger is active (`onToggle`) and never starts
under reduced motion, which paints one finished frame instead.

Per point: position on the lathe, a normal, a band index, and a brightness.
Per frame: each band gets its own vertical offset and its own yaw, then a
hand-rolled perspective projection (`s = focal / dz`), a facing term so points
whose surface turns toward the viewer carry the light, and a size/alpha falloff
by depth. Rendering is **two passes** — one bone, one amber — so the fill colour
changes twice per frame rather than 14,000 times.

`focal` is derived from the canvas box (`min(1.15h, 2.7w)`) so the can fills
whatever frame it is given, and pulls back by 32% as it opens so the full spread
of six bands still fits. A fixed focal clipped the can on mobile.

Layout is two columns with the canvas `position: sticky` in the left one. Below
`lg` the can and rows share a column, so the sticky element needs its own
`bg-ink` and noise overlay for rows to pass behind it, must pin to `top-0`, and
its wrapper uses `contents lg:block` to get a tall containing block at any width.

**Point counts:** 6,500 below 700px, 14,000 above. Buffers are typed arrays and
are rebuilt on the shared resize bus.

## Layout pass — containers, headlines, compaction

The production-matching invariant is **retired**. Three deliberate divergences,
directed by the owner:

- **One container width.** Every section is `Grid width="lg"` (1280). Previously
  the page walked `full → 1152 → 1024 → 1280 → 1280 → 1280 → 1152 → 1024 → 1024`,
  so almost no two sections' content started at the same x. About stays `full`
  because its portrait bleeds off the left edge.
- **Headlines on one line.** The binding constraint was `max-w-[NNch]` on each
  `h2`, not the column span — `WordsPullUpMultiStyle` adds no per-word spans, so
  removing the cap simply reflows. Caps are gone everywhere except **Manifesto**
  (needs 1599px at 72px — impossible at 1440) and **The Gap** (its italic second
  clause is a deliberate `startsNewLine` break). About's headline still wraps: it
  sits in a narrow column beside the portrait.
- **Compaction.** Sections went `py-24 md:py-32` → `py-16 md:py-20`, BoundaryGap
  `12vh` → `6vh`, and Calibration's rows `py-14` → `py-6`. Document height
  **10,331 → 7,945px at 1440, a 23% cut.**

## Services — particle product cards

`ServiceIcons.tsx` is deleted. Each card now carries a `ProductCloud.tsx` — the
same point-cloud technique as the can, but with no scroll coupling and no bands:
idle rotation, one fill colour, ~2,200 points, gated by an `IntersectionObserver`
so off-screen cards cost nothing (verified: painting on screen, fully paused off).

Forms are bottle / carton / tub / can, toned bone / amber alternating. **End caps
matter**: without a scatter across the top and bottom faces a carton is a hollow
ring of dots and reads as a blob. Equal card heights need `h-full` on *both* the
`Reveal` and the `<article>`, because `Reveal` interposes a div; the closing rule
uses `mt-auto` so the rules line up across a row.

## Section joins — no bands, no crossfade

`BoundaryGap.tsx` and `PageBackground.tsx` are **deleted**. They are not coming
back: the mechanism was an empty 6vh band with the page background interpolating
ink to paper behind it, and mid-scroll that band rendered as a muddy in-between
colour — a visible third stripe at every join, which is exactly what it was
meant to avoid.

Sections now **lap over each other**. Every section from About down carries
`relative z-10 -mt-8 rounded-t-[1.75rem] md:-mt-12 md:rounded-t-[2.5rem]`, so
each one rises over the one above with a rounded top. The corner cut-out reveals
the *previous section*, never the page background, so no intermediate colour can
ever appear. Equal `z-10` plus DOM order does the stacking; no per-section
z-index ladder is needed.

Two consequences worth knowing:

- `html { background-color: #0b0907 }` in `index.css` is now the only page
  background, and it is only visible above the Hero.
- Removing the eight bands took roughly 780px off the document (8,001 → 7,221 at
  1440).

## The badge

`SpinningText.tsx` is a ring of type on an SVG `textPath`, with `textLength`
pinned to the circumference and `lengthAdjust="spacing"` so the phrase closes
its own loop cleanly. It lives in **Who I work with**, hard right, with the four
`ProcessIcons` cycling at its centre in amber on a 2.6s interval.

**The spin must stay on a group inside the SVG, never on the `<svg>` element.**
Rotating the element grows its bounding box by up to 41%, which pushed past the
container and caused horizontal overflow at 1024 and 768 where there is no spare
margin to absorb it.

## The Gap

`GapDivergence.tsx` is **deleted**. The scroll-driven SVG that scattered six
shapes and resolved them into a diamond was removed at the user's request; the
section is now copy only. Do not reinstate it.

One thing learnt there is worth keeping, because it will bite again:
**`vector-effect: non-scaling-stroke` silently breaks `stroke-dashoffset`
drawing.** The browser measures the dash array in screen units while
`getTotalLength()` returns user units, so at any SVG scale other than 1:1 the
gap stops covering the path and undrawn segments leak fragments. Also, a round
line-cap paints a dot on a zero-length dash — which is exactly what an undrawn
segment is. Use `butt` caps, a gap of `2 * len`, and hold each part at
`opacity: 0` until it is due.

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
