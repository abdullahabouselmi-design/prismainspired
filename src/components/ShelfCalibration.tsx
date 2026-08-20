import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { onLayoutResize, requestScrollRefresh } from '../lib/motion'

const BONE = '#EFE4D1'
const AMBER = '#C98B4B'
const AMBER_DEEP = '#8F5F2C'
const INK = '#0B0907'

/** The rail, and the nine facings standing on it. */
const VIEW_W = 1200
const RAIL_Y = 360
const RAIL_X0 = 40
const RAIL_X1 = 1000
const SLOT = 110
const FIRST = 80
const centre = (i: number) => FIRST + SLOT * i

const OURS = 4

/**
 * Nine silhouettes, drawn from a baseline of y=0 so each one can simply be
 * translated onto the rail. Deliberately varied in form and height: a shelf
 * is a set of unlike things competing for the same glance.
 */
const PACKS: { d: string; cap?: [number, number, number, number]; rim?: number }[] = [
  { d: 'M-26 0 L-26 -86 L-9 -104 L-9 -113 L-12 -113 L-12 -120 L12 -120 L12 -113 L9 -113 L9 -104 L26 -86 L26 0 Z' },
  { d: 'M-29 0 L-29 -108 L-10 -128 L-10 -141 L-13 -141 L-13 -150 L13 -150 L13 -141 L10 -141 L10 -128 L29 -108 L29 0 Z' },
  { d: 'M-31 0 L-31 -140 L-14 -160 L14 -160 L31 -140 L31 0 Z', cap: [0, -158, 9, 5] },
  { d: 'M-24 0 L-24 -80 L-8 -110 L-8 -136 L-10 -136 L-10 -145 L10 -145 L10 -136 L8 -136 L8 -110 L24 -80 L24 0 Z' },
  { d: 'M-34 0 L-34 -148 L-15 -170 L15 -170 L34 -148 L34 0 Z', cap: [0, -168, 10, 5] },
  { d: 'M-27 0 L-27 -86 L-22 -95 L22 -95 L27 -86 L27 0 Z', rim: -86 },
  { d: 'M-27 0 L-27 -71 L-22 -80 L22 -80 L27 -71 L27 0 Z', rim: -71 },
  { d: 'M-26 0 L-26 -96 L-9 -116 L-9 -126 L-12 -126 L-12 -135 L12 -135 L12 -126 L9 -126 L9 -116 L26 -96 L26 0 Z' },
  { d: 'M-28 0 L-33 -62 L-35 -62 L-35 -72 L35 -72 L35 -62 L33 -62 L28 0 Z' },
]

/** Audience: the only facings this person would ever consider. */
const IN_PLAY = [2, 3, 4, 5]

/**
 * Price: the shelf re-sorts cheapest to dearest. Ours holds slot 4 and
 * everything else rearranges around it — the point of the beat is that
 * position is relative, not that our number changed.
 */
const PRICE_SLOT = [2, 6, 8, 5, 4, 0, 1, 3, 7]

/** Channel: the facings that fall outside a narrower rail. */
const CHANNEL_OUT = [2, 5, 6, 8]

/** Seven beats, one per row. Each moves early in its window, then holds. */
const BEATS = 7
const at = (k: number) => k / BEATS + 0.015
const D = 0.085

export function ShelfCalibration({
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

    const q = <T extends SVGElement>(sel: string) => svg.querySelector<T>(sel)
    const qa = <T extends SVGElement>(sel: string) => gsap.utils.toArray<T>(sel, svg)

    const packs = qa<SVGGElement>('[data-pack]')
    if (packs.length !== PACKS.length) return
    const ours = packs[OURS]
    const oursPath = ours.querySelector('path')
    if (!oursPath) return
    const detail = q<SVGEllipseElement>('[data-detail]')
    const bracket = q<SVGPathElement>('[data-bracket]')
    const habit = q<SVGGElement>('[data-habit]')
    const leader = q<SVGPathElement>('[data-leader]')
    const caret = q<SVGPathElement>('[data-caret]')
    const veil = q<SVGRectElement>('[data-veil]')
    const rail = q<SVGPathElement>('[data-rail]')
    const stage = q<SVGGElement>('[data-stage]')

    // Resolved state only: the shelf as it ends, with nothing in motion.
    if (prefersReducedMotion()) {
      packs.forEach((p, i) => (p.style.opacity = i === OURS ? '1' : '0.28'))
      if (detail) detail.style.opacity = '1'
      if (oursPath) {
        oursPath.setAttribute('stroke', AMBER)
        oursPath.setAttribute('stroke-width', '2.5')
      }
      if (detail) detail.setAttribute('stroke', AMBER)
      return
    }

    const ctx = gsap.context(() => {
      const leaderLen = leader?.getTotalLength() ?? 0

      // From-state. Nothing is chosen: nine equal facings, no annotation.
      gsap.set(packs, { opacity: 0.55, x: 0, y: 0 })
      gsap.set([bracket, habit, caret], { opacity: 0 })
      gsap.set(veil, { opacity: 0 })
      gsap.set(detail, { opacity: 0 })
      gsap.set(rail, { transformOrigin: `${centre(OURS)}px ${RAIL_Y}px` })
      if (leader && leaderLen) {
        gsap.set(leader, { opacity: 1, strokeDasharray: leaderLen, strokeDashoffset: leaderLen })
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out', duration: D },
        scrollTrigger: {
          trigger,
          // The shelf becomes sticky at roughly half the viewport, and the rows
          // are only readable in the band beneath it. Anchor the sequence to
          // that band so the last beat still has its row on screen.
          start: 'top 50%',
          end: 'bottom 72%',
          scrub: 0.6,
        },
      })

      // The lit row is read off the timeline, not off the trigger, so the copy
      // and the shelf are never a beat apart while the scrub catches up.
      tl.eventCallback('onUpdate', () => {
        const b = Math.max(0, Math.min(BEATS - 1, Math.floor(tl.progress() * BEATS)))
        if (b !== beatRef.current) {
          beatRef.current = b
          onBeat(b)
        }
      })

      // 01 Audience — most of the shelf was never in play.
      tl.to(bracket, { opacity: 0.55 }, at(0))
      packs.forEach((p, i) => {
        tl.to(p, { opacity: IN_PLAY.includes(i) ? 0.9 : 0.15 }, at(0))
      })

      // 02 Product — ours resolves, and gains the detail that earns the re-buy.
      tl.to(oursPath, { attr: { 'stroke-width': 2.2 }, opacity: 1 }, at(1))
      tl.to(ours, { opacity: 1 }, at(1))
      tl.to(detail, { opacity: 1 }, at(1) + 0.03)

      // 03 Positioning — the habit it is really up against is off the shelf.
      tl.to(bracket, { opacity: 0, duration: 0.05 }, at(2))
      tl.to(habit, { opacity: 0.75 }, at(2) + 0.02)
      if (leader && leaderLen) {
        tl.to(leader, { strokeDashoffset: 0, duration: D + 0.03, ease: 'power2.inOut' }, at(2))
      }

      // 04 Price — the shelf re-sorts. Ours holds still; the rest move around it.
      tl.to([leader, habit], { opacity: 0, duration: 0.06 }, at(3))
      packs.forEach((p, i) => {
        const dx = SLOT * (PRICE_SLOT[i] - i)
        if (dx !== 0) tl.to(p, { x: dx, duration: D + 0.04, ease: 'power2.inOut' }, at(3))
      })
      tl.to(caret, { opacity: 0.9 }, at(3) + 0.05)

      // 05 Message — the first three seconds. Only the top band registers.
      tl.to(veil, { opacity: 1 }, at(4) + 0.02)

      // 06 Channel — less room, same fight.
      tl.to(veil, { opacity: 0, duration: 0.06 }, at(5))
      tl.to(rail, { scaleX: 0.58, duration: D + 0.03, ease: 'power2.inOut' }, at(5))
      tl.to(stage, { x: VIEW_W / 2 - centre(OURS), duration: D + 0.03, ease: 'power2.inOut' }, at(5))
      CHANNEL_OUT.forEach((i) => {
        tl.to(packs[i], { opacity: 0, duration: D }, at(5))
      })
      tl.to(caret, { opacity: 0, duration: 0.05 }, at(5))

      // 07 Result — taken off the shelf, restocked, taken again. It ends
      // present and chosen; closing on an empty rail would read as gone.
      tl.to(oursPath, { attr: { stroke: AMBER, 'stroke-width': 2.5 }, duration: 0.04 }, at(6))
      tl.to(detail, { attr: { stroke: AMBER }, duration: 0.04 }, at(6))
      tl.to(ours, { y: -95, opacity: 0, duration: 0.035, ease: 'power2.in' }, at(6) + 0.02)
      tl.set(ours, { y: 0, opacity: 1 }, at(6) + 0.06)
      tl.to(ours, { y: -95, opacity: 0, duration: 0.035, ease: 'power2.in' }, at(6) + 0.075)
      tl.set(ours, { y: 0, opacity: 1 }, at(6) + 0.115)

      // Timeline time and scroll progress must be the same number.
      tl.set({}, {}, 1)
      requestScrollRefresh()
    }, svg)

    return () => ctx.revert()
  }, [triggerRef, onBeat])

  // The full rail needs width. Below md the frame crops to the middle facings.
  useEffect(() => {
    const svg = root.current
    if (!svg) return
    const apply = () => {
      const narrow = window.innerWidth < 768
      svg.setAttribute('viewBox', narrow ? '250 80 540 330' : '0 80 1200 330')
    }
    apply()
    return onLayoutResize(apply)
  }, [])

  const stroke = {
    fill: 'none',
    stroke: BONE,
    strokeWidth: 1.5,
    vectorEffect: 'non-scaling-stroke' as const,
  }

  return (
    <svg
      ref={root}
      viewBox="0 80 1200 330"
      aria-hidden="true"
      className={`pointer-events-none h-full w-full ${className ?? ''}`}
    >
      {/* Audience: the bracket over the set that was ever in play. */}
      <path
        data-bracket
        d={`M${centre(IN_PLAY[0]) - 31} 172 L${centre(IN_PLAY[0]) - 31} 160 L${centre(IN_PLAY[3]) + 27} 160 L${centre(IN_PLAY[3]) + 27} 172`}
        {...stroke}
        strokeOpacity={0.55}
      />

      {/* Positioning: the habit, off the shelf, with no rail beneath it. */}
      <path data-leader d={`M${centre(OURS)} 190 L${centre(OURS)} 100 L1105 100 L1105 222`} {...stroke} stroke={AMBER_DEEP} />
      <g data-habit transform="translate(1105, 300)">
        <path
          d="M-24 0 L-30 -70 L-32 -70 L-32 -78 L32 -78 L32 -70 L30 -70 L24 0 Z"
          {...stroke}
          strokeDasharray="6 5"
        />
      </g>

      <g data-stage="">
      <path data-rail d={`M${RAIL_X0} ${RAIL_Y} L${RAIL_X1} ${RAIL_Y}`} {...stroke} />

      {/* Placement lives on the outer group so GSAP owns the inner transform
          uncontested; writing x/y onto a group that already carries a
          translate() attribute replaces the placement instead of adding to it. */}
      {PACKS.map((pack, i) => (
        <g key={i} transform={`translate(${centre(i)}, ${RAIL_Y})`}>
          <g data-pack="">
            <path d={pack.d} {...stroke} />
            {pack.rim ? <path d={`M-22 ${pack.rim} L22 ${pack.rim}`} {...stroke} strokeOpacity={0.6} /> : null}
            {pack.cap ? (
              <ellipse
                {...(i === OURS ? { 'data-detail': '' } : {})}
                cx={pack.cap[0]}
                cy={pack.cap[1]}
                rx={pack.cap[2]}
                ry={pack.cap[3]}
                {...stroke}
              />
            ) : null}
          </g>
        </g>
      ))}
      </g>

      {/* Price: where it landed in the order. */}
      <path data-caret d={`M${centre(OURS) - 7} ${RAIL_Y + 12} L${centre(OURS)} ${RAIL_Y + 3} L${centre(OURS) + 7} ${RAIL_Y + 12}`} {...stroke} stroke={AMBER_DEEP} />

      {/* Message: everything below the first read falls away. */}
      <rect data-veil x={0} y={245} width={1200} height={215} fill={INK} />
    </svg>
  )
}
