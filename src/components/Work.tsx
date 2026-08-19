import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { Reveal } from './Reveal'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'

// TODO: client names — replace each placeholder with a real brand or organisation.
const TIER_ONE_NAMES = [
  'Placeholder One', 'Placeholder Two', 'Placeholder Three',
  'Placeholder Four', 'Placeholder Five', 'Placeholder Six',
]

// TODO: client names — replace each placeholder with a real organisation.
const TIER_TWO_NAMES = [
  'Placeholder One', 'Placeholder Two', 'Placeholder Three',
  'Placeholder Four', 'Placeholder Five', 'Placeholder Six',
]

const TIERS = [
  {
    tier: 'Tier 1',
    name: 'Brands',
    description:
      'Six years inside FMCG — relaunches, distribution partnerships, and market entry.',
    names: TIER_ONE_NAMES,
  },
  {
    tier: 'Tier 2',
    name: 'Organisations',
    description:
      'Two years in strategy consulting — research, benchmarking, and strategic frameworks across public and private sector.',
    names: TIER_TWO_NAMES,
  },
]

export function Work() {
  return (
    <section id="work" className="relative bg-paper py-16 md:py-24">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

      <Grid className="relative gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow tone="light">Where the work has been applied</Eyebrow>
        </div>

        <h2 className="display-1 col-span-4 max-w-[18ch] text-ink md:col-span-8 lg:col-span-9">
          <WordsPullUpMultiStyle
            align="left"
            segments={[{ text: 'Seven years, two very different rooms.' }]}
          />
        </h2>

        <div className="col-span-4 mt-10 space-y-16 md:col-span-8 lg:col-span-12">
          {TIERS.map((tier) => (
            <div key={tier.tier}>
              <div className="flex items-baseline gap-4">
                <span className="label shrink-0 text-amberDeep">{tier.tier}</span>
                <span className="display-2 shrink-0 text-ink">{tier.name}</span>
                <span aria-hidden="true" className="h-px w-full bg-ink/15" />
              </div>

              <p className="body-base mt-4 max-w-[64ch] text-ink/60">{tier.description}</p>

              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
                {tier.names.map((mark, i) => (
                  <Reveal key={`${tier.tier}-${mark}`} index={i % 4}>
                    <li className="label text-ink/40 transition-colors hover:text-ink">
                      {mark}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Grid>
    </section>
  )
}
