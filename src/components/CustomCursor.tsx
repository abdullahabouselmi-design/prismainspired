import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary'

/** Desktop-only trailing cursor. Disabled on touch and under reduced motion. */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!finePointer) return

    const el = dot.current
    if (!el) return

    document.documentElement.classList.add('has-custom-cursor')
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 1 })

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const target = { ...pos }

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.15
      pos.y += (target.y - pos.y) * 0.15
      gsap.set(el, { x: pos.x, y: pos.y })
    }
    gsap.ticker.add(tick)

    const grow = () => gsap.to(el, { width: 48, height: 48, opacity: 0.4, duration: 0.25, ease: 'power2.out' })
    const shrink = () => gsap.to(el, { width: 12, height: 12, opacity: 1, duration: 0.25, ease: 'power2.out' })

    const onOver = (event: PointerEvent) => {
      if ((event.target as HTMLElement)?.closest?.(INTERACTIVE)) grow()
    }
    const onOut = (event: PointerEvent) => {
      if ((event.target as HTMLElement)?.closest?.(INTERACTIVE)) shrink()
    }
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] h-3 w-3 rounded-full bg-slate opacity-0 mix-blend-difference"
    />
  )
}
