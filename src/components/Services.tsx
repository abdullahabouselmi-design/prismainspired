import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { Reveal } from './Reveal'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'
import { ProductCloud } from './ProductCloud'

const BONE = '#EFE4D1'
const AMBER = '#C98B4B'

type Card = {
  number: string
  title: string
  description: string
  closing: string
  /** The pack this piece of work decides the shape of. */
  form: 'bottle' | 'carton' | 'tub' | 'can'
  tone: string
}

const CARDS: Card[] = [
  {
    number: '01',
    title: 'Consumer & Category Insight',
    description:
      'Consumer research, category and competitive benchmarking, need-gap analysis, whitespace mapping.',
    closing: 'Not who they say they are, but what they actually reach for, and why.',
    form: 'bottle',
    tone: BONE,
  },
  {
    number: '02',
    title: 'Product Strategy & Innovation',
    description:
      'New product development, range and format structure, concept definition, product logic.',
    closing: 'The decisions that get made long before anyone sees a design.',
    form: 'carton',
    tone: AMBER,
  },
  {
    number: '03',
    title: 'Brand Strategy & Positioning',
    description:
      'Positioning, brand architecture, value proposition, messaging territory, naming.',
    closing: "What you stand for, and what you're quietly taking share from.",
    form: 'tub',
    tone: BONE,
  },
  {
    number: '04',
    title: 'Go-to-Market',
    description:
      'Market entry, pricing strategy, packaging direction, launch sequencing, distribution and route-to-market.',
    closing: 'What gets listed, what gets reordered, and what dies at the second buy.',
    form: 'can',
    tone: AMBER,
  },
]

export function Services() {
  return (
    <section id="services" className="relative bg-ink py-16 md:py-20">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <Grid width="lg" className="relative gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow>Services</Eyebrow>
        </div>

        <h2 className="display-1 col-span-4 text-bone md:col-span-8 lg:col-span-12">
          <WordsPullUpMultiStyle align="left" segments={[{ text: "What I'm for." }]} />
        </h2>

        <div className="col-span-4 mt-6 grid grid-cols-1 gap-4 md:col-span-8 md:grid-cols-2 lg:col-span-12">
          {CARDS.map((card, i) => (
            // h-full on both: Reveal interposes a div, so the card would
            // otherwise sit at content height inside a stretched wrapper.
            <Reveal key={card.number} className="h-full" index={i}>
              <article className="flex h-full flex-col rounded-2xl bg-panel p-8">
                <div className="flex items-start justify-between">
                  {/* The art box needs a definite height or the canvas measures zero. */}
                  <div className="h-32 w-28">
                    <ProductCloud form={card.form} tone={card.tone} />
                  </div>
                  <span className="text-xs text-bone/40">{card.number}</span>
                </div>

                <h3 className="display-2 mt-4 text-bone">{card.title}</h3>

                <p className="mt-3 text-sm leading-relaxed text-bone/60">{card.description}</p>

                {/* mt-auto pins the closing line to the foot of every card, so
                    the rules line up across the row even when copy differs. */}
                <hr className="mt-auto border-t border-bone/10 pt-0" />

                <p className="mt-5 text-sm font-medium text-bone">{card.closing}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Grid>
    </section>
  )
}
