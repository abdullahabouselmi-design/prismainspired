# Handoff — current state and next task

Written so a fresh session can resume without prior conversation.
Read `CLAUDE.md` first for the non-negotiables.

Repo: `/Users/abdullahabouselmi/Downloads/PrismaInspired`
GitHub: `https://github.com/abdullahabouselmi-design/prismainspired` (private)
Production: `https://abdullahabouselmi.com` (also `www.`, and the original
`https://prismainspired.vercel.app` alias still resolves). Vercel project
`prismainspired`, team `abdullah-as-elmi` — connected to the GitHub repo, so a
push to `main` deploys to production on its own. The domain is registered *at*
Vercel and uses Vercel nameservers, so there is no third-party DNS to edit.

---

## Where things stand

**The repo and production are in sync and everything is shipped.** Working tree
clean at `1904b85`, pushed to `origin/main`. The live alias serves the build
Vercel produced from that commit. There is no outstanding work in flight.

The site is a single scrolling document, ten sections, no router:

    Hero · About · Manifesto · The Gap · Services · Process
    Calibration · Work · Who I work with · Contact

**The repo is the source of truth, not the deployed site.** An earlier session
reconstructed production's typography after an unapproved pass; that is done and
the invariant has since been deliberately broken. Typography (Almarai +
Instrument Serif, the six scale classes, the four headline sizes) is frozen.
**Layout is not.** One container width (1280) for every section, headlines on one
line, vertical space cut hard. Do not "restore" spacing or per-section container
widths to match anything older — that divergence is intentional.

## The section visuals, and what drives them

| Section | Visual | Component |
|---|---|---|
| Hero | video loop, parallax | `Hero.tsx` (**frozen**) |
| Services | four rotating point-cloud packs | `ProductCloud.tsx` |
| Calibration | a can that splits into six bands on scroll | `CalibrationCan.tsx` |
| Work | two colour logo marquees | `Work.tsx` + `public/logos/**` |
| Who I work with | audience marquee | `WhoThisIsFor.tsx` |
| Contact | revolving STRATEGY MADE SEEN ring | `SpinningText.tsx` |

Everything is 2D canvas or SVG driven by GSAP. **No 3D** — three, R3F and drei
were removed with the old Calibration can; reintroducing them costs a ~814KB
chunk, so don't without a reason that earns it.

## Traps already hit. Do not rediscover these.

1. **`vector-effect: non-scaling-stroke` silently breaks `stroke-dashoffset`
   drawing.** The browser measures the dash array in screen units while
   `getTotalLength()` returns user units, so at any SVG scale but 1:1 the gap
   stops covering the path and undrawn segments leak fragments.
2. **A round line-cap paints a dot on a zero-length dash** — which is exactly
   what an undrawn segment is. Use `butt` caps and a gap of `2 * len`.
3. **`max-h-full` on an image gives it no definite dimension**, so it lays out
   0×0, never intersects the viewport, and `loading="lazy"` never fires. Use
   `h-full` and let width come from the width/height attributes.
4. **A CSS rotation on an `<svg>` grows its bounding box by up to 41%** and
   caused horizontal overflow. Rotate a group *inside* the SVG instead.
5. **Grid auto-placement will silently displace things.** The Contact badge
   needs `lg:col-start-9`; without it, it lands in column 1. An eyebrow at
   `lg:col-span-12` cannot share a row with it and gets pushed below the
   headline.
6. **The in-app browser pane pauses rAF when hidden**, which stalls Lenis and
   leaves reveals unplayed. Drive scroll checks with Playwright (already in
   `node_modules`). Lenis eases toward an accumulated target, so wheel the whole
   remaining delta once and wait ~700ms rather than nudging.
7. **`vercel deploy --prod` has not always moved the alias.** Always confirm the
   live bundle hash matches `dist/index.html`, and `vercel promote <url>` if not.
   This applies to *manual* CLI deploys. Builds triggered by a push to `main`
   are promoted by Vercel itself and have not shown this problem.
8. **Vercel's GitHub App grants access per repository.** It was installed but
   scoped to one unrelated repo, so `vercel git connect` failed with a
   misleading "make sure there aren't any typos" error. The fix is *Adjust
   GitHub App Permissions* on the project's Settings -> Git page, not
   re-authenticating.

## Open items

- **`hello@example.com` in `Contact.tsx` is a placeholder and is live.** Highest
  priority. The LinkedIn URL beside it is real (`/in/aaselmi/`).
- `{/* TODO: copy */}` on the CTA label in `BookACall.tsx` and
  `ScrollDownButton.tsx`. The Calendly URL is real.
- `ProcessIcons.tsx`'s `IconLocate` has no `data-fade` element, so
  `Process.tsx` tweens an empty array and GSAP logs one "target not found"
  warning per load. Cosmetic, pre-existing.
- `hero-poster.png` is 29.7MB and sits in the critical path as the video poster.
  Frozen by instruction, but it dominates load time. `public/` is ~42MB.

## Verifying

```bash
npx tsc -b --noEmit && npm run build
```

Then serve `dist/` (`.claude/launch.json` has a `preview` config on port 4173)
and check with Playwright at 1440 / 1024 / 768 / 375:

- no horizontal overflow (`scrollWidth === clientWidth`)
- zero failed `/logos/` requests
- one content left-edge per breakpoint, plus About's intentional full bleed
- every `h2` on one line except **Manifesto** and **The Gap**, which cannot fit
  and stay two-line by decision
- under `reducedMotion: 'reduce'`: marquees and the ring static, canvases
  painted once, no hidden copy, nothing stranded at `data-reveal="pending"`

## Deploying

Pushing to `main` builds and deploys to production automatically. Any other
branch gets its own preview URL, so branch when you do not mean to ship.

```bash
git push origin main
```

The manual CLI route remains available as an override:

```bash
npm run build && npx vercel deploy --prod --yes
```

After a *manual* deploy, confirm the alias moved:

```bash
curl -s https://prismainspired.vercel.app/ | grep -o 'assets/index-[A-Za-z0-9_-]*\.js'
grep -o 'assets/index-[A-Za-z0-9_-]*\.js' dist/index.html
```

If they differ, `npx vercel promote <deployment-url> --yes`. Roll back with
`npx vercel rollback <deployment-url>`.
