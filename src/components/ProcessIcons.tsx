// Stroked elements draw themselves in; filled ones cannot, so they fade.
// The parent step owns the timeline and finds these by attribute.

type IconProps = { className?: string; accentClassName?: string }

const svg = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** 001 LOOK — bars of varying height, one peak marked. */
export function IconLook({ className, accentClassName }: IconProps) {
  return (
    <svg {...svg} className={className} aria-hidden="true">
      <path data-draw="" d="M6 40h36" />
      <path data-draw="" d="M11 40V30" />
      <path data-draw="" d="M18.5 40V22.5" />
      <path data-draw="" d="M26 40V14" />
      <path data-draw="" d="M33.5 40V26" />
      <path data-draw="" d="M41 40V33" />
      <circle
        data-fade=""
        className={accentClassName}
        cx="26"
        cy="8.5"
        r="2.75"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

/** 002 SHAPE — a bottle described as nodes and vertices. */
export function IconShape({ className, accentClassName }: IconProps) {
  const nodes = [
    [18, 8], [30, 8], [30, 16], [35, 23], [35, 40], [13, 40], [13, 23], [18, 16],
  ]
  return (
    <svg {...svg} className={className} aria-hidden="true">
      <path
        data-draw=""
        d="M18 8h12v8l5 7v17H13V23l5-7V8Z"
      />
      {nodes.map(([cx, cy], i) => (
        <circle
          key={`${cx}-${cy}`}
          data-fade=""
          className={i === 3 ? accentClassName : undefined}
          cx={cx}
          cy={cy}
          r="2.3"
          fill="currentColor"
          stroke="none"
        />
      ))}
    </svg>
  )
}

/** 003 LOCATE — a row of units, one picked out in the accent. */
export function IconLocate({ className, accentClassName }: IconProps) {
  const xs = [6, 19.5, 33]
  return (
    <svg {...svg} className={className} aria-hidden="true">
      {xs.map((x, i) => (
        <rect
          key={x}
          data-draw=""
          className={i === 1 ? accentClassName : undefined}
          x={x}
          y="15"
          width="9"
          height="21"
          rx="1.5"
          strokeWidth={i === 1 ? 2.25 : 1.5}
        />
      ))}
      <path data-draw="" d="M4 40h40" />
    </svg>
  )
}

/** 004 SHOW — the thing itself, made visible. */
export function IconShow({ className, accentClassName }: IconProps) {
  return (
    <svg {...svg} className={className} aria-hidden="true">
      <path
        data-fade=""
        d="M19 18h10v5l5 6.5V40H14V29.5L19 23V18Z"
        fill="currentColor"
        stroke="none"
      />
      <path data-draw="" className={accentClassName} d="M24 12V6" />
      <path data-draw="" className={accentClassName} d="M16 14 12.5 9.5" />
      <path data-draw="" className={accentClassName} d="M32 14 35.5 9.5" />
    </svg>
  )
}
