import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)

/** The exact cubic-bezier(0.76, 0, 0.24, 1) used for the preloader exit. */
export const EASE_EXIT = CustomEase.create('exitEase', '0.76, 0, 0.24, 1')

/** The [0.16, 1, 0.3, 1] curve the ported framer-motion components used. */
export const EASE_IN = CustomEase.create('easeIn', '0.16, 1, 0.3, 1')

/** The [0.22, 1, 0.36, 1] curve the icon draw-in used. */
export const EASE_DRAW = CustomEase.create('easeDraw', '0.22, 1, 0.36, 1')

export { gsap, ScrollTrigger, CustomEase }

/** True when the visitor has asked for reduced motion. */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
