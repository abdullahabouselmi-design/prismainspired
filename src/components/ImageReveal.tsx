import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion, EASE_EXIT } from '../lib/gsap'
import { clearReveal, revealAttr } from '../lib/motion'

/**
 * The mask wipes upward: the visible box grows from the bottom edge as the top
 * inset retreats, while the image itself settles from 1.15 to 1.
 */
export function ImageReveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return

    if (prefersReducedMotion()) {
      clearReveal(el)
      return
    }

    const inner = el.firstElementChild
    if (!inner) {
      clearReveal(el)
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set(inner, { scale: 1.15 })
      clearReveal(el)

      const trigger = { trigger: el, start: 'top 88%', once: true } as const
      gsap.to(el, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.1,
        ease: EASE_EXIT,
        scrollTrigger: trigger,
      })
      gsap.to(inner, {
        scale: 1,
        duration: 1.1,
        ease: EASE_EXIT,
        scrollTrigger: trigger,
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrap} className={className} {...revealAttr()}>
      {children}
    </div>
  )
}
