# Handoff — current state and next task

Written so a fresh session can resume without prior conversation.
Read `CLAUDE.md` first for the non-negotiables.

Repo: `/Users/abdullahabouselmi/Downloads/PrismaInspired`
Production: `https://prismainspired.vercel.app` (Vercel project `prismainspired`,
team `abdullah-as-elmi`)

---

## The one thing to understand

**The repo does not match production, and production is the approved look.**

The working tree carries a typography/layout pass that was never approved
(Fontshare faces, one oversized type scale, a single wide grid). Production was
deliberately rolled back away from it. Everything since then must sit on top of
production's look.

**There is no git route back.** `02f718a` is the *root* commit and contains the
entire project, so reverting it deletes everything. The pre-typography source
exists nowhere in version control. Restoration is therefore a **reconstruction
guided by measurement of the live site**, which is why the table below exists.

## Commit history

| Commit | What it is | Keep? |
|---|---|---|
| `a255402` | The Gap: scroll-driven divergence→resolution SVG | **Yes** — additive |
| `c8d9ee7` | Phase 0: motion foundation hardening | **Yes** — no visual output |
| `88678dc` | Empty checkpoint before Phase 0 | — |
| `02f718a` | Root commit. Contains the whole project **including the unapproved typography pass** | Cannot be reverted |

## Measured production baseline (live, 1440px)

Faces: `Almarai 300/400/700/800` + `Instrument Serif 400 italic` (Google Fonts).
Body 16px/400. **Total document height 12,344px** — the single best signal that
a restoration is complete.

| Section | bg | pad Y | container | pad X | h2 | body |
|---|---|---|---|---|---|---|
| Hero | ink | 24 | — | 0 | — | — |
| About | paper | 128 | none | 0 | 60/400 | 16/400 |
| Manifesto | ink | 128 | 1152 | 24 | **72**/400 | 16/400 |
| The Gap | paper | 128 | 1024 | 24 | 60/400 | 16/400 |
| Services | ink | 128 | 1280 | 24 | 48/400 | 16/400 |
| Process | paper | 128 | 1280 | 24 | 48/400 | 16/400 |
| Calibration | ink | **160** | 1280 | 24 | 48/400 | 16/400 |
| Work | paper | 128 | 1152 | 24 | 48/400 | **14**/400 |
| Who I work with | paper | **96** | 1024 | 24 | 36/400 | 16/400 |
| Contact | ink | 0 | 1024 | 24 | **72**/400 | 16/400 |

Eyebrow: 12px / weight 400 / tracking 1.2px / uppercase / amber — **no square**.

Re-measure any time with the live site as the target; do not trust the repo.

## NEXT TASK — restore the foundation

Full plan: `~/.claude/plans/you-are-acting-as-tidy-snowflake.md`

1. **`index.html`** — swap the three Fontshare links for Google Fonts:
   `Almarai:wght@300;400;700;800` and `Instrument+Serif:ital@1`.
2. **`tailwind.config.js`** — `fontFamily.sans` → Almarai stack;
   `fontFamily.serif` → `"Instrument Serif"`; drop `fontFamily.display`.
   Leave colour tokens alone.
3. **`src/index.css`** — retune the six scale classes (`display-hero`,
   `display-1`, `display-2`, `body-lg`, `body-base`, `label`) to the measured
   values. Weight **400**, not 600/700. Production uses four headline sizes, so
   `display-1` becomes the 48px default and sections needing 72/60/36 set it
   explicitly.
4. **`src/components/Eyebrow.tsx`** — 12px / 400 / tracking 1.2px, remove the
   accent square.
5. **`src/components/Grid.tsx`** — add a `width` prop
   (`'sm' | 'md' | 'lg'` → 1024 / 1152 / 1280, default 1280) and `px-6`.
   Each section passes its measured width.
6. **Section rhythm** — one padding class per section file: 128 everywhere,
   except Calibration 160, Who I work with 96, Contact 0.
7. **Re-tune `GapDivergence.tsx`** — required. Its `STAGES` boundaries were
   measured against the *current* Gap section; restoring production's type and
   containers changes that section's height, so the old anchors
   (0.322 / 0.398 / 0.422 / 0.446 / 0.601) will move. Re-measure and update.

### Do not touch

`Hero.tsx`, `Preloader.tsx`, `useHeroParallax.ts`, `src/lib/motion.ts`,
`MaskReveal`, `FadeUp`, `Reveal`, `ImageReveal`, `CanScene`/`Calibration`
behaviour, Lenis config, `public/hero-poster.png`, `public/hero-loop.mp4`,
`public/portrait.webp`.

## Verification

1. `npx tsc -b --noEmit` and `npm run build` clean.
2. **Diff against production, not against intent.** Load the live site and a
   local `vite preview` of the production build at 1440 and assert equality on:
   registered font faces, per-section `h2` size/weight, container
   `max-width`/padding, section `padY`, and total document height (12,344px).
3. No horizontal overflow at 1440 / 1024 / 768 / 375.
4. `reducedMotion: 'reduce'` — all content visible, zero Three.js requests.
5. Hero geometry fingerprint unchanged (section, `h1`, `nav`, scroll-button
   boxes and computed font size).
6. Re-capture The Gap's four stages after re-tuning.
7. Commit the restoration on its own, separate from later creative work.

## Known state and risks

- **Assets:** `hero-poster.png` is 29.7MB and sits in the critical path as the
  video poster — frozen by instruction, but it dominates load time.
  `portrait.webp` is 0.9MB (was 19.9MB; PSNR 41.3dB at render size).
  `public/` totals ~42MB, so deploys are slow.
- **GSAP registers ~117 of its own resize listeners**, one per ScrollTrigger.
  That is by design, not a leak. Our own bus is exactly one listener.
- **Vite dev duplicates `src/lib/motion.ts`**, so the dev server shows 2 bus
  listeners where production correctly shows 1. Dev-only artifact.
- Preview deployments are SSO-gated; only the production alias is public.
- Placeholder copy still marked `// TODO:` in Services, Process, Work,
  Who I work with, and Contact (email + LinkedIn).
