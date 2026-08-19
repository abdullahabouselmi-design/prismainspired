import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { SplitText } from 'gsap/SplitText'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { clearReveal, fontsReady, onLayoutResize, revealAttr } from '../lib/motion'

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
 *
 * Two things this has to get right:
 *  - Splitting waits for final font metrics, or every line box is measured
 *    against the fallback face and is wrong once the real face swaps in.
 *  - On resize the split is rebuilt, not merely reverted. A reverted split
 *    with no rebuild loses its masks entirely.
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

    if (prefersReducedMotion()) {
      clearReveal(el)
      return
    }

    let split: SplitText | null = null
    let ctx: gsap.Context | null = null
    let played = false
    let cancelled = false

    const teardown = () => {
      ctx?.revert()
      ctx = null
      split?.revert()
      split = null
    }

    const build = () => {
      if (cancelled || !ref.current) return
      teardown()

      ctx = gsap.context(() => {
        // `mask: 'lines'` wraps every line in its own overflow-hidden element.
        split = new SplitText(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
        })

        const lines = split.lines
        if (!lines.length) return

        if (played) {
          // Already revealed: rebuild in the settled state, do not replay.
          gsap.set(lines, { yPercent: 0 })
          return
        }

        gsap.set(lines, { yPercent: 110 })
        gsap.to(lines, {
          yPercent: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.08,
          delay: order * 0.16,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
              played = true
            },
          },
        })
      }, el)

      clearReveal(el)
    }

    // Nothing measures lines until the real faces are in.
    fontsReady().then(build)

    const unsubscribe = onLayoutResize(build)

    return () => {
      cancelled = true
      unsubscribe()
      teardown()
    }
  }, [order])

  return (
    <Tag ref={ref} className={className} {...revealAttr()}>
      {children}
    </Tag>
  )
}
