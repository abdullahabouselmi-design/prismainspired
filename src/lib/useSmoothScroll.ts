import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

/**
 * Lenis on the window, kept in lockstep with ScrollTrigger.
 *
 * Lenis drives the real window scroll position, so ScrollTrigger reads the same
 * value it always would; the two are synced by having Lenis push updates into
 * ScrollTrigger and by running Lenis off GSAP's ticker rather than its own rAF.
 * A scrollerProxy is only required when the scroller is an element other than
 * the window, which would fight this setup rather than help it.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
      smoothWheel: true,
    })

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Anchor clicks go through Lenis so smooth scrolling stays consistent.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement)?.closest?.('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -24 })
    }
    document.addEventListener('click', onClick)

    ScrollTrigger.refresh()

    return () => {
      document.removeEventListener('click', onClick)
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [])
}
