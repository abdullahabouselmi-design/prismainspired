import { useEffect, useState } from 'react'
import { ScrollTrigger, prefersReducedMotion } from './gsap'

/* ------------------------------------------------------------------ *
 * Font readiness
 *
 * SplitText measures line boxes. If it runs while a fallback face is
 * still showing, the real face swaps in afterwards and every line box is
 * wrong. Nothing that measures lines may run before this resolves.
 *
 * Capped, so a slow or failed font request can never leave masked
 * content hidden indefinitely.
 * ------------------------------------------------------------------ */

const FONT_TIMEOUT_MS = 1500

let fontsPromise: Promise<void> | null = null

export function fontsReady(): Promise<void> {
  if (!fontsPromise) {
    const ready =
      typeof document !== 'undefined' && document.fonts
        ? document.fonts.ready.then(() => undefined)
        : Promise.resolve()

    fontsPromise = Promise.race([
      ready,
      new Promise<void>((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS)),
    ])
  }
  return fontsPromise
}

/** Reactive form, for components that need to gate rendering rather than an effect. */
export function useFontsReady(): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    fontsReady().then(() => {
      if (alive) setReady(true)
    })
    return () => {
      alive = false
    }
  }, [])
  return ready
}

/* ------------------------------------------------------------------ *
 * One debounced ScrollTrigger refresh
 *
 * refresh() recalculates every trigger on the page. Previously five call
 * sites fired it on mount and every MaskReveal instance fired it again on
 * each resize. Everything now funnels through here.
 * ------------------------------------------------------------------ */

const REFRESH_DEBOUNCE_MS = 150

let refreshTimer: number | null = null
let refreshCount = 0

export function requestScrollRefresh(): void {
  if (typeof window === 'undefined') return
  if (refreshTimer !== null) window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => {
    refreshTimer = null
    refreshCount += 1
    ScrollTrigger.refresh()
  }, REFRESH_DEBOUNCE_MS)
}

/** Test hook: how many real refreshes have actually run. */
export function __refreshCount(): number {
  return refreshCount
}

/* ------------------------------------------------------------------ *
 * One resize bus
 *
 * A single window listener, debounced, fanning out to subscribers. Only
 * width changes count: mobile browsers fire resize when the URL bar
 * hides, and re-splitting text on that is both pointless and expensive.
 * ------------------------------------------------------------------ */

type ResizeHandler = () => void

const subscribers = new Set<ResizeHandler>()
let listening = false
let resizeTimer: number | null = null
let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 0

function onWindowResize() {
  if (window.innerWidth === lastWidth) return
  lastWidth = window.innerWidth

  if (resizeTimer !== null) window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    resizeTimer = null
    subscribers.forEach((fn) => fn())
    requestScrollRefresh()
  }, REFRESH_DEBOUNCE_MS)
}

/** Subscribe to debounced width changes. Returns an unsubscribe function. */
export function onLayoutResize(handler: ResizeHandler): () => void {
  subscribers.add(handler)
  if (!listening && typeof window !== 'undefined') {
    window.addEventListener('resize', onWindowResize, { passive: true })
    listening = true
  }
  // The window listener is installed once and kept. Tearing it down whenever
  // the subscriber set briefly empties just churns add/remove pairs under
  // StrictMode's double-mount; one passive listener for the app's lifetime is
  // cheaper and cannot race.
  return () => {
    subscribers.delete(handler)
  }
}

/** Test hook: confirms components are not attaching their own listeners. */
export function __resizeSubscriberCount(): number {
  return subscribers.size
}

/* ------------------------------------------------------------------ *
 * Reveal gating
 *
 * Reveal components render with data-reveal="pending", which CSS hides
 * before first paint. GSAP sets its deterministic from-state and then
 * clears the attribute, so nothing is ever visible for a frame in the
 * wrong position. Under reduced motion the attribute is never applied.
 * ------------------------------------------------------------------ */

/**
 * Reactive reduced-motion flag, replacing framer-motion's useReducedMotion for
 * the components being ported off it. Resolves synchronously on first render
 * rather than returning null once, so nothing renders the wrong branch first.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function revealAttr(): { 'data-reveal'?: 'pending' } {
  return prefersReducedMotion() ? {} : { 'data-reveal': 'pending' }
}

export function clearReveal(el: Element | null): void {
  el?.removeAttribute('data-reveal')
}
