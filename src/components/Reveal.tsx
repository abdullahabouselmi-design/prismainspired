import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { clearReveal, revealAttr } from '../lib/motion'

/**
 * Card and grid-item entrance: rises from below while a mask reveals it from
 * the bottom edge. The from-state is set before the attribute is cleared, so
 * the element never paints in its settled position first.
 */
export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode
  index?: number
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
      gsap.set(el, { y: 40, clipPath: 'inset(100% 0% 0% 0%)' })
      clearReveal(el)
      gsap.to(el, {
        y: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.8,
        ease: 'power3.out',
        delay: index * 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [index])

  return (
    <div ref={ref} className={className} {...revealAttr()}>
      {children}
    </div>
  )
}
