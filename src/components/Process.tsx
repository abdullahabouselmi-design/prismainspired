import { useEffect, useRef, type ComponentType } from 'react'
import { gsap, prefersReducedMotion, EASE_IN, EASE_DRAW } from '../lib/gsap'
import { clearReveal, revealAttr } from '../lib/motion'
import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'
import { IconLook, IconShape, IconLocate, IconShow } from './ProcessIcons'

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
    body: "Market and sector analysis, competitive benchmarking, best-practice review, and the consumer and cultural work underneath it. Whether it's a new launch or a relaunch, the point is to find the blind spots, the risks nobody's priced in, and the openings that don't show from the surface.",
    Icon: IconLook,
  },
  {
    number: '002',
    label: 'Shape',
    title: 'Formulate the strategy.',
    body: "The research turns into something with a spine: positioning, the business case, the product logic, the route to market. It's the blueprint that gives the idea structure and a path forward.",
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
    body: "Most strategy stops at the recommendation. I go to the moment that decides whether it works: the product in someone's hand, the campaign in the wild, the pack on the shelf. I make that moment concrete enough to react to, so it can be judged rather than admired. If it's wrong, you find that out on a page instead of months in.",
    Icon: IconShow,
  },
]

function ProcessStep({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      clearReveal(el)
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { y: 20, opacity: 0 })
      clearReveal(el)

      // Stroked icon parts draw themselves; filled parts cannot, so they fade.
      const strokes = gsap.utils.toArray<SVGGeometryElement>('[data-draw]', el)
      const fills = gsap.utils.toArray<SVGElement>('[data-fade]', el)

      strokes.forEach((node) => {
        const length = typeof node.getTotalLength === 'function' ? node.getTotalLength() : 0
        if (length) gsap.set(node, { strokeDasharray: length, strokeDashoffset: length })
      })
      gsap.set([...strokes, ...fills], { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top bottom-=80px', once: true },
      })

      tl.to(el, { y: 0, opacity: 1, duration: 0.7, delay: index * 0.12, ease: EASE_IN })
        .to(strokes, { opacity: 1, duration: 0.15 }, '<0.2')
        .to(strokes, { strokeDashoffset: 0, duration: 0.8, ease: EASE_DRAW }, '<')
        .to(fills, { opacity: 1, duration: 0.5 }, '<0.25')
    }, el)

    return () => ctx.revert()
  }, [index])

  // A single slate hairline to the left of columns two, three and four.
  const divider = index > 0 ? 'lg:border-l lg:border-slate/25 lg:pl-8' : ''

  return (
    <li
      ref={ref}
      className={`lg:grid lg:grid-rows-subgrid lg:row-span-4 ${divider}`}
      {...revealAttr()}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-bold tracking-widest text-amberDeep">{step.number}</span>
        <span className="text-xs uppercase tracking-widest text-ink/50">{step.label}</span>
      </div>

      <span className="mt-6 block">
        <step.Icon className="h-12 w-12 text-ink" accentClassName="text-amberDeep" />
      </span>

      <h3 className="step-title mt-6 text-lg font-bold text-ink sm:text-xl">{step.title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-ink/60">{step.body}</p>
    </li>
  )
}

export function Process() {
  return (
    <section id="process" className="relative z-10 -mt-8 rounded-t-[1.75rem] md:-mt-12 md:rounded-t-[2.5rem] bg-paper py-16 md:py-20">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

      <Grid width="lg" className="relative gap-y-6">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow tone="light">How I work</Eyebrow>
        </div>

        <h2 className="display-1 col-span-4 text-ink md:col-span-8 lg:col-span-12">
          <WordsPullUpMultiStyle
            align="left"
            segments={[{ text: 'From ambiguous brief to undeniable vision.' }]}
          />
        </h2>

        <ol className="col-span-4 mt-6 grid grid-cols-1 gap-8 md:col-span-8 md:grid-cols-2 md:gap-x-8 lg:col-span-12 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto_auto] lg:gap-x-0 lg:gap-y-0">
          {STEPS.map((step, i) => (
            <ProcessStep key={step.number} step={step} index={i} />
          ))}
        </ol>
      </Grid>
    </section>
  )
}
