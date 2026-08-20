import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

const INK = '#0B0907'
const AMBER_DEEP = '#8F5F2C'
const C = 210 // centre of the 420 viewBox

/**
 * Six interpretations of one deck. Deliberately uneven: different directions,
 * distances, rotations and settled scales, so it reads as divergent readings
 * rather than a symmetrical explosion.
 */
const SHAPES = [
  { id: 'circle', dx: 126, dy: -82, rot: -18, scale: 1.22, at: 0.0 },
  { id: 'square', dx: -140, dy: 44, rot: 14, scale: 0.78, at: 0.025 },
  { id: 'rect', dx: 72, dy: 130, rot: 22, scale: 1.05, at: 0.008 },
  { id: 'triangle', dx: -94, dy: -126, rot: -9, scale: 0.92, at: 0.04 },
  { id: 'pentagon', dx: 156, dy: 32, rot: 7, scale: 0.71, at: 0.016 },
  { id: 'rounded', dx: -44, dy: -150, rot: -24, scale: 1.28, at: 0.05 },
]

type Stages = {
  deckOut: number
  divergeStart: number
  divergeEnd: number
  holdEnd: number
  convergeEnd: number
  drawStart: number
  drawEnd: number
}

/**
 * Tuned to measured copy positions at 1440, not to assumed percentages.
 * Re-measured after the production type scale and the 1024px container were
 * restored: the section is shorter now, so the copy sits later in the trigger
 * than it did before. The body runs 0.40 to 0.78, not the 0.32 to 0.60 the
 * previous anchors were cut against.
 *
 *   0.420  first paragraph centred   -> deck still up
 *   0.477  "Six people approve..."   -> divergence underway
 *   0.537  "So before you brief..."  -> convergence begins
 *   0.598  end of that paragraph     -> convergence underway
 *   0.738  closing line centred      -> diamond complete
 *
 * Everything resolves by ~0.76 and the diamond then holds for the remainder,
 * which is what the brief asks for.
 */
const STAGES: Stages = {
  deckOut: 0.44,
  divergeStart: 0.46,
  divergeEnd: 0.52,
  holdEnd: 0.54,
  convergeEnd: 0.76,
  drawStart: 0.6,
  drawEnd: 0.74,
}

export function GapDivergence() {
  const root = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = root.current
    if (!svg) return

    const diamond = svg.querySelector<SVGPathElement>('[data-diamond]')
    const deck = svg.querySelector<SVGGElement>('[data-deck]')
    const shapes = gsap.utils.toArray<SVGGElement>('[data-shape]', svg)
    const drifts = gsap.utils.toArray<SVGGElement>('[data-drift]', svg)

    // Reduced motion: the resolved state only. No shapes, no scroll linkage.
    if (prefersReducedMotion()) {
      if (deck) deck.style.opacity = '0'
      shapes.forEach((s) => (s.style.opacity = '0'))
      if (diamond) {
        diamond.style.opacity = '1'
        diamond.style.strokeDasharray = 'none'
        diamond.style.strokeDashoffset = '0'
      }
      return
    }

    const ctx = gsap.context(() => {
      const length = diamond?.getTotalLength() ?? 0

      gsap.set(deck, { opacity: 0 })
      gsap.set(shapes, { opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.2 })
      if (diamond && length) {
        gsap.set(diamond, {
          opacity: 1,
          strokeDasharray: length,
          strokeDashoffset: length,
        })
      }

      const { deckOut, divergeStart, divergeEnd, holdEnd, convergeEnd, drawStart, drawEnd } =
        STAGES

      // A normalised timeline: 1 unit of timeline == full section progress.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: svg.closest('section'),
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: 1,
        },
      })

      // Stage 1 — the deck, present while the first paragraph is read.
      tl.to(deck, { opacity: 1, duration: 0.1 }, 0)
      tl.to(deck, { opacity: 0, duration: 0.05 }, deckOut)

      // Stage 2 — divergence. Each interpretation leaves at its own rate.
      SHAPES.forEach((shape, i) => {
        const el = shapes[i]
        if (!el) return
        const start = divergeStart + shape.at
        const duration = divergeEnd - start
        tl.to(el, { opacity: 1, duration: 0.05 }, start)
        tl.to(
          el,
          {
            x: shape.dx,
            y: shape.dy,
            rotate: shape.rot,
            scale: shape.scale,
            duration,
            ease: 'power2.out',
          },
          start,
        )
      })

      // Stage 3 — held at maximum divergence (the drift below runs on its own).

      // Stage 4 — they return to centre and vanish; nothing morphs.
      SHAPES.forEach((_, i) => {
        const el = shapes[i]
        if (!el) return
        tl.to(
          el,
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 0,
            opacity: 0,
            duration: convergeEnd - holdEnd,
            ease: 'power2.inOut',
          },
          holdEnd,
        )
      })

      // One clearly defined direction, drawn.
      if (diamond && length) {
        tl.to(
          diamond,
          { strokeDashoffset: 0, duration: drawEnd - drawStart, ease: 'power2.inOut' },
          drawStart,
        )
      }

      // The timeline's duration is otherwise set by its last tween (~0.62), and
      // ScrollTrigger maps scroll progress onto that duration -- which would
      // compress every stage into the first 62% of the scrub. Pin it to 1 so
      // timeline time and section progress are the same number.
      tl.set({}, {}, 1)

      // Keeps the frame alive during the hold without fighting the scrub:
      // the drift lives on a wrapper, the scrubbed transform on the child.
      drifts.forEach((el, i) => {
        gsap.to(el, {
          x: i % 2 === 0 ? 3 : -2.5,
          y: i % 3 === 0 ? -2.5 : 3,
          duration: 3 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    }, svg)

    return () => ctx.revert()
  }, [])

  const stroke = {
    fill: 'none',
    stroke: INK,
    strokeOpacity: 0.2,
    strokeWidth: 1.5,
    vectorEffect: 'non-scaling-stroke' as const,
  }

  return (
    <svg
      ref={root}
      viewBox="0 0 420 420"
      aria-hidden="true"
      className="pointer-events-none absolute right-[4%] top-1/2 z-0 hidden h-auto w-[300px] -translate-y-1/2 md:block lg:w-[420px]"
    >
      {/* Stage 1 — one deck. */}
      <g data-deck>
        <rect x={140} y={166} width={140} height={88} {...stroke} />
        <line x1={156} y1={192} x2={244} y2={192} {...stroke} />
        <line x1={156} y1={210} x2={228} y2={210} {...stroke} />
        <line x1={156} y1={228} x2={252} y2={228} {...stroke} />
      </g>

      {/* Stage 2 — six divergent interpretations, all leaving from the centre. */}
      <g data-drift>
        <g data-shape>
          <circle cx={C} cy={C} r={26} {...stroke} />
        </g>
      </g>
      <g data-drift>
        <g data-shape>
          <rect x={C - 24} y={C - 24} width={48} height={48} {...stroke} />
        </g>
      </g>
      <g data-drift>
        <g data-shape>
          <rect x={C - 34} y={C - 20} width={68} height={40} {...stroke} />
        </g>
      </g>
      <g data-drift>
        <g data-shape>
          <path d={`M${C} ${C - 28} L${C + 26} ${C + 20} L${C - 26} ${C + 20} Z`} {...stroke} />
        </g>
      </g>
      <g data-drift>
        <g data-shape>
          <path
            d={`M${C} ${C - 28} L${C + 27} ${C - 8} L${C + 17} ${C + 24} L${C - 17} ${C + 24} L${C - 27} ${C - 8} Z`}
            {...stroke}
          />
        </g>
      </g>
      <g data-drift>
        <g data-shape>
          <rect x={C - 30} y={C - 22} width={60} height={44} rx={12} {...stroke} />
        </g>
      </g>

      {/* Stage 4 — one direction, crisper than the rest. */}
      <path
        data-diamond
        d={`M${C} ${C - 46} L${C + 46} ${C} L${C} ${C + 46} L${C - 46} ${C} Z`}
        fill="none"
        stroke={AMBER_DEEP}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        opacity={0}
      />
    </svg>
  )
}
