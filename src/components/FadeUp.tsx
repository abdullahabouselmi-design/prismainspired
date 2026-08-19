import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion, EASE_IN } from '../lib/gsap'
import { clearReveal, revealAttr } from '../lib/motion'

/**
 * Rise-and-fade on scroll entry. A direct GSAP replacement for the
 * framer-motion `fadeUp` pattern these sections used: same 20px offset, same
 * 0.7s duration, same [0.16, 1, 0.3, 1] curve, and `top bottom-=80px` matches
 * framer's `viewport: { margin: '-80px' }`.
 */
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      clearReveal(el)
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { y: 20, opacity: 0 })
      clearReveal(el)
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay,
        ease: EASE_IN,
        scrollTrigger: { trigger: el, start: 'top bottom-=80px', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [delay])

  return (
    <div ref={ref} className={className} {...revealAttr()}>
      {children}
    </div>
  )
}
