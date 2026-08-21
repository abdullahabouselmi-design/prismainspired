import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'

type Logo = {
  name: string
  src: string
  w: number
  h: number
  /** Optical correction. Aspect ratios run 1:1 to 6:1, so equal height is not
   *  equal visual weight: wide wordmarks need trimming, square marks need lifting. */
  scale?: number
}

const TIER_ONE_LOGOS: Logo[] = [
  { name: 'Cosmopolitan Cosmetics', src: '/logos/brands/cosmopolitan-cosmetics.webp', w: 733, h: 120, scale: 0.76 },
  { name: 'Evoluderm', src: '/logos/brands/evoluderm.webp', w: 409, h: 120, scale: 0.94 },
  { name: 'Les Karites', src: '/logos/brands/les-karites.webp', w: 500, h: 211, scale: 1.05 },
  { name: 'Lovea', src: '/logos/brands/lovea.webp', w: 120, h: 120, scale: 1.2 },
  { name: 'Septona', src: '/logos/brands/septona.webp', w: 257, h: 120, scale: 0.86 },
]

const TIER_TWO_LOGOS: Logo[] = [
  { name: 'Expand', src: '/logos/organizations/expand.webp', w: 459, h: 120, scale: 0.88 },
  { name: 'Gambit', src: '/logos/organizations/gambit.webp', w: 381, h: 120, scale: 0.92 },
  { name: 'Qiddiya', src: '/logos/organizations/qiddiya.webp', w: 139, h: 120, scale: 1.18 },
  { name: 'TAM', src: '/logos/organizations/tam.webp', w: 329, h: 120, scale: 0.96 },
  { name: 'Toada', src: '/logos/organizations/toada.webp', w: 235, h: 120, scale: 1.04 },
]

/** Container height is 20 / 24 / 28px at sm / md / lg, times each logo's scale. */

/**
 * One pass of a tier's logos. The -50% keyframe needs exactly two identical
 * halves, and five marks do not fill 1232px, so each half repeats the set.
 */
function LogoRun({ logos, ariaHidden }: { logos: Logo[]; ariaHidden?: boolean }) {
  // Two passes per half is enough once the pitch is wide; three put the same
  // mark on screen twice, which reads as a mistake rather than a loop.
  const run = [...logos, ...logos]
  return (
    <span aria-hidden={ariaHidden ? 'true' : undefined} className="flex shrink-0 items-center">
      {run.map((logo, i) => (
        <span
          key={`${logo.src}-${i}`}
          className="flex shrink-0 items-center justify-center px-9 md:px-14 lg:px-20"
        >
          <span
            // Height stays responsive via classes; the per-logo optical
            // correction rides in as a CSS variable.
            className="flex items-center justify-center h-[calc(20px*var(--k))] md:h-[calc(24px*var(--k))] lg:h-[calc(28px*var(--k))]"
            style={{ ['--k' as string]: logo.scale ?? 1 }}
          >
            <img
              src={logo.src}
              alt={ariaHidden ? '' : logo.name}
              width={logo.w}
              height={logo.h}
              // h-full, not max-h-full: max-height leaves the box with no definite
              // dimension, so it lays out 0x0 and never decodes.
              className="h-full w-auto object-contain"
            />
          </span>
        </span>
      ))}
    </span>
  )
}

const TIERS = [
  {
    tier: 'Tier 1',
    name: 'Brands',
    description:
      'Six years inside FMCG — relaunches, distribution partnerships, and market entry.',
    logos: TIER_ONE_LOGOS,
    duration: '46s',
  },
  {
    tier: 'Tier 2',
    name: 'Organisations',
    description:
      'Two years in strategy consulting — research, benchmarking, and strategic frameworks across public and private sector.',
    logos: TIER_TWO_LOGOS,
    duration: '58s',
  },
]

export function Work() {
  return (
    <section id="work" className="relative bg-paper py-16 md:py-20">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

      <Grid width="lg" className="relative gap-y-6">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow tone="light">Where the work has been applied</Eyebrow>
        </div>

        <h2 className="display-1 col-span-4 text-ink md:col-span-8 lg:col-span-12">
          <WordsPullUpMultiStyle
            align="left"
            segments={[{ text: 'Seven years, two very different rooms.' }]}
          />
        </h2>

        <div className="col-span-4 mt-6 space-y-10 md:col-span-8 lg:col-span-12">
          {TIERS.map((tier) => (
            <div key={tier.tier}>
              <div className="flex items-baseline gap-4">
                <span className="label shrink-0 text-amberDeep">{tier.tier}</span>
                <span className="shrink-0 text-lg font-bold text-ink">{tier.name}</span>
                <span aria-hidden="true" className="h-px w-full bg-ink/15" />
              </div>

              <p className="mt-3 max-w-[64ch] text-sm text-ink/60">{tier.description}</p>

              <div
                className="marquee-host marquee-fade relative mt-6 overflow-hidden"
                style={{ ['--marquee-duration' as string]: tier.duration }}
              >
                <div className="marquee-track flex w-max">
                  <LogoRun logos={tier.logos} />
                  <LogoRun logos={tier.logos} ariaHidden />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Grid>
    </section>
  )
}
