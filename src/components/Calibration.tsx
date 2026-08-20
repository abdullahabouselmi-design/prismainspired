import { useCallback, useRef, useState } from 'react'
import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { MaskReveal } from './MaskReveal'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'
import { ShelfCalibration } from './ShelfCalibration'
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
    <section className="relative bg-ink py-28 md:py-40">
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
      </Grid>

      {/* The shelf is the stage: it holds while the rows pass beneath it.
          Sticky is bounded by its own parent, so the shelf and the rows share
          one wrapper — otherwise the shelf would linger over the section's
          bottom padding after the last row had gone. */}
      <div className="relative">
      <div className="sticky top-0 z-10 mt-16 bg-ink pb-6 pt-8">
        <Grid width="lg" className="relative">
          <div className="col-span-4 h-[30vh] md:col-span-8 md:h-[36vh] lg:col-span-12 lg:h-[42vh]">
            <ShelfCalibration triggerRef={rowsRef} onBeat={onBeat} />
          </div>
        </Grid>
      </div>

      <Grid width="lg" className="relative">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
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
                    className={`transition-opacity duration-500 ${isResult ? 'py-16' : 'border-b border-bone/10 py-16'}`}
                    style={{ opacity: isActive ? 1 : 0.25 }}
                  >
                    <p className={`label ${isResult ? 'text-bone' : 'text-amber'}`}>
                      {block.label}
                    </p>
                    <p
                      className={
                        isResult
                          ? 'body-lg mt-3 max-w-[52ch] font-medium text-bone'
                          : 'body-base mt-3 max-w-[52ch] text-bone'
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
      </Grid>
      </div>
    </section>
  )
}
