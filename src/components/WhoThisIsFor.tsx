import { useReducedMotion } from '../lib/motion'
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

export function WhoThisIsFor() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative bg-paper py-16 md:py-20">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

      <Grid width="lg" className="relative gap-y-5">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow tone="light">Who I work with</Eyebrow>
        </div>

        <h2 className="col-span-4 text-2xl font-normal text-ink sm:text-3xl md:col-span-8 md:text-4xl lg:col-span-12">
          <WordsPullUpMultiStyle
            align="left"
            segments={[{ text: 'People with something to launch.' }]}
          />
        </h2>

        <MaskReveal
          as="p"
          order={1}
          className="body-base col-span-4 max-w-[52ch] text-ink/60 md:col-span-8 lg:col-span-6"
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
