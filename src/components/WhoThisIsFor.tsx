import { useEffect, useState } from 'react'
import { useReducedMotion } from '../lib/motion'
import { SpinningText } from './SpinningText'
import { IconLook, IconShape, IconLocate, IconShow } from './ProcessIcons'
import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { MaskReveal } from './MaskReveal'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'

const AUDIENCES = ['Brand Directors', 'Innovation leads', 'CPG & Consumer Goods Founders']

const SEQUENCE = [...AUDIENCES, ...AUDIENCES, ...AUDIENCES, ...AUDIENCES]

function Strip({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <span aria-hidden={ariaHidden ? 'true' : undefined} className="flex shrink-0 items-center">
      {SEQUENCE.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap text-lg font-bold text-ink sm:text-2xl">{item}</span>
          <span aria-hidden="true" className="px-6 text-lg text-amberDeep sm:px-8 sm:text-2xl">
            +
          </span>
        </span>
      ))}
    </span>
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
    <div className="relative h-40 w-40 text-ink/35 sm:h-48 sm:w-48 lg:h-56 lg:w-56">
      <SpinningText text="Strategy Made Seen" duration="26s" />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {MARKS.map((Mark, n) => (
          <Mark
            key={n}
            className={`absolute h-11 w-11 text-amberDeep transition-opacity duration-700 sm:h-14 sm:w-14 ${
              n === i ? 'opacity-100' : 'opacity-0'
            }`}
            accentClassName="text-amber"
          />
        ))}
      </span>
    </div>
  )
}

export function WhoThisIsFor() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative z-10 -mt-8 rounded-t-[1.75rem] md:-mt-12 md:rounded-t-[2.5rem] bg-paper py-16 md:py-20">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

      <Grid width="lg" className="relative gap-y-5">
        <div className="col-span-4 md:col-span-8 lg:col-span-8">
          <Eyebrow tone="light">Who I work with</Eyebrow>
        </div>

        {/* The badge spans the header rows and sits hard right. */}
        <div className="col-span-4 row-span-3 hidden justify-end md:col-span-8 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:flex lg:items-center">
          <Badge still={reduceMotion} />
        </div>

        <h2 className="col-span-4 text-2xl font-normal text-ink sm:text-3xl md:col-span-8 md:text-4xl lg:col-span-8 lg:col-start-1">
          <WordsPullUpMultiStyle
            align="left"
            segments={[{ text: 'People with something to launch.' }]}
          />
        </h2>

        <MaskReveal
          as="p"
          order={1}
          className="body-base col-span-4 max-w-[52ch] text-ink/60 md:col-span-8 lg:col-span-6 lg:col-start-1"
        >
          Founders, brand directors, and innovation leads who&rsquo;d rather find
          out now than after the first production run.
        </MaskReveal>
      </Grid>

      {reduceMotion ? (
        <Grid width="lg" className="relative mt-6">
          <div className="col-span-4 flex flex-wrap items-center gap-x-8 gap-y-3 md:col-span-8 lg:col-span-12">
            {AUDIENCES.map((item) => (
              <span key={item} className="text-lg font-bold text-ink sm:text-2xl">
                {item}
              </span>
            ))}
          </div>
        </Grid>
      ) : (
        <Grid width="lg" className="relative mt-6">
          <div className="marquee-host marquee-fade relative col-span-4 overflow-hidden md:col-span-8 lg:col-span-12">
            <div className="marquee-track flex w-max">
              <Strip />
              <Strip ariaHidden />
            </div>
          </div>
        </Grid>
      )}
    </section>
  )
}
