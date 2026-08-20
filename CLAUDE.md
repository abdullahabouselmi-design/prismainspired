# PrismaInspired — working agreement

Personal portfolio for Abdullah Abou Selmi. Read `HANDOFF.md` for current state
and the next task.

## Non-negotiables

1. **`https://prismainspired.vercel.app` is the frozen visual foundation.**
   Its fonts, type sizes, spacing and look are approved and must not change.
   All new work sits *on top of* it. When in doubt, measure the live site —
   it is the source of truth, not this repo.

2. **`Hero.tsx` is frozen.** No visual, animation, timing, layout, typography
   or behavioural changes. Also frozen: `Preloader.tsx` (including its 2.2s
   floor), `useHeroParallax.ts`, `public/hero-poster.png`, `public/hero-loop.mp4`.
   If a project-breaking issue forces a change, stop and explain first.

3. **`framer-motion` stays installed** solely because Hero uses it. Every other
   component has been ported to GSAP. Do not remove the package, and do not
   reintroduce it anywhere else.

4. Copy, section order and information architecture are approved. Do not
   rewrite, shorten, reorder, merge or add sections.

5. No new dependencies without asking. No gradients, glassmorphism, bright
   colour, or generic "AI" aesthetics. Motion must carry meaning, not decorate.

## Stack

React 18.3.1 · Vite 8 · Tailwind 3.4 · TypeScript. Client-side SPA, no router —
one scrolling document with in-page anchors.

Motion: GSAP 3.15 (`ScrollTrigger`, `SplitText`, `CustomEase`) + Lenis 1.3.
Shared infrastructure lives in `src/lib/motion.ts` — font gating, one debounced
`ScrollTrigger.refresh()`, one resize bus, reveal gating. **Use it.** Do not add
per-component resize listeners or extra `refresh()` calls.

3D: React Three Fiber 8 + drei 9 + three 0.169, pinned to the v8 line because
R3F 9 requires React 19. Lazy-loaded, gated on reduced-motion and a WebGL probe.

## Rules that keep motion reliable

- Nothing that measures text lines may run before `fontsReady()` resolves.
- Reveal components set their hidden state via `data-reveal` in CSS, then GSAP
  clears it. Never set the hidden state in `useEffect` alone.
- GSAP owns `transform`. Do not add blanket CSS transitions on it.
- A GSAP timeline takes its duration from its contents; pin it to 1 if you are
  mapping ScrollTrigger progress onto it directly.
- Everything must degrade under `prefers-reduced-motion`: all content visible,
  no smooth scroll, no cursor, no parallax, no WebGL request.
- No horizontal overflow at 375 / 768 / 1024 / 1440.

## Deploying

```bash
npm run build
npx vercel deploy --prod --yes    # public alias
npx vercel deploy --yes           # preview (SSO-gated, owner-only)
```

Only the production alias is publicly viewable; preview URLs sit behind Vercel
deployment protection. Roll back with `npx vercel rollback <deployment-url>`.
