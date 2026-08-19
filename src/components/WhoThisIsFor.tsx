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
          <span className="display-2 whitespace-nowrap text-ink">{item}</span>
          <span aria-hidden="true" className="display-2 px-6 text-amberDeep sm:px-8">
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
    <section className="relative bg-paper py-12 md:py-16">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

      <Grid className="relative gap-y-6">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow tone="light">Who I work with</Eyebrow>
        </div>

        <h2 className="display-1 col-span-4 max-w-[14ch] text-ink md:col-span-8 lg:col-span-8">
          <WordsPullUpMultiStyle
            align="left"
            segments={[{ text: 'People with something to launch.' }]}
          />
        </h2>

        <MaskReveal
          as="p"
          order={1}
          className="body-lg col-span-4 max-w-[52ch] text-ink/60 md:col-span-8 lg:col-span-6"
        >
          Founders, brand directors, and innovation leads who&rsquo;d rather find
          out now than after the first production run.
        </MaskReveal>
      </Grid>

      {reduceMotion ? (
        <Grid className="relative mt-10">
          <div className="col-span-4 flex flex-wrap items-center gap-x-8 gap-y-3 md:col-span-8 lg:col-span-12">
            {AUDIENCES.map((item) => (
              <span key={item} className="display-2 text-ink">
                {item}
              </span>
            ))}
          </div>
        </Grid>
      ) : (
        <div className="marquee-host relative mt-10 overflow-hidden">
          <div className="marquee-track flex w-max">
            <Strip />
            <Strip ariaHidden />
          </div>
        </div>
      )}
    </section>
  )
}
