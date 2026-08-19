import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion, EASE_EXIT } from '../lib/gsap'

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
    if (prefersReducedMotion()) return
    const inner = el.firstElementChild
    if (!inner) return

    const ctx = gsap.context(() => {
      gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set(inner, { scale: 1.15 })

      gsap.to(el, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.1,
        ease: EASE_EXIT,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
      gsap.to(inner, {
        scale: 1,
        duration: 1.1,
        ease: EASE_EXIT,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrap} className={className}>
      {children}
    </div>
  )
}
