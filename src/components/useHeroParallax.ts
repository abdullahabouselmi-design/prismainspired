import { useEffect, type RefObject } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/** Video drifts down and scales; the name outruns the scroll and fades out. */
export function useHeroParallax(
  section: RefObject<HTMLElement | null>,
  media: RefObject<HTMLElement | null>,
  name: RefObject<HTMLElement | null>,
  nav: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const sectionEl = section.current
    if (!sectionEl) return

    const ctx = gsap.context(() => {
      const common = {
        trigger: sectionEl,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      } as const

      if (media.current) {
        gsap.to(media.current, {
          yPercent: 20,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: common,
        })
      }

      if (name.current) {
        gsap.to(name.current, {
          yPercent: -115,
          ease: 'none',
          scrollTrigger: common,
        })
        gsap.to(name.current, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: '70% top',
            scrub: 1,
          },
        })
      }

      if (nav.current) {
        gsap.to(nav.current, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: '45% top',
            scrub: 1,
          },
        })
      }
    }, sectionEl)

    return () => ctx.revert()
  }, [section, media, name, nav])
}
