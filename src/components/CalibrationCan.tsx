import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { requestScrollRefresh } from '../lib/motion'

const BONE = '#EFE4D1'
const AMBER = '#C98B4B'

/**
 * One 355ml can, drawn in elevation. Depth comes from perspective alone: every
 * horizontal on the can is an ellipse arc of the same viewing angle
 * (minor/major = 0.24), the base shows only its front curve because the back is
 * behind the body, and two faint contour lines sit at 0.75R where the cylinder
 * turns away. No fills, no shading — the geometry does the work.
 */
const CX = 180
const R = 70 // body radius
const RN = 58 // neck radius — a 355ml can necks in far less than it looks
const RB = 62 // base radius
const RY = 17 // perspective minor radius at R; every horizontal shares this angle
const RYB = 15 // ...at RB

const Y_RIM = 92
const Y_NECK = 100 // where the neck meets the shoulder curve
const Y_SHOULDER = 124 // ...and where that curve meets the straight body
const Y_BODY_BOT = 318
const Y_BASE = 332
const Y_GROUND = 358

/** The shelf we open on: five facings, one of them ours, dead centre. */
const SHELF_Y = 300
const FACINGS = [
  { x: 48, d: 'M-13 0 L-13 -44 L-5 -54 L-5 -58 L-6.5 -58 L-6.5 -62 L6.5 -62 L6.5 -58 L5 -58 L5 -54 L13 -44 L13 0 Z' },
  { x: 114, d: 'M-15 0 L-15 -70 L-7 -80 L7 -80 L15 -70 L15 0 Z' },
  { x: 180, d: 'M-14 0 L-14 -46 L-11 -50 L11 -50 L14 -46 L14 0 Z', ours: true },
  { x: 246, d: 'M-13 0 L-13 -52 L-5 -64 L-5 -70 L-7 -70 L-7 -75 L7 -75 L7 -70 L5 -70 L5 -64 L13 -52 L13 0 Z' },
  { x: 312, d: 'M-12 0 L-15 -30 L-16 -30 L-16 -35 L16 -35 L16 -30 L15 -30 L12 0 Z' },
]

const BEATS = 7
const at = (k: number) => k / BEATS + 0.015

export function CalibrationCan({
  triggerRef,
  onBeat,
  className,
}: {
  triggerRef: React.RefObject<HTMLElement>
  onBeat: (index: number) => void
  className?: string
}) {
  const root = useRef<SVGSVGElement>(null)
  const beatRef = useRef(-1)

  useEffect(() => {
    const svg = root.current
    const trigger = triggerRef.current
    if (!svg || !trigger) return

    const qa = <T extends SVGElement>(sel: string) => gsap.utils.toArray<T>(sel, svg)
    const groups = [0, 1, 2, 3, 4, 5].map((k) => qa<SVGGElement>(`[data-seg="${k}"]`))
    const segments = [0, 1, 2, 3, 4, 5].map((k) =>
      qa<SVGGeometryElement>(`[data-seg="${k}"] > *`),
    )
    if (segments.some((s) => s.length === 0)) return

    const others = qa<SVGGElement>('[data-facing]:not([data-ours])')
    const oursFacing = qa<SVGGElement>('[data-ours]')
    const rail = qa<SVGElement>('[data-rail]')
    const ground = qa<SVGElement>('[data-ground]')
    const band = qa<SVGElement>('[data-band]')

    const strokes = segments.flat()

    if (prefersReducedMotion()) {
      // The finished can, marked, with nothing to play.
      ;[...others, ...oursFacing, ...rail].forEach((el) => (el.style.opacity = '0'))
      ground.forEach((el) => (el.style.opacity = '0.22'))
      band.forEach((el) => {
        el.setAttribute('stroke', AMBER)
        el.setAttribute('stroke-width', '2')
      })
      return
    }

    const ctx = gsap.context(() => {
      // Every stroke starts undrawn; the shelf starts fully present.
      strokes.forEach((el) => {
        const len = el.getTotalLength()
        if (!len) return
        // Dash and gap are set separately, with the gap deliberately longer.
        // A single-value dasharray makes the pattern period 2*len, so on a
        // closed shape the path's end lands exactly on the dash start and a
        // round line-cap paints a dot there. A gap of 2*len keeps the whole
        // path inside it with room to spare — getTotalLength() under-reports
        // curves slightly, and a tight margin lets the tail wrap back into the
        // dash. Offsetting past `len` instead of widening the gap would wrap it
        // the other way and reveal the tail outright.
        gsap.set(el, { strokeDasharray: `${len} ${len * 2}`, strokeDashoffset: len })
      })
      gsap.set(ground, { opacity: 0 })
      // A part that has not been reached is hidden outright, not merely dashed
      // to zero length — sub-pixel remnants of an undrawn stroke still register.
      gsap.set(groups.flat(), { opacity: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: { trigger, start: 'top 20%', end: 'bottom 55%', scrub: 0.6 },
      })

      // Read the lit row off the timeline, not the trigger, so the copy and the
      // drawing can never sit a beat apart while the scrub catches up.
      tl.eventCallback('onUpdate', () => {
        const b = Math.max(0, Math.min(BEATS - 1, Math.floor(tl.progress() * BEATS)))
        if (b !== beatRef.current) {
          beatRef.current = b
          onBeat(b)
        }
      })

      const draw = (k: number, time: number, duration = 0.09) => {
        tl.set(groups[k], { opacity: 1 }, time)
        tl.to(segments[k], { strokeDashoffset: 0, duration }, time)
      }

      // 01 — the shelf resolves to the one, then clears the frame for it.
      tl.to(others, { opacity: 0, duration: 0.05 }, at(0))
      tl.to([...oursFacing, ...rail], { opacity: 0, duration: 0.05 }, at(0) + 0.04)
      draw(0, at(0) + 0.075, 0.055)

      // 02–06 — the can accrues, one part per row. Nothing ever leaves.
      for (let k = 1; k <= 5; k++) draw(k, at(k))

      // 07 — the mark it carries, and the ground it goes back to.
      tl.to(band, { attr: { stroke: AMBER, 'stroke-width': 2 }, duration: 0.05 }, at(6))
      tl.to(ground, { opacity: 0.22, duration: 0.06 }, at(6) + 0.03)

      // Timeline time and scroll progress must be the same number.
      tl.set({}, {}, 1)

      requestScrollRefresh()
    }, svg)

    return () => ctx.revert()
  }, [triggerRef, onBeat])

  // Deliberately NOT non-scaling-stroke. That property makes the browser
  // measure stroke-dasharray in screen units while getTotalLength() reports
  // user units, so at this SVG's ~1.3x scale the gap stops covering the path
  // and undrawn segments leak fragments. Letting the stroke scale with the
  // drawing is also the more honest behaviour for a line illustration.
  const line = {
    fill: 'none',
    stroke: BONE,
    strokeWidth: 1.5,
    // butt, not round: a round cap paints a dot even on a zero-length dash,
    // which is exactly what an undrawn segment is.
    strokeLinecap: 'butt' as const,
    strokeLinejoin: 'round' as const,
  }
  const detail = { ...line, strokeWidth: 1.15 }

  return (
    <svg
      ref={root}
      viewBox="0 55 360 325"
      aria-hidden="true"
      className={`pointer-events-none h-full w-full ${className ?? ''}`}
    >
      {/* The shelf we open on. */}
      <path data-rail d={`M20 ${SHELF_Y} L340 ${SHELF_Y}`} {...detail} strokeOpacity={0.5} />
      {FACINGS.map((f) => (
        <g
          key={f.x}
          data-facing=""
          {...(f.ours ? { 'data-ours': '' } : {})}
          transform={`translate(${f.x}, ${SHELF_Y})`}
        >
          <path d={f.d} {...detail} strokeOpacity={f.ours ? 0.9 : 0.5} />
        </g>
      ))}

      {/* Where it ends up: back on a shelf, once it is worth putting there. */}
      <path data-ground d={`M62 ${Y_GROUND} L298 ${Y_GROUND}`} {...detail} strokeOpacity={1} />

      {/* 1 — base: the front curve only, plus the bead inside it. */}
      <g data-seg="0">
        <path
          d={`M${CX - R} ${Y_BODY_BOT} Q${CX - R} ${Y_BASE - 4} ${CX - RB} ${Y_BASE} Q${CX} ${Y_BASE + 2 * RYB} ${CX + RB} ${Y_BASE} Q${CX + R} ${Y_BASE - 4} ${CX + R} ${Y_BODY_BOT}`}
          {...line}
        />
      </g>

      {/* 2 — body, with the two contours where the cylinder turns away. */}
      <g data-seg="1">
        <path d={`M${CX - R} ${Y_BODY_BOT} L${CX - R} ${Y_SHOULDER}`} {...line} />
        <path d={`M${CX + R} ${Y_BODY_BOT} L${CX + R} ${Y_SHOULDER}`} {...line} />
      </g>

      {/* 3 — the neck. Concave, and far shorter than it feels like it should be. */}
      <g data-seg="2">
        <path d={`M${CX - R} ${Y_SHOULDER} Q${CX - R} ${Y_NECK + 4} ${CX - RN} ${Y_NECK} L${CX - RN} ${Y_RIM}`} {...line} />
        <path d={`M${CX + R} ${Y_SHOULDER} Q${CX + R} ${Y_NECK + 4} ${CX + RN} ${Y_NECK} L${CX + RN} ${Y_RIM}`} {...line} />
      </g>

      {/* 4 — the rolled rim, which flares just past the neck. */}
      <g data-seg="3">
        <ellipse cx={CX} cy={Y_RIM} rx={RN + 2} ry={14.5} {...line} />
        <ellipse cx={CX} cy={Y_RIM + 2} rx={RN - 4} ry={13} {...detail} strokeOpacity={0.5} />
      </g>

      {/* 5 — the lid, its rivet and tab. */}
      <g data-seg="4">
        <ellipse cx={CX} cy={Y_RIM + 4} rx={46} ry={11} {...detail} />
        <circle cx={CX - 3} cy={Y_RIM + 4} r={3} {...detail} strokeOpacity={0.7} />
        <ellipse cx={CX + 15} cy={Y_RIM + 4} rx={13} ry={5} {...detail} strokeOpacity={0.7} />
      </g>

      {/* 6 — the band. Curved, because everything horizontal on a can is. */}
      <g data-seg="5">
        <path data-band d={`M${CX - R} 206 Q${CX} ${206 + 2 * RY} ${CX + R} 206`} {...detail} />
        <path data-band d={`M${CX - R} 240 Q${CX} ${240 + 2 * RY} ${CX + R} 240`} {...detail} />
      </g>
    </svg>
  )
}
