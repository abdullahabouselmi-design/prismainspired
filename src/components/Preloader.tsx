import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion, EASE_EXIT } from '../lib/gsap'

const MIN_MS = 2200
const MAX_MS = 4000

type PreloaderProps = { onDone: () => void }

export function Preloader({ onDone }: PreloaderProps) {
  const overlay = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const fillRect = useRef<SVGRectElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const state = { progress: 0 }
    // Decelerates into 100 rather than running linear.
    const counter = gsap.to(state, {
      progress: 100,
      duration: MIN_MS / 1000,
      ease: 'power3.out',
      onUpdate: () => {
        const value = Math.round(state.progress)
        setCount(value)
        if (fillRect.current) {
          // Can is 12..92 in the viewBox; the fill grows from its base upward.
          const height = (value / 100) * 80
          fillRect.current.setAttribute('y', String(92 - height))
          fillRect.current.setAttribute('height', String(height))
        }
      },
    })

    const start = performance.now()
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      counter.progress(1)

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = ''
          onDone()
        },
      })
      tl.to(content.current, { opacity: 0, duration: 0.3, ease: 'power2.out' })
      tl.to(
        overlay.current,
        { yPercent: -100, duration: 0.8, ease: EASE_EXIT },
        '>',
      )
    }

    // Ready when the hero video can play through, or the floor has elapsed,
    // whichever is later; hard-capped so a stalled video never blocks entry.
    let videoReady = false
    const video = document.querySelector('video')
    const markReady = () => {
      videoReady = true
      maybeFinish()
    }
    const maybeFinish = () => {
      const elapsed = performance.now() - start
      if (elapsed < MIN_MS) return
      if (videoReady) finish()
    }

    if (video) {
      if (video.readyState >= 4) videoReady = true
      else video.addEventListener('canplaythrough', markReady, { once: true })
    } else {
      videoReady = true
    }

    const floor = window.setTimeout(maybeFinish, MIN_MS + 30)
    const cap = window.setTimeout(finish, MAX_MS)
    const poll = window.setInterval(maybeFinish, 120)

    return () => {
      counter.kill()
      window.clearTimeout(floor)
      window.clearTimeout(cap)
      window.clearInterval(poll)
      video?.removeEventListener('canplaythrough', markReady)
      document.body.style.overflow = ''
    }
  }, [onDone])

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div ref={content} className="flex flex-col items-center">
        <span className="text-6xl font-bold tabular-nums text-bone sm:text-7xl md:text-8xl">
          {String(count).padStart(2, '0')}
        </span>

        <svg
          viewBox="0 0 60 104"
          className="mt-8 h-20 w-auto"
          aria-hidden="true"
          fill="none"
        >
          <defs>
            <clipPath id="preloader-can">
              <path d="M14 12 H46 C48 12 50 14 50 17 V87 C50 90 48 92 46 92 H14 C12 92 10 90 10 87 V17 C10 14 12 12 14 12 Z" />
            </clipPath>
          </defs>
          <path
            d="M14 12 H46 C48 12 50 14 50 17 V87 C50 90 48 92 46 92 H14 C12 92 10 90 10 87 V17 C10 14 12 12 14 12 Z"
            fill="#EFE4D1"
            fillOpacity={0.15}
          />
          <rect
            ref={fillRect}
            x="10"
            y="92"
            width="40"
            height="0"
            fill="#EFE4D1"
            clipPath="url(#preloader-can)"
          />
        </svg>

        <span className="mt-8 text-xs uppercase tracking-widest text-bone/40">
          Product &amp; Brand Strategist
        </span>
      </div>
    </div>
  )
}

/** The preloader is skipped entirely under reduced motion. */
export function shouldShowPreloader() {
  return !prefersReducedMotion()
}
