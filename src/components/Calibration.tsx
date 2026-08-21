import { useCallback, useRef, useState } from 'react'
import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { MaskReveal } from './MaskReveal'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'
import { CalibrationCan } from './CalibrationCan'
import { prefersReducedMotion } from '../lib/gsap'

const BLOCKS = [
  { label: 'Audience', description: "Who it's for, and the need they haven't solved" },
  { label: 'Product', description: 'What it actually delivers, and the detail that earns the second purchase' },
  { label: 'Positioning', description: "What it means, and the habit it's really up against" },
  { label: 'Price', description: 'Where it sits against everything beside it, and what that says before anyone tries it' },
  { label: 'Message', description: 'What lands in the first three seconds' },
  { label: 'Channel', description: 'Where and when it meets them' },
  { label: 'Result', description: 'Chosen. Then chosen again.' },
]

export function Calibration() {
  const rowsRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Stable, so the shelf's timeline is never rebuilt by a re-render.
  const onBeat = useCallback((i: number) => setActiveIndex(i), [])

  const reduced = typeof window !== 'undefined' && prefersReducedMotion()

  return (
    <section className="relative bg-ink py-16 md:py-20">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <Grid width="lg" className="relative gap-y-6">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow>How I think</Eyebrow>
        </div>

        <h2 className="display-1 col-span-4 text-bone md:col-span-8 lg:col-span-12">
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
      </Grid>

      {/* The can holds while the rows scroll beside it. `contents` below lg
          hands the sticky element the tall wrapper it needs to travel in; at lg
          the wrapper becomes the left grid column, which stretches to the row's
          full height and does the same job. */}
      <Grid width="lg" className="relative mt-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="contents lg:block lg:col-span-5">
              {/* Below lg the can and the rows share one column, so the can
                  needs its own ground for the rows to pass behind — and it
                  pins to the very top, or rows would reappear above it. At lg
                  it sits in its own column and needs neither. */}
              <div className="sticky top-0 z-10 mb-10 flex h-[38vh] items-center justify-center bg-ink md:h-[40vh] lg:top-[12vh] lg:mb-0 lg:h-[44vh] lg:bg-transparent">
                <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15] lg:hidden" />
                <CalibrationCan triggerRef={rowsRef} onBeat={onBeat} />
              </div>
            </div>

            <div className="pb-[6vh] lg:col-span-7">
              <div className="flex items-baseline justify-between border-b border-bone/15 pb-3">
                <span className="text-xs uppercase tracking-widest text-bone">The calibration</span>
                <span className="text-xs text-bone/40">Set to a proportion</span>
              </div>

              <div ref={rowsRef}>
                <ul>
                  {BLOCKS.map((block, i) => {
                    const isResult = i === BLOCKS.length - 1
                    const isActive = reduced || i === activeIndex
                    return (
                      <li
                        key={block.label}
                        className={`transition-opacity duration-500 ${isResult ? 'py-6' : 'border-b border-bone/10 py-6'}`}
                        style={{ opacity: isActive ? 1 : 0.25 }}
                      >
                        <p className={`label ${isResult ? 'text-bone' : 'text-amber'}`}>
                          {block.label}
                        </p>
                        <p
                          className={
                            isResult
                              ? 'body-lg mt-3 max-w-[46ch] font-medium text-bone'
                              : 'body-base mt-3 max-w-[46ch] text-bone'
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
        </div>
      </Grid>
    </section>
  )
}
