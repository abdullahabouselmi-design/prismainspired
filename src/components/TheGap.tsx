import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { MaskReveal } from './MaskReveal'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'

const P1 =
  'Slides leave the hardest part to your imagination, and everyone in the room imagines something slightly different.'

const P2 =
  "Six people approve the same strategy and picture six different products. The misalignment doesn't surface in the meeting, it surfaces at the factory, in the artwork round, on the shelf. So before you brief a supplier, commission a designer, or go out to a distributor, you already know what the product is, who's reaching for it, and what it has to beat."

const P3 =
  "I don't design, I decide what needs to be seen, and I direct the making, so the vision survives the handoff instead of dissolving in it."

export function TheGap() {
  return (
    <section className="relative bg-paper py-20 md:py-28">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

      <Grid className="relative gap-y-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow tone="light">The gap</Eyebrow>
        </div>

        <h2 className="display-1 col-span-4 max-w-[14ch] text-ink md:col-span-8 lg:col-span-5">
          <WordsPullUpMultiStyle
            align="left"
            segments={[
              { text: 'A deck tells you the strategy.' },
              { text: 'I show it to you.', className: 'font-serif italic', startsNewLine: true },
            ]}
          />
        </h2>

        <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
          <MaskReveal as="p" className="body-lg max-w-[58ch] text-ink/70">
            {P1}
          </MaskReveal>
          <MaskReveal as="p" order={1} className="body-lg mt-8 max-w-[58ch] text-ink/70">
            {P2}
          </MaskReveal>

          <div className="mt-12 border-t border-ink/15 pt-12">
            <MaskReveal as="p" order={2} className="body-lg max-w-[52ch] text-ink">
              {P3}
            </MaskReveal>
          </div>
        </div>
      </Grid>
    </section>
  )
}
