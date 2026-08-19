import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const
const INTERVAL_MS = 2600

type RotatingWordProps = {
  words: string[]
  className?: string
}

/**
 * Cycles through `words` on a timer. Every word is also rendered invisibly in
 * the same grid cell, so the container is always as wide as the widest word and
 * the surrounding line never reflows as it cycles.
 */
export function RotatingWord({ words, className }: RotatingWordProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion || words.length < 2) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [reduceMotion, words.length])

  if (reduceMotion) {
    return <span className={className}>{words[0]}</span>
  }

  // The global `* { font-family }` rule beats inheritance, so the font classes
  // have to land on the text spans themselves, not only on the container.
  const text = className ?? ''

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

      <span className={`col-start-1 row-start-1 whitespace-nowrap ${text}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            className={`inline-block ${text}`}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}
