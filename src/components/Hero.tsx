import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { WordsPullUp } from './WordsPullUp'
import { ScrollDownButton } from './ScrollDownButton'
import { useHeroParallax } from './useHeroParallax'

const EASE = [0.16, 1, 0.3, 1] as const

const NAV_ITEMS = [
  { label: 'Thinking', href: '#thinking' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Work', href: '#work' },
]

// Almarai bold at -0.04em renders "ABDULLAH" and "ABOU SELMI" at a 1 : 1.1166
// width ratio, so line one is sized up by that factor to match line two.
// Both are in vw, so the match holds at every viewport width.
// Tracking must live on the sized element: letter-spacing in `em` resolves
// against the font-size where it is declared, then inherits as a fixed length.
// Both lines share one size now; matched widths are no longer wanted.
const NAME_LINE = 'display-hero block whitespace-nowrap'

export function Hero() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useHeroParallax(sectionRef, mediaRef, nameRef, navRef)

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: 0.8, delay, ease: EASE },
        }

  return (
    <section ref={sectionRef} className="h-screen w-full bg-ink p-4 md:p-6">
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-ink md:rounded-[2rem]">
        <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        {reduceMotion ? (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="/hero-poster.png"
            alt=""
          />
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/hero-loop.mp4"
            poster="/hero-poster.png"
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        </div>

        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.6] mix-blend-overlay" />

        {/* Legibility scrims. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

        {/* Soft pool behind the name, now that it sits low in the frame. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 26% at 50% 88%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0) 80%)',
          }}
        />

        <nav ref={navRef} className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-2xl bg-ink px-4 py-2 md:rounded-b-3xl md:px-8">
          <ul className="label flex items-center gap-3 sm:gap-6 md:gap-12">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-bone/80 transition-colors hover:text-bone">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Name and scroll button sit together at the foot of the frame, so the
            video subject stays unobstructed above them. */}
        <div ref={nameRef} className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center px-4 will-change-transform sm:bottom-10">
          <p className="label mb-4 text-center text-bone/70 sm:mb-5">
            Product &amp; Brand Strategist
          </p>

          <h1 className="flex flex-col items-center text-center uppercase text-bone">
            <WordsPullUp text="Abdullah" className={NAME_LINE} />
            <WordsPullUp text="Abou Selmi" className={NAME_LINE} order={1} />
          </h1>

          <motion.div {...fadeUp(0.6)} className="mt-5 sm:mt-6">
            <ScrollDownButton targetId="about" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
