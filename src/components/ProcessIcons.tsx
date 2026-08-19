import { motion, type Variants } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

// Stroked elements draw themselves in; filled ones cannot, so they fade.
export const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.8, delay: 0.2, ease: EASE },
      opacity: { duration: 0.15, delay: 0.2 },
    },
  },
}

export const fillVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.45 } },
}

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
      <motion.path variants={drawVariants} d="M6 40h36" />
      <motion.path variants={drawVariants} d="M11 40V30" />
      <motion.path variants={drawVariants} d="M18.5 40V22.5" />
      <motion.path variants={drawVariants} d="M26 40V14" />
      <motion.path variants={drawVariants} d="M33.5 40V26" />
      <motion.path variants={drawVariants} d="M41 40V33" />
      <motion.circle
        variants={fillVariants}
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
      <motion.path
        variants={drawVariants}
        d="M18 8h12v8l5 7v17H13V23l5-7V8Z"
      />
      {nodes.map(([cx, cy], i) => (
        <motion.circle
          key={`${cx}-${cy}`}
          variants={fillVariants}
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
        <motion.rect
          key={x}
          variants={drawVariants}
          className={i === 1 ? accentClassName : undefined}
          x={x}
          y="15"
          width="9"
          height="21"
          rx="1.5"
          strokeWidth={i === 1 ? 2.25 : 1.5}
        />
      ))}
      <motion.path variants={drawVariants} d="M4 40h40" />
    </svg>
  )
}

/** 004 SHOW — the thing itself, made visible. */
export function IconShow({ className, accentClassName }: IconProps) {
  return (
    <svg {...svg} className={className} aria-hidden="true">
      <motion.path
        variants={fillVariants}
        d="M19 18h10v5l5 6.5V40H14V29.5L19 23V18Z"
        fill="currentColor"
        stroke="none"
      />
      <motion.path variants={drawVariants} className={accentClassName} d="M24 12V6" />
      <motion.path variants={drawVariants} className={accentClassName} d="M16 14 12.5 9.5" />
      <motion.path variants={drawVariants} className={accentClassName} d="M32 14 35.5 9.5" />
    </svg>
  )
}
