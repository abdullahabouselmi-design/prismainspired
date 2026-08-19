import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

type MaskRevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /**
   * Position within its block. Later paragraphs get a longer delay so they can
   * never begin before an earlier one has started.
   */
  order?: number
}

/**
 * Content arrives from behind a mask rather than fading. Text is split into
 * LINES, each line sits in an overflow-hidden wrapper, and the lines translate
 * up into place on entry.
 */
export function MaskReveal({
  children,
  as: Tag = 'div',
  className,
  order = 0,
}: MaskRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return

    let split: SplitText | null = null
    const ctx = gsap.context(() => {
      // `mask: 'lines'` wraps every line in its own overflow-hidden element.
      split = new SplitText(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
      })

      gsap.set(split.lines, { yPercent: 110 })
      gsap.to(split.lines, {
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.08,
        delay: order * 0.16,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    }, el)

    // Re-split on resize so line boxes stay correct.
    const onResize = () => {
      split?.revert()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      split?.revert()
      ctx.revert()
    }
  }, [order])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
