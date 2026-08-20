import type { ReactNode } from 'react'

/**
 * The single grid container every section uses. No section sets its own
 * max-width or horizontal padding; content places itself with column spans.
 *
 * Production runs a different container width per section rather than one
 * page-wide grid, so the width is a prop. Gutters are 24px at every
 * breakpoint, which `--bleed` in index.css mirrors for `.full-bleed`.
 */
const WIDTHS = {
  sm: 'max-w-5xl', // 1024
  md: 'max-w-6xl', // 1152
  lg: 'max-w-7xl', // 1280
  full: 'max-w-none',
} as const

export function Grid({
  children,
  className,
  width = 'lg',
}: {
  children: ReactNode
  className?: string
  width?: keyof typeof WIDTHS
}) {
  return (
    <div
      className={`mx-auto grid ${WIDTHS[width]} grid-cols-4 gap-4 px-6 md:grid-cols-8 md:gap-6 lg:grid-cols-12 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
