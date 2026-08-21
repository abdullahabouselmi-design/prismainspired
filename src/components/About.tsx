import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { MaskReveal } from './MaskReveal'
import { RotatingWord } from './RotatingWord'
import { BookACall } from './BookACall'
import { ImageReveal } from './ImageReveal'
import { FadeUp } from './FadeUp'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'

const FEATHER_X = 'linear-gradient(to right, black 0%, black 92%, transparent 100%)'
const FEATHER_Y =
  'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)'

const maskStyle = (image: string) =>
  ({ maskImage: image, WebkitMaskImage: image }) as const

const ROTATING = ['launch it.', 'build it.', 'fund it.']

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-paper py-16 md:py-20">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

      <Grid width="full" className="relative items-center gap-y-8">
        {/* Full-bleed portrait: deliberately escapes the grid to the left edge. */}
        <div className="col-span-4 md:col-span-8 lg:col-span-5">
          <ImageReveal className="-ml-6">
            <div style={maskStyle(FEATHER_Y)}>
              <div className="relative" style={maskStyle(FEATHER_X)}>
                <img
                  src="/portrait.webp"
                  alt="Abdullah Abou Selmi"
                  width={2600}
                  height={3482}
                  loading="lazy"
                  decoding="async"
                  className="h-[55vh] w-full object-cover object-center lg:h-[78vh]"
                  onError={(event) => {
                    event.currentTarget.style.visibility = 'hidden'
                  }}
                />
                <div
                  aria-hidden="true"
                  className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]"
                />
              </div>
            </div>
          </ImageReveal>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
          <Eyebrow tone="light">Product &amp; Brand Strategist</Eyebrow>

          <h2 className="display-1 mt-4 text-ink lg:text-6xl">
            <WordsPullUpMultiStyle
              align="left"
              segments={[{ text: 'See it before you' }]}
            />
            <RotatingWord words={ROTATING} className="font-serif italic" />
          </h2>

          <MaskReveal as="p" order={1} className="body-base mt-6 max-w-[46ch] text-ink/70">
            I make strategy tangible. Research, consumer understanding and
            commercial thinking, formulated into opportunities you can actually
            see before you build them.
          </MaskReveal>

          <FadeUp delay={0.5} className="mt-8">
            <BookACall variant="ink" />
          </FadeUp>
        </div>
      </Grid>
    </section>
  )
}
