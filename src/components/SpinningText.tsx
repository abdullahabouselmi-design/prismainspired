const R = 54
const CIRCUMFERENCE = 2 * Math.PI * R

/**
 * Text set on a ring, turning continuously.
 *
 * `textLength` is pinned to the path's circumference with
 * `lengthAdjust="spacing"`, so the phrase distributes itself evenly and meets
 * its own tail cleanly however long the string is — rather than leaving a gap
 * or overlapping at the seam.
 *
 * Almarai at weight 800 is what makes this read as the Hero: `.display-hero`
 * sets no font-family of its own, so the weight is the shared trait. Tracking
 * is positive here, unlike the Hero's -0.03em, because letters set radially
 * need room to breathe.
 */
export function SpinningText({
  text = 'Strategy Made Seen',
  duration = '24s',
  className,
}: {
  text?: string
  duration?: string
  className?: string
}) {
  const phrase = `${text.toUpperCase()} • `
  const ring = phrase.repeat(2)

  return (
    <svg
      viewBox="0 0 140 140"
      aria-hidden="true"
      className={`h-full w-full ${className ?? ''}`}
    >
      <defs>
        <path
          id="spin-ring"
          fill="none"
          d={`M 70 ${70 - R} A ${R} ${R} 0 1 1 ${70 - 0.01} ${70 - R} Z`}
        />
      </defs>
      {/* The spin lives on a group inside the SVG, not on the SVG element.
          Rotating the element itself grows its bounding box by up to 41%,
          which pushed past the container and caused horizontal overflow at
          1024 and 768 where there is no spare margin to absorb it. */}
      <g
        className="badge-spin"
        style={{
          ['--badge-duration' as string]: duration,
          transformBox: 'view-box',
          transformOrigin: '70px 70px',
        }}
      >
        <text
          fill="currentColor"
          fontSize="12.5"
          fontWeight={800}
          letterSpacing="2.6"
        >
          <textPath href="#spin-ring" textLength={CIRCUMFERENCE} lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </g>
    </svg>
  )
}
