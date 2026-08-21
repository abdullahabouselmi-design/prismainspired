import { useEffect, useRef } from 'react'
import { ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { onLayoutResize, requestScrollRefresh } from '../lib/motion'

const BONE = '#EFE4D1'
const AMBER = '#C98B4B'

const TAU = Math.PI * 2
const BEATS = 7
const NB = 6 // one band per component
const CAN_H = 300
const CAN_R = 84
const SPREAD = 34 // model units each band travels apart
const TWIST = 0.15 // ...and radians it turns on its own
const BEAT = 1 / BEATS
const RAMP = BEAT * 0.62 // a band opens over most of its own beat

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

/** 355ml profile: rolled base, straight body, a short neck, rolled rim. */
function profile(t: number) {
  if (t < 0.03) return 0.86 + 0.14 * (t / 0.03)
  if (t < 0.88) return 1
  if (t < 0.96) return 1 - 0.2 * ((t - 0.88) / 0.08)
  return 0.82
}

type Cloud = {
  n: number
  x: Float32Array
  y: Float32Array
  z: Float32Array
  nx: Float32Array
  nz: Float32Array
  ny: Float32Array
  band: Uint8Array
  bri: Float32Array
}

function build(n: number): Cloud {
  const c: Cloud = {
    n,
    x: new Float32Array(n), y: new Float32Array(n), z: new Float32Array(n),
    nx: new Float32Array(n), nz: new Float32Array(n), ny: new Float32Array(n),
    band: new Uint8Array(n), bri: new Float32Array(n),
  }
  for (let i = 0; i < n; i++) {
    const th = Math.random() * TAU
    const st = Math.sin(th)
    const ct = Math.cos(th)
    // Weighted toward the two ends so the rim and base read as edges.
    const u = Math.random()
    let t = u < 0.1 ? Math.random() * 0.05 : u < 0.28 ? 0.9 + Math.random() * 0.1 : 0.05 + Math.random() * 0.85
    let y = (t - 0.5) * CAN_H
    let r = CAN_R * profile(t)
    let up = 0
    // A scatter of points across the lid, so the top is a surface not a ring.
    if (Math.random() < 0.05) {
      t = 1
      y = CAN_H * 0.5
      r = CAN_R * profile(1) * Math.sqrt(Math.random())
      up = 1
    }
    c.x[i] = st * r
    c.y[i] = y
    c.z[i] = ct * r
    c.nx[i] = up ? 0 : st
    c.nz[i] = up ? 0 : ct
    c.ny[i] = up
    c.band[i] = clamp(Math.floor((0.5 - y / CAN_H) * NB), 0, NB - 1)
    c.bri[i] = 0.45 + Math.random() * 0.55
  }
  return c
}

export function CalibrationCan({
  triggerRef,
  onBeat,
  className,
}: {
  triggerRef: React.RefObject<HTMLElement>
  onBeat: (index: number) => void
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const target = useRef(0)
  const beatRef = useRef(-1)

  useEffect(() => {
    const cv = canvas.current
    const box = host.current
    const trigger = triggerRef.current
    if (!cv || !box || !trigger) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const reduced = prefersReducedMotion()
    let w = 0
    let h = 0
    let cloud = build(window.innerWidth < 700 ? 6500 : 14000)

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = box.getBoundingClientRect()
      w = Math.max(1, Math.round(r.width))
      h = Math.max(1, Math.round(r.height))
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const cb = new Float64Array(NB)
    const sb = new Float64Array(NB)
    const sep = new Float64Array(NB)
    let yaw = 0
    let shown = 0

    function draw(p: number) {
      ctx!.clearRect(0, 0, w, h)

      // Each band peels away during its own beat; Result reels them all back.
      const home = clamp((p - 6 * BEAT) / RAMP, 0, 1)
      let open = 0
      for (let k = 0; k < NB; k++) {
        sep[k] = clamp((p - k * BEAT) / RAMP, 0, 1) * (1 - home)
        if (sep[k] > open) open = sep[k]
        const a = yaw + (k - (NB - 1) / 2) * TWIST * sep[k]
        cb[k] = Math.cos(a)
        sb[k] = Math.sin(a)
      }

      const beat = clamp(Math.floor(p * BEATS), 0, BEATS - 1)
      const active = beat < NB ? beat : -1
      // Once it is whole again it carries one mark, around the middle.
      const marked = home > 0.35

      // Focal is derived from the frame, not fixed, so the can fills whatever
      // box it is given — and it pulls back as it opens so the full spread of
      // six bands still fits.
      const fit = Math.min(1.15 * h, 2.7 * w)
      const focal = fit * (1 - 0.32 * open)
      const camZ = -CAN_H * 1.6
      const cx = w / 2
      const cy = h * 0.52

      // Two passes, so the fill colour changes twice rather than 14,000 times.
      for (let pass = 0; pass < 2; pass++) {
        ctx!.fillStyle = pass ? AMBER : BONE
        for (let i = 0; i < cloud.n; i++) {
          const k = cloud.band[i]
          // A band only lights once it is actually moving, so the can sits
          // whole and unmarked until the section is entered. At Result the
          // whole object lights, not a band around its middle.
          const hot = marked ? true : k === active && sep[k] > 0.02
          if (hot !== (pass === 1)) continue

          const py = cloud.y[i] + ((NB - 1) / 2 - k) * SPREAD * sep[k]
          const ca = cb[k]
          const sa = sb[k]
          const rx = cloud.x[i] * ca - cloud.z[i] * sa
          const rz = cloud.x[i] * sa + cloud.z[i] * ca
          const dz = rz - camZ
          if (dz < 40) continue

          const s = focal / dz
          const sx = cx + rx * s
          const sy = cy - py * s
          if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue

          // Points whose surface turns toward you carry the light.
          let face = -(cloud.nx[i] * sa + cloud.nz[i] * ca)
          if (face < 0) face = 0
          face += cloud.ny[i] * 0.45
          if (face > 1) face = 1

          const px = clamp((focal * 1.15) / dz, 0.7, 2.4)
          let al = cloud.bri[i] * (0.3 + 0.7 * face) * clamp(1.6 / px, 0.4, 1)
          if (hot) al *= 1.18
          if (al > 1) al = 1
          ctx!.globalAlpha = al
          ctx!.fillRect(sx, sy, px, px)
        }
      }
      ctx!.globalAlpha = 1
    }

    size()

    if (reduced) {
      // Whole, marked, still.
      shown = 1
      draw(1)
      onBeat(BEATS - 1)
      const stop = onLayoutResize(() => {
        size()
        draw(1)
      })
      return stop
    }

    let raf = 0
    let running = false
    let last = 0

    const frame = (ts: number) => {
      if (!running) return
      const dt = Math.min((ts - last) / 1000 || 0, 0.05)
      last = ts
      yaw += dt * 0.22
      // Ease toward the scroll position rather than snapping to it.
      shown += (target.current - shown) * Math.min(1, dt * 6)
      draw(shown)
      raf = requestAnimationFrame(frame)
    }

    const st = ScrollTrigger.create({
      trigger,
      start: 'top 20%',
      end: 'bottom 55%',
      onUpdate: (self) => {
        target.current = self.progress
        const b = clamp(Math.floor(self.progress * BEATS), 0, BEATS - 1)
        if (b !== beatRef.current) {
          beatRef.current = b
          onBeat(b)
        }
      },
      onToggle: (self) => {
        running = self.isActive
        if (running) {
          last = performance.now()
          raf = requestAnimationFrame(frame)
        } else {
          cancelAnimationFrame(raf)
        }
      },
    })

    // Visible before the trigger is entered, so paint one resting frame.
    draw(0)

    const stopResize = onLayoutResize(() => {
      cloud = build(window.innerWidth < 700 ? 6500 : 14000)
      size()
      draw(shown)
    })

    requestScrollRefresh()

    return () => {
      cancelAnimationFrame(raf)
      st.kill()
      stopResize()
    }
  }, [triggerRef, onBeat])

  return (
    <div ref={host} className={`h-full w-full ${className ?? ''}`}>
      <canvas ref={canvas} aria-hidden="true" className="block h-full w-full" />
    </div>
  )
}
