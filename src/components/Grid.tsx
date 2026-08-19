import type { ReactNode } from 'react'

/**
 * The single grid container every section uses. No section sets its own
 * max-width or horizontal padding; content places itself with column spans.
 */
export function Grid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`mx-auto grid max-w-[1600px] grid-cols-4 gap-4 px-6 md:grid-cols-8 md:gap-6 md:px-10 lg:grid-cols-12 lg:px-16 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
