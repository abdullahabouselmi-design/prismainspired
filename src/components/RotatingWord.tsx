import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion, EASE_IN } from '../lib/gsap'
import { useReducedMotion } from '../lib/motion'

const INTERVAL_MS = 2600
const PHASE = 0.4

type RotatingWordProps = {
  words: string[]
  className?: string
}

/**
 * Cycles through `words` on a timer. Every word is also rendered invisibly in
 * the same grid cell, so the container is always as wide as the widest word and
 * the surrounding line never reflows as it cycles.
 *
 * GSAP port of the previous AnimatePresence `mode="wait"` sequence: the current
 * word leaves before the next arrives, same 0.4s phases and same curve.
 */
export function RotatingWord({ words, className }: RotatingWordProps) {
  const reduceMotion = useReducedMotion()
  const [shown, setShown] = useState(0)
  const wordRef = useRef<HTMLSpanElement>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion() || words.length < 2) return
    const el = wordRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const id = setInterval(() => {
        const next = (indexRef.current + 1) % words.length
        indexRef.current = next

        gsap
          .timeline()
          // Out, then swap, then in: the wait between phases is what
          // AnimatePresence mode="wait" was providing.
          .to(el, { y: -12, opacity: 0, duration: PHASE, ease: EASE_IN })
          .add(() => setShown(next))
          .fromTo(
            el,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: PHASE, ease: EASE_IN },
          )
      }, INTERVAL_MS)

      return () => clearInterval(id)
    })

    return () => ctx.revert()
  }, [words])

  // The global font-family rule beats inheritance, so the font classes have to
  // land on the text spans themselves, not only on the container.
  const text = className ?? ''

  if (reduceMotion) {
    return <span className={text}>{words[0]}</span>
  }

  return (
    <span className={`relative inline-grid align-bottom ${text}`}>
      {/* Width reservation: every word stacked in one cell, none of them shown. */}
      {words.map((word) => (
        <span
          key={`sizer-${word}`}
          aria-hidden="true"
          className={`invisible col-start-1 row-start-1 whitespace-nowrap ${text}`}
        >
          {word}
        </span>
      ))}

      <span
        ref={wordRef}
        className={`col-start-1 row-start-1 whitespace-nowrap ${text}`}
      >
        {words[shown]}
      </span>
    </span>
  )
}
