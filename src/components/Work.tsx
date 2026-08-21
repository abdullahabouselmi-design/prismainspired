import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { Reveal } from './Reveal'
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
  /** Marks that carry their own internal light and dark cannot be silhouetted. */
  filter?: string
}

/** Desaturate and pull every mark to a common weight — but never to a
 *  silhouette. brightness(0) collapses alpha into solid black, which erases
 *  any logo built as light type on a filled shape (Septona) and thickens
 *  anti-aliased wordmarks into mud (Cosmopolitan). */
const FLATTEN = 'grayscale(1) brightness(0.5) contrast(1.3)'

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

const TIERS = [
  {
    tier: 'Tier 1',
    name: 'Brands',
    description:
      'Six years inside FMCG — relaunches, distribution partnerships, and market entry.',
    logos: TIER_ONE_LOGOS,
  },
  {
    tier: 'Tier 2',
    name: 'Organisations',
    description:
      'Two years in strategy consulting — research, benchmarking, and strategic frameworks across public and private sector.',
    logos: TIER_TWO_LOGOS,
  },
]

export function Work() {
  return (
    <section id="work" className="relative bg-paper py-24 md:py-32">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

      <Grid width="md" className="relative gap-y-8">
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
                <span className="shrink-0 text-lg font-bold text-ink">{tier.name}</span>
                <span aria-hidden="true" className="h-px w-full bg-ink/15" />
              </div>

              <p className="mt-4 max-w-[64ch] text-sm text-ink/60">{tier.description}</p>

              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
                {tier.logos.map((logo, i) => {
                  const k = logo.scale ?? 1
                  return (
                    // <li> wraps <Reveal>, not the other way round: Reveal renders a
                    // <div>, and a <div> is not valid inside a <ul>.
                    <li
                      key={`${tier.tier}-${logo.src}`}
                      className="group flex items-center justify-center"
                    >
                      <Reveal index={i % 4}>
                        <span
                          // Height stays responsive via classes; the per-logo
                          // optical correction rides in as a CSS variable.
                          className="flex items-center justify-center h-[calc(20px*var(--k))] md:h-[calc(24px*var(--k))] lg:h-[calc(28px*var(--k))]"
                          style={{ ['--k' as string]: k }}
                        >
                          <img
                            src={logo.src}
                            alt={logo.name}
                            width={logo.w}
                            height={logo.h}
                            loading="lazy"
                            // h-full, not max-h-full: max-height leaves the box with no definite
                            // dimension, so it lays out 0x0, never intersects the viewport,
                            // and loading="lazy" therefore never fires. Width comes from the
                            // width/height attributes' aspect ratio.
                            className="h-full w-auto object-contain opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                            style={{ filter: logo.filter ?? FLATTEN }}
                          />
                        </span>
                      </Reveal>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </Grid>
    </section>
  )
}
