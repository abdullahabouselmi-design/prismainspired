import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { MaskReveal } from './MaskReveal'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'
import { CanFallback } from './CanFallback'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { requestScrollRefresh } from '../lib/motion'
import type { ProgressRef } from './CanScene'

const CanScene = lazy(() => import('./CanScene'))

const BLOCKS = [
  { label: 'Audience', description: "Who it's for, and the need they haven't solved" },
  { label: 'Product', description: 'What it actually delivers, and the detail that earns the second purchase' },
  { label: 'Positioning', description: "What it means, and the habit it's really up against" },
  { label: 'Price', description: 'Where it sits against everything beside it, and what that says before anyone tries it' },
  { label: 'Message', description: 'What lands in the first three seconds' },
  { label: 'Channel', description: 'Where and when it meets them' },
  { label: 'Result', description: 'Chosen. Then chosen again.' },
]

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export function Calibration() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0) as ProgressRef
  const [activeIndex, setActiveIndex] = useState(0)
  const [inView, setInView] = useState(false)
  // Three.js is never imported when we cannot or should not run it.
  const [use3D, setUse3D] = useState(false)

  useEffect(() => {
    setUse3D(!prefersReducedMotion() && webglAvailable())
  }, [])

  useEffect(() => {
    const pin = pinRef.current
    if (!pin) return
    if (prefersReducedMotion()) {
      setActiveIndex(BLOCKS.length - 1)
      return
    }

    const onUpdate = (p: number) => {
      progress.current = p
      setActiveIndex(Math.round(p * (BLOCKS.length - 1)))
      // The list rides the same scrub, so the labels pass the pinned can.
      const list = listRef.current
      const frame = windowRef.current
      if (list && frame) {
        const travel = Math.max(0, list.scrollHeight - frame.clientHeight)
        gsap.set(list, { y: -travel * p })
      }
    }

    const mm = gsap.matchMedia()

    // Desktop: pin the block so the seven stages get real scroll distance.
    mm.add('(min-width: 1024px)', () => {
      const st = ScrollTrigger.create({
        trigger: pin,
        start: 'top top',
        end: '+=320%',
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onEnter: () => setInView(true),
        onEnterBack: () => setInView(true),
        onLeave: () => setInView(false),
        onLeaveBack: () => setInView(false),
        onUpdate: (self) => onUpdate(self.progress),
      })
      return () => st.kill()
    })

    // Below lg the can is sticky and the labels simply scroll beneath it.
    mm.add('(max-width: 1023px)', () => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: 'top 80%',
        end: 'bottom bottom',
        scrub: true,
        onEnter: () => setInView(true),
        onEnterBack: () => setInView(true),
        onLeave: () => setInView(false),
        onLeaveBack: () => setInView(false),
        onUpdate: (self) => {
          progress.current = self.progress
          setActiveIndex(Math.round(self.progress * (BLOCKS.length - 1)))
        },
      })
      return () => st.kill()
    })

    requestScrollRefresh()
    return () => mm.revert()
  }, [])

  const reduced = typeof window !== 'undefined' && prefersReducedMotion()

  return (
    <section ref={sectionRef} className="relative bg-ink py-28 md:py-40">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <Grid width="lg" className="relative gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow>How I think</Eyebrow>
        </div>

        <h2 className="display-1 col-span-4 max-w-[12ch] text-bone md:col-span-8 lg:col-span-9">
          <WordsPullUpMultiStyle
            align="left"
            segments={[{ text: 'I think in building blocks.' }]}
          />
        </h2>

        <MaskReveal as="p" order={1} className="body-base col-span-4 max-w-[58ch] text-bone/60 md:col-span-8 lg:col-span-7">
          A product isn&rsquo;t one big idea. It&rsquo;s dozens of small decisions,
          each set to a level, all aimed at the same person. The idea is rarely
          the problem, yet the proportions are. A shade too premium, a format
          that doesn&rsquo;t fit the shelf, a claim that lands a fraction off,
          and the same product stops being chosen.
        </MaskReveal>

        <div
          ref={pinRef}
          className="col-span-4 mt-16 grid grid-cols-1 gap-10 md:col-span-8 lg:col-span-12 lg:grid-cols-12 lg:items-center lg:gap-16"
        >
          <div className="lg:col-span-5">
            <div className="sticky top-16 z-10 flex h-[34vh] items-center justify-center lg:static lg:h-[68vh]">
              {use3D ? (
                <Suspense fallback={<CanFallback className="h-full w-auto" />}>
                  <CanScene progress={progress} active={inView} />
                </Suspense>
              ) : (
                <CanFallback className="h-full w-auto" />
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-baseline justify-between border-b border-bone/15 pb-3">
              <span className="text-xs uppercase tracking-widest text-bone">The calibration</span>
              <span className="text-xs text-bone/40">Set to a proportion</span>
            </div>

            <div
              ref={windowRef}
              className="mt-2 lg:h-[52vh] lg:overflow-hidden"
            >
            <ul ref={listRef}>
              {BLOCKS.map((block, i) => {
                const isResult = i === BLOCKS.length - 1
                const isActive = reduced || i === activeIndex
                return (
                  <li
                    key={block.label}
                    className={`transition-opacity duration-500 ${isResult ? 'py-8' : 'border-b border-bone/10 py-8'}`}
                    style={{ opacity: isActive ? 1 : 0.25 }}
                  >
                    <p className={`label ${isResult ? 'text-bone' : 'text-amber'}`}>
                      {block.label}
                    </p>
                    <p
                      className={
                        isResult
                          ? 'body-lg mt-3 font-medium text-bone'
                          : 'body-base mt-3 text-bone'
                      }
                    >
                      {block.description}
                    </p>
                  </li>
                )
              })}
            </ul>
            </div>
          </div>
        </div>
      </Grid>
    </section>
  )
}
