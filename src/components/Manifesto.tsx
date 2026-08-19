import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { MaskReveal } from './MaskReveal'
import { CountUp } from './CountUp'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'

const PARAGRAPH_ONE =
  'I treat that choice as a formula. The brand, the product, the packaging, the positioning, the price, the promise, etc. all solved for one specific person. Each one set to a proportion, and those proportions are what decides it. Get them right and the person will always choose you.'

const PARAGRAPH_TWO =
  "Six years inside FMCG taught me the formula, two years in strategy consulting taught me it isn't entirely about the product. A shampoo, a home-care line or public initiative all have something in common, and that is: it still needs to be chosen. And this is exactly what I solve for."

const STATS = [
  { value: '06', label: 'Years in FMCG' },
  { value: '08', label: 'Consumer brands worked on' },
  { value: '02', label: 'Years in strategy consulting' },
  { value: '05', label: 'Sectors advised across' },
]

export function Manifesto() {
  return (
    <section id="thinking" className="relative bg-ink py-32 md:py-48">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <Grid className="relative gap-y-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow>The way I see it</Eyebrow>
        </div>

        <h2 className="display-1 col-span-4 max-w-[16ch] text-bone md:col-span-8 lg:col-span-10">
          <WordsPullUpMultiStyle
            align="left"
            segments={[
              { text: 'Why does a person reach for this and not' },
              { text: 'that?', className: 'font-serif italic' },
            ]}
          />
        </h2>

        <div className="col-span-4 mt-6 md:col-span-8 lg:col-span-7 lg:col-start-6">
          <MaskReveal as="p" className="body-lg max-w-[58ch] text-bone/80">
            {PARAGRAPH_ONE}
          </MaskReveal>
          <MaskReveal as="p" order={1} className="body-lg mt-8 max-w-[58ch] text-bone/80">
            {PARAGRAPH_TWO}
          </MaskReveal>
        </div>

        <div className="col-span-4 mt-16 grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4 lg:col-span-12">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <CountUp
                value={stat.value}
                className="display-2 block text-bone"
              />
              <p className="label mt-3 text-bone/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </Grid>
    </section>
  )
}
