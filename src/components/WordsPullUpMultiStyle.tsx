import { MaskReveal } from './MaskReveal'

export type StyledSegment = {
  text: string
  className?: string
  /** Forces this segment onto its own line. */
  startsNewLine?: boolean
}

type Props = {
  segments: StyledSegment[]
  className?: string
  align?: 'center' | 'left'
  order?: number
}

/**
 * Line-masked headline reveal. Segments keep their own className, so italic
 * serif accents survive the line split.
 */
export function WordsPullUpMultiStyle({ segments, className, align = 'center', order }: Props) {
  const alignment = align === 'left' ? 'text-left' : 'text-center'
  return (
    <MaskReveal as="span" className={`block ${alignment} ${className ?? ''}`} order={order}>
      {segments.map((segment, i) => (
        <span key={i} className={segment.className}>
          {segment.startsNewLine && i > 0 ? <br /> : i > 0 ? ' ' : null}
          {segment.text}
        </span>
      ))}
    </MaskReveal>
  )
}
