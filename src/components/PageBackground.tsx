import { useEffect } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { requestScrollRefresh } from '../lib/motion'

const COLOURS = { ink: '#0B0907', paper: '#EAE2D4' } as const

/**
 * Drives the page background across each dark/light boundary.
 *
 * Sections keep their own opaque backgrounds, so text contrast is never at the
 * mercy of the crossfade. The transition is visible through the empty
 * BoundaryGap bands, which is the only place the page background is exposed.
 */
export function PageBackground() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const gaps = [...document.querySelectorAll<HTMLElement>('[data-boundary]')]
    if (!gaps.length) return

    const ctx = gsap.context(() => {
      gsap.set(document.documentElement, { backgroundColor: COLOURS.ink })

      gaps.forEach((gap) => {
        const from = COLOURS[(gap.dataset.from ?? 'ink') as keyof typeof COLOURS]
        const to = COLOURS[(gap.dataset.to ?? 'paper') as keyof typeof COLOURS]

        ScrollTrigger.create({
          trigger: gap,
          // Roughly 40vh of scroll on either side of the band.
          start: 'top bottom-=20%',
          end: 'bottom top+=20%',
          scrub: true,
          onUpdate: (self) => {
            gsap.set(document.documentElement, {
              backgroundColor: gsap.utils.interpolate(from, to, self.progress),
            })
          },
          onLeave: () => gsap.set(document.documentElement, { backgroundColor: to }),
          onLeaveBack: () => gsap.set(document.documentElement, { backgroundColor: from }),
        })
      })
    })

    requestScrollRefresh()
    return () => ctx.revert()
  }, [])

  return null
}
