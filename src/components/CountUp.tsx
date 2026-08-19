import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

type CountUpProps = {
  value: string
  className?: string
}

/**
 * Counts to `value` once in view, easing out over 1.6s.
 * Keeps the source string's padding, so "06" counts up as "06".
 */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const target = parseInt(value, 10) || 0
  const pad = value.length
  const [display, setDisplay] = useState(prefersReducedMotion() ? target : 0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setDisplay(target)
      return
    }

    const state = { value: 0 }
    const ctx = gsap.context(() => {
      gsap.to(state, {
        value: target,
        duration: 1.6,
        ease: 'power3.out',
        onUpdate: () => setDisplay(Math.round(state.value)),
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    }, el)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [target])

  return (
    <span ref={ref} className={className}>
      {String(display).padStart(pad, '0')}
    </span>
  )
}
