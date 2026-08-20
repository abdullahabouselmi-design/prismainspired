import type { ComponentType } from 'react'
import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { Reveal } from './Reveal'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'
import { IconMagnifier, IconCube, IconTarget, IconBars } from './ServiceIcons'

type Card = {
  number: string
  title: string
  description: string
  closing: string
  Icon: ComponentType<{ className?: string }>
}

const CARDS: Card[] = [
  {
    number: '01',
    title: 'Consumer & Category Insight',
    description:
      'Consumer research, category and competitive benchmarking, need-gap analysis, whitespace mapping.',
    closing: 'Not who they say they are — what they actually reach for, and why.',
    Icon: IconMagnifier,
  },
  {
    number: '02',
    title: 'Product Strategy & Innovation',
    description:
      'New product development, range and format structure, concept definition, product logic.',
    closing: 'The decisions that get made long before anyone sees a design.',
    Icon: IconCube,
  },
  {
    number: '03',
    title: 'Brand Strategy & Positioning',
    description:
      'Positioning, brand architecture, value proposition, messaging territory, naming.',
    closing: "What you stand for, and what you're quietly taking share from.",
    Icon: IconTarget,
  },
  {
    number: '04',
    title: 'Go-to-Market',
    description:
      'Market entry, pricing strategy, packaging direction, launch sequencing, distribution and route-to-market.',
    closing: 'What gets listed, what gets reordered, and what dies at the second buy.',
    Icon: IconBars,
  },
]

export function Services() {
  return (
    <section id="services" className="relative bg-ink py-24 md:py-32">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <Grid width="lg" className="relative gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow>Services</Eyebrow>
        </div>

        <h2 className="display-1 col-span-4 max-w-[10ch] text-bone md:col-span-8 lg:col-span-8">
          <WordsPullUpMultiStyle align="left" segments={[{ text: "What I'm for." }]} />
        </h2>

        <div className="col-span-4 mt-8 grid grid-cols-1 gap-4 md:col-span-8 md:grid-cols-2 lg:col-span-12">
          {CARDS.map((card, i) => (
            <Reveal key={card.number} index={i}>
              <article className="flex flex-col rounded-2xl bg-panel p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-bone/5">
                    <card.Icon className="h-6 w-6 text-amber" />
                  </span>
                  <span className="text-xs text-bone/40">{card.number}</span>
                </div>

                <h3 className="display-2 mt-6 text-bone">{card.title}</h3>

                <p className="mt-4 text-sm leading-relaxed text-bone/60">{card.description}</p>

                <hr className="my-6 border-t border-bone/10" />

                <p className="text-sm font-medium text-bone">{card.closing}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Grid>
    </section>
  )
}
