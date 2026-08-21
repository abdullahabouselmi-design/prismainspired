import { useEffect, useState } from 'react'
import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { MaskReveal } from './MaskReveal'
import { BookACall } from './BookACall'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'
import { SpinningText } from './SpinningText'
import { IconLook, IconShape, IconLocate, IconShow } from './ProcessIcons'
import { useReducedMotion } from '../lib/motion'

const LINKEDIN_URL = 'https://www.linkedin.com/in/aaselmi/'

/** Filled brand glyph. lucide-react dropped brand icons, so this is by hand. */
function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.71h.05a4.17 4.17 0 0 1 3.75-2.06c4.01 0 4.75 2.64 4.75 6.07V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H9V9Z" />
    </svg>
  )
}

const MARKS = [IconLook, IconShape, IconLocate, IconShow]

/**
 * The ring, with the four process marks cycling at its centre. The icons are
 * the same ones the How I work section uses, so the badge reads as a summary of
 * the method rather than as decoration.
 */
function Badge({ still }: { still: boolean }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (still) return
    const id = setInterval(() => setI((n) => (n + 1) % MARKS.length), 2600)
    return () => clearInterval(id)
  }, [still])

  return (
    <div className="relative h-40 w-40 text-bone/30 sm:h-48 sm:w-48 lg:h-56 lg:w-56">
      <SpinningText text="Strategy Made Seen" duration="26s" />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {MARKS.map((Mark, n) => (
          <Mark
            key={n}
            className={`absolute h-11 w-11 text-amber transition-opacity duration-700 sm:h-14 sm:w-14 ${
              n === i ? 'opacity-100' : 'opacity-0'
            }`}
            accentClassName="text-amberDeep"
          />
        ))}
      </span>
    </div>
  )
}

export function Contact() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative z-10 -mt-8 rounded-t-[1.75rem] md:-mt-12 md:rounded-t-[2.5rem] bg-ink pt-12 md:pt-16">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <Grid width="lg" className="relative gap-y-6">
        <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-1 lg:row-start-1">
          <Eyebrow>Contact</Eyebrow>
        </div>

        <h2 className="col-span-4 text-4xl font-normal text-bone sm:text-5xl md:col-span-8 md:text-6xl lg:col-span-8 lg:col-start-1 lg:row-start-2 lg:text-7xl">
          <WordsPullUpMultiStyle
            align="left"
            segments={[
              { text: "Let's make it" },
              { text: 'seen.', className: 'font-serif italic' },
            ]}
          />
        </h2>

        {/* Sits in the dark to the right of the headline. */}
        <div className="col-span-4 hidden justify-end md:col-span-8 lg:col-span-4 lg:col-start-9 lg:row-span-3 lg:row-start-1 lg:flex lg:items-center">
          <Badge still={reduceMotion} />
        </div>

        <MaskReveal
          as="p"
          order={1}
          className="body-base col-span-4 max-w-[48ch] text-bone/60 md:col-span-8 lg:col-span-6 lg:col-start-1 lg:row-start-3"
        >
          Tell me what you&rsquo;re building. If I can make it something you can
          see, I&rsquo;ll tell you how.
        </MaskReveal>

        <div className="col-span-4 mt-6 flex flex-col items-start gap-3 md:col-span-8 lg:col-span-12">
          <BookACall />
          <span className="text-xs text-bone/40">Usually replies within a day</span>
        </div>

        <footer className="col-span-4 mt-16 flex flex-col gap-10 border-t border-bone/10 pt-8 md:col-span-8 sm:flex-row sm:items-start sm:justify-between sm:gap-8 lg:col-span-12">
          <div>
            <p className="text-sm font-bold tracking-wide text-bone">ABDULLAH ABOU SELMI</p>
            <p className="mt-1 text-xs text-bone/40">Product &amp; Brand Strategist</p>
            <p className="mt-4 text-xs text-bone/30">&copy; 2026. All rights reserved.</p>
          </div>

          {/* Aligned to the name's baseline, not the foot of the block. */}
          <div className="flex items-center gap-5 text-xs text-bone/40 sm:pt-px">
            {/* TODO: real email address */}
            <a href="mailto:hello@example.com" className="transition-colors hover:text-bone">
              hello@example.com
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-bone"
            >
              <LinkedInMark className="h-[18px] w-[18px]" />
            </a>
          </div>

        </footer>
      </Grid>
    </section>
  )
}
