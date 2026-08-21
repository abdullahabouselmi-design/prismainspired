import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/gsap'
import { onLayoutResize } from '../lib/motion'

const TAU = Math.PI * 2
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Radius as a fraction of the widest point, sampled up the height of the form.
 * A carton is not a solid of revolution, so it is described by its footprint
 * instead and walked around the perimeter.
 */
type Form = 'bottle' | 'carton' | 'tub' | 'can'

const PROFILE: Record<
  Form,
  { h: number; r?: number; f?: (t: number) => number; bw?: number; bd?: number }
> = {
  bottle: {
    h: 250,
    r: 52,
    f: (t) => {
      if (t < 0.05) return 0.92
      if (t < 0.62) return 1
      if (t < 0.8) return lerp(1, 0.42, (t - 0.62) / 0.18)
      if (t < 0.93) return 0.4
      return 0.52
    },
  },
  carton: { h: 230, bw: 96, bd: 72 },
  tub: {
    h: 160,
    r: 72,
    f: (t) => {
      // A pronounced taper and a lip, or it reads as a plain cylinder.
      if (t < 0.05) return 0.78
      if (t < 0.86) return lerp(0.8, 1, (t - 0.05) / 0.81)
      if (t < 0.94) return 1
      return 1.07
    },
  },
  can: {
    h: 210,
    r: 62,
    f: (t) => {
      if (t < 0.03) return 0.86 + 0.14 * (t / 0.03)
      if (t < 0.88) return 1
      if (t < 0.96) return 1 - 0.2 * ((t - 0.88) / 0.08)
      return 0.82
    },
  },
}

type Cloud = {
  n: number
  x: Float32Array
  y: Float32Array
  z: Float32Array
  nx: Float32Array
  nz: Float32Array
  ny: Float32Array
  bri: Float32Array
  h: number
}

function build(form: Form, n: number): Cloud {
  const P = PROFILE[form]
  const c: Cloud = {
    n,
    x: new Float32Array(n), y: new Float32Array(n), z: new Float32Array(n),
    nx: new Float32Array(n), nz: new Float32Array(n), ny: new Float32Array(n),
    bri: new Float32Array(n),
    h: P.h,
  }
  for (let i = 0; i < n; i++) {
    const th = Math.random() * TAU
    // Weighted toward the two ends so the rim and base read as edges.
    const u = Math.random()
    const t = u < 0.12 ? Math.random() * 0.07 : u < 0.32 ? 0.87 + Math.random() * 0.13 : 0.07 + Math.random() * 0.8

    // A tenth of the points go on the end caps. Without them a carton is a
    // hollow ring of dots and reads as a blob rather than a box.
    const cap = Math.random()
    const onTop = cap < 0.07
    const onBase = !onTop && cap < 0.11
    const ty = onTop ? 1 : onBase ? 0 : t

    if (P.bw && P.bd) {
      const per = 2 * (P.bw + P.bd)
      const sp = (th / TAU) * per
      let bx: number, bz: number, bnx: number, bnz: number
      if (sp < P.bw) { bx = -P.bw / 2 + sp; bz = -P.bd / 2; bnx = 0; bnz = -1 }
      else if (sp < P.bw + P.bd) { bx = P.bw / 2; bz = -P.bd / 2 + (sp - P.bw); bnx = 1; bnz = 0 }
      else if (sp < 2 * P.bw + P.bd) { bx = P.bw / 2 - (sp - P.bw - P.bd); bz = P.bd / 2; bnx = 0; bnz = 1 }
      else { bx = -P.bw / 2; bz = P.bd / 2 - (sp - 2 * P.bw - P.bd); bnx = -1; bnz = 0 }
      if (onTop || onBase) {
        // Scatter across the face rather than around its edge.
        c.x[i] = bx * Math.random(); c.z[i] = bz * Math.random()
        c.nx[i] = 0; c.nz[i] = 0; c.ny[i] = 1
      } else {
        c.x[i] = bx; c.z[i] = bz; c.nx[i] = bnx; c.nz[i] = bnz; c.ny[i] = 0
      }
    } else {
      const pr = P.r! * P.f!(ty) * (onTop || onBase ? Math.sqrt(Math.random()) : 1)
      c.x[i] = Math.sin(th) * pr
      c.z[i] = Math.cos(th) * pr
      if (onTop || onBase) { c.nx[i] = 0; c.nz[i] = 0; c.ny[i] = 1 }
      else { c.nx[i] = Math.sin(th); c.nz[i] = Math.cos(th); c.ny[i] = 0 }
    }
    c.y[i] = (ty - 0.5) * P.h
    c.bri[i] = 0.42 + Math.random() * 0.58
  }
  return c
}

/**
 * One consumer-goods form as a slowly turning point cloud. Unlike the
 * Calibration can this has no scroll coupling and no bands — it just idles,
 * and only while it is on screen.
 */
export function ProductCloud({
  form,
  tone,
  className,
}: {
  form: Form
  tone: string
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvas.current
    const box = host.current
    if (!cv || !box) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let cloud = build(form, window.innerWidth < 700 ? 1300 : 2200)
    let yaw = 0.5

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = box.getBoundingClientRect()
      w = Math.max(1, Math.round(r.width))
      h = Math.max(1, Math.round(r.height))
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      // Focal comes from the frame so the form fills whatever box it is given.
      const focal = Math.min(1.5 * h, 3.2 * w)
      const camZ = -cloud.h * 1.9
      const cx = w / 2
      const cy = h * 0.56
      const ca = Math.cos(yaw)
      const sa = Math.sin(yaw)
      ctx.fillStyle = tone
      for (let i = 0; i < cloud.n; i++) {
        const rx = cloud.x[i] * ca - cloud.z[i] * sa
        const rz = cloud.x[i] * sa + cloud.z[i] * ca
        const dz = rz - camZ
        if (dz < 30) continue
        const s = focal / dz
        const sx = cx + rx * s
        const sy = cy - cloud.y[i] * s
        if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue
        // Points whose surface turns toward you carry the light.
        let face = -(cloud.nx[i] * sa + cloud.nz[i] * ca)
        if (face < 0) face = 0
        face += cloud.ny[i] * 0.5
        if (face > 1) face = 1
        const px = clamp((focal * 1.1) / dz, 0.7, 2.4)
        let al = cloud.bri[i] * (0.32 + 0.68 * face)
        if (al > 1) al = 1
        ctx.globalAlpha = al
        ctx.fillRect(sx, sy, px, px)
      }
      ctx.globalAlpha = 1
    }

    size()

    if (prefersReducedMotion()) {
      draw()
      return onLayoutResize(() => { size(); draw() })
    }

    let raf = 0
    let running = false
    let last = 0
    const frame = (ts: number) => {
      if (!running) return
      const dt = Math.min((ts - last) / 1000 || 0, 0.05)
      last = ts
      yaw += dt * 0.22
      draw()
      raf = requestAnimationFrame(frame)
    }

    // Off-screen cards cost nothing.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true
          last = performance.now()
          raf = requestAnimationFrame(frame)
        } else if (!e.isIntersecting && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { rootMargin: '120px 0px' },
    )
    io.observe(box)
    draw()

    const stopResize = onLayoutResize(() => {
      cloud = build(form, window.innerWidth < 700 ? 1300 : 2200)
      size()
      draw()
    })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      stopResize()
    }
  }, [form, tone])

  return (
    <div ref={host} className={`h-full w-full ${className ?? ''}`}>
      <canvas ref={canvas} aria-hidden="true" className="block h-full w-full" />
    </div>
  )
}
