import { WordsPullUpMultiStyle } from './WordsPullUpMultiStyle'
import { MaskReveal } from './MaskReveal'
import { BookACall } from './BookACall'
import { Grid } from './Grid'
import { Eyebrow } from './Eyebrow'

export function Contact() {
  return (
    <section className="relative bg-ink">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <Grid width="sm" className="relative gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <Eyebrow>Contact</Eyebrow>
        </div>

        <h2 className="col-span-4 max-w-[12ch] text-4xl font-normal text-bone sm:text-5xl md:col-span-8 md:text-6xl lg:col-span-9 lg:text-7xl">
          <WordsPullUpMultiStyle
            align="left"
            segments={[
              { text: "Let's make it" },
              { text: 'seen.', className: 'font-serif italic' },
            ]}
          />
        </h2>

        <MaskReveal
          as="p"
          order={1}
          className="body-base col-span-4 max-w-[48ch] text-bone/60 md:col-span-8 lg:col-span-6"
        >
          Tell me what you&rsquo;re building. If I can make it something you can
          see, I&rsquo;ll tell you how.
        </MaskReveal>

        <div className="col-span-4 mt-6 flex flex-col items-start gap-3 md:col-span-8 lg:col-span-12">
          <BookACall />
          <span className="text-xs text-bone/40">Usually replies within a day</span>
        </div>

        <footer className="col-span-4 mt-24 flex flex-col gap-8 border-t border-bone/10 pt-10 md:col-span-8 sm:flex-row sm:items-start sm:justify-between lg:col-span-12">
          <div>
            <p className="text-sm font-bold tracking-wide text-bone">ABDULLAH ABOU SELMI</p>
            <p className="mt-1 text-xs text-bone/40">Product &amp; Brand Strategist</p>

            <div className="mt-4 flex items-center gap-5 text-xs text-bone/40">
              {/* TODO: real email address */}
              <a href="mailto:hello@example.com" className="transition-colors hover:text-bone">
                hello@example.com
              </a>
              {/* TODO: real LinkedIn URL */}
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-bone"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="sm:text-right">
            <p className="text-xs text-bone/40">Strategy made seen</p>
            <p className="mt-2 text-xs text-bone/30">&copy; 2026 &mdash; All rights reserved</p>
          </div>
        </footer>
      </Grid>
    </section>
  )
}
