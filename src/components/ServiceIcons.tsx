type IconProps = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** 01 — Consumer and category insight. */
export function IconMagnifier({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.4 15.4 20.5 20.5" />
    </svg>
  )
}

/** 02 — Product strategy and innovation. */
export function IconCube({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 2.75 20 7.25v9.5L12 21.25 4 16.75v-9.5L12 2.75Z" />
      <path d="M12 12v9.25" />
      <path d="M12 12 20 7.25" />
      <path d="M12 12 4 7.25" />
    </svg>
  )
}

/** 03 — Brand strategy and positioning. */
export function IconTarget({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** 04 — Go-to-market. */
export function IconBars({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3.5 20.5h17" />
      <path d="M6.75 20.5v-4" />
      <path d="M11.5 20.5v-7.5" />
      <path d="M16.25 20.5v-11" />
      <path d="M21 20.5V5.5" />
    </svg>
  )
}
