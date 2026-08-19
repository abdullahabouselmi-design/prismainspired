import { useRef, type ComponentType } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'
import { IconLook, IconShape, IconLocate, IconShow } from './ProcessIcons'

const EASE = [0.16, 1, 0.3, 1] as const

type Step = {
  number: string
  label: string
  title: string
  body: string
  Icon: ComponentType<{ className?: string; accentClassName?: string }>
}

const STEPS: Step[] = [
  {
    number: '001',
    label: 'Look',
    title: 'Map the terrain.',
    body: "Market and sector analysis, competitive benchmarking, best-practice review, and the consumer and cultural work underneath it. Whether it's a shelf or a public program, the point is to find the blind spots, the risks nobody's priced in, and the openings that don't show from the surface.",
    Icon: IconLook,
  },
  {
    number: '002',
    label: 'Shape',
    title: 'Formulate the strategy.',
    body: "The research turns into something with a spine — positioning, the business case, the product or program logic, the route to market. It's the blueprint that gives the idea structure and a path forward.",
    Icon: IconShape,
  },
  {
    number: '003',
    label: 'Locate',
    title: 'Find its place in the real world.',
    body: "Then it gets tested against what's actually out there: distribution dynamics, price sensitivity, cultural fit, stakeholder appetite. Where it lives, how it competes, and who it genuinely lands with.",
    Icon: IconLocate,
  },
  {
    number: '004',
    label: 'Show',
    title: 'Make it undeniable.',
    body: "Most strategy stops at the recommendation. I take the moment that decides whether it works — the product in someone's hand, the campaign in the wild, the program running — and make that moment concrete enough to react to, so it can be judged rather than admired. If it's wrong, you find that out on a page instead of months in.",
    Icon: IconShow,
  },
]

function ProcessStep({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLLIElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()
  const active = reduceMotion ? true : isInView

  // A single slate hairline to the left of columns two, three and four.
  const divider = index > 0 ? 'lg:border-l lg:border-slate/25 lg:pl-8' : ''

  return (
    <motion.li
      ref={ref}
      className={divider}
      initial={reduceMotion ? false : { y: 20, opacity: 0 }}
      animate={active ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.7, delay: index * 0.12, ease: EASE }
      }
    >
      <div className="flex items-baseline gap-3">
        <span className="label text-amberDeep">{step.number}</span>
        <span className="label text-ink/50">{step.label}</span>
      </div>

      <motion.span
        className="mt-6 block"
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <step.Icon className="h-12 w-12 text-ink" accentClassName="text-amberDeep" />
      </motion.span>

      <h3 className="display-2 mt-6 text-ink">{step.title}</h3>
      <p className="body-base mt-4 text-ink/60">{step.body}</p>
    </motion.li>
  )
}

export function Process() {
  return (
    <section id="process" className="relative bg-paper py-16 md:py-24">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

      <Grid className="relative gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow tone="light">How I work</Eyebrow>
        </div>

        <h2 className="display-1 col-span-4 max-w-[18ch] text-ink md:col-span-8 lg:col-span-9">
          <WordsPullUpMultiStyle
            align="left"
            segments={[{ text: 'From ambiguous brief to undeniable vision.' }]}
          />
        </h2>

        <ol className="col-span-4 mt-8 grid grid-cols-1 gap-10 md:col-span-8 md:grid-cols-2 md:gap-x-8 lg:col-span-12 lg:grid-cols-4 lg:gap-x-0">
          {STEPS.map((step, i) => (
            <ProcessStep key={step.number} step={step} index={i} />
          ))}
        </ol>
      </Grid>
    </section>
  )
}
